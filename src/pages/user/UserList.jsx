import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";

export default function UserList() {
  const [page, setPage] = useState({
    content: [],
    totalElements: 0,
    number: 0,
    size: 20,
  });
  const [loading, setLoading] = useState(true);
  const isAdmin = useAuthStore((s) => s.hasRole("ADMIN"));

  const fetchData = async (p = 0) => {
    const { data } = await api.get("/api/users", {
      params: { page: p, size: page.size },
    });
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-lg font-semibold mb-4">Users</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Company</th>
              {isAdmin && <th className="border px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {page.content.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.role}</td>
                <td className="border px-4 py-2">{u.company?.name || "-"}</td>
                {isAdmin && (
                  <td className="border px-4 py-2 space-x-3">
                    <Link
                      className="text-blue-600 hover:underline"
                      to={`/users/edit/${u.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {page.content.length === 0 && (
              <tr>
                <td
                  className="border px-4 py-2 text-center text-gray-500"
                  colSpan={isAdmin ? 6 : 5}
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
