import { useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";

const LabTicket = ({setPage}) => {

    async function insertTicketToDatabase(){
        const {error} = await supabase.from('tickets').insert({type:'lab'});
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

export default LabTicket;