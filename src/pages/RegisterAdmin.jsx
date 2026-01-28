import { useState } from "react";
import { toast } from "react-toastify";
import { authAPI } from "../api/api";
import Loader from "../components/Loader";

const RegisterAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.registerAdmin({ email: form.email, password: form.password });
      toast.success("Admin mpya amesajiliwa");
      setForm({ email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Imeshindikana kusajili admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 bg-[#DDE1E8] -mx-8 -mt-8 px-8 pb-4 pt-6">
        <h1 className="text-3xl font-bold text-gray-800">Register Admin</h1>
        <p className="text-gray-600 mt-1">
          Moderator anaweza kusajili admin mpya
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (min 6)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#2D3A58] hover:bg-[#0F172A] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader /> : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterAdmin;


