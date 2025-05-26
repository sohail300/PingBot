import { toast } from "sonner";

export function displaySuccessToast({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  toast(title, {
    description: description,
    style: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      fontSize: "14px",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
    },
  });
}

export function displayErrorToast({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  toast(title, {
    description: description,
    style: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      color: "#ffffff",
      fontSize: "14px",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
    },
  });
}
