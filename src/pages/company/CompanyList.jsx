import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function CompanyList({ role }) {
    const [companies, setCompanies] = useState([]);
    const [newCompany, setNewCompany] = useState({ name: "", address: "" });
    const [editingCompanyId, setEditingCompanyId] = useState(null);
    const [editedCompany, setEditedCompany] = useState({});

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const res = await api.get("/companies");
            console.log("Companies data:", res.data);
            setCompanies(res.data.content || res.data || []); // hỗ trợ cả dạng phân trang và mảng
        } catch (err) {
            console.error("Error loading companies:", err);
        }
    };

    // thêm company
    const handleAdd = async () => {
        try {
            const payload = {
                name: newCompany.name,
                address: newCompany.address,
            };
            await api.post("/companies", payload);
            setNewCompany({ name: "", address: "" });
            loadCompanies(); // load lại danh sách
        } catch (err) {
            console.error("Error adding company:", err);
        }
    };

    // xóa company
    const handleDelete = async (id) => {
        try {
            await api.delete(`/companies/${id}`);
            loadCompanies();
        } catch (err) {
            console.error("Error deleting company:", err);
        }
    };

    // bắt đầu sửa
    const handleStartEdit = (company) => {
        setEditingCompanyId(company.id);
        setEditedCompany({ ...company });
    };

    // hủy sửa
    const handleCancelEdit = () => {
        setEditingCompanyId(null);
        setEditedCompany({});
    };

    // lưu sửa
    const handleSaveEdit = async () => {
        try {
            const payload = {
                name: editedCompany.name,
                address: editedCompany.address,
            };
            await api.put(`/companies/${editedCompany.id}`, payload);
            setEditingCompanyId(null);
            setEditedCompany({});
            loadCompanies();
        } catch (err) {
            console.error("Error editing company:", err);
        }
    };

    return (
        <div>
            <h2>Danh sách Công ty</h2>

            {/* Form thêm mới */}
            {role === "ROLE_ADMIN" && (
                <div style={{ marginBottom: "10px" }}>
                    <input
                        placeholder="Tên công ty"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    />
                    <input
                        placeholder="Địa chỉ"
                        value={newCompany.address}
                        onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                    />
                    <button onClick={handleAdd}>Thêm</button>
                </div>
            )}

            {/* Bảng danh sách */}
            <table border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Địa chỉ</th>
                    {role === "ROLE_ADMIN" && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {companies.map((c) => (
                    <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>
                            {editingCompanyId === c.id ? (
                                <input
                                    value={editedCompany.name || ""}
                                    onChange={(e) =>
                                        setEditedCompany({ ...editedCompany, name: e.target.value })
                                    }
                                />
                            ) : (
                                c.name
                            )}
                        </td>
                        <td>
                            {editingCompanyId === c.id ? (
                                <input
                                    value={editedCompany.address || ""}
                                    onChange={(e) =>
                                        setEditedCompany({ ...editedCompany, address: e.target.value })
                                    }
                                />
                            ) : (
                                c.address
                            )}
                        </td>
                        {role === "ROLE_ADMIN" && (
                            <td>
                                {editingCompanyId === c.id ? (
                                    <>
                                        <button onClick={handleSaveEdit}>Lưu</button>
                                        <button onClick={handleCancelEdit}>Huỷ</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleStartEdit(c)}>Sửa</button>
                                        <button onClick={() => handleDelete(c.id)}>Xoá</button>
                                    </>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
                {companies.length === 0 && (
                    <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>
                            Không có công ty nào
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
