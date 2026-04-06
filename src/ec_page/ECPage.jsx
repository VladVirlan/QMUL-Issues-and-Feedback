import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

import "./ECPage.css";
import ECForm from "./components/ECForm";

const ECPage = () => {

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [expandedClaimId, setExpandedClaimId] = useState(null);
    const [claims, setClaims] = useState([]);
    const hasClaims = claims.length > 0;

    const formatDate = (value) => {
        if (!value) return "Not available";
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "Not available";
        return parsed.toLocaleDateString();
    };

    useEffect(() => {
        const fetchClaims = async () => {
            const { data, error } = await supabase.from('ec_claims').select('*').order('updated_at', { ascending: false });   

            if (error) {
                console.error("Error fetching claims:", error);
                return;
            }

            setClaims(data);
        };
        fetchClaims();
    }, []);



    if (isFormOpen) {
        return (
            <div className="ec-page-shell">
                <button
                    type="button"
                    className="ec-secondary-btn ec-back-to-claims-btn"
                    onClick={() => setIsFormOpen(false)}
                >
                    Back to Claims
                </button>
                <ECForm />
            </div>
        );
    }

    return (
        <div className="ec-page-shell">
            <div className="ec-header">
                <h1>Submitted EC Claims</h1>
                <p>Each submitted claim will appear here for review.</p>

                {hasClaims && (
                    <button
                        type="button"
                        className="ec-go-to-form-btn ec-go-to-form-btn-header"
                        onClick={() => setIsFormOpen(true)}
                    >
                        Submit New EC Claim
                    </button>
                )}
            </div>

            <div className="ec-main-content">
                {!hasClaims ? (
                    <div className="ec-empty-state">
                        <h2>You've submitted no EC claims yet.</h2>
                        <p>When you submit a claim, it will appear here with its latest status.</p>
                        <button type="button" className="ec-go-to-form-btn" onClick={() => setIsFormOpen(true)}>
                            Submit Your First EC Claim
                        </button>
                    </div>
                ) : (
                    claims.map((claim) => (
                        <div key={claim.id} className="ec-card">
                            <div className="ec-card-flex">
                                <h2>{claim.reference}</h2>
                                <div className="ec-card-status">
                                    <h2>{claim.status}</h2>
                                </div>
                            </div>
                            <div className="ec-card-flex">
                                <p>{claim?.circumstance}</p>
                                <button
                                    type="button"
                                    className="ec-expand-btn"
                                    onClick={() =>
                                        setExpandedClaimId((previous) =>
                                            previous === claim.id ? null : claim.id,
                                        )
                                    }
                                >
                                    {expandedClaimId === claim.id ? "Hide Details" : "View Details"}
                                </button>
                            </div>

                            {expandedClaimId === claim.id && (
                                <div className="ec-claim-details">
                                    <p><strong>Claim Type:</strong> {claim?.claim_type}</p>
                                    <p><strong>Summary:</strong> {claim?.summary}</p>
                                    <p><strong>Module:</strong> {claim?.module_code}</p>
                                    <p><strong>Assessment:</strong> {claim?.assessment}</p>
                                    <p><strong>Impact:</strong> {claim?.impact_type}</p>
                                    <p><strong>Deadline:</strong> {claim?.deadline || "Not provided"}</p>
                                    <p><strong>Submitted On:</strong> {formatDate(claim?.submitted_at)}</p>
                                    <p><strong>Evidence Choice:</strong> {claim?.evidence_choice || "Not provided"}</p>
                                    {claim?.evidence_choice === "no-evidence" && (
                                        <p><strong>No Evidence:</strong> {claim?.no_evidence_reason || "Not provided"}</p>
                                    )}
                                    {claim?.evidence_choice === "upload_now" && (
                                        <p><strong>Evidence:</strong> {claim?.evidence_file_name || "Not provided"}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ECPage;