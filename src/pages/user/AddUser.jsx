import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Lock, Eye, EyeOff, Loader2, Save } from "lucide-react";
import api from "../../api/api";
import { motion } from "framer-motion";

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", role: "ROLE_USER", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (loading) return;

    if (!validateEmail(form.email)) {
      setErr("Email không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/users", {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password,
      });
      navigate("/users");
    } catch (error) {
      setErr(
        typeof error?.response?.data === "string"
          ? error.response.data
          : "Tạo người dùng thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-700/50"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-3 font-[Inter] tracking-tight">
          Thêm người dùng
        </h1>
        <p className="text-center text-gray-300 mb-6 text-base font-[Inter]">
          Nhập thông tin để tạo người dùng mới.
        </p>

        <form onSubmit={submit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Tên người dùng"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="Email"
            />
          </div>

          {/* Role */}
          <div className="relative">
            <Shield className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <select
              className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="ROLE_USER">Người dùng</option>
              <option value="ROLE_ADMIN">Quản trị viên</option>
            </select>
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type={showPass ? "text" : "password"}
              className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-10 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="Mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              {showPass ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>

          {/* Error message */}
          {err && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center font-medium bg-red-900/20 py-2 rounded-lg"
            >
              {String(err)}
            </motion.p>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.07, boxShadow: "0 0 25px rgba(59, 130, 246, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white py-4 rounded-lg text-xl font-bold shadow-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-6 w-6" />
                Đang tạo...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Tạo người dùng
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}