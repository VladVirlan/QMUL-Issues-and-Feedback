import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import "./Users.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);

        const { data, error } = await supabase.from("users").select("*");

        if (error) {
            console.error(error);
            alert(error.message);
        } else {
            setUsers(data);
        }

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

    return (
        <div className="UsersContainer">
            <div className="HeaderRow">
                <h2 className="PageTitle">User Management</h2>
                <button className="refreshBtn" onClick={fetchUsers}>
                    Refresh
                </button>
            </div>

            {loading && <div className="loadingText">Loading users...</div>}

            <div className="UsersList">
                {users.map((user) => (
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

                        {/* ROLE CONTROL (ONLY WAY TO CHANGE ROLE) */}
                        <select
                            className="RoleSelect"
                            value={user.role || ""}
                            disabled={actionLoading === user.id}
                            onChange={(e) =>
                                updateRole(user.id, e.target.value)
                            }
                        >
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="user">User</option>
                        </select>

                        {/* SINGLE ACTION BUTTON */}
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

            <div className="InfoSection">
                <h3>Permissions Info</h3>
                <p>Admin: Full access</p>
                <p>Staff: Limited management</p>
                <p>User: Basic access</p>
            </div>
        </div>
    );
};

export default Users;
