import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserList from "./pages/user/UserList";
import CompanyList from "./pages/company/CompanyList";

function App() {
    // 👉 test tạm role
    const role = "ROLE_ADMIN"; // hoặc "ROLE_USER"

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
                {/* truyền role xuống đây 👇 */}
                <Route path="/users" element={<UserList role={role} />} />
                <Route path="/companies" element={<CompanyList role={role} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
