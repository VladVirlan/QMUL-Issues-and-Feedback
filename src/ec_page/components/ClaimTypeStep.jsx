import { CLAIM_TYPES } from "../ecFormConfig";

const ClaimTypeStep = ({ claimType, selfCertConfirmed, onTypeChange, onSelfCertConfirm }) => {
    const isSelfCertification = claimType === CLAIM_TYPES.SELF_CERTIFICATION;

    return (
        <div className="ec-form-card">
            <h2>Claim Type</h2>
            <p>Select the claim route that best matches your circumstances.</p>

            <div className="ec-radio-group ec-radio-group-inline">
                <label className="ec-radio-item" htmlFor="claim-standard">
                    <input
                        id="claim-standard"
                        type="radio"
                        name="claimType"
                        value={CLAIM_TYPES.STANDARD}
                        checked={claimType === CLAIM_TYPES.STANDARD}
                        onChange={(event) => onTypeChange(event.target.value)}
                    />
                    Standard Claim
                </label>

                <label className="ec-radio-item" htmlFor="claim-self-certification">
                    <input
                        id="claim-self-certification"
                        type="radio"
                        name="claimType"
                        value={CLAIM_TYPES.SELF_CERTIFICATION}
                        checked={isSelfCertification}
                        onChange={(event) => onTypeChange(event.target.value)}
                    />
                    Self-Certification
                </label>
            </div>

            {isSelfCertification && (
                <div className="ec-inline-alert ec-inline-alert-warning">
                    <p>
                        Self-certification should only be used where your circumstances satisfy the self-cert
                        criteria. Evidence upload is skipped at this stage.
                    </p>
                    <label className="ec-checkbox-item" htmlFor="self-cert-confirm">
                        <input
                            id="self-cert-confirm"
                            type="checkbox"
                            checked={selfCertConfirmed}
                            onChange={(event) => onSelfCertConfirm(event.target.checked)}
                        />
                        I confirm I have read and understood the self-certification criteria.
                    </label>
                </div>
            )}
        </div>
    );
};

export default ClaimTypeStep;
