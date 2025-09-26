import { useState } from "react";
import api from "../../api/api";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const loginStore = useAuthStore((s) => s.login);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(""); setOk("");

        try {
            await api.post("/api/auth/register", {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            setOk("Tạo tài khoản thành công. Đang đăng nhập...");
            const { data: loginRes } = await api.post("/api/auth/login", {
                email: form.email,
                password: form.password,
            });
            const token = loginRes?.accessToken;
            if (!token) throw new Error("Không nhận được token sau khi đăng ký");

            useAuthStore.getState().login({ token, user: null });
            const me = await api.get("/api/users/me").then(r => r.data);
            loginStore({ token, user: me });
            navigate("/");
        } catch (error) {
            const status = error?.response?.status;
            const msg = error?.response?.data;

            if (status === 401 || status === 403 || status === 404) {
                setErr("Đăng ký công khai đang bị tắt. Vui lòng liên hệ Admin để được tạo tài khoản.");
                return;
            }
            if (status === 409) {
                setErr("Email đã tồn tại. Bạn có thể đăng nhập nếu đã có tài khoản.");
                return;
            }
            setErr(typeof msg === "string" ? msg : "Register failed");
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
                    Đăng ký
                </h1>
                <p className="text-center text-gray-300 mb-6 text-base font-[Inter]">
                    Tạo tài khoản mới để bắt đầu!
                </p>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            placeholder="Họ và tên"
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

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            placeholder="Mật khẩu"
                        />
                    </div>

                    {err && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm text-center font-medium bg-red-900/20 py-2 rounded-lg"
                        >
                            {String(err)}
                        </motion.p>
                    )}
                    {ok && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-600 text-sm text-center font-medium bg-green-900/20 py-2 rounded-lg"
                        >
                            {ok}
                        </motion.p>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.07, boxShadow: "0 0 25px rgba(59, 130, 246, 0.8)" }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white py-4 rounded-lg text-xl font-bold shadow-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        disabled={false}
                    >
                        Đăng ký
                    </motion.button>
                </form>

                <p className="text-xs text-gray-500 mt-4 text-center font-[Inter]">
                    Nếu bạn thấy thông báo “Đăng ký công khai đang bị tắt”, hãy yêu cầu Admin tạo tài khoản tại mục <b>Users → Add User</b>.
                </p>
            </motion.div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text" }) {
    return (
        <div className="relative">
            <label className="block text-sm text-gray-400 mb-1 font-[Inter]">{label}</label>
            <input
                type={type}
                className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
            />
        </div>
    );
}