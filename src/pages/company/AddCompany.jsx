import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddCompany() {
    const nav = useNavigate();
    const [form, setForm] = useState({ name:"", address:"" });
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault(); setErr("");
        try {
            await api.post("/api/companies", form);
            nav("/companies");
        } catch (error) {
            setErr(error?.response?.data || "Create failed");
        }
    };

    return (
        <div className="max-w-md p-4">
            <h1 className="text-lg font-semibold mb-3">Add Company</h1>
            <form onSubmit={submit} className="space-y-3">
                <Field label="Name" value={form.name} onChange={(v)=>setForm({...form, name:v})}/>
                <Field label="Address" value={form.address} onChange={(v)=>setForm({...form, address:v})}/>
                {err && <p className="text-red-600 text-sm">{String(err)}</p>}
                <button className="border px-3 py-2 rounded">Create</button>
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
