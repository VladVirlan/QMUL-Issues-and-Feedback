import "./Form.css"
import { useEffect} from "react";

const Form = ({setPage, ticketType, setSummary, setDetails}) => {

    function displayTicketType(){
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
        setSummary("");
        setDetails("");
    }, []);

    return (
        <div className="main_body_form">
            <label>{displayTicketType()}</label>
            <input type="text" placeholder="Summary" required onChange={(e) => setSummary(e.target.value)}></input>
            <textarea className="text_box" rows="10" placeholder="Explain the issue in detail here, provide the location if necessary." required onChange={(e) => setDetails(e.target.value)}></textarea>
            <div className="buttons">
                <button className="button" onClick={() => {setPage("intro_page")}}>Go Back</button>
                <button className="button" type="submit" onClick={() => {if(window.confirm("Are you sure you want to submit this ticket? Make sure the information you provided is accurate and sufficiently detailed.")){setPage("submitted")}}}>Submit Ticket</button>
            </div>
        </div>
    );
};

export default Form;