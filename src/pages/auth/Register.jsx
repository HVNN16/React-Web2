import { useState } from "react";
import api from "../../api/api";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";

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
            // 1) cố gắng đăng ký công khai
            const res = await api.post("/api/auth/register", {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            // 2) nếu backend trả ok -> tự login
            setOk("Tạo tài khoản thành công. Đang đăng nhập...");
            const { data: loginRes } = await api.post("/api/auth/login", {
                email: form.email,
                password: form.password,
            });
            const token = loginRes?.accessToken;
            if (!token) throw new Error("Không nhận được token sau khi đăng ký");

            // tạm set token để gọi /me
            useAuthStore.getState().login({ token, user: null });
            const me = await api.get("/api/users/me").then(r => r.data);
            loginStore({ token, user: me });
            navigate("/");

        } catch (error) {
            const status = error?.response?.status;
            const msg = error?.response?.data;

            // các tình huống backend KHÔNG mở đăng ký công khai
            if (status === 401 || status === 403 || status === 404) {
                setErr("Đăng ký công khai đang bị tắt. Vui lòng liên hệ Admin để được tạo tài khoản.");
                return;
            }

            // trùng email
            if (status === 409) {
                setErr("Email đã tồn tại. Bạn có thể đăng nhập nếu đã có tài khoản.");
                return;
            }

            // lỗi khác
            setErr(typeof msg === "string" ? msg : "Register failed");
            // không set logout ở đây vì chưa có token
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-12">
            <h1 className="text-2xl font-semibold mb-4">Đăng ký</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <Field label="Name" value={form.name} onChange={(v)=>setForm({...form, name:v})}/>
                <Field label="Email" value={form.email} onChange={(v)=>setForm({...form, email:v})}/>
                <Field type="password" label="Password" value={form.password} onChange={(v)=>setForm({...form, password:v})}/>
                {err && <p className="text-red-600 text-sm">{String(err)}</p>}
                {ok && <p className="text-green-600 text-sm">{ok}</p>}
                <button className="w-full border px-3 py-2 rounded">Register</button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
                Lưu ý: nếu thấy thông báo “Đăng ký công khai đang bị tắt”, hãy yêu cầu Admin tạo tài khoản ở mục <b>Users → Add User</b>.
            </p>
        </div>
    );
}

function Field({ label, value, onChange, type="text" }) {
    return (
        <div>
            <label className="block text-sm">{label}</label>
            <input
                type={type}
                className="w-full border px-3 py-2 rounded"
                value={value}
                onChange={(e)=>onChange(e.target.value)}
                required
            />
        </div>
    );
}
