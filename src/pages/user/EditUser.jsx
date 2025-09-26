import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "ROLE_USER",
    password: "",
    companyId: "",
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Lấy thông tin user
        const { data } = await api.get(`/api/users/${id}`);
        setForm({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "ROLE_USER",
          password: "",
          companyId: data.company?.id || "",
        });

        // Lấy danh sách company
        const res = await api.get("/api/companies");
        const list = Array.isArray(res.data) ? res.data : res.data.content || [];
        setCompanies(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        company: form.companyId ? { id: form.companyId } : null,
      };
      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }

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
          label="New Password (optional)"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          required={false}
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
        <button className="border px-3 py-2 rounded">Save</button>
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
