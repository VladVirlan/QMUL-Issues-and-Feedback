import { useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";
import "./Submitted.css"

const Submitted = ({setPage, ticketType, summary, details}) => {

    async function insertTicketToDatabase(){
        const user = await supabase.auth.getUser();

        const {error} = await supabase.from('tickets').insert({
            title: summary != "" ? summary : "no title",
            message: details != "" ? details : "no details given",
            status: "submitted",
            student_email: user.email,
            type: ticketType
        });
    }

    useEffect(() => {
        insertTicketToDatabase();
    }, []);

    return (
        <div>
            <p>Your Ticket Has Been Submitted</p>
            <button onClick={() => {setPage("intro_page")}}>Return To Dashboard</button>
        </div>
    );
};

export default Submitted;