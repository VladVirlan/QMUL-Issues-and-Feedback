import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

import "./ECPage.css";
import ECForm from "./components/ECForm";

const status = {
  submitted: "submitted",
  under_review: "under_review",
  approved: "approved",
  rejected: "rejected",
};

const ECPage = () => {

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expandedClaimId, setExpandedClaimId] = useState(null);
    const [claims, setClaims] = useState([]);

    const [pendingEvidenceFiles, setPendingEvidenceFiles] = useState({});
    const [submittingClaimId, setSubmittingClaimId] = useState(null);
    const [evidenceErrorClaimId, setEvidenceErrorClaimId] = useState(null);
    const [evidenceError, setEvidenceError] = useState("");

    const hasClaims = claims.length > 0;

    const formatDate = (value) => {
        if (!value) return "Not available";
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "Not available";
        return parsed.toLocaleDateString();
    };

    const fetchClaims = async () => {
        setLoading(true);

        const { data, error } = await supabase.from('ec_claims').select('*').order('updated_at', { ascending: false });

        if (error) {
            console.error("Error fetching claims:", error);
            setLoading(false);
            return;
        }

        setClaims(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const handlePendingEvidenceFileChange = (claimId, fileName) => {
        setEvidenceError("");
        setEvidenceErrorClaimId(null);
        setPendingEvidenceFiles((previous) => ({
            ...previous,
            [claimId]: fileName,
        }));
    };

    const handleUploadEvidenceNow = async (claimId) => {
        const evidenceFileName = pendingEvidenceFiles[claimId];

        if (!evidenceFileName) {
            setEvidenceError("Please choose an evidence file first.");
            setEvidenceErrorClaimId(claimId);
            return;
        }

        setEvidenceError("");
        setEvidenceErrorClaimId(null);
        setSubmittingClaimId(claimId);

        const { error } = await supabase
            .from('ec_claims')
            .update({
                evidence_choice: "upload-now",
                evidence_file_name: evidenceFileName,
                upload_later_confirmed: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', claimId);

        if (error) {
            console.error("Error updating late evidence:", error);
            setEvidenceError("Could not submit evidence. Please try again.");
            setEvidenceErrorClaimId(claimId);
            setSubmittingClaimId(null);
            return;
        }

        setPendingEvidenceFiles((previous) => ({
            ...previous,
            [claimId]: "",
        }));

        await fetchClaims();
        setSubmittingClaimId(null);
    };


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
                <ECForm setIsFormOpen={setIsFormOpen} onSubmitSuccess={fetchClaims} />
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
                {loading ? (
                    <div className="ec-loading-state">
                        <h2>Loading your claims...</h2>
                    </div>
                ) :
                !hasClaims ? (
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
                                <div className={`ec-card-status ${status[claim.status]}`}>
                                    <h2>{claim.status === "under_review" ? "under review" : claim.status}</h2>
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
                                    {claim?.evidence_choice === "upload-now" && (
                                        <p><strong>Evidence:</strong> {claim?.evidence_file_name || "Not provided"}</p>
                                    )}
                                    {claim?.evidence_choice === "upload-later" && (
                                        <div className="ec-late-evidence-box">
                                            <p>
                                                <strong>Action Required:</strong> Upload evidence now to move this claim
                                                towards screening.
                                            </p>
                                            <label className="ec-field" htmlFor={`late-evidence-file-${claim.id}`}>
                                                <span>Choose evidence file</span>
                                                <input
                                                    id={`late-evidence-file-${claim.id}`}
                                                    type="file"
                                                    onChange={(event) =>
                                                        handlePendingEvidenceFileChange(
                                                            claim.id,
                                                            event.target.files?.[0]?.name || "",
                                                        )
                                                    }
                                                />
                                            </label>    
                                            {pendingEvidenceFiles[claim.id] && (
                                                <p className="ec-file-name">Selected: {pendingEvidenceFiles[claim.id]}</p>
                                            )}
                                            <button
                                                type="button"
                                                className="ec-primary-btn"
                                                onClick={() => handleUploadEvidenceNow(claim.id)}
                                                disabled={submittingClaimId === claim.id}
                                            >
                                                {submittingClaimId === claim.id ? "Submitting..." : "Submit Evidence"}
                                            </button>
                                            {evidenceError && evidenceErrorClaimId === claim.id && (
                                                <p className="ec-evidence-status ec-evidence-status-error">
                                                    {evidenceError}
                                                </p>
                                            )}
                                        </div>
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