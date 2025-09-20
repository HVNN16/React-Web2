import { useState } from "react";
import api from "../../api/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      alert("Đăng nhập thành công!");
      localStorage.setItem("token", res.data.accessToken);
    } catch (err) {
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng nhập</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
