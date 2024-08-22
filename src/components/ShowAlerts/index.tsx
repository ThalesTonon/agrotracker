import Swal, { SweetAlertIcon } from "sweetalert2";

export const showAlert = (
  icon: SweetAlertIcon,
  title: string,
  text: string,
  timer = 2000
) => {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    timer: timer,
  });
};
