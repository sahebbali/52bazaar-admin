import { Bounce, toast } from "react-toastify";

export const Notification = (msg, type = "default") => {
  const baseOptions = {
    autoClose: 1500,
    hideProgressBar: false,
    pauseOnHover: false,
    transition: Bounce,
    position: "top-center",
  };

  switch (type) {
    case "success":
      return toast.success(msg, baseOptions);

    case "error":
      return toast.error(msg, baseOptions);

    case "info":
      return toast.info(msg, baseOptions);

    case "warning":
      return toast.warning(msg, baseOptions);

    default:
      return toast(msg, baseOptions);
  }
};
