import { CLAIM_TYPES } from "../ecFormConfig";

const ReviewStep = ({ formData, moduleLabel }) => {
    const claimTypeLabel =
        formData.claimType === CLAIM_TYPES.STANDARD ? "Standard Claim" : "Self-Certification";

    const evidenceSummary =
        formData.claimType === CLAIM_TYPES.SELF_CERTIFICATION
            ? "Not required for self-certification"
            : {
                  "upload-now": formData.evidenceFileName
                      ? `Evidence selected: ${formData.evidenceFileName}`
                      : "Evidence upload not provided",
                  "upload-later": "Evidence will be uploaded later",
                  "no-evidence": `No evidence uploaded. Reason: ${formData.noEvidenceReason || "Not provided"}`,
              }[formData.evidenceChoice];

    return (
        <div className="ec-form-card">
            <h2>Review Your Application</h2>
            <p>Check all details carefully before submitting.</p>

            <div className="ec-review-grid">
                <div>
                    <h3>Guidance</h3>
                    <p>{formData.soughtGuidance === "yes" ? "Guidance sought" : "Guidance not sought"}</p>
                </div>

                <div>
                    <h3>Claim Type</h3>
                    <p>{claimTypeLabel}</p>
                </div>

                <div>
                    <h3>Nature of Circumstances</h3>
                    <p>{formData.circumstance}</p>
                </div>

                <div>
                    <h3>Summary</h3>
                    <p>{formData.summary}</p>
                </div>

                <div>
                    <h3>Module and Assessment</h3>
                    <p>{moduleLabel}</p>
                    <p>{formData.assessment}</p>
                </div>

                <div>
                    <h3>Impact and Deadline</h3>
                    <p>{formData.impactType}</p>
                    <p>{formData.deadline}</p>
                </div>

                <div>
                    <h3>Evidence</h3>
                    <p>{evidenceSummary}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewStep;
