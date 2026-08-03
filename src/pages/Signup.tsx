import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react"
import AuthBanner from "../components/auth/AuthBanner";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)

    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");

    const { session, signInNewUser } = useAuth();
    const Navigate = useNavigate();

    if (session) {
        Navigate("/home")
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

            // validate password confirmation
            if (password !== confirmPassword) {
                setError("Las contraseñas no coinciden.");
                setLoading(false);
                return;
            }

        try {
            const { success, error } = await signInNewUser(email, password, nombre, apellido);
            if (success) {
                Navigate("/home");
            } else {
                setError(error ?? "Signup failed. Please try again.");
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
                            Crear cuenta
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full justify-between gap-4">
                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="nombre">Nombre:</label>
                            <input
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                id="nombre"
                                type="text"
                                required
                                placeholder="Nombre"
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="apellido">Apellido:</label>
                            <input
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                type="text"
                                id="apellido"
                                required
                                placeholder="Apellido"
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">Email:</label>
                        <input
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
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

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">Confirmar contraseña:</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="********"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 mt-4 text-center bg-red-50 rounded-lg py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                            disabled={loading}
                        >
                            {loading ? "Creando..." : "Crear cuenta"}
                        </button>

                    <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
                            id="acceptTerms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            />

                        <label htmlFor="acceptTerms">
                            Acepto los{" "}
                        </label>

                        <button
                            type="button"
                            className="text-green-600 font-bold cursor-pointer hover:underline"
                            onClick={() => window.open("https://www.google.com", "_blank")}
                        >
                            términos y condiciones
                        </button>
                    </div>

                    <p className="text-center text-gray-600">
                        Ya tienes una cuenta?{" "}
                        <Link to="/login" className="text-green-600 font-bold hover:text-green-700 hover:underline">
                            Iniciar sesión
                        </Link>
                    </p>
                </form>

            </div>
        </div>
    )
};

export default Signup;
