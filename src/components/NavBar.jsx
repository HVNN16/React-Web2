import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

const norm = (r) => (r?.startsWith("ROLE_") ? r.slice(5) : r);

export default function NavBar() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const hasRole = useAuthStore((s) => s.hasRole);
    const logout = useAuthStore((s) => s.logout);
    const isAdmin = hasRole("ADMIN");

    return (
        <nav className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center gap-4">
                <NavLink to="/" className="font-semibold">Home</NavLink>
                <NavLink to="/users">Users</NavLink>
                <NavLink to="/companies">Companies</NavLink>
                {isAdmin && (
                    <>
                        <NavLink to="/users/add">Add User</NavLink>
                        <NavLink to="/companies/add">Add Company</NavLink>
                    </>
                )}
            </div>
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <span className="text-sm">👤 {user?.name || user?.email} ({norm(user?.role)})</span>
                        <button className="px-3 py-1 border rounded"
                                onClick={() => { logout(); navigate("/login"); }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link className="px-3 py-1 border rounded" to="/login">Login</Link>
                        <Link className="px-3 py-1 border rounded" to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
