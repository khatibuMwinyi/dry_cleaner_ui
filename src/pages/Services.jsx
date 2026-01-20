import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { serviceAPI } from "../api/api";
import Loader from "../components/Loader";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    basePrice: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await serviceAPI.getAll();
      setServices(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({ name: "", basePrice: "" });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || "",
      basePrice: service.basePrice ?? "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    if (!formData.basePrice || Number(formData.basePrice) < 0) {
      toast.error("Base price must be a valid number");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      basePrice: Number(formData.basePrice),
    };

    try {
      if (editingService) {
        await serviceAPI.update(editingService._id, payload);
        toast.success("Service updated");
      } else {
        await serviceAPI.create(payload);
        toast.success("Service created");
      }

      setShowModal(false);
      setEditingService(null);
      setFormData({ name: "", basePrice: "" });
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save service");
    }
  };
  const confirmToast = (message, onConfirm) => {
    const id = toast.info(
      <div>
        <div className="mb-2">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800"
            onClick={() => {
              onConfirm();
              toast.dismiss(id);
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
            onClick={() => toast.dismiss(id)}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false, pauseOnHover: true },
    );
  };
const handleDelete = (id) => {
  confirmToast("Are you sure you want to delete this service?", async () => {
    try {
      await serviceAPI.delete(id);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete service"
      );
    }
  });
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#DDE1E8] -mx-8 -mt-8 px-8 pb-4 pt-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-600 mt-1">
            Manage dry cleaning services and pricing
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#2D3A58] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader />
          </div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No services found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Base Price (TSh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{service.name}</td>
                  <td className="px-6 py-4 text-sm">
                    {(service.basePrice ?? 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(service)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Base Price (TSh) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#2D3A58] text-white py-2 rounded-lg hover:bg-[#0F172A]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 py-2 rounded-lg"
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

export default Services;
