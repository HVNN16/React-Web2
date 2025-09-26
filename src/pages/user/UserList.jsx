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

  if (loading)
    return <p className="p-4 text-center text-gray-200">Đang tải dữ liệu...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-700 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-[#0f172a] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Danh sách Người dùng</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 border border-indigo-500">ID</th>
                <th className="px-4 py-3 border border-indigo-500">Tên</th>
                <th className="px-4 py-3 border border-indigo-500">Email</th>
                <th className="px-4 py-3 border border-indigo-500">Vai trò</th>
                <th className="px-4 py-3 border border-indigo-500">Công ty</th>
                {isAdmin && (
                  <th className="px-4 py-3 border border-indigo-500 text-center">
                    Thao tác
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {page.content.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-indigo-900/40 transition-colors"
                >
                  <td className="px-4 py-3 border border-gray-700 text-gray-200">{u.id}</td>
                  <td className="px-4 py-3 border border-gray-700 font-medium text-white">{u.name}</td>
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">{u.email}</td>
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">{u.role}</td>
                  <td className="px-4 py-3 border border-gray-700 text-gray-300">{u.company?.name || "-"}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 border border-gray-700 text-center space-x-3">
                      <Link
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                        to={`/users/edit/${u.id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
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
                    className="px-4 py-4 border border-gray-700 text-center text-gray-400"
                    colSpan={isAdmin ? 6 : 5}
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
