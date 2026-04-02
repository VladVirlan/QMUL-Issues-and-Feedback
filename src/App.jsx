import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabaseClient.js";
import LoginPage from "./login_page/LoginPage.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import ServiceCheckPage from "./service_check/ServiceCheckPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSession() {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        }

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/service-check" element={session ? <ServiceCheckPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
        </Routes>
    );
};

export default App;