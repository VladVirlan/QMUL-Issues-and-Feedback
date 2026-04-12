import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import "./ECClaimsReview.css";

const REVIEWABLE_STATUSES = ["submitted", "under_review"];
const EVIDENCE_BUCKET = "ec-evidence";

const formatStatusLabel = (status) => {
    if (!status) return "unknown";
    return status.replaceAll("_", " ");
};

const formatDateTime = (value) => {
    if (!value) return "Not available";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Not available";

    return parsed.toLocaleString();
};

const ECClaimsReview = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [claims, setClaims] = useState([]);
    const [studentEmailMap, setStudentEmailMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [updatingClaimId, setUpdatingClaimId] = useState(null);
    const [selectedClaimId, setSelectedClaimId] = useState(null);
    const [downloadingEvidenceClaimId, setDownloadingEvidenceClaimId] = useState(null);

    const fetchClaims = async (staffId) => {
        if (!staffId) {
            setClaims([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        const { data, error } = await supabase
            .from("ec_claims")
            .select("*")
            .eq("assigned_staff_id", staffId)
            .in("status", REVIEWABLE_STATUSES)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("Error fetching EC claims:", error);
            setErrorMessage("Could not load EC claims.");
            setClaims([]);
            setStudentEmailMap({});
            setLoading(false);
            return;
        }

        const nextClaims = data || [];
        setClaims(nextClaims);

        const studentIds = [...new Set(nextClaims.map((claim) => claim.user_id).filter(Boolean))];

        if (studentIds.length === 0) {
            setStudentEmailMap({});
            setLoading(false);
            return;
        }

        const { data: userRows, error: userError } = await supabase
            .from("users")
            .select("id, email")
            .in("id", studentIds);

        if (userError) {
            console.error("Error fetching student emails:", userError);
            setStudentEmailMap({});
            setLoading(false);
            return;
        }

        const nextStudentEmailMap = (userRows || []).reduce((accumulator, row) => {
            accumulator[row.id] = row.email;
            return accumulator;
        }, {});

        setStudentEmailMap(nextStudentEmailMap);
        setLoading(false);
    };

    useEffect(() => {
        const fetchCurrentUserAndClaims = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setErrorMessage("You must be logged in to review EC claims.");
                setLoading(false);
                return;
            }

            setCurrentUser(user);
            await fetchClaims(user.id);
        };

        fetchCurrentUserAndClaims();
    }, []);

    const selectedClaim = claims.find((claim) => claim.id === selectedClaimId) || null;

    const handleReviewClaim = async (claim) => {
        if (!currentUser || !claim) {
            return;
        }

        setUpdatingClaimId(claim.id);
        setErrorMessage("");

        if (claim.status === "submitted") {
            const { error } = await supabase
                .from("ec_claims")
                .update({
                    status: "under_review",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", claim.id)
                .eq("assigned_staff_id", currentUser.id);

            if (error) {
                console.error("Error updating EC claim to under_review:", error);
                setErrorMessage("Could not open this claim for review. Please try again.");
                setUpdatingClaimId(null);
                return;
            }
        }

        setSelectedClaimId(claim.id);
        await fetchClaims(currentUser.id);
        setUpdatingClaimId(null);
    };

    const handleDecision = async (claimId, newStatus) => {
        if (!currentUser) {
            return;
        }

        setUpdatingClaimId(claimId);
        setErrorMessage("");

        const { error } = await supabase
            .from("ec_claims")
            .update({
                status: newStatus,
                updated_at: new Date().toISOString(),
            })
            .eq("id", claimId);

        if (error) {
            console.error("Error updating EC claim:", error);
            setErrorMessage("Could not update claim status. Please try again.");
            setUpdatingClaimId(null);
            return;
        }

        if (selectedClaimId === claimId) {
            setSelectedClaimId(null);
        }

        await fetchClaims(currentUser.id);
        setUpdatingClaimId(null);
    };

    const handleDownloadEvidence = async (claim) => {
        if (!claim?.evidence_file_path) {
            return;
        }

        setDownloadingEvidenceClaimId(claim.id);
        setErrorMessage("");

        const { data, error } = await supabase.storage
            .from(EVIDENCE_BUCKET)
            .createSignedUrl(claim.evidence_file_path, 120);

        if (error || !data?.signedUrl) {
            console.error("Error creating signed URL for evidence download:", error);
            setErrorMessage("Could not download the evidence file. Please try again.");
            setDownloadingEvidenceClaimId(null);
            return;
        }

        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
        setDownloadingEvidenceClaimId(null);
    };

    return (
        <div className="ECClaimsReview">
            <div className="ECClaimsReviewHeader">
                <h2>EC Claims Review</h2>
                <p>Review EC claims assigned to you and record outcomes.</p>
            </div>

            {loading && <p>Loading EC claims...</p>}
            {!loading && errorMessage && <p className="ec-review-error">{errorMessage}</p>}

            {!loading && !errorMessage && claims.length === 0 && (
                <p>No EC claims are currently assigned to you.</p>
            )}

            {!loading && !errorMessage && claims.length > 0 && (
                <div className="ECClaimsList">
                    {claims.map((claim) => {
                        const isUpdating = updatingClaimId === claim.id;
                        const isSelected = selectedClaimId === claim.id;

                        return (
                            <article key={claim.id} className="ECClaimCard">
                                <div className="ECClaimCardHeader">
                                    <h3>{claim.reference || `Claim #${claim.id}`}</h3>
                                    <span className={`ec-claim-status ${claim.status}`}>{formatStatusLabel(claim.status)}</span>
                                </div>

                                <p><strong>Student:</strong> {studentEmailMap[claim.user_id] || "Email unavailable"}</p>
                                <p><strong>Type:</strong> {claim.claim_type}</p>
                                <p><strong>Circumstance:</strong> {claim.circumstance || "Not provided"}</p>
                                <p><strong>Submitted:</strong> {formatDateTime(claim.submitted_at || claim.created_at)}</p>

                                <div className="ECClaimActions">
                                    <button
                                        type="button"
                                        className="review"
                                        disabled={isUpdating}
                                        onClick={() => handleReviewClaim(claim)}
                                    >
                                        {isUpdating
                                            ? "Opening..."
                                            : claim.status === "submitted"
                                                ? "Review"
                                                : "Continue Review"}
                                    </button>
                                </div>

                                {isSelected && selectedClaim && (
                                    <section className="ECClaimDetails">
                                        <h4>Full Details</h4>
                                        <p><strong>Guidance Sought:</strong> {selectedClaim.sought_guidance ? "Yes" : "No"}</p>
                                        <p><strong>Summary:</strong> {selectedClaim.summary || "Not provided"}</p>
                                        <p><strong>Module:</strong> {selectedClaim.module_code || "Not provided"}</p>
                                        <p><strong>Assessment:</strong> {selectedClaim.assessment || "Not provided"}</p>
                                        <p><strong>Impact:</strong> {selectedClaim.impact_type || "Not provided"}</p>
                                        <p><strong>Deadline:</strong> {selectedClaim.deadline || "Not provided"}</p>
                                        <p><strong>Evidence Choice:</strong> {selectedClaim.evidence_choice || "Not provided"}</p>
                                        <p>
                                            <strong>Evidence File:</strong>{" "}
                                            {selectedClaim.evidence_file_path && selectedClaim.evidence_file_name ? (
                                                <button
                                                    type="button"
                                                    className="ec-evidence-download-link"
                                                    disabled={downloadingEvidenceClaimId === selectedClaim.id}
                                                    onClick={() => handleDownloadEvidence(selectedClaim)}
                                                >
                                                    {downloadingEvidenceClaimId === selectedClaim.id
                                                        ? "Preparing download..."
                                                        : selectedClaim.evidence_file_name}
                                                </button>
                                            ) : (
                                                "Not provided"
                                            )}
                                        </p>
                                        <p><strong>No Evidence Reason:</strong> {selectedClaim.no_evidence_reason || "Not provided"}</p>

                                        {REVIEWABLE_STATUSES.includes(selectedClaim.status) ? (
                                            <div className="ECClaimActions ECClaimDecisionActions">
                                                <button
                                                    type="button"
                                                    className="approve"
                                                    disabled={isUpdating}
                                                    onClick={() => handleDecision(selectedClaim.id, "approved")}
                                                >
                                                    {isUpdating ? "Saving..." : "Approve"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="reject"
                                                    disabled={isUpdating}
                                                    onClick={() => handleDecision(selectedClaim.id, "rejected")}
                                                >
                                                    {isUpdating ? "Saving..." : "Reject"}
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="ec-review-note">This claim already has a final outcome.</p>
                                        )}
                                    </section>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ECClaimsReview;
