export const CLAIM_TYPES = {
    STANDARD: "standard",
    SELF_CERTIFICATION: "self_certification",
};

export const CIRCUMSTANCE_OPTIONS = [
    "Acute illness",
    "Accident or injury",
    "Bereavement",
    "Mental health difficulty",
    "Family or personal crisis",
    "Victim of crime",
    "Housing emergency",
    "Other",
];

export const MODULE_OPTIONS = [
    {
        code: "ECS506U",
        name: "Software Engineering Project",
        assessments: ["Coursework 1", "My Skills"],
    },
    {
        code: "ECS518U",
        name: "Operating Systems",
        assessments: ["Lab Exercises", "Final Exam", "Quiz"],
    },
    {
        code: "ECS522U",
        name: "Graphical User Interfaces",
        assessments: ["Assignment 1 - Requirements", "Assignment 2 - Design and Implementation", "Assignment 3 - Evaluation and Reflection"],
    },
    {
        code: "ECS524U",
        name: "Internet Protocol and Applications",
        assessments: ["Term-Test 1", "Term-Test 2", "Final Exam"],
    },
];

export const IMPACT_TYPES = [
    "Unable to submit by deadline",
    "Unable to attend in-person assessment",
    "Significant reduction in performance",
    "Intermittent impact across assessment period",
];

export const STEPS = [
    "Guidance",
    "Claim Type",
    "Circumstances",
    "Assessment Impact",
    "Evidence",
    "Review & Submit",
];
