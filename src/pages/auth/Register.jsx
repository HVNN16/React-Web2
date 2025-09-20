import { useState } from "react";
import api from "../../api/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      alert("Đăng ký thành công!");
      localStorage.setItem("token", res.data.accessToken);
    } catch (err) {
      alert("Lỗi đăng ký: " + err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng ký</h2>
      <input name="name" placeholder="Tên" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} />
      <button type="submit">Đăng ký</button>
    </form>
  );
}
