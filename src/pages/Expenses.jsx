import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, Paperclip } from "lucide-react";
import { expenseAPI } from "../api/api";
import Loader from "../components/Loader";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
    receipt: null,
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseAPI.getAll();
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // HARD validation — backend-aligned
    if (!formData.category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!formData.date) {
      toast.error("Date is required");
      return;
    }

    try {
      const data = new FormData();
      data.append("category", formData.category.trim());
      data.append("amount", Number(formData.amount));
      data.append("description", formData.description.trim());
      data.append("date", formData.date);

      if (formData.receipt) {
        data.append("receipt", formData.receipt);
      }

      await expenseAPI.create(data);

      toast.success("Expense saved successfully!");
      setShowModal(false);
      setFormData({
        category: "",
        amount: "",
        description: "",
        date: "",
        receipt: null,
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to save expense: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const confirmDeleteToast = (onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-medium text-gray-800">
            Are you sure you want to delete this expense?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                closeToast();
                onConfirm();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      },
    );
  };

  const handleDelete = (id) => {
    confirmDeleteToast(async () => {
      try {
        await expenseAPI.delete(id);
        toast.success("Expense deleted!");
        fetchExpenses();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete expense");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#DDE1E8] -mx-8 -mt-8 px-8 pb-4 pt-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-600 mt-1">
            Track and manage business expenses
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2D3A58] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Expense
        </button>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader />
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No expenses found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Amount (TSh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {expense.receiptUrl ? (
                      <a
                        href={expense.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 flex items-center gap-1"
                      >
                        <Paperclip className="w-4 h-4" /> View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount (TSh) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Receipt (optional)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    setFormData({ ...formData, receipt: e.target.files[0] })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#2D3A58] hover:bg-[#0F172A] text-white py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      category: "",
                      amount: "",
                      description: "",
                      date: "",
                      receipt: null,
                    });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
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

export default Expenses;
