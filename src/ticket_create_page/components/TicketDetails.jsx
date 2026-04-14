import "./TicketDetails.css"
import { supabase } from "../../supabase/supabaseClient";
import { useState, useEffect } from "react";

const TicketDetails = ({setPage, ticket}) => {

    const [emailSame, setEmailSame] = useState(false);
    const [comments, setComments] = useState([]);

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
        async function compareEmail() {
            const {data: {user}} = await supabase.auth.getUser();

            if(ticket.student_email == user?.email){
                setEmailSame(true);
            }
            else{
                setEmailSame(false);
            }
        }

        const getComments = async () => {
            const {data, error} = await supabase.from('ticket_updates').select('*').eq('ticket_id', ticket.id).order('created_at', {ascending: true});
            if(!error){
                setComments(data);
            }
        }

        compareEmail();
        getComments();
    },[]);

    return(
        <div className="main_body">
            <div className="details">
                <div className="title">
                    <h1>{ticket.title}</h1>
                    <p className="ticket_type">{displayTicketType(ticket.type)}</p>
                    <p className="ticket_status">{ticket.status}</p>
                </div>
                <p className="email">{ticket.student_email}</p>
                <p className="message">{ticket.message}</p>
            </div>
            <div className="comments">
                {comments.map((comment) => (
                    <div className="comment">
                        <div className="comment_header">
                            <h1 className="comment_email">{comment.user_email}</h1>
                            <p className="comment_date">{new Date(comment.created_at).toLocaleString()}</p>
                        </div>
                        <p className="comment_message">{comment.message}</p>
                    </div>
                ))}
            </div>
            <div className="buttons">
                <button className="button" onClick={() => {setPage("intro_page")}}>Go Back</button>
                {emailSame && <button className="button" onClick={() => {setPage("create_comment")}}> New Comment</button>}
            </div>
        </div>
    );
}

export default TicketDetails;