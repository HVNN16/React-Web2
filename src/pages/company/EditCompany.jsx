import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCompany() {
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState({ name: "", address: "" });
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(`/api/companies/${id}`);
                setForm({ name: data.name || "", address: data.address || "" });
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            await api.put(`/api/companies/${id}`, form);
            nav("/companies");
        } catch (error) {
            setErr(error?.response?.data || "Update failed");
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="flex justify-center p-6">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">Chỉnh sửa công ty</h1>

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

                    {err && <p className="text-red-600 text-sm">{String(err)}</p>}

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                            onClick={() => nav("/companies")}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
            />
        </div>
    );
}
