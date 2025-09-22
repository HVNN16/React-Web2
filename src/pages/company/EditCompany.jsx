import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCompany() {
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState({ name:"", address:"" });
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(`/api/companies/${id}`);
                setForm({ name: data.name || "", address: data.address || "" });
            } finally { setLoading(false); }
        })();
    }, [id]);

    const submit = async (e) => {
        e.preventDefault(); setErr("");
        try {
            await api.put(`/api/companies/${id}`, form);
            nav("/companies");
        } catch (error) {
            setErr(error?.response?.data || "Update failed");
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="max-w-md p-4">
            <h1 className="text-lg font-semibold mb-3">Edit Company</h1>
            <form onSubmit={submit} className="space-y-3">
                <Field label="Name" value={form.name} onChange={(v)=>setForm({...form, name:v})}/>
                <Field label="Address" value={form.address} onChange={(v)=>setForm({...form, address:v})}/>
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
