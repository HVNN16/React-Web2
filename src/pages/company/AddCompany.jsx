import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddCompany() {
    const nav = useNavigate();
    const [form, setForm] = useState({ name: "", address: "" });
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            await api.post("/api/companies", form);
            nav("/companies");
        } catch (error) {
            setErr(error?.response?.data || "Create failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Thêm Công Ty
                </h1>

                <form onSubmit={submit} className="space-y-4">
                    <Field
                        label="Tên công ty"
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                    />
                    <Field
                        label="Địa chỉ"
                        value={form.address}
                        onChange={(v) => setForm({ ...form, address: v })}
                    />

                    {err && (
                        <p className="text-red-600 text-sm text-center">
                            {String(err)}
                        </p>
                    )}

                    <button
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                        Tạo mới
                    </button>
                </form>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
            />
        </div>
    );
}
