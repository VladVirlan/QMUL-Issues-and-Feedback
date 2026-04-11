import { EVIDENCE_ACCEPT_ATTRIBUTE } from "../evidenceValidation";

const EvidenceStep = ({
    evidenceChoice,
    evidenceFileName,
    uploadLaterConfirmed,
    noEvidenceReason,
    onChoiceChange,
    onFileChange,
    onUploadLaterConfirm,
    onNoEvidenceReasonChange,
}) => {
    return (
        <div className="ec-form-card">
            <h2>Evidence</h2>
            <p>Provide supporting evidence for your claim, or select an alternative option below.</p>

            <div className="ec-radio-group">
                <label className="ec-radio-item" htmlFor="evidence-upload-now">
                    <input
                        id="evidence-upload-now"
                        type="radio"
                        name="evidence-choice"
                        value="upload-now"
                        checked={evidenceChoice === "upload-now"}
                        onChange={(event) => onChoiceChange(event.target.value)}
                    />
                    Upload evidence now
                </label>

                <label className="ec-radio-item" htmlFor="evidence-upload-later">
                    <input
                        id="evidence-upload-later"
                        type="radio"
                        name="evidence-choice"
                        value="upload-later"
                        checked={evidenceChoice === "upload-later"}
                        onChange={(event) => onChoiceChange(event.target.value)}
                    />
                    I wish to upload evidence later
                </label>

                <label className="ec-radio-item" htmlFor="evidence-none">
                    <input
                        id="evidence-none"
                        type="radio"
                        name="evidence-choice"
                        value="no-evidence"
                        checked={evidenceChoice === "no-evidence"}
                        onChange={(event) => onChoiceChange(event.target.value)}
                    />
                    I do not have any evidence to upload
                </label>
            </div>

            {evidenceChoice === "upload-now" && (
                <div className="ec-inline-alert ec-inline-alert-neutral">
                    <label className="ec-field" htmlFor="evidence-file">
                        <span>Choose file</span>
                        <input
                            id="evidence-file"
                            type="file"
                            accept={EVIDENCE_ACCEPT_ATTRIBUTE}
                            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
                        />
                    </label>
                    {evidenceFileName && <p className="ec-file-name">Selected: {evidenceFileName}</p>}
                </div>
            )}

            {evidenceChoice === "upload-later" && (
                <div className="ec-inline-alert ec-inline-alert-warning">
                    <p>
                        Your claim can be submitted now, but it will not move to screening until evidence is
                        uploaded.
                    </p>
                    <label className="ec-checkbox-item" htmlFor="upload-later-confirm">
                        <input
                            id="upload-later-confirm"
                            type="checkbox"
                            checked={uploadLaterConfirmed}
                            onChange={(event) => onUploadLaterConfirm(event.target.checked)}
                        />
                        I understand and wish to continue.
                    </label>
                </div>
            )}

            {evidenceChoice === "no-evidence" && (
                <div className="ec-inline-alert ec-inline-alert-warning">
                    <label className="ec-field" htmlFor="no-evidence-reason">
                        <span>Please explain why no evidence is being provided</span>
                        <textarea
                            id="no-evidence-reason"
                            rows={4}
                            value={noEvidenceReason}
                            onChange={(event) => onNoEvidenceReasonChange(event.target.value)}
                            placeholder="Provide your reason."
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default EvidenceStep;
