import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import api from "../../api/api";
import { useAuthStore } from "../../store";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) setForm((f) => ({ ...f, email: savedEmail, remember: true }));
  }, []);

  const extractToken = (data) =>
    data?.accessToken || data?.token || data?.jwt || null;

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateEmail(form.email)) {
      setErr("Email không hợp lệ!");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const token = extractToken(data);
      if (!token) throw new Error("Không nhận được token từ máy chủ.");

      if (form.remember) localStorage.setItem("savedEmail", form.email);
      else localStorage.removeItem("savedEmail");

      useAuthStore.getState().login({ token, user: null });
      const me = await api.get("/api/users/me").then((r) => r.data);

      loginStore({ token, user: me });
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) setErr("Sai email hoặc mật khẩu.");
      else
        setErr(
          typeof error?.response?.data === "string"
            ? error.response.data
            : "Đăng nhập thất bại"
        );
      try {
        useAuthStore.getState().logout();
      } catch {}
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
          Đăng nhập
        </h1>
        <p className="text-center text-gray-300 mb-6 text-base font-[Inter]">
          Chào mừng bạn quay lại! Hãy bắt đầu ngay.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="username"
              required
              placeholder="Email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type={showPass ? "text" : "password"}
              className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-10 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
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

          {/* Remember me */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
                className="accent-blue-500"
              />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/forgot-password" className="hover:text-blue-400 transition-colors">
              Quên mật khẩu?
            </Link>
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

          {/* Login button */}
          <motion.button
            whileHover={{ scale: 1.07, boxShadow: "0 0 25px rgba(59, 130, 246, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white py-4 rounded-lg text-xl font-bold shadow-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-6 w-6" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                Đăng nhập
              </>
            )}
          </motion.button>
        </form>

        {/* Register */}
        <div className="mt-8 text-center text-base font-[Inter]">
          <span className="text-gray-400">Chưa có tài khoản? </span>
          <Link
            to="/register"
            className="text-blue-300 font-semibold hover:text-blue-200 hover:underline transition-all duration-200"
          >
            Đăng ký ngay
          </Link>
        </div>
      </motion.div>
    </div>
  );
}