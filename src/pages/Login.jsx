import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Loader from "../components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      toast.success("Umefanikiwa kuingia kwenye mfumo");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Imeshindikana kuingia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DDE1E8] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Login</h1>
        <p className="text-sm text-gray-600 mt-1">
          Ingiza barua pepe na nenosiri
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none border-b-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D3A58] hover:bg-[#0F172A] text-white py-2 rounded-lg flex items-center justify-center"
          >
            {loading ? <Loader size={28} /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


