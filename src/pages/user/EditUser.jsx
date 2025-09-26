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
        const { data } = await api.get(`/api/users/${id}`);
        setForm({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "ROLE_USER",
          password: "",
          companyId: data.company?.id || "",
        });

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
    <div className="flex justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Chỉnh sửa người dùng</h1>

        <form onSubmit={submit} className="space-y-4">
          <Field
            label="Tên"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Field
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="ROLE_USER">ROLE_USER</option>
              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            </select>
          </div>

          <Field
            type="password"
            label="Mật khẩu mới (tùy chọn)"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required={false}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
              required
            >
              <option value="">-- Chọn công ty --</option>
              {Array.isArray(companies) &&
                companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {err && <p className="text-red-600 text-sm">{String(err)}</p>}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              onClick={() => nav("/users")}
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

function Field({ label, value, onChange, type = "text", required = true }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
