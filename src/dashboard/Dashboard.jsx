import React from "react";
import "./Dashboard.css";
import { supabase } from "../supabase/supabaseClient";

const Dashboard = () => {
    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <div className="DashboardContainer">
            <p>Dashboard</p>
            <button id="LogOutButton" onClick={handleLogout}>
                LOG OUT
            </button>
        </div>
    );
};

export default Dashboard;
