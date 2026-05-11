import axios from "axios";

export const getAxiosError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const axiosErr = err;
    const status = axiosErr.response?.status;

    const errors = axiosErr.response?.data?.errors;

    let message = axiosErr.message;

    if (errors) {
      if (Array.isArray(errors)) {
        message = errors
          .map((e) => {
            if (typeof e === "string") return e;
            if (typeof e === "object" && e !== null) {
              return e.message ?? JSON.stringify(e);
            }
            return String(e);
          })
          .join(", ");
      } else if (typeof errors === "object") {
        message = Object.values(errors).flat().join(", ");
      }
    }

    return {
      success: false,
      status,
      message,
    };
  }

  return {
    success: false,
    status: null,
    message: (err as Error)?.message || "Unknown error",
  };
};
