import React, { useState } from "react";
import "./Dashboard.css";
import { supabase } from "../supabase/supabaseClient";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    const tabs = ["tab1", "tab2", "tab3"];

    const tabContent = {
        tab1: "This is Tab 1 content",
        tab2: "This is Tab 2 content",
        tab3: "This is Tab 3 content",
    };

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div className="DashboardContainer">
            <div className="Tabs">
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
                <p>{tabContent[activeTab]}</p>{" "}
            </div>

            <button id="LogOutButton" onClick={handleLogout}>
                LOG OUT
            </button>
        </div>
    );
};

export default Dashboard;
