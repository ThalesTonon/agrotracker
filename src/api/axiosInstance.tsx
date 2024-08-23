import axios from "axios";
import Swal from "sweetalert2";
const token = localStorage.getItem("access_token");
const headers = {
  Authorization: "Bearer " + token,
};
const axiosInstance = axios.create({
  baseURL: "https://apiagrotracker.thalestonon.com.br/api/",
  // baseURL: "http://127.0.0.1:8000/api/",
  headers,
});
// Intercepta as respostas
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
        didOpen: () => {
          Swal.showLoading(); // Mostra o indicador de carregamento
        },
      });
      localStorage.removeItem("access_token");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // Redireciona após 2 segundos
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
