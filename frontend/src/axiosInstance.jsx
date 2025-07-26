import axios from "axios";

function axiosInstance(){
    return axios.create({
        baseURL: import.meta.env.VITE_API_SERVER_BASE_URL,
        withCredentials: true,                 
      });
}

export default axiosInstance;