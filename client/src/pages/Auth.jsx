import { useState } from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import { signInWithPopup } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { auth, provider } from "../utils/firebase.js";
import { serverUrl } from "../config.js";
import { setUserData } from "../redux/userSlice.js";

const Auth = () => {
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({ ...currentData, [name]: value }));
    };

    const handleManualAuth = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
            const body = isRegistering
                ? formData
                : { email: formData.email, password: formData.password };

            const response = await axios.post(
                serverUrl + endpoint,
                body,
                { withCredentials: true }
            );

            // Update Redux immediately because App's initial session check has already run.
            dispatch(setUserData(response.data.data.user));
            navigate("/");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setIsLoading(true);

        try {
            const response = await signInWithPopup(auth, provider);

            // The backend verifies this signed Firebase token before trusting the user.
            const idToken = await response.user.getIdToken();
            const loginResponse = await axios.post(
                serverUrl + "/api/auth/google",
                { idToken },
                { withCredentials: true }
            );

            dispatch(setUserData(loginResponse.data.data.user));
            navigate("/");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Google sign-in failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const changeMode = () => {
        setIsRegistering((currentMode) => !currentMode);
        setError("");
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b12] px-4 py-10 text-white">
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[130px]" />

            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: -40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[520px] rounded-3xl border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10"
            >
                <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                        <BsRobot size={23} />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">
                        interview<span className="text-indigo-400">IQ</span>.AI
                    </h2>
                </div>

                <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
                    <IoSparkles size={14} />
                    AI-powered interview preparation
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {isRegistering ? "Create your account" : "Welcome back"}
                </h1>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                    {isRegistering
                        ? "Start practising interviews and turn feedback into progress."
                        : "Sign in to continue your interview preparation."}
                </p>

                <form className="mt-7 space-y-4" onSubmit={handleManualAuth}>
                    {isRegistering && (
                        <AuthInput
                            label="Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            autoComplete="name"
                        />
                    )}

                    <AuthInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                    />
                    <AuthInput
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete={isRegistering ? "new-password" : "current-password"}
                        minLength={8}
                    />

                    {error && (
                        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3.5 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Please wait..." : isRegistering ? "Create account" : "Sign in"}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[10px] uppercase tracking-[1px] text-gray-600">or</span>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-gray-900 shadow-lg shadow-black/20 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FcGoogle size={22} />
                    Continue with Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-400">
                    {isRegistering ? "Already have an account?" : "New to InterviewIQ?"}{" "}
                    <button type="button" onClick={changeMode} className="font-medium text-indigo-400 hover:text-indigo-300">
                        {isRegistering ? "Sign in" : "Create an account"}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

const AuthInput = ({ label, ...inputProps }) => (
    <label className="block">
        <span className="mb-2 block text-xs font-medium text-gray-300">{label}</span>
        <input
            {...inputProps}
            required
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/15"
        />
    </label>
);

export default Auth;
