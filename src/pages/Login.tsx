import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import AuthBanner from "../components/auth/AuthBanner";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { session, signInExistingUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate("/home");
        }
    }, [session, navigate]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { success, error } = await signInExistingUser(email, password);
            if (success) {
                navigate("/home");
            } else {
                setError(error ?? "Login failed. Please try again.");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            <div className="relative hidden lg:flex lg:w-1/2">
                <AuthBanner />
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center px-8">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold">
                            Bienvenido de vuelta
                        </h2>

                        <p className="text-gray-500 mt-2">Inicia sesión para continuar</p>
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email:</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Contraseña:</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="********"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-2 text-gray-400 hover:text-gray-600 transition rounded-lg"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 mt-4 text-center bg-red-50 rounded-lg py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition shadow-sm disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                    >
                    {loading ? "Iniciando..." : "Iniciar sesión"}
                    </button>

                    <p className="text-center text-gray-600">
                        No tienes una cuenta?{" "}
                        <Link to="/signup" className="text-green-600 font-bold hover:text-green-700 hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </form>
            </div>

        </div>
    )
};

export default Login;
