import { useState } from "react";
import IntroPage from "./components/IntroPage";
import Form from "./components/Form";
import Submitted from "./components/Submitted";
import TicketDetails from "./components/TicketDetails";
import CreateComment from "./components/CreateComment";
import InsertComment from "./components/InsertComment";

const CreateTicket = () => {
    const [page, setPage] = useState("intro_page");
    const [ticketType, setTicketType] = useState("general");
    const [summary, setSummary] = useState("");
    const [details, setDetails] = useState("");
    const [ticket, setTicket] = useState("");
    const [commentDetails, setCommentDetails] = useState("");

    return (
        <>
            {page == "form" && <Form setPage={setPage} ticketType={ticketType} summary={summary} details={details} setSummary={setSummary} setDetails={setDetails}/>}

            {page == "intro_page" && <IntroPage setPage={setPage} setTicketType={setTicketType} setTicket={setTicket}/>}

            {page == "submitted" && <Submitted setPage={setPage} ticketType={ticketType} summary={summary} details={details}/>}

            {page == "ticket_details" && <TicketDetails setPage={setPage} ticket={ticket}/>}

            {page == "create_comment" && <CreateComment setPage={setPage} commentDetails={commentDetails} setCommentDetails={setCommentDetails} />}

            {page == "insert_comment" && <InsertComment setPage={setPage} ticket={ticket} commentDetails={commentDetails} />}
        </>
    );
};

export default CreateTicket;