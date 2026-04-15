import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import "./IntroPage.css";

const IntroPage = ({setPage, setTicketType, setTicket}) => {

    const [tickets, setTickets] = useState([]);
    const [userEmail, setUserEmail] = useState([]);
    const [showAll, setShowAll] = useState(true);

    function displayTicketType(ticketType){
        if(ticketType == "it"){
            return "IT Issue"
        }
        else if(ticketType == "lab"){
            return "Lab Issue"
        }
        else {
            return "General Issue"
        }
    }

    useEffect(() => {
        const getTickets = async () => {
            const {data, error} = await supabase.from('tickets').select('*').order('created_at', {ascending: false});
            if(!error){
                setTickets(data);
            }

            const {data: {user}} = await supabase.auth.getUser();
            setUserEmail(user?.email);
        }
        getTickets();
    }, []);

    async function toggleFilter(){
        if(showAll){
            const {data, error} = await supabase.from('tickets').select('*').eq("student_email", userEmail).order('created_at', {ascending: false});
            if(!error){
                setTickets(data);
                setShowAll(false);
            }
        }
        else{
            const {data, error} = await supabase.from('tickets').select('*').order('created_at', {ascending: false});
            if(!error){
                setTickets(data);
                setShowAll(true);
            }
        }
    }

    return (
        <div className="main_body">
            <div className="ticket_intro_heading">
                <h2 className="tickets_heading">Tickets</h2>
                <button className="button" onClick={() => {toggleFilter()}}>
                    {showAll ? "Show My Tickets" : "Show All Tickets"}
                </button>
            </div>
            <div className="display_tickets" >
                {
                    tickets.map((ticket) => (
                        <button className="ticket" onClick={() => {setPage("ticket_details"); setTicket(ticket)}}>
                            <div className="title_status">
                                <h1>{ticket.title}</h1>
                                <p className="ticket_type">{displayTicketType(ticket.type)}</p>
                                <p className="ticket_p">{ticket.status}</p>
                            </div>
                            <p className="ticket_email">{ticket.student_email}</p>
                            <p className="ticket_p">{ticket.message}</p>
                        </button>
                    ))
                }
            </div>
            <div className="submit_tickets">
                <p>Want to report an issue? Submit a ticket</p>
                <div className="buttons">
                    <button className="button" onClick={() => {setPage("form"), setTicketType("general")}}>General Ticket</button>
                    <button className="button" onClick={() => {setPage("form"), setTicketType("it")}}>IT Ticket</button>
                    <button className="button" onClick={() => {setPage("form"), setTicketType("lab")}}>Lab Ticket</button>
                </div>
            </div>
        </div>

    );
};

export default IntroPage;