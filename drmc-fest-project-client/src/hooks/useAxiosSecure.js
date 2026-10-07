import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import app from "../services/firebase/firebase.config";
const axiosSecure = axios.create({
    baseURL: "http://localhost:5000/api",
})
const useAxiosSecure = () => {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    // console.log("this is outside interceptor", user.accessToken)

    if (isLoading || !user) return;

    // console.log('secure axios', user.email)
    // add a request interceptors
    axiosSecure.interceptors.request.use(
        async function (config) {
            const auth = getAuth(app);
            const currentUser = auth.currentUser;

            if (currentUser) {
                const token = await currentUser.getIdToken();
                config.headers.authorization = `Bearer ${token}`
            }
            // const accessToken = user?.accessToken;
            return config;
        },
        function (error) {
            return Promise.reject(error)
        }
    )

    // add a response interceptor
    axiosSecure.interceptors.response.use(
        function (response) {
            return response
        },
        async (error) => {
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                // console.log(status)
                await logout()
                navigate("/auth/signin")
            }
            return Promise.reject(error)
        }
    )

    return axiosSecure
};

export default useAxiosSecure;