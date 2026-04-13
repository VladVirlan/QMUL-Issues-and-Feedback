const GuidanceStep = ({ soughtGuidance, onChange }) => {
    const showGuidanceMessage = soughtGuidance === "no";

    return (
        <div className="ec-form-card">
            <h2>Guidance Declaration</h2>
            <p>
                Before submitting an EC claim, students should seek guidance from their School/Support Team
                where possible.
            </p>

            <div className="ec-radio-group">
                <label className="ec-radio-item" htmlFor="guidance-yes">
                    <input
                        id="guidance-yes"
                        type="radio"
                        name="guidance"
                        value="yes"
                        checked={soughtGuidance === "yes"}
                        onChange={(event) => onChange(event.target.value)}
                    />
                    I have sought guidance on completing this claim.
                </label>

                <label className="ec-radio-item" htmlFor="guidance-no">
                    <input
                        id="guidance-no"
                        type="radio"
                        name="guidance"
                        value="no"
                        checked={soughtGuidance === "no"}
                        onChange={(event) => onChange(event.target.value)}
                    />
                    I have not sought guidance.
                </label>
            </div>

            {showGuidanceMessage && (
                <div className="ec-inline-alert ec-inline-alert-warning">
                    <strong>Important:</strong> Appropriate guidance can help you submit a complete and accurate
                    claim. You can still continue with your application.
                </div>
            )}
        </div>
    );
};

export default GuidanceStep;
