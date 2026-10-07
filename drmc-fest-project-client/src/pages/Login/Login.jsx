import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import { Link, useLocation, useNavigate } from "react-router";
// import Navbar from "../../components/shared/Navbar/Navbar"
import Navbar from "../../components/Navbar/Navbar";
import { useForm } from "react-hook-form";
import useCreateUser from "../../hooks/useCreateUser";

const Login = () => {
    const { signIn } = useAuth();
    const userAsync = useCreateUser();
    const navigate = useNavigate();
    const location = useLocation();
    let from = location.state?.from?.pathname || '/';
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleLogin = data => {
        const email = data.email;
        const password = data.password;

        signIn(email, password)
            .then(() => {
                Swal.fire({
                    title: "Good job!",
                    text: "You Have Login Successfully",
                    icon: "success"
                })

                userAsync({ email: email })
                navigate(from, { replace: true })
            })
            .catch(error => {
                const newError = error?.message.replace("Firebase:", "");
                toast.error(`Oppss! Login failed: ${newError}`)
                console.log(error)
            })
    };

    useEffect(() => {
        switch (errors.password?.type) {
            case "minLength":
                toast.error("Error: Password must be at least 6 characters", { autoClose: 1500 });
                break;
            case "pattern":
                toast.error("Error: Password must have an uppercase and a lowercase letter", { autoClose: 1500 });
                break;
        }
        switch (errors.email?.type) {
            case "pattern":
                toast.error("Error: Invalid Email", { autoClose: 1500 });
                break;
        }
    }, [errors.password?.type, errors.email?.type]);

    // if (user) navigate("/")

    return (
        <div>
            <Navbar />
            <title>CO2BD || Login Page</title>
            <ToastContainer />
            <div className="hero min-h-screen auth-login">
                <div className="hero-content 2xl:px-20 md:shadow-2xl border-green-300 md:border-2 rounded-3xl md:mx-0
                h-5/6 lg:max-w-[55%] w-screen md:w-3/4 lg:w-[55%] 2xl:w-[75%] gap-[10%] flex-col md:flex-row">

                    <div className="card w-full lg:w-2/3">
                        <div>
                        </div>
                        <div className="card-body w-full inter mb-0 mt-0 text-xl font-semibold">
                            {/* email */}
                            <div className="card-body  mb-0 md:w-2/3 md:mx-auto lg:mx-0 lg:w-full">
                                <h2 className="text-4xl inter font-bold md:text-left lg:text-center">Login</h2>
                                <form onSubmit={handleSubmit(handleLogin)} className="fieldset w-full items-center font-medium">
                                    {/* email */}
                                    <label className="label w-full">Email</label>
                                    <input {...register("email",
                                        {
                                            required: true,
                                            pattern: /^[^\s@]+@[^\s/@]+\.[^\s@]+$/
                                        })}
                                        name='email'
                                        type="email"
                                        className="input font-bold w-full focus:bg-transparent
                                                 "
                                        placeholder="Email"
                                        required />

                                    {/* password */}
                                    <label className="label w-full">Password</label>
                                    <input {...register("password",
                                        {
                                            required: true,
                                            minLength: 6,
                                            pattern: /(?=.*[A-Z])(?=.*[a-z])/
                                        })}
                                        name='password'
                                        type="password"
                                        className="input font-bold focus:bg-transparent w-full"
                                        placeholder="Password"
                                        required />
                                    <input type='submit' value='Login' className="btn w-1/3  mt-4 btn-primary text-white border-none " />
                                </form>
                                {/* go to register page */}
                                <Link to="/register" className="link link-hover text-green-500">Go to Register Page</Link>
                            </div>
                            <SocialLogin
                            ></SocialLogin>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;