import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabaseClient.js";
import LoginPage from "./login_page/LoginPage.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";

const App = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setSession(session);
            setLoading(false);
        }

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return session ? <Dashboard /> : <LoginPage />;
};

export default App;