import StepProgress from "./StepProgress";
import GuidanceStep from "./GuidanceStep";
import ClaimTypeStep from "./ClaimTypeStep";
import CircumstancesStep from "./CircumstancesStep";
import AssessmentImpactStep from "./AssessmentImpactStep";
import EvidenceStep from "./EvidenceStep";
import ReviewStep from "./ReviewStep";

import { CLAIM_TYPES, CIRCUMSTANCE_OPTIONS, IMPACT_TYPES, MODULE_OPTIONS, STEPS } from "../ecFormConfig";
import { useMemo, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";

const INITIAL_FORM_DATA = {
    soughtGuidance: "",
    claimType: CLAIM_TYPES.STANDARD,
    selfCertConfirmed: false,
    circumstance: "",
    summary: "",
    moduleCode: "",
    assessment: "",
    impactType: "",
    deadline: "",
    evidenceChoice: "upload-now",
    evidenceFileName: "",
    uploadLaterConfirmed: false,
    noEvidenceReason: "",
};

const ECForm = ({ setIsFormOpen, onSubmitSuccess }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errorMessage, setErrorMessage] = useState("");

    const selectedModule = useMemo(
        () => MODULE_OPTIONS.find((moduleItem) => moduleItem.code === formData.moduleCode),
        [formData.moduleCode],
    );

    const visibleSteps =
        formData.claimType === CLAIM_TYPES.SELF_CERTIFICATION
        ? STEPS.filter((step) => step !== "Evidence")
        : STEPS;

    const activeStepLabel = STEPS[currentStep];
    const stepTransitionKey = `${currentStep}-${formData.claimType}`;
    const moduleLabel = selectedModule
        ? `${selectedModule.code} - ${selectedModule.name}`
        : "Not selected";

    const updateFormData = (updates) => {
        setFormData((previous) => ({ ...previous, ...updates }));
    };

    const validateCurrentStep = () => {
        if (currentStep === 0) {
            if (!formData.soughtGuidance) {
                setErrorMessage("Please select whether you have sought guidance.");
                return false;
            }
        }

        if (currentStep === 1) {
            if (!formData.claimType) {
                setErrorMessage("Please select a claim type.");
                return false;
            }

            if (formData.claimType === CLAIM_TYPES.SELF_CERTIFICATION && !formData.selfCertConfirmed) {
                setErrorMessage("Please confirm that you understand the self-certification criteria.");
                return false;
            }
        }

        if (currentStep === 2) {
            if (!formData.circumstance || !formData.summary.trim()) {
                setErrorMessage("Please complete the circumstances dropdown and summary.");
                return false;
            }
        }

        if (currentStep === 3) {
            if (!formData.moduleCode || !formData.assessment || !formData.impactType || !formData.deadline) {
                setErrorMessage("Please complete module, assessment, impact type, and original deadline.");
                return false;
            }
        }

        if (currentStep === 4 && formData.claimType === CLAIM_TYPES.STANDARD) {
            if (formData.evidenceChoice === "upload-now" && !formData.evidenceFileName) {
                setErrorMessage("Please choose an evidence file or select another evidence option.");
                return false;
            }

            if (formData.evidenceChoice === "upload-later" && !formData.uploadLaterConfirmed) {
                setErrorMessage("Please confirm that you understand claims will not progress until evidence is uploaded.");
                return false;
            }

            if (formData.evidenceChoice === "no-evidence" && !formData.noEvidenceReason.trim()) {
                setErrorMessage("Please explain why no evidence is being provided.");
                return false;
            }
        }

        setErrorMessage("");
        return true;
    };

    const handleNext = () => {
        const isValid = validateCurrentStep();

        if (!isValid) {
            return;
        }

        if (currentStep === 3 && formData.claimType === CLAIM_TYPES.SELF_CERTIFICATION) {
            setCurrentStep(5);
            return;
        }

        setCurrentStep((previous) => Math.min(previous + 1, 5));
    };

    const handleBack = () => {
        setErrorMessage("");

        if (currentStep === 5 && formData.claimType === CLAIM_TYPES.SELF_CERTIFICATION) {
            setCurrentStep(3);
            return;
        }

        setCurrentStep((previous) => Math.max(previous - 1, 0));
    };

    const handleSubmit = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setErrorMessage("You must be logged in to submit a claim.");
            return;
        }

        const { error } = await supabase.from('ec_claims').insert({
            user_id: user.id,
            sought_guidance: formData.soughtGuidance === "yes",
            claim_type: formData.claimType,
            self_cert_confirmed: formData.selfCertConfirmed,
            circumstance: formData.circumstance,
            summary: formData.summary,
            module_code: formData.moduleCode,
            assessment: formData.assessment,
            impact_type: formData.impactType,
            deadline: formData.deadline,
            evidence_choice: formData.selfCertConfirmed ? "no-evidence" : formData.evidenceChoice,
            evidence_file_name: formData.evidenceFileName,
            upload_later_confirmed: formData.uploadLaterConfirmed,
            no_evidence_reason: formData.selfCertConfirmed ? "Not required for self-certification" : formData.noEvidenceReason,
        });

        if (error) {
            setErrorMessage("Something went wrong submitting your claim. Please try again.");
            console.error("Error inserting claim:", error);
            return;
        }

        setErrorMessage("");
        setIsFormOpen(false);

        if (onSubmitSuccess) {
            await onSubmitSuccess();
        }
    };

    return (
        <>
            <div className="ec-header">
                <h1>Extenuating Circumstances Application</h1>
                <p>Complete each section to submit your claim. You can review details before final submission.</p>
            </div>

            <div className="ec-form-content">
                <StepProgress steps={visibleSteps} activeStep={activeStepLabel} />

                {errorMessage && (
                    <div className="ec-inline-alert ec-inline-alert-error" role="alert">
                        {errorMessage}
                    </div>
                )}

                <div key={stepTransitionKey} className="ec-step-content" aria-live="polite">
                    {currentStep === 0 && (
                        <GuidanceStep
                            soughtGuidance={formData.soughtGuidance}
                            onChange={(value) => updateFormData({ soughtGuidance: value })}
                        />
                    )}

                    {currentStep === 1 && (
                        <ClaimTypeStep
                            claimType={formData.claimType}
                            selfCertConfirmed={formData.selfCertConfirmed}
                            onTypeChange={(value) =>
                                updateFormData({
                                    claimType: value,
                                    selfCertConfirmed: value === CLAIM_TYPES.SELF_CERTIFICATION ? formData.selfCertConfirmed : false,
                                })
                            }
                            onSelfCertConfirm={(value) => updateFormData({ selfCertConfirmed: value })}
                        />
                    )}

                    {currentStep === 2 && (
                        <CircumstancesStep
                            circumstance={formData.circumstance}
                            summary={formData.summary}
                            circumstances={CIRCUMSTANCE_OPTIONS}
                            onCircumstanceChange={(value) => updateFormData({ circumstance: value })}
                            onSummaryChange={(value) => updateFormData({ summary: value })}
                        />
                    )}

                    {currentStep === 3 && (
                        <AssessmentImpactStep
                            modules={MODULE_OPTIONS}
                            moduleCode={formData.moduleCode}
                            assessment={formData.assessment}
                            impactType={formData.impactType}
                            deadline={formData.deadline}
                            impactTypes={IMPACT_TYPES}
                            onModuleChange={(value) => updateFormData({ moduleCode: value, assessment: "" })}
                            onAssessmentChange={(value) => updateFormData({ assessment: value })}
                            onImpactTypeChange={(value) => updateFormData({ impactType: value })}
                            onDeadlineChange={(value) => updateFormData({ deadline: value })}
                        />
                    )}

                    {currentStep === 4 && formData.claimType === CLAIM_TYPES.STANDARD && (
                        <EvidenceStep
                            evidenceChoice={formData.evidenceChoice}
                            evidenceFileName={formData.evidenceFileName}
                            uploadLaterConfirmed={formData.uploadLaterConfirmed}
                            noEvidenceReason={formData.noEvidenceReason}
                            onChoiceChange={(value) =>
                                updateFormData({
                                    evidenceChoice: value,
                                    evidenceFileName: "",
                                    uploadLaterConfirmed: false,
                                    noEvidenceReason: "",
                                })
                            }
                            onFileChange={(value) => updateFormData({ evidenceFileName: value })}
                            onUploadLaterConfirm={(value) => updateFormData({ uploadLaterConfirmed: value })}
                            onNoEvidenceReasonChange={(value) => updateFormData({ noEvidenceReason: value })}
                        />
                    )}

                    {currentStep === 5 && <ReviewStep formData={formData} moduleLabel={moduleLabel} />}
                </div>

                <div className="ec-actions">
                    <button type="button" className="ec-secondary-btn" onClick={handleBack} disabled={currentStep === 0}>
                        Back
                    </button>

                    {currentStep < 5 ? (
                        <button type="button" className="ec-primary-btn" onClick={handleNext}>
                            Continue
                        </button>
                    ) : (
                        <button type="button" className="ec-primary-btn" onClick={handleSubmit}>
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ECForm