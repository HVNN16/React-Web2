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
            // 👇 GỬI CHÍNH XÁC { email, password }
            const { data } = await api.post("/api/auth/login", {
                email: form.email.trim(),
                password: form.password,
            });

            const token = extractToken(data);
            if (!token) throw new Error("Không nhận được token từ máy chủ.");

            // tạm set token để gọi /me
            useAuthStore.getState().login({ token, user: null });

            // lấy profile hiện tại
            const me = await api.get("/api/users/me").then((r) => r.data);

            // lưu vào store & điều hướng
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
        <div className="max-w-sm mx-auto mt-12">
            <h1 className="text-3xl font-bold mb-4">Đăng nhập</h1>

            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        className="w-full border px-3 py-2 rounded"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        autoComplete="username"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm">Password</label>
                    <input
                        type="password"
                        className="w-full border px-3 py-2 rounded"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        autoComplete="current-password"
                        required
                    />
                </div>

                {err && <p className="text-red-600 text-sm">{String(err)}</p>}

                <button
                    className="w-full border px-3 py-2 rounded disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Đang đăng nhập..." : "Login"}
                </button>
            </form>

            <div className="mt-3 text-sm">
                Chưa có tài khoản? <Link to="/register" className="underline">Register</Link>
            </div>
        </div>
    );
}
