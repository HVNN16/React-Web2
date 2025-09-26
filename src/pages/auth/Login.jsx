// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import { useAuthStore } from "../../store";

export default function Login() {
    const navigate = useNavigate();
    const loginStore = useAuthStore((s) => s.login);
    const [form, setForm] = useState({ email: "", password: "" });
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const extractToken = (data) =>
        data?.accessToken || data?.token || data?.jwt || null;

    const onSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setErr("");
        setLoading(true);

        try {
            const { data } = await api.post("/api/auth/login", {
                email: form.email.trim(),
                password: form.password,
            });

            const token = extractToken(data);
            if (!token) throw new Error("Không nhận được token từ máy chủ.");

            useAuthStore.getState().login({ token, user: null });
            const me = await api.get("/api/users/me").then((r) => r.data);

            loginStore({ token, user: me });
            navigate("/");
        } catch (error) {
            const status = error?.response?.status;
            if (status === 401) setErr("Sai email hoặc mật khẩu.");
            else setErr(
                typeof error?.response?.data === "string"
                    ? error.response.data
                    : "Login failed"
            );
            try {
                useAuthStore.getState().logout();
            } catch {}
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-indigo-700 pt-16">
            <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-semibold text-center mb-6 text-white">
                    Đăng nhập
                </h1>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            className="w-full border border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            className="w-full border border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {err && (
                        <p className="text-red-500 text-sm text-center">
                            {String(err)}
                        </p>
                    )}

                    <button
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-400">
                    Chưa có tài khoản?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-400 hover:underline font-medium"
                    >
                        Đăng ký
                    </Link>
                </p>
            </div>
        </div>
    );
}
