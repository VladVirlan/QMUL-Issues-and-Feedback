import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabaseClient.js";
import LoginPage from "./login_page/LoginPage.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import ECPage from "./ec_page/ECPage.jsx";
import CreateTicket from "./ticket_create_page/CreateTicket.jsx";

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

    //return session ? <Dashboard /> : <LoginPage />;
    return <Dashboard/>;
};

export default App;
