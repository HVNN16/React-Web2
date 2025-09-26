import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

const norm = (r) => (r?.startsWith("ROLE_") ? r.slice(5) : r);

export default function NavBar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const hasRole = useAuthStore((s) => s.hasRole);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = hasRole("ADMIN");

  const linkStyle = ({ isActive }) =>
    `px-2 py-1 rounded hover:bg-gray-100 ${
      isActive ? "text-blue-600 font-semibold underline" : ""
    }`;

  return (
    <nav className="bg-white shadow-sm border-b px-4 py-2 flex items-center justify-between">
      {/* left menu */}
      <div className="flex items-center gap-4">
        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>
        <NavLink to="/users" className={linkStyle}>
          Users
        </NavLink>
        <NavLink to="/companies" className={linkStyle}>
          Companies
        </NavLink>
        {isAdmin && (
          <>
            <NavLink to="/users/add" className={linkStyle}>
              Add User
            </NavLink>
            <NavLink to="/companies/add" className={linkStyle}>
              Add Company
            </NavLink>
          </>
        )}
      </div>

      {/* right user info */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-700">
              👤 {user?.name || user?.email} ({norm(user?.role)})
            </span>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              className="px-3 py-1 border rounded hover:bg-gray-100"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="px-3 py-1 border rounded hover:bg-gray-100"
              to="/register"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
