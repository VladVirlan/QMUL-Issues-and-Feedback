import { useState } from "react";
import GeneralTicket from "./components/GeneralTicket";
import IntroPage from "./components/IntroPage";
import ItTicket from "./components/ItTicket";
import LabTicket from "./components/LabTicket";

const CreateTicket = () => {
    const [page, setPage] = useState("intro_page");

    return (
        <>
            {page == "intro_page" && <IntroPage setPage={setPage}/>}
            {page == "general" && <GeneralTicket setPage={setPage}/>}
            {page == "it" && <ItTicket setPage={setPage}/>}
            {page == "lab" && <LabTicket setPage={setPage}/>}
        </>
    );
};

export default CreateTicket;