import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Edit, Trash2, Users, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import api from "../../api/api";
import { useAuthStore } from "../../store";
import { motion } from "framer-motion";

export default function UserList() {
  const [page, setPage] = useState({ content: [], totalElements: 0, number: 0, size: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(null); // For delete confirmation
  const isAdmin = useAuthStore((s) => s.hasRole)("ADMIN");

  const fetchData = async (p = 0) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/users", { params: { page: p, size: page.size } });
      setPage(data);
    } catch (error) {
      setError(
        typeof error?.response?.data === "string"
          ? error.response.data
          : "Không thể tải danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchData(0);
    })();
  }, []);

  const onDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      await fetchData(page.number);
      setShowConfirm(null);
    } catch (error) {
      setError(
        typeof error?.response?.data === "string"
          ? error.response.data
          : "Xóa người dùng thất bại"
      );
      setShowConfirm(null);
    }
  };

  const totalPages = Math.ceil(page.totalElements / page.size);

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-white flex items-center gap-2"
        >
          <Loader2 className="animate-spin h-8 w-8" />
          <span>Đang tải...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-5xl mx-auto border border-gray-700/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-white font-[Inter] tracking-tight">
            Danh sách người dùng
          </h1>
        </div>
        <p className="text-gray-300 mb-6 text-base font-[Inter]">
          Quản lý danh sách người dùng trong hệ thống.
        </p>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm text-center font-medium bg-red-900/20 py-2 rounded-lg mb-6 flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {String(error)}
          </motion.p>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="px-4 py-3 font-medium text-gray-200 rounded-l-lg">ID</th>
                <th className="px-4 py-3 font-medium text-gray-200">Tên</th>
                <th className="px-4 py-3 font-medium text-gray-200">Email</th>
                <th className="px-4 py-3 font-medium text-gray-200">Vai trò</th>
                {isAdmin && (
                  <th className="px-4 py-3 font-medium text-gray-200 rounded-r-lg">Hành động</th>
                )}
              </tr>
            </thead>
            <tbody>
              {page.content.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.role === "ROLE_ADMIN" ? "Quản trị viên" : "Người dùng"}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 space-x-3">
                      <Link
                        to={`/users/edit/${user.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit className="w-5 h-5 inline-block mr-1" /> Sửa
                      </Link>
                      <button
                        onClick={() => setShowConfirm(user.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 inline-block mr-1" /> Xóa
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
              {page.content.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="px-4 py-3 text-center text-gray-400"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4 font-[Inter]">
                Xác nhận xóa
              </h2>
              <p className="text-gray-300 mb-6">
                Bạn có chắc chắn muốn xóa người dùng này?
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirm(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(showConfirm)}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors"
                >
                  Xóa
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between text-gray-300">
            <div>
              Hiển thị {page.content.length} / {page.totalElements} người dùng
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fetchData(page.number - 1)}
                disabled={page.number === 0}
                className="p-2 rounded-lg bg-gray-700/50 text-gray-300 disabled:opacity-50 hover:bg-gray-600/50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span>
                Trang {page.number + 1} / {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fetchData(page.number + 1)}
                disabled={page.number + 1 === totalPages}
                className="p-2 rounded-lg bg-gray-700/50 text-gray-300 disabled:opacity-50 hover:bg-gray-600/50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}