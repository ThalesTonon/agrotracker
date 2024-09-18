import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const token = Cookies.get("access_token");
const userId = Cookies.get("User_id");
const headers = {
  Authorization: "Bearer " + token,
};
const axiosInstance = axios.create({
  baseURL: "https://apiagrotracker.thalestonon.com.br/api/",
  // baseURL: "http://127.0.0.1:8000/api/",
  headers,
});
// Intercepta as respostas
if (token && userId !== null && userId !== undefined) {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: "Acesso expirado!",
          text: "Redirecionando para a página de login...",
          icon: "warning",
          showConfirmButton: false,
          allowOutsideClick: false, // Impede que o usuário clique fora do alerta
        });
        Cookies.remove("access_token");
        Cookies.remove("User_id");
        Cookies.remove("Company_id");

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // Redireciona após 2 segundos
      }
      return Promise.reject(error);
    }
  );
}
export { axiosInstance };
