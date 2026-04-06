import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { supabase } from "../supabase/supabaseClient";
import Performance from "../components/admin_tabs/Performance";
import Users from "../components/admin_tabs/Users";
import ECPage from "../ec_page/ECPage";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("EC");
    const [user, setUser] = useState(null);

    const adminTabs = ["Performance", "Users"];
    const tabs = ["EC", "tab2", "tab3"];

    const tabContent = {
        Performance: Performance,
        Users: Users,
        EC: () => <ECPage />,
        tab2: () => <p>This is Tab 2 content</p>,
        tab3: () => <p>This is Tab 3 content</p>,
    };

    const ActiveComponent = tabContent[activeTab];

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
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
    }

    const isAdmin = user?.role === "admin";

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
