import { supabase } from "../../supabase/supabaseClient";
import { useEffect, useRef } from "react";

const InsertComment = ({setPage, ticket, commentDetails}) => {

    const hasInserted = useRef(false);

    async function insertCommentIntoDatabase() {
        if (hasInserted.current){
            return
        };
        hasInserted.current = true;

        const {data: {user}} = await supabase.auth.getUser();

        const {error} = await supabase.from('ticket_updates').insert({
            message: commentDetails != "" ? commentDetails : "no details given",
            ticket_id: ticket.id,
            user_id: user?.id,
            user_email: user?.email,
            user_role: "student"
        });

    }

    useEffect(() => {
        insertCommentIntoDatabase();
        setPage("ticket_details");
    } ,[]);

    return(
        <></>
    );
}

export default InsertComment;