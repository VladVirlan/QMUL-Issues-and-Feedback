import "./Form.css"

const Form = ({setPage, ticketType, setSummary, setDetails}) => {

    return (
        <div className="main_body">
            <label>{ticketType}</label>
            <input type="text" placeholder="Summary" required onChange={(e) => setSummary(e.target.value)}></input>
            <textarea rows="5" placeholder="Explain the issue in detail here, provide the location if necessary." required onChange={(e) => setDetails(e.target.value)}></textarea>

            <button onClick={() => {setPage("intro_page")}}>Go Back</button>
            <button type="submit" onClick={() => {setPage("submitted")}}>Submit Ticket</button>
        </div>
    );
};

export default Form;