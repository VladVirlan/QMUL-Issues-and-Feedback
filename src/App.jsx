import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabaseClient.js";
import LoginPage from "./login_page/LoginPage.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import ECPage from "./ec_page/ECPage.jsx";
import CreateTicket from "./ticket_create_page/CreateTicket.jsx";
import ServiceCheckPage from "./service_check/ServiceCheckPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateLastLogin = async (user) => {
        await supabase
            .from("users")
            .update({ last_login: new Date().toISOString() })
            .eq("id", user.id);
    };

    useEffect(() => {
        async function getSession() {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                updateLastLogin(data.user);
            }

            setLoading(false);
        }

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);

            if (_event === "SIGNED_IN" && session?.user) {
                updateLastLogin(session.user);
            }
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