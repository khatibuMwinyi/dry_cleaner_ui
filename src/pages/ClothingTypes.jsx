import { useState, useEffect } from "react";
import { clothingTypeAPI, serviceAPI } from "../api/api";
import { Plus, Edit, Trash2 } from "lucide-react";
import Loader from "../components/Loader";

const ClothingTypes = () => {
  const [clothingTypes, setClothingTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    servicePricing: {},
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clothingTypesRes, servicesRes] = await Promise.all([
        clothingTypeAPI.getAll(),
        serviceAPI.getAll(),
      ]);
      setClothingTypes(clothingTypesRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pricingData = {
        name: formData.name,
        pricing: formData.servicePricing,
      };

      if (editingType) {
        await clothingTypeAPI.update(editingType._id, pricingData);
      } else {
        await clothingTypeAPI.create(pricingData);
      }

      setShowModal(false);
      setEditingType(null);
      setFormData({
        name: "",
        servicePricing: {},
      });
      fetchData();
    } catch (error) {
      alert(
        "Error saving clothing type: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEdit = (clothingType) => {
    setEditingType(clothingType);
    const pricingMap =
      clothingType.pricing instanceof Map
        ? Object.fromEntries(clothingType.pricing)
        : clothingType.pricing || {};

    setFormData({
      name: clothingType.name,
      servicePricing: pricingMap,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this clothing type?")) return;

    try {
      await clothingTypeAPI.delete(id);
      fetchData();
    } catch (error) {
      alert(
        "Error deleting clothing type: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleServicePriceChange = (serviceId, price) => {
    setFormData((prev) => ({
      ...prev,
      servicePricing: {
        ...prev.servicePricing,
        [serviceId]: price ? parseFloat(price) : null,
      },
    }));
  };

  const toggleServiceSelection = (serviceId) => {
    setFormData((prev) => {
      const newServicePricing = { ...prev.servicePricing };
      if (newServicePricing[serviceId] !== undefined) {
        delete newServicePricing[serviceId];
      } else {
        newServicePricing[serviceId] = 0;
      }
      return {
        ...prev,
        servicePricing: newServicePricing,
      };
    });
  };

  const openAddModal = () => {
    setEditingType(null);
    setFormData({
      name: "",
      servicePricing: {},
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#DDE1E8] -mx-8 -mt-8 px-8 pb-4 pt-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clothing Types</h1>
          <p className="text-gray-600 mt-1">
            Manage clothing types and service-specific pricing
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 bg-[#2D3A58] hover:bg-[#0F172A]"
        >
          <Plus className="w-5 h-5" />
          Add Clothing Type
        </button>
      </div>

      {/* Clothing Types Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-gray-500 flex flex-col items-center justify-center">
              <Loader />
              Loading...
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Clothing Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clothingTypes.map((type) => {
                  const pricingMap =
                    type.pricing instanceof Map
                      ? Object.fromEntries(type.pricing)
                      : type.pricing || {};

                  return (
                    <tr key={type._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {type.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          {Object.keys(pricingMap).length > 0 ? (
                            Object.entries(pricingMap).map(
                              ([serviceId, price]) => {
                                const service = services.find(
                                  (s) => s._id === serviceId
                                );
                                return (
                                  <div key={serviceId} className="text-xs">
                                    {service?.name || "Unknown"}: TSh{" "}
                                    {price?.toLocaleString() || "0"}
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <span className="text-gray-400">
                              Uses base pricing
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(type.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(type)}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(type._id)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Clothing Type Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingType ? "Edit Clothing Type" : "Add New Clothing Type"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clothing Type Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
                  placeholder="e.g., Shirt, Dress, Suit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Services and Set Pricing
                </label>
                <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {services.map((service) => {
                    const isSelected =
                      formData.servicePricing[service._id] !== undefined;
                    const price =
                      formData.servicePricing[service._id] ||
                      service.basePrice ||
                      0;

                    return (
                      <div
                        key={service._id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          id={`service-${service._id}`}
                          checked={isSelected}
                          onChange={() => toggleServiceSelection(service._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`service-${service._id}`}
                          className="flex-1 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {service.name}
                          <span className="text-gray-500 ml-2">
                            (Base: TSh{" "}
                            {service.basePrice?.toLocaleString() || "0"})
                          </span>
                        </label>
                        {isSelected && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">TSh</span>
                            <input
                              type="number"
                              value={price || ""}
                              onChange={(e) =>
                                handleServicePriceChange(
                                  service._id,
                                  e.target.value
                                )
                              }
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm outline-none border-b-2"
                              placeholder="0.00"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select services to apply specific pricing for this clothing
                  type. Unselected services will use base pricing.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#2D3A58] hover:bg-[#0F172A] text-white py-2 rounded-lg"
                >
                  {editingType ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingType(null);
                    setFormData({
                      name: "",
                      servicePricing: {},
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

export default ClothingTypes;
