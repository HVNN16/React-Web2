import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";

export default function UserList() {
  const [page, setPage] = useState({ content: [], totalElements: 0, number: 0, size: 20 });
  const [loading, setLoading] = useState(true);
  const isAdmin = useAuthStore((s) => s.hasRole)("ADMIN");

  const fetchData = async (p = 0) => {
    const { data } = await api.get("/api/users", { params: { page: p, size: page.size } });
    setPage(data);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchData(0);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Xoá user này?")) return;
    await api.delete(`/api/users/${id}`);
    await fetchData(page.number);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-3">Users</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Company</th>
            {isAdmin && <th className="border p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {page.content.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">{u.company?.name || "-"}</td>
              {isAdmin && (
                <td className="border p-2 space-x-2">
                  <Link className="underline" to={`/users/edit/${u.id}`}>Edit</Link>
                  <button className="text-red-600 underline" onClick={() => onDelete(u.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
          {page.content.length === 0 && (
            <tr><td className="border p-2" colSpan={isAdmin ? 6 : 5}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
