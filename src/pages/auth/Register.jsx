// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setErr("");
        setLoading(true);

        try {
            await api.post("/api/auth/register", {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            navigate("/login");
        } catch (error) {
            setErr(
                error?.response?.data?.message ||
                    "Đăng ký thất bại, vui lòng thử lại"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-indigo-700 pt-16">
            <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-semibold text-center mb-2 text-white">
                    Đăng ký
                </h1>
                <p className="text-center text-gray-400 mb-6">
                    Tạo tài khoản mới để bắt đầu!
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Họ và tên
                        </label>
                        <input
                            className="w-full border border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border border-gray-600 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
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
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-400">
                    Đã có tài khoản?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-400 hover:underline font-medium"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
