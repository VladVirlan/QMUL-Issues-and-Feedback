import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import "./Tickets.css";

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [updateText, setUpdateText] = useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    async function fetchTickets() {
        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) setTickets(data);
    }

    async function assignTicket(id) {
        await supabase
            .from("tickets")
            .update({ status: "assigned" })
            .eq("id", id);

        fetchTickets();
    }

    async function updateTicket(status) {
        if (!selectedTicket) return;

        await supabase
            .from("tickets")
            .update({ status })
            .eq("id", selectedTicket.id);

        fetchTickets();
    }

    return (
        <div className="TicketsPage">
            <div className="TicketsList">
                <h2>Department Tickets</h2>

                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="TicketCard"
                        onClick={() => setSelectedTicket(ticket)}
                    >
                        <h3>{ticket.title}</h3>
                        <p>{ticket.description}</p>
                        <span>Status: {ticket.status}</span>
                    </div>
                ))}
            </div>

            <div className="TicketDetails">
                {selectedTicket ? (
                    <>
                        <h2>{selectedTicket.title}</h2>
                        <p>{selectedTicket.description}</p>
                        <p>Status: {selectedTicket.status}</p>

                        <button onClick={() => assignTicket(selectedTicket.id)}>
                            Assign to Me
                        </button>

                        <button onClick={() => updateTicket("awaiting_information")}>
                            Request Info
                        </button>

                        <button onClick={() => updateTicket("closed")}>
                            Close Ticket
                        </button>

                        <textarea
                            placeholder="Add update..."
                            value={updateText}
                            onChange={(e) => setUpdateText(e.target.value)}
                        />
                    </>
                ) : (
                    <p>Select a ticket to view details</p>
                )}
            </div>
        </div>
    );
};

export default Tickets;