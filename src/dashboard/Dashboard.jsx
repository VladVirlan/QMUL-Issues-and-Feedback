import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { supabase } from "../supabase/supabaseClient";
import Performance from "../components/admin_tabs/Performance";
import Users from "../components/admin_tabs/Users";
import Tickets from "../staff_tabs/Tickets";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("Tickets");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user || null);
    }

    const isAdmin = user?.email === "admin@gmail.com";

    const adminTabs = ["Performance", "Users"];
    const staffTabs = ["Tickets"];

    const tabContent = {
        Performance,
        Users,
        Tickets,
    };

    const visibleTabs = [
        ...(isAdmin ? adminTabs : []),
        ...staffTabs,
    ];

    useEffect(() => {
        if (isAdmin) setActiveTab("Performance");
    }, [isAdmin]);

    const ActiveComponent = tabContent[activeTab];

    async function handleLogout() {
        await supabase.auth.signOut();
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

                <button
                    style={{ marginLeft: "auto" }}
                    className="tab"
                    onClick={() => navigate('/service-check')}
                >
                    🔧 Service Status
                </button>
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