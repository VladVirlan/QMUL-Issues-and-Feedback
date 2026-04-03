export const CLAIM_TYPES = {
    STANDARD: "standard",
    SELF_CERTIFICATION: "self-certification",
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
        code: "ECS1001",
        name: "Introduction to Data Analytics",
        assessments: ["Coursework 1", "Group Presentation", "Final Exam"],
    },
    {
        code: "ECS2002",
        name: "Software Engineering",
        assessments: ["Lab Assessment", "Project Milestone", "Final Report"],
    },
    {
        code: "ECS3003",
        name: "Human Computer Interaction",
        assessments: ["Design Portfolio", "Usability Study", "Reflective Essay"],
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
