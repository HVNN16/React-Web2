import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import { Protected, RequireRole } from "./components/Protected";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import UserList from "./pages/user/UserList";
import AddUser from "./pages/user/AddUser";
import EditUser from "./pages/user/EditUser";

import CompanyList from "./pages/company/CompanyList";
import AddCompany from "./pages/company/AddCompany";
import EditCompany from "./pages/company/EditCompany";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Không có Navbar */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Có Navbar */}
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <Protected>
                                <div className="p-4">
                                    Chào mừng! Chọn Users / Companies ở menu.
                                </div>
                            </Protected>
                        </>
                    }
                />

                {/* Users */}
                <Route
                    path="/users"
                    element={
                        <>
                            <Navbar />
                            <Protected>
                                <UserList />
                            </Protected>
                        </>
                    }
                />
                <Route
                    path="/users/add"
                    element={
                        <>
                            <Navbar />
                            <Protected>
                                <RequireRole role="ADMIN">
                                    <AddUser />
                                </RequireRole>
                            </Protected>
                        </>
                    }
                />
                <Route
                    path="/users/edit/:id"
                    element={
                        <>
                            <Navbar />
                            <Protected>
                                <RequireRole role="ADMIN">
                                    <EditUser />
                                </RequireRole>
                            </Protected>
                        </>
                    }
                />

                {/* Companies */}
                <Route
                    path="/companies"
                    element={
                        <>
                            <Navbar />
                            <Protected>
                                <CompanyList />
                            </Protected>
                        </>
                    }
                />
                <Route
                    path="/companies/add"
                    element={
                        <>
                            <Navbar />
                            <Protected>
                                <RequireRole role="ADMIN">
                                    <AddCompany />
                                </RequireRole>
                            </Protected>
                        </>
                    }
                />
                <Route
                    path="/companies/edit/:id"
                    element={
                        <>
                            <Navbar />
                            <Protected>
                                <RequireRole role="ADMIN">
                                    <EditCompany />
                                </RequireRole>
                            </Protected>
                        </>
                    }
                />

                <Route path="*" element={<div className="p-4">Not found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
