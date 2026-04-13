const AssessmentImpactStep = ({
    modules,
    moduleCode,
    assessment,
    impactType,
    deadline,
    impactTypes,
    onModuleChange,
    onAssessmentChange,
    onImpactTypeChange,
    onDeadlineChange,
}) => {
    const selectedModule = modules.find((moduleItem) => moduleItem.code === moduleCode);

    return (
        <div className="ec-form-card">
            <h2>Assessment and Impact</h2>
            <p>Choose the module/assessment affected and how your circumstances impacted you.</p>

            <div className="ec-form-grid">
                <label className="ec-field" htmlFor="module-code">
                    <span>Affected module</span>
                    <select
                        id="module-code"
                        value={moduleCode}
                        onChange={(event) => onModuleChange(event.target.value)}
                    >
                        <option value="">Please select</option>
                        {modules.map((moduleItem) => (
                            <option key={moduleItem.code} value={moduleItem.code}>
                                {moduleItem.code} - {moduleItem.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="ec-field" htmlFor="assessment-name">
                    <span>Assessment</span>
                    <select
                        id="assessment-name"
                        value={assessment}
                        onChange={(event) => onAssessmentChange(event.target.value)}
                        disabled={!selectedModule}
                    >
                        <option value="">Please select</option>
                        {selectedModule?.assessments.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="ec-field" htmlFor="impact-type">
                    <span>Impact type</span>
                    <select
                        id="impact-type"
                        value={impactType}
                        onChange={(event) => onImpactTypeChange(event.target.value)}
                    >
                        <option value="">Please select</option>
                        {impactTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="ec-field" htmlFor="original-deadline">
                    <span>Original deadline date</span>
                    <input
                        id="original-deadline"
                        type="date"
                        value={deadline}
                        onChange={(event) => onDeadlineChange(event.target.value)}
                    />
                </label>
            </div>
        </div>
    );
};

export default AssessmentImpactStep;
