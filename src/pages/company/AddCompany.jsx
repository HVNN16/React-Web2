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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-700">
      <div className="w-full max-w-lg bg-[#0f172a] p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Thêm Công Ty
        </h1>

        <form onSubmit={submit} className="space-y-5">
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
            <p className="text-red-400 text-sm text-center bg-red-500/20 py-2 rounded-lg">
              {String(err)}
            </p>
          )}

          <button
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-semibold text-lg transition"
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
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full p-3 rounded-lg bg-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
