import "./ModuleOrganiser.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";

const TEST_UUID = "b2d6aafa-216f-4065-9c4c-b8fde9bea4f2";

const ModuleOrganiser = () => {
    const [ecs, setEcs] = useState([]);

    useEffect(() => {
        fetchECs();
    }, []);

    const fetchECs = async () => {
        const { data, error } = await supabase
            .from("module_organizer")
            .select("*")
            .eq("module_organiser_id", TEST_UUID)
            .order("date", { ascending: true });

        if (!error) setEcs(data);
    };

    return (
        <div className="ec-card">
                <div className="ec-card-header">
                    <h2>EC Submissions</h2>
                    <p>View your extenuating circumstance submissions</p>
                </div>

                {ecs.length === 0 ? (
                    <p className="ec-empty">No EC submissions found.</p>
                ) : (
                    <table className="ec-table">
                        <thead>
                            <tr>
                                <th>Module Organiser</th>
                                <th>Date</th>
                                <th>Assignment Type</th>
                                <th>Student ID</th>
                                <th>Student Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ecs.map((ec) => (
                                <tr key={ec.ec_id}>
                                    <td>{ec.module_organiser}</td>
                                    <td>{ec.date}</td>
                                    <td>{ec.assignment_type}</td>
                                    <td>{ec.student_id}</td>
                                    <td>{ec.student_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
        </div>
    );
};

export default ModuleOrganiser;
