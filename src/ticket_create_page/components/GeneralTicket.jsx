import { useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";

const GeneralTicket = ({setPage}) => {

    async function insertTicketToDatabase(){
        const {error} = await supabase.from('tickets').insert({type:'general'});
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

export default GeneralTicket;