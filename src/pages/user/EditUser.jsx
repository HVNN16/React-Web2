import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState({ name:"", email:"", role:"ROLE_USER", password:"" });
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(`/api/users/${id}`);
                setForm({ name: data.name || "", email: data.email || "", role: data.role || "ROLE_USER", password: "" });
            } finally { setLoading(false); }
        })();
    }, [id]);

    const submit = async (e) => {
        e.preventDefault(); setErr("");
        try {
            const payload = { name: form.name, email: form.email, role: form.role };
            if (form.password) payload.password = form.password; // chỉ đổi khi nhập
            await api.put(`/api/users/${id}`, payload);
            nav("/users");
        } catch (error) {
            setErr(error?.response?.data || "Update failed");
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="max-w-md p-4">
            <h1 className="text-lg font-semibold mb-3">Edit User</h1>
            <form onSubmit={submit} className="space-y-3">
                <Field label="Name" value={form.name} onChange={(v)=>setForm({...form, name:v})}/>
                <Field label="Email" value={form.email} onChange={(v)=>setForm({...form, email:v})}/>
                <div>
                    <label className="block text-sm">Role</label>
                    <select className="w-full border px-3 py-2 rounded"
                            value={form.role}
                            onChange={(e)=>setForm({...form, role:e.target.value})}>
                        <option value="ROLE_USER">ROLE_USER</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                    </select>
                </div>
                <Field type="password" label="New Password (optional)" value={form.password} onChange={(v)=>setForm({...form, password:v})}/>
                {err && <p className="text-red-600 text-sm">{String(err)}</p>}
                <button className="border px-3 py-2 rounded">Save</button>
            </form>
        </div>
    );
}

function Field({ label, value, onChange, type="text" }) {
    return (
        <div>
            <label className="block text-sm">{label}</label>
            <input type={type} className="w-full border px-3 py-2 rounded"
                   value={value} onChange={(e)=>onChange(e.target.value)} required />
        </div>
    );
}
