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

    useEffect(() => { (async () => { try { await fetchData(0); } finally { setLoading(false); } })(); }, []);

    const onDelete = async (id) => {
        if (!confirm("Xoá company này?")) return;
        await api.delete(`/api/companies/${id}`);
        await fetchData(page.number);
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="p-4">
            <h1 className="text-lg font-semibold mb-3">Companies</h1>
            <table className="w-full border">
                <thead>
                <tr className="bg-gray-50">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Address</th>
                    {isAdmin && <th className="border p-2">Actions</th>}
                </tr>
                </thead>
                <tbody>
                {page.content.map((c) => (
                    <tr key={c.id}>
                        <td className="border p-2">{c.id}</td>
                        <td className="border p-2">{c.name}</td>
                        <td className="border p-2">{c.address}</td>
                        {isAdmin && (
                            <td className="border p-2 space-x-2">
                                <Link className="underline" to={`/companies/edit/${c.id}`}>Edit</Link>
                                <button className="text-red-600 underline" onClick={() => onDelete(c.id)}>Delete</button>
                            </td>
                        )}
                    </tr>
                ))}
                {page.content.length === 0 && (
                    <tr><td className="border p-2" colSpan={isAdmin?4:3}>No data</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
