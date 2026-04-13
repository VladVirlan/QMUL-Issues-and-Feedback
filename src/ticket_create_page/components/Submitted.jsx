import { useEffect, useRef } from "react";
import { supabase } from "../../supabase/supabaseClient";
import "./Submitted.css"

const Submitted = ({setPage, ticketType, summary, details}) => {

    
    const hasInserted = useRef(false);

    async function insertTicketToDatabase(){

        if (hasInserted.current){
            return
        };
        hasInserted.current = true;

        const {data: {user}} = await supabase.auth.getUser();

        const {error} = await supabase.from('tickets').insert({
            title: summary != "" ? summary : "no title",
            message: details != "" ? details : "no details given",
            status: "submitted",
            student_email: user?.email,
            type: ticketType
        });
    }

    useEffect(() => {
        insertTicketToDatabase();
    }, []);

    return (
        <div className="main_body_submitted">
            <p>Your Ticket Has Been Submitted</p>
            <button className="button" onClick={() => {setPage("intro_page")}}>Return To Dashboard</button>
        </div>
    );
};

export default Submitted;