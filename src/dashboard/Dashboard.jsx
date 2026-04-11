import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { supabase } from "../supabase/supabaseClient";
import Performance from "../components/admin_tabs/Performance";
import Users from "../components/admin_tabs/Users";
import StudentDashboard from "../student-dashboard/StudentDashboard";
import StaffDashboard from "../staff-dashboard/StaffDashboard";
import Tickets from "../staff_tabs/Tickets";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("Performance");
    const [user, setUser] = useState(null);

    const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        const authUser = data?.user;

        if (!authUser) return;

        const { data: userData, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", authUser.id)
            .single();

        if (error) {
            console.error("Error fetching role:", error);
        }

        setUser({
            ...authUser,
            role: userData?.role,
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    const rawRole = (user?.role || "").toString().trim();
    const normalizedRole = rawRole.toLowerCase();
    const upperRole = rawRole.toUpperCase();

    const isAdmin = normalizedRole === "admin";
    const isStaff = ["staff", "sst", "itt", "lt"].includes(normalizedRole);
    const isStudent = normalizedRole === "student";
    const isModuleOrganiser = normalizedRole === "module_organiser";

    const adminTabs = ["Performance", "Users"];
    const staffTabs = ["Tickets"];

    const tabContent = {
        Performance,
        Users,
        Tickets,
    };

    const visibleTabs = isAdmin ? [...adminTabs, ...staffTabs] : [];

    useEffect(() => {
        if (isAdmin) setActiveTab("Performance");
    }, [isAdmin]);

    const ActiveComponent = tabContent[activeTab];

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    if (!user) {
        return <div className="DashboardLoading">Loading dashboard...</div>;
    }

    if (isStudent) {
        return <StudentDashboard onLogout={handleLogout} />;
    }

    if (isStaff) {
        return <StaffDashboard onLogout={handleLogout} staffRole={upperRole} />;
    }

    if (isModuleOrganiser) {
        return (
            <div className="DashboardContainer">
                <div className="Tabs">
                    <button className="tab active">EC Outcomes</button>
                </div>

                <div className="TabContent">
                    <Tickets />
                </div>

                <button id="LogOutButton" onClick={handleLogout}>
                    LOG OUT
                </button>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="DashboardLoading">
                Your role does not have dashboard access.
            </div>
        );
    }

    return (
        <div className="DashboardContainer">
            <div className="Tabs">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab}
                        className={activeTab === tab ? "tab active" : "tab"}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="TabContent">
                {ActiveComponent && <ActiveComponent />}
            </div>

            <button id="LogOutButton" onClick={handleLogout}>
                LOG OUT
            </button>
        </div>
    );
};

export default Dashboard;