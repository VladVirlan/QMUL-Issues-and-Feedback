import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import SearchBar from "../search_bar/SearchBar";
import "./Users.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [newUser, setNewUser] = useState({
        email: "",
        role: "user",
    });

    const fetchUsers = async () => {
        setLoading(true);

        const { data, error } = await supabase.from("users").select("*");

        if (error) {
            console.error(error);
            alert(error.message);
        } else {
            setUsers(data);
        }

        setLastUpdated(new Date());
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (id, newRole) => {
        setActionLoading(id);

        const { error } = await supabase
            .from("users")
            .update({ role: newRole })
            .eq("id", id);

        setActionLoading(null);

        if (error) {
            console.error(error);
            alert(error.message);
        } else {
            fetchUsers();
        }
    };

    const toggleUserStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === "active" ? "disabled" : "active";

        setActionLoading(id);

        const { error } = await supabase
            .from("users")
            .update({ status: nextStatus })
            .eq("id", id);

        setActionLoading(null);

        if (error) {
            console.error(error);
            alert(error.message);
        } else {
            fetchUsers();
        }
    };

    const createUser = async () => {
        if (!newUser.email) {
            alert("Email is required");
            return;
        }

        setActionLoading("create");

        const { data, error } = await supabase.auth.signUp({
            email: newUser.email,
            password: newUser.password,
            options: {
                data: {
                    role: newUser.role,
                },
            },
        });

        setActionLoading(null);

        if (error) {
            console.error(error);
            alert(error.message);
        } else {
            alert("User created successfully");
            setNewUser({ email: "", role: "user" });
            fetchUsers();
        }
    };

    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();

        return (
            user.email?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query) ||
            user.status?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="UsersContainer">
            <div className="HeaderRow">
                <h2 className="PageTitle">User Management</h2>
                <button className="refreshBtn" onClick={fetchUsers}>
                    Refresh
                </button>
            </div>

            <p className="lastUpdated">
                Last updated: {lastUpdated.toLocaleTimeString()}
            </p>

            {loading && <div className="loadingText">Loading users...</div>}

            <SearchBar
                placeholder="Search by email, role, or status..."
                onChange={(value) => setSearchQuery(value)}
            />

            <p className="usersFound">{filteredUsers.length} users found</p>
            {filteredUsers.length === 0 && !loading && (
                <p className="noneFound">No users found</p>
            )}

            <div className="UsersList">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="UserCard">
                        <h3 className="UserEmail">{user.email}</h3>

                        <div
                            className={`UserStatus ${
                                user.status === "active"
                                    ? "statusActive"
                                    : "statusDisabled"
                            }`}
                        >
                            {user.status}
                        </div>

                        <div className="LastLogin">
                            Last login:{" "}
                            {user.last_login
                                ? new Date(user.last_login).toLocaleString()
                                : "Never"}
                        </div>

                        <select
                            className="RoleSelect"
                            value={user.role || ""}
                            disabled={actionLoading === user.id}
                            onChange={(e) =>
                                updateRole(user.id, e.target.value)
                            }
                        >
                            <option value="admin">Admin</option>
                            <option value="sst">Student Support</option>
                            <option value="its">IT Support</option>
                            <option value="lt">Lab Technician</option>
                            <option value="student">Student</option>
                        </select>

                        <div className="ActionsRow">
                            <button
                                className={
                                    user.status === "active"
                                        ? "dangerBtn"
                                        : "primaryBtn"
                                }
                                disabled={actionLoading === user.id}
                                onClick={() =>
                                    toggleUserStatus(user.id, user.status)
                                }
                            >
                                {user.status === "active"
                                    ? "Disable User"
                                    : "Enable User"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="CreateUserCard">
                <h3>Create New User</h3>

                <input
                    className="InputField"
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                    }
                />

                <input
                    className="InputField"
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                    }
                />

                <select
                    className="RoleSelect"
                    value={newUser.role}
                    onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                    }
                >
                    <option value="admin">Admin</option>
                    <option value="sst">Student Support</option>
                    <option value="its">IT Support</option>
                    <option value="lt">Lab Technician</option>
                    <option value="student">Student</option>
                </select>

                <button
                    className="primaryBtn"
                    disabled={actionLoading === "create"}
                    onClick={createUser}
                >
                    {actionLoading === "create" ? "Creating..." : "Create User"}
                </button>
            </div>

            <div className="InfoSection">
                <h3>Permissions Info</h3>
                <p>Admin: Full system control</p>
                <p>Student Support: Manage student issues</p>
                <p>IT Support: Handle technical problems</p>
                <p>Lab Technician: Manage lab-specific issues</p>
                <p>Student: Basic system access</p>
            </div>
        </div>
    );
};

export default Users;
