// src/pages/user/UserList.jsx
import { useEffect, useState } from "react";
import api from "../../api/api"; // baseURL nên là http://localhost:8080/api

export default function UserList() {
  const [users, setUsers] = useState([]);     // luôn bắt đầu là []
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users");  // => http://localhost:8080/api/users
        console.log("Users API data:", res.data);

        // Nếu backend trả mảng: dùng res.data
        // Nếu backend trả kiểu paging: { content: [...] }
        const data =
          Array.isArray(res.data)
            ? res.data
            : (Array.isArray(res.data?.content) ? res.data.content : []);

        setUsers(data);
        setErr("");
      } catch (e) {
        // Khi bị 401/403 hoặc CORS hoặc trả HTML
        console.error(e);
        setUsers([]);
        setErr("Không tải được danh sách users. Kiểm tra token/quyền hoặc URL API.");
      }
    })();
  }, []);

  // Fallback khi không phải array để tránh .map crash
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div style={{maxWidth:900, margin:"24px auto"}}>
      <h2>Users</h2>
      {err && <div style={{color:"red"}}>{err}</div>}
      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr>
        </thead>
        <tbody>
          {safeUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
