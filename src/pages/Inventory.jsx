import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { inventoryAPI } from "../api/inventoryApi.js";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import Loader from "../components/Loader";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [lowStock, setLowStock] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    costPerUnit: "",
    reorderLevel: "",
  });

  /* ----------------------------- helpers ----------------------------- */

  const isLowStock = (item) =>
    typeof item.reorderLevel === "number" && item.quantity <= item.reorderLevel;

  const lowStockItems = useMemo(
    () => inventory.filter(isLowStock),
    [inventory],
  );

  /* ------------------------------ fetch ------------------------------- */

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await inventoryAPI.getAll();
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await inventoryAPI.getLowStock();
      setLowStock(res.data);
    } catch (err) {
      console.error("Failed to fetch low stock items", err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchLowStock();
  }, []);

  /* ------------------------------ submit ------------------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      quantity: Number(formData.quantity),
      unit: formData.unit?.trim() || undefined,
      costPerUnit:
        formData.costPerUnit !== "" ? Number(formData.costPerUnit) : undefined,
      reorderLevel:
        formData.reorderLevel !== ""
          ? Number(formData.reorderLevel)
          : undefined,
    };

    try {
      if (editingItem) {
        const res = await inventoryAPI.update(editingItem._id, payload);
        setInventory((prev) =>
          prev.map((item) => (item._id === editingItem._id ? res.data : item)),
        );
      } else {
        const res = await inventoryAPI.create(payload);
        setInventory((prev) => [res.data, ...prev]);
      }

      resetModal();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save inventory item");
    }
  };

  /* ------------------------------ edit ------------------------------- */

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit || "",
      costPerUnit: item.costPerUnit ?? 0,
      reorderLevel: item.reorderLevel ?? "",
    });
    setShowModal(true);
  };

  /* ------------------------------ delete ------------------------------ */

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-medium text-gray-800">
            Are you sure you want to delete this inventory item?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await inventoryAPI.delete(id);
                  setInventory((prev) =>
                    prev.filter((item) => item._id !== id),
                  );
                  toast.success("Inventory item deleted");
                } catch (err) {
                  toast.error(
                    err.response?.data?.message ||
                      "Failed to delete inventory item",
                  );
                } finally {
                  closeToast();
                }
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { autoClose: false },
    );
  };

  /* ------------------------------ modal ------------------------------- */

  const resetModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ name: "", quantity: "", unit: "", costPerUnit: "", reorderLevel: "" });
  };

  /* ------------------------------- UI -------------------------------- */

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#DDE1E8] -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 px-4 md:px-6 lg:px-8 pt-4 md:pt-6 pb-3 md:pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Inventory</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Track and manage resources and supplies
          </p>
        </div>
        <button
          onClick={() => {
            resetModal();
            setShowModal(true);
          }}
          className="text-white px-4 py-2 rounded-lg bg-[#2D3A58] hover:bg-[#0F172A] flex items-center gap-2 text-sm md:text-base w-fit"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Item</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="w-4 h-5" />
            <span className="font-semibold text-sm md:text-base">Low Stock Alert</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1 md:mt-2">
            {lowStockItems.length} item(s) are below reorder level
          </p>
          <div className="mt-2 md:mt-3 space-y-1">
            {lowStockItems.map((item) => (
              <div key={item._id} className="text-xs md:text-sm text-yellow-700">
                • {item.name}: {Number(item.quantity || 0).toFixed(3)} {item.unit || ""}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Qty
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                  Unit
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  Cost/Unit
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Reorder
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item._id}>
                  <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-sm">{item.name}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-sm">{Number(item.quantity || 0).toFixed(3)}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-sm hidden sm:table-cell">{item.unit || "-"}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-sm hidden md:table-cell">
                    {Number(item.costPerUnit || 0).toLocaleString()}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-sm hidden lg:table-cell">{item.reorderLevel ?? "-"}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    {isLowStock(item) ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                        Low
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 p-1"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              {editingItem ? "Edit Item" : "Add Item"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full border p-2 rounded text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full border p-2 rounded text-base"
                  placeholder="kg, liters, pieces"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Per Unit (TZS)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={formData.costPerUnit}
                  onChange={(e) =>
                    setFormData({ ...formData, costPerUnit: e.target.value })
                  }
                  className="w-full border p-2 rounded text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Level
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, reorderLevel: e.target.value })
                  }
                  className="w-full border p-2 rounded text-base"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button className="flex-1 bg-[#2D3A58] text-white py-2 md:py-3 rounded text-base">
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetModal}
                  className="flex-1 bg-gray-200 py-2 md:py-3 rounded text-base"
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

export default Inventory;
