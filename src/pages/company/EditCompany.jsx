import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, MapPin, Loader2, Save } from "lucide-react";
import api from "../../api/api";
import { motion } from "framer-motion";

export default function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/companies/${id}`);
        setForm({ name: data.name || "", address: data.address || "" });
      } catch (error) {
        setErr(
          typeof error?.response?.data === "string"
            ? error.response.data
            : "Không thể tải thông tin công ty"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await api.put(`/api/companies/${id}`, {
        name: form.name.trim(),
        address: form.address.trim(),
      });
      navigate("/companies");
    } catch (error) {
      setErr(
        typeof error?.response?.data === "string"
          ? error.response.data
          : "Cập nhật công ty thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900">
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
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-700/50"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-3 font-[Inter] tracking-tight">
          Sửa thông tin công ty
        </h1>
        <p className="text-center text-gray-300 mb-6 text-base font-[Inter]">
          Cập nhật thông tin công ty của bạn.
        </p>

        <form onSubmit={submit} className="space-y-5">
          {/* Company Name */}
          <div className="relative">
            <Building2 className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Tên công ty"
            />
          </div>

          {/* Company Address */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full bg-gray-900/50 border border-gray-600 pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              placeholder="Địa chỉ"
            />
          </div>

          {/* Error message */}
          {err && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center font-medium bg-red-900/20 py-2 rounded-lg"
            >
              {String(err)}
            </motion.p>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.07, boxShadow: "0 0 25px rgba(59, 130, 246, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white py-4 rounded-lg text-xl font-bold shadow-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-6 w-6" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Lưu thay đổi
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}