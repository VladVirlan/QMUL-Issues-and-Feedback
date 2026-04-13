const CircumstancesStep = ({ circumstance, summary, circumstances, onCircumstanceChange, onSummaryChange }) => {
    return (
        <div className="ec-form-card">
            <h2>Circumstances</h2>
            <p>Select the nature of your circumstances and provide a short summary.</p>

            <div className="ec-form-grid single-column">
                <label className="ec-field" htmlFor="circumstance-type">
                    <span>Nature of circumstances</span>
                    <select
                        id="circumstance-type"
                        value={circumstance}
                        onChange={(event) => onCircumstanceChange(event.target.value)}
                    >
                        <option value="">Please select</option>
                        {circumstances.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="ec-field" htmlFor="summary">
                    <span>Summary of circumstances</span>
                    <textarea
                        id="summary"
                        rows={5}
                        value={summary}
                        onChange={(event) => onSummaryChange(event.target.value)}
                        placeholder="Briefly describe how this unexpected event is affecting your assessment(s)."
                    />
                </label>
            </div>
        </div>
    );
};

export default CircumstancesStep;
