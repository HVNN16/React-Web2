import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function UserList({ role }) {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "ROLE_USER",
    companyId: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
    loadCompanies();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.content || res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const loadCompanies = async () => {
    try {
      const res = await api.get("/companies");
      setCompanies(res.data.content || res.data || []);
    } catch (err) {
      console.error("Error loading companies:", err);
    }
  };

  // thêm user
  const handleAdd = async () => {
    try {
      const payload = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.companyId ? { id: newUser.companyId } : null,
      };
      await api.post("/users", payload);
      setNewUser({ name: "", email: "", role: "ROLE_USER", companyId: "" });
      loadUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // xóa user
  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // bật chế độ edit
  const handleEdit = (user) => {
    setEditingUser({
      ...user,
      companyId: user.company ? user.company.id : "",
    });
  };

  // lưu update
  const handleUpdate = async () => {
    try {
      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        company: editingUser.companyId ? { id: editingUser.companyId } : null,
      };
      await api.put(`/users/${editingUser.id}`, payload);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
      <div>
        <h2>Danh sách Người dùng</h2>

        {role === "ROLE_ADMIN" && (
            <div style={{ marginBottom: "10px" }}>
              <input
                  placeholder="Tên"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="ROLE_USER">ROLE_USER</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
              </select>
              <select
                  value={newUser.companyId}
                  onChange={(e) =>
                      setNewUser({ ...newUser, companyId: parseInt(e.target.value) })
                  }
              >
                <option value="">--Chọn công ty--</option>
                {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                ))}
              </select>
              <button onClick={handleAdd}>Thêm</button>
            </div>
        )}

        <table border="1" cellPadding="5">
          <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Company</th>
            {role === "ROLE_ADMIN" && <th>Actions</th>}
          </tr>
          </thead>
          <tbody>
          {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>

                {editingUser?.id === u.id ? (
                    <>
                      <td>
                        <input
                            value={editingUser.name}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, name: e.target.value })
                            }
                        />
                      </td>
                      <td>
                        <input
                            value={editingUser.email}
                            onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  email: e.target.value,
                                })
                            }
                        />
                      </td>
                      <td>
                        <select
                            value={editingUser.role}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, role: e.target.value })
                            }
                        >
                          <option value="ROLE_USER">ROLE_USER</option>
                          <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                        </select>
                      </td>
                      <td>
                        <select
                            value={editingUser.companyId}
                            onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  companyId: parseInt(e.target.value),
                                })
                            }
                        >
                          <option value="">--Chọn công ty--</option>
                          {companies.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button onClick={handleUpdate}>Lưu</button>
                        <button onClick={() => setEditingUser(null)}>Hủy</button>
                      </td>
                    </>
                ) : (
                    <>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.company ? u.company.name : ""}</td>
                      {role === "ROLE_ADMIN" && (
                          <td>
                            <button onClick={() => handleEdit(u)}>Sửa</button>
                            <button onClick={() => handleDelete(u.id)}>Xoá</button>
                          </td>
                      )}
                    </>
                )}
              </tr>
          ))}
          {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Không có người dùng nào
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
}
