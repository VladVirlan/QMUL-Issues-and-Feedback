import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import "./Tickets.css";

const Tickets = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
        }
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setTickets(data || []);
  }

  async function fetchMessages(ticketId) {
    const { data, error } = await supabase
      .from("ticket_updates")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    if (!error) setMessages(data || []);
  }

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
  };

  async function assignTicket(id) {
    const { error } = await supabase
      .from("tickets")
      .update({
        status: "in_progress",
        assigned_to: user.id,
      })
      .eq("id", id);

    if (!error) {
      await supabase.from("ticket_updates").insert({
        ticket_id: id,
        user_id: user.id,
        user_email: user.email,
        user_role: "staff",
        message: "Staff member assigned themselves to this ticket",
      });
      fetchTickets();
      if (selectedTicket && selectedTicket.id === id) {
        fetchMessages(id);
      }
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;
    if (!selectedTicket) return;

    const { error } = await supabase.from("ticket_updates").insert({
      ticket_id: selectedTicket.id,
      user_id: user.id,
      user_email: user.email,
      user_role: userRole || "staff",
      message: newMessage,
    });

    if (!error) {
      setNewMessage("");
      fetchMessages(selectedTicket.id);
    }
  }

  async function updateTicketStatus(newStatus, systemMessage = null) {
    if (!selectedTicket) return;

    const oldStatus = selectedTicket.status;
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", selectedTicket.id);

    if (!error) {
      const msg = systemMessage || `Status changed from ${oldStatus} to ${newStatus}`;
      await supabase.from("ticket_updates").insert({
        ticket_id: selectedTicket.id,
        user_id: user.id,
        user_email: user.email,
        user_role: "staff",
        message: msg,
      });
      fetchTickets();
      fetchMessages(selectedTicket.id);
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  }

  async function requestInfo() {
    await updateTicketStatus(
      "awaiting_information",
      "Requested additional information from student"
    );
  }

  async function resumeTicket() {
    await updateTicketStatus("in_progress", "Student has replied; resuming ticket");
  }

  async function closeTicket() {
    await updateTicketStatus("closed", "Ticket resolved and closed");
  }

  async function markUnavailableAndReassign() {
    const { data: myTickets } = await supabase
      .from("tickets")
      .select("id")
      .eq("assigned_to", user.id)
      .in("status", ["in_progress", "awaiting_information"]);

    if (myTickets && myTickets.length) {
      for (let ticket of myTickets) {
        await supabase
          .from("tickets")
          .update({ assigned_to: null, status: "open" })
          .eq("id", ticket.id);
        await supabase.from("ticket_updates").insert({
          ticket_id: ticket.id,
          user_id: user.id,
          user_email: user.email,
          user_role: "staff",
          message: "Staff member marked unavailable – ticket reassigned to department pool",
        });
      }
      alert(`Reassigned ${myTickets.length} ticket(s) to department pool.`);
      fetchTickets();
      if (selectedTicket) fetchMessages(selectedTicket.id);
    } else {
      alert("No open tickets assigned to you.");
    }
  }

  if (userRole === "module_organiser") {
    return (
      <div className="ModuleOrganiserView">
        <h2>EC Outcomes (Read‑Only)</h2>
        <p>This is a placeholder for the EC submissions list.</p>
        <p>As a Module Organiser, you can view but not update tickets.</p>
      </div>
    );
  }

  return (
    <div className="TicketsPage">
      <div className="TicketsList">
        <h2>All Tickets</h2>
        {tickets.length === 0 && <p>No tickets found.</p>}
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`TicketCard ${selectedTicket?.id === ticket.id ? "selected" : ""}`}
            onClick={() => handleSelectTicket(ticket)}
          >
            <h3>{ticket.title}</h3>
            <p>{ticket.description || ticket.message}</p>
            <span className={`status-badge ${ticket.status}`}>Status: {ticket.status}</span>
            {ticket.assigned_to && <span className="assigned-to">Assigned</span>}
          </div>
        ))}
      </div>

      <div className="TicketDetails">
        {selectedTicket ? (
          <>
            <h2>{selectedTicket.title}</h2>
            <p><strong>Description:</strong> {selectedTicket.description || selectedTicket.message}</p>
            <p><strong>Student email:</strong> {selectedTicket.student_email}</p>
            <p><strong>Current status:</strong> {selectedTicket.status}</p>

            <div className="ActionButtons">
              {!selectedTicket.assigned_to && (
                <button onClick={() => assignTicket(selectedTicket.id)}>Assign to Me</button>
              )}
              {selectedTicket.status === "awaiting_information" && (
                <button onClick={resumeTicket}>Student Replied – Resume</button>
              )}
              <button onClick={requestInfo}>Request Info</button>
              <button onClick={closeTicket}>Close Ticket</button>
              <button onClick={markUnavailableAndReassign} className="danger">
                I'm Unavailable – Reassign My Tickets
              </button>
            </div>

            <div className="MessageThread">
              <h4>Conversation</h4>
              {messages.length === 0 && <p className="no-messages">No messages yet.</p>}
              {messages.map((msg) => (
                <div key={msg.id} className="MessageBubble">
                  <div className="message-header">
                    <strong>{msg.user_email}</strong>
                    <span className="role-badge">({msg.user_role})</span>
                    <span className="timestamp">{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="NewMessage">
              <textarea
                placeholder="Write a message (student will see this)..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows="3"
              />
              <button onClick={sendMessage}>Send Message</button>
            </div>
          </>
        ) : (
          <p className="no-selection">Select a ticket from the list to view details and conversation.</p>
        )}
      </div>
    </div>
  );
};

export default Tickets;