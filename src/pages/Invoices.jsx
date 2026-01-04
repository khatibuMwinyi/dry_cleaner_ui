import { useState, useEffect } from "react";
import {
  invoiceAPI,
  customerAPI,
  serviceAPI,
  clothingTypeAPI,
} from "../api/api";
import {
  Plus,
  CheckCircle,
  XCircle,
  MessageCircle,
  CreditCard,
  Send,
} from "lucide-react";
import Dropdown from "../components/Dropdown";
import Loader from "../components/Loader";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [clothingTypes, setClothingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    items: [{ clothingTypeId: "", serviceId: "", quantity: 1 }],
    discount: 0,
    pickupDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, customersRes, servicesRes, clothingTypesRes] =
        await Promise.all([
          invoiceAPI.getAll(),
          customerAPI.getAll(),
          serviceAPI.getAll(),
          clothingTypeAPI.getAll(),
        ]);
      setInvoices(invoicesRes.data);
      setCustomers(customersRes.data);
      setServices(servicesRes.data);
      setClothingTypes(clothingTypesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Actions ----------------------
  const handleMarkPaid = async (id) => {
    try {
      await invoiceAPI.markPaid(id);
      fetchData();
    } catch (error) {
      alert(
        "Error marking invoice as paid: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleSendPickupNotification = async (id) => {
    try {
      await invoiceAPI.sendPickupNotification(id);
      alert("Pickup notification sent!");
    } catch (error) {
      alert(
        "Error sending pickup notification: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleSendWhatsappInvoice = async (id) => {
    try {
      await invoiceAPI.sendWhatsappInvoice(id);
      alert("Invoice sent via WhatsApp!");
    } catch (error) {
      alert(
        "Error sending WhatsApp invoice: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // ---------------------- Form Helpers ----------------------
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { clothingTypeId: "", serviceId: "", quantity: 1 },
      ],
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] =
      field === "quantity" ? parseInt(value) || 0 : value;
    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await invoiceAPI.create(formData);
      setShowModal(false);
      setFormData({
        customerId: "",
        items: [{ clothingTypeId: "", serviceId: "", quantity: 1 }],
        discount: 0,
        pickupDate: "",
      });
      fetchData();
    } catch (error) {
      alert(
        "Error creating invoice: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#DDE1E8] -mx-8 -mt-8 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <p className="text-gray-600 mt-1">
            Manage customer invoices and orders
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2D3A58] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="flex flex-col items-center">
              <Loader />
              <span className="mt-2">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Pickup Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{invoice._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {invoice.customerId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {invoice.createdAt
                      ? new Date(invoice.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {invoice.pickupDate
                      ? new Date(invoice.pickupDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    TSh {invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {invoice.paymentStatus === "PAID" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <XCircle className="w-4 h-4 mr-1" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleMarkPaid(invoice._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Mark as Paid"
                      >
                        <CreditCard className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          handleSendPickupNotification(invoice._id)
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Send Pickup Notification"
                      >
                        <Send className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleSendWhatsappInvoice(invoice._id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Send Invoice via WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Invoice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer *
                </label>
                <Dropdown
                  required
                  value={formData.customerId}
                  onChange={(value) =>
                    setFormData({ ...formData, customerId: value })
                  }
                  options={customers}
                  placeholder="Select a customer"
                  getOptionLabel={(customer) =>
                    `${customer.name} - ${customer.phone}`
                  }
                />
              </div>

              {/* Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items
                </label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Dropdown
                      required
                      value={item.clothingTypeId}
                      onChange={(value) =>
                        handleItemChange(index, "clothingTypeId", value)
                      }
                      options={clothingTypes}
                      placeholder="Clothing Type"
                      className="flex-1"
                    />
                    <Dropdown
                      required
                      value={item.serviceId}
                      onChange={(value) =>
                        handleItemChange(index, "serviceId", value)
                      }
                      options={services}
                      placeholder="Service"
                      className="flex-1"
                    />
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
                      placeholder="Qty"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Item
                </button>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (TSh)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
                />
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Check-in date will be automatically set to today
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#2D3A58] hover:bg-[#0F172A] text-white py-2 rounded-lg"
                >
                  Create Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      customerId: "",
                      items: [
                        { clothingTypeId: "", serviceId: "", quantity: 1 },
                      ],
                      discount: 0,
                      pickupDate: "",
                    });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
