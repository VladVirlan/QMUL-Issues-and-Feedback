import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { supabase } from "../supabase/supabaseClient";
import Performance from "../components/admin_tabs/Performance";
import Users from "../components/admin_tabs/Users";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const adminTabs = ["Performance", "Users"];
    const tabs = ["tab1", "tab2", "tab3"];

    const tabContent = {
        Performance: Performance,
        Users: Users,
        tab1: () => <p>This is Tab 1 content</p>,
        tab2: () => <p>This is Tab 2 content</p>,
        tab3: () => <p>This is Tab 3 content</p>,
    };

    const ActiveComponent = tabContent[activeTab];

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user || null);
    }

    const isAdmin = user?.email === "admin@gmail.com";

    useEffect(() => {
        if (isAdmin) {
            setActiveTab("Performance");
        }
    }, [isAdmin]);

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div className="DashboardContainer">
            <div className="Tabs">
                {isAdmin &&
                    adminTabs.map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? "tab active" : "tab"}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}

                {tabs.map((tab) => (
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
                <ActiveComponent />
            </div>

            <button id="LogOutButton" onClick={handleLogout}>
                LOG OUT
            </button>
        </div>
    );
};

export default Dashboard;