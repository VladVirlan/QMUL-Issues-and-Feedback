import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import "./IntroPage.css";

const IntroPage = ({setPage, setTicketType}) => {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const getTickets = async () => {
            const {data, error} = await supabase.from('tickets').select('*').order('created_at', {ascending: false});
            if(!error){
                setTickets(data);
            }
        }
        getTickets();
    }, []);

    return (
        <div className="main_body">
            <div className="display_tickets" >
                {tickets.map((ticket) => (
                    <div className="ticket">
                        <h1>{ticket.title}</h1>
                        <p>{ticket.type}</p>
                        <p>{ticket.status}</p>
                        <p>{ticket.message}</p>
                    </div>
                ))}
            </div>
            <div className="submit_tickets">
                <p>Want to report an issue? Submit a ticket</p>
                <div className="buttons">
                    <button onClick={() => {setPage("form"), setTicketType("general")}}>General Ticket</button>
                    <button onClick={() => {setPage("form"), setTicketType("it")}}>IT Ticket</button>
                    <button onClick={() => {setPage("form"), setTicketType("lab")}}>Lab Ticket</button>
                </div>
            </div>
        </div>

    );
};

export default IntroPage;