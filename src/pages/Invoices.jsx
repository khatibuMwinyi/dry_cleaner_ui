import { useState, useEffect } from "react";
import {
  invoiceAPI,
  customerAPI,
  serviceAPI,
  clothingTypeAPI,
} from "../api/api";
import { Plus, CheckCircle, XCircle, MessageCircle, CreditCard } from "lucide-react";
import Dropdown from "../components/Dropdown";

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pickup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#F8F8F9] divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.customerId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {invoice.items.length} item(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    TSh {invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.paymentStatus === "PAID" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <XCircle className="w-4 h-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.checkInDate
                      ? new Date(invoice.checkInDate).toLocaleDateString()
                      : new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.pickupDate
                      ? new Date(invoice.pickupDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkPaid(invoice._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark Payment Done"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Handle send message
                          console.log("Send message for invoice:", invoice._id);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send Invoice Message"
                      >
                        <MessageCircle className="w-4 h-4" />
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
                  getOptionLabel={(customer) => `${customer.name} - ${customer.phone}`}
                />
              </div>

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
                        handleItemChange(
                          index,
                          "clothingTypeId",
                          value
                        )
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

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#2D3A58] hover:bg-[#0F172A] text-white py-2 rounded-lg "
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
