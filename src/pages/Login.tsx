import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { session, signInExistingUser } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate("/home");
        }
    }, [session, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { success, error } = await signInExistingUser(email, password);
            if (success) {
                navigate("/home");
            } else {
                setError(error);
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
                <img
                    src="https://centrocuestanacional.com/wp-content/uploads/2022/01/Supermercados-Nacional-Plaza-Central.jpg"
                    alt="Supermarket"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-screen-700/60"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full text-white px-8">
                    <h1 className="text-5xl font-bold mb-4">
                        Mercado Verde
                    </h1>

                    <p className="text-xl text-center max-w-md">
                        Productos frescos, entregados con cuidado directo a tu puerta.
                    </p>
                </div>

            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center px-8">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold">
                            Bienvenido de vuelta
                        </h2>

                        <p className="text-gray-500 mt-2">Inicia sesion para continuar</p>
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full border rounded-lg p-3"
                            />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2">contraseña:</label>
                        <div className="relative">
                            <input 
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required 
                                placeholder="********"
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full border rounded-lg p-3"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <button
                                    type="button" 
                                    className="cursor-pointer py-4 pr-2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 mt-4 text-center">
                            {error}
                        </p>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition cursor-pointer"
                    >
                    {loading ? "Iniciando..." : "Iniciar sesion"}
                    </button>

                    <p className="text-center">
                        No tienes una cuenta?{" "}
                        <Link to="/signup" className="text-green-600 font-bold">
                            Registrate
                        </Link>
                    </p>
                </form>
            </div>

        </div>
    )
};

export default Login;