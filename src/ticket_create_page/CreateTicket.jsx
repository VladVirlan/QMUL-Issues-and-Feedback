import { useState } from "react";
import IntroPage from "./components/IntroPage";
import Form from "./components/form";
import Submitted from "./components/Submitted";

const CreateTicket = () => {
    const [page, setPage] = useState("intro_page");
    const [ticketType, setTicketType] = useState("general");
    const [summary, setSummary] = useState("");
    const [details, setDetails] = useState("");

    return (
        <>
            {page == "form" && <
                    Form setPage={setPage}
                    ticketType={ticketType}
                    setSummary={setSummary}
                    setDetails={setDetails}
            />}

            {page == "intro_page" && <
                    IntroPage setPage={setPage}
                    setTicketType={setTicketType}
            />}

            {page == "submitted" && <
                    Submitted setPage={setPage}
                    ticketType={ticketType}
                    summary={summary}
                    details={details}
            />}
        </>
    );
};

export default CreateTicket;