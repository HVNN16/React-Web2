import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";

export default function CompanyList() {
    const [page, setPage] = useState({ content: [], totalElements: 0, number: 0, size: 20 });
    const [loading, setLoading] = useState(true);
    const isAdmin = useAuthStore((s) => s.hasRole)("ADMIN");

    const fetchData = async (p = 0) => {
        const { data } = await api.get("/api/companies", { params: { page: p, size: page.size } });
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
        if (!confirm("Xoá company này?")) return;
        await api.delete(`/api/companies/${id}`);
        await fetchData(page.number);
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Danh sách Công Ty</h1>

            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Tên</th>
                            <th className="px-4 py-2 border">Địa chỉ</th>
                            {isAdmin && <th className="px-4 py-2 border">Thao tác</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {page.content.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{c.id}</td>
                                <td className="px-4 py-2 border font-medium text-gray-800">{c.name}</td>
                                <td className="px-4 py-2 border">{c.address}</td>
                                {isAdmin && (
                                    <td className="px-4 py-2 border space-x-3">
                                        <Link
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                            to={`/companies/edit/${c.id}`}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="text-red-600 hover:text-red-800 font-medium"
                                            onClick={() => onDelete(c.id)}
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
                                    className="px-4 py-3 border text-center text-gray-500"
                                    colSpan={isAdmin ? 4 : 3}
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
