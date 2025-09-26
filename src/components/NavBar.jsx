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
        <nav className="bg-white shadow-lg px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
                {/* Left side - Navigation Links */}
                <div className="flex items-center space-x-6">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                            `flex items-center h-full text-base font-medium transition-colors duration-200 px-3 py-2 rounded-md ${
                                isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-500'
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/users"
                        className={({ isActive }) => 
                            `flex items-center h-full text-base font-medium transition-colors duration-200 px-3 py-2 rounded-md ${
                                isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-500'
                            }`
                        }
                    >
                        Users
                    </NavLink>
                    <NavLink 
                        to="/companies"
                        className={({ isActive }) => 
                            `flex items-center h-full text-base font-medium transition-colors duration-200 px-3 py-2 rounded-md ${
                                isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-500'
                            }`
                        }
                    >
                        Companies
                    </NavLink>
                    {isAdmin && (
                        <>
                            <NavLink 
                                to="/users/add"
                                className={({ isActive }) => 
                                    `flex items-center h-full text-base font-medium transition-colors duration-200 px-3 py-2 rounded-md ${
                                        isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-500'
                                    }`
                                }
                            >
                                Add User
                            </NavLink>
                            <NavLink 
                                to="/companies/add"
                                className={({ isActive }) => 
                                    `flex items-center h-full text-base font-medium transition-colors duration-200 px-3 py-2 rounded-md ${
                                        isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-500'
                                    }`
                                }
                            >
                                Add Company
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Right side - User Actions */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700 flex items-center h-full">
                                    👤 {user?.name || user?.email}
                                </span>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center h-full">
                                    {norm(user?.role)}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate("/login");
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-md shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center h-full"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200 flex items-center h-full"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center h-full"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}