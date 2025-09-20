import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserList from "./pages/user/UserList";
import CompanyList from "./pages/company/CompanyList";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
        <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
        <Link to="/users" style={{ marginRight: "10px" }}>Users</Link>
        <Link to="/companies">Companies</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/companies" element={<CompanyList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
