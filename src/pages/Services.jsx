import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Play, Trash2 } from "lucide-react";
import { serviceAPI, inventoryAPI } from "../api/api";
import Dropdown from "../components/Dropdown";
import Loader from "../components/Loader";

const Services = () => {
  const [services, setServices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    basePrice: "",
    consumables: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesRes, inventoryRes] = await Promise.all([
        serviceAPI.getAll(),
        inventoryAPI.getAll(),
      ]);
      setServices(servicesRes.data);
      setInventory(inventoryRes.data.filter((i) => i.isActive));
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const addConsumable = () => {
    setForm({
      ...form,
      consumables: [...form.consumables, { inventory: "", quantity: "" }],
    });
  };

  const updateConsumable = (index, field, value) => {
    const updated = [...form.consumables];
    updated[index][field] = value;
    setForm({ ...form, consumables: updated });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name || !form.basePrice) {
      toast.error("Name and price required");
      return;
    }

    try {
      await serviceAPI.create({
        name: form.name.trim(),
        basePrice: Number(form.basePrice),
        consumables: form.consumables.map((c) => ({
          inventory: c.inventory,
          quantity: Number(c.quantity),
        })),
      });

      toast.success("Service created");
      setShowModal(false);
      setForm({ name: "", basePrice: "", consumables: [] });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create service");
    }
  };

  const executeService = async (id) => {
    const qty = prompt("Execute how many units?", "1");
    if (!qty) return;

    try {
      await serviceAPI.execute(id, { quantity: Number(qty) });
      toast.success("Service executed");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Execution failed");
    }
  };

  const deleteService = async (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-medium mb-2">Delete this service?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await serviceAPI.delete(id);
                toast.success("Service deleted");
                loadData();
                closeToast();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false },
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Services</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2D3A58] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{service.name}</td>
                <td className="px-6 py-4">
                  {service.basePrice?.toLocaleString() ?? "-"}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => executeService(service._id)}
                    className="text-green-600"
                  >
                    <Play size={18} />
                  </button>
                  <button
                    onClick={() => deleteService(service._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleCreate}
            className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4"
          >
            <h2 className="text-xl font-bold">Create Service</h2>

            <input
              placeholder="Service name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="number"
              placeholder="Base price"
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="space-y-2">
              {form.consumables.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <Dropdown
                    options={inventory}
                    value={c.inventory}
                    onChange={(v) => updateConsumable(i, "inventory", v)}
                    getOptionLabel={(o) => o.name}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={c.quantity}
                    onChange={(e) =>
                      updateConsumable(i, "quantity", e.target.value)
                    }
                    className="w-24 border px-2 py-1 rounded"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addConsumable}
                className="text-sm text-blue-600"
              >
                + Add inventory consumption
              </button>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-[#2D3A58] text-white py-2 rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Services;
