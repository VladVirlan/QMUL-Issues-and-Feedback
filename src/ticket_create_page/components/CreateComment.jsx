import { useEffect} from "react";

const CreateComment = ({setPage, commentDetails, setCommentDetails}) => {

    useEffect(() => {
        setCommentDetails("");
    }, []);

    return(
        <div className="main_body">
            <textarea className="text_box" rows="10" placeholder="Start writing your comment here..." required onChange={(e) => setCommentDetails(e.target.value)}></textarea>
            <div className="buttons">
                <button className="button" onClick={() => {setPage("ticket_details")}}>Go Back</button>
                <button className="button" onClick={() => {
                    if(!commentDetails.trim()){
                        window.alert("Please write a comment.");
                        return;
                    }
                    if(window.confirm("Are you sure you want to submit this comment?")){
                        setPage("insert_comment")
                    }
                }}>Submit</button>
            </div>
        </div>
    );
}

export default CreateComment;