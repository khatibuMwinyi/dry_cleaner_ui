import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { expenseAPI } from "../api/api";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Loader from "../components/Loader";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await expenseAPI.getAll();
      setExpenses(data);
    } catch {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("category", formData.category);
    data.append("amount", formData.amount);
    data.append("description", formData.description);
    data.append("date", formData.date);
    if (receipt) data.append("receipt", receipt);

    try {
      if (editingExpense) {
        await expenseAPI.update(editingExpense._id, data);
      } else {
        await expenseAPI.create(data);
      }

      setShowModal(false);
      setEditingExpense(null);
      setReceipt(null);
      setFormData({ category: "", amount: "", description: "", date: "" });
      fetchExpenses();
    } catch {
      toast.error("Failed to save expense");
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      amount: expense.amount,
      description: expense.description || "",
      date: new Date(expense.date).toISOString().split("T")[0],
    });
    setReceipt(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await expenseAPI.delete(id);
    fetchExpenses();
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <button
          onClick={() => {
            setEditingExpense(null);
            setReceipt(null);
            setFormData({
              category: "",
              amount: "",
              description: "",
              date: "",
            });
            setShowModal(true);
          }}
          className="bg-[#2D3A58] text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-600">Total Expenses</p>
        <p className="text-2xl font-bold text-red-600">
          TSh {totalExpenses.toLocaleString()}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <Loader />
          </div>
        ) : (
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e._id} className="border-t">
                  <td className="px-6 py-3">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">{e.category}</td>
                  <td className="px-6 py-3">TSh {e.amount.toLocaleString()}</td>
                  <td className="px-6 py-3">{e.description || "-"}</td>
                  <td className="px-6 py-3 flex gap-2">
                    {e.receiptUrl && (
                      <button
                        onClick={() => window.open(e.receiptUrl, "_blank")}
                        title="View receipt"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    <button onClick={() => handleEdit(e)}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(e._id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </h2>

            <input
              required
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              required
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setReceipt(e.target.files[0])}
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#2D3A58] text-white py-2 rounded"
              >
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

export default Expenses;
