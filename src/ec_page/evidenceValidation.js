export const MAX_EVIDENCE_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_EVIDENCE_MIME_TYPES = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/msword",
];

export const EVIDENCE_ACCEPT_ATTRIBUTE = ".pdf,.png,.jpg,.jpeg,.doc";

const formatAllowedEvidenceTypes = () =>
    "PDF, PNG, JPG/JPEG, or DOC";

export const validateEvidenceFile = (file) => {
    if (!file) {
        return "Please choose an evidence file.";
    }

    if (!ALLOWED_EVIDENCE_MIME_TYPES.includes(file.type)) {
        return `Unsupported file type. Please upload ${formatAllowedEvidenceTypes()}.`;
    }

    if (file.size > MAX_EVIDENCE_FILE_SIZE_BYTES) {
        return "File is too large. Maximum size is 10 MB.";
    }

    return "";
};
