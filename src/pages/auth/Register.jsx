// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setErr("");
        setLoading(true);

        try {
            await api.post("/api/auth/register", form);
            // TODO: điều hướng hoặc thông báo thành công
        } catch (error) {
            setErr(
                typeof error?.response?.data === "string"
                    ? error.response.data
                    : "Đăng ký thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-700">
            <div className="w-full max-w-sm bg-[#0f172a] shadow-lg rounded-2xl p-6">
                <h1 className="text-2xl font-bold text-center mb-2 text-white">Đăng ký</h1>
                <p className="text-center text-gray-400 text-sm mb-6">
                    Tạo tài khoản mới để bắt đầu!
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Họ và tên</label>
                        <input
                            className="w-full bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-lg focus:ring focus:ring-indigo-500 outline-none"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-lg focus:ring focus:ring-indigo-500 outline-none"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            className="w-full bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-lg focus:ring focus:ring-indigo-500 outline-none"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    {err && <p className="text-red-500 text-sm">{String(err)}</p>}

                    <button
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>

                <div className="mt-4 text-sm text-center text-gray-400">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-indigo-400 hover:underline">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}
