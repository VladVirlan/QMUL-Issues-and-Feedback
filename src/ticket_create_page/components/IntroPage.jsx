const IntroPage = ({setPage}) => {

    return (
        <div>
            <p>Want to report an issue? Submit a ticket</p>
            <div>
                <button onClick={() => {setPage("general")}}>General Ticket</button>
                <button onClick={() => {setPage("it")}}>IT Ticket</button>
                <button onClick={() => {setPage("lab")}}>Lab Ticket</button>
            </div>
        </div>
    );
};

export default IntroPage;