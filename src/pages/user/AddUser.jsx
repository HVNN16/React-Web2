import { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "ROLE_USER",
    password: "",
    companyId: "",
  });
  const [err, setErr] = useState("");
  const [companies, setCompanies] = useState([]);

  // Lấy danh sách công ty
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/companies");
        const list = Array.isArray(data) ? data : data.content || [];
        setCompanies(list);
      } catch (e) {
        console.error("Load companies failed", e);
        setCompanies([]);
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.password || form.password.trim() === "") {
      setErr("Password is required");
      return;
    }

    try {
      // Gửi company dưới dạng object {id}
      await api.post("/api/users", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        company: form.companyId ? { id: form.companyId } : null,
      });
      nav("/users");
    } catch (error) {
      setErr(error?.response?.data || "Create failed");
    }
  };

  return (
    <div className="max-w-md p-4">
      <h1 className="text-lg font-semibold mb-3">Add User</h1>
      <form onSubmit={submit} className="space-y-3">
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Field
          label="Email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />

        <div>
          <label className="block text-sm">Role</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="ROLE_USER">ROLE_USER</option>
            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
          </select>
        </div>

        <Field
          type="password"
          label="Password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          required
        />

        <div>
          <label className="block text-sm">Company</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            required
          >
            <option value="">-- Select Company --</option>
            {Array.isArray(companies) &&
              companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {err && <p className="text-red-600 text-sm">{String(err)}</p>}
        <button className="border px-3 py-2 rounded">Create</button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = true }) {
  return (
    <div>
      <label className="block text-sm">{label}</label>
      <input
        type={type}
        className="w-full border px-3 py-2 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
