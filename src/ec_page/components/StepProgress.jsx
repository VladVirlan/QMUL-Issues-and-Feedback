const StepProgress = ({ steps, activeStep }) => {
    return (
        <div className="ec-step-progress" aria-label="Application steps">
            {steps.map((step, index) => {
                const isActive = step === activeStep;
                const isComplete = steps.indexOf(activeStep) > index;

                return (
                    <div
                        key={step}
                        className={`ec-step-chip ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
                    >
                        <span className="ec-step-chip-number">{index + 1}</span>
                        <span>{step}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default StepProgress;
