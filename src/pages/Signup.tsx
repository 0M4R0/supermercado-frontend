import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react"

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");

    const { session, signInNewUser } = UseAuth();
    const Navigate = useNavigate();

    if (session) {
        Navigate("/home")
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                setError(error);
            }
        } catch (error) {
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
                            Crear cuenta
                        </h2>
                    </div>

                    <div className="flex flex-row w-full justify-between">
                        <div>
                            <label className="block mb-2" htmlFor="nombre">Nombre:</label>
                            <input
                                className="w-full border rounded-lg p-3"
                                id="nombre"
                                type="text"
                                required
                                placeholder="Nombre"
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block mb-2" htmlFor="apellido">Apellido:</label>
                            <input
                                className="w-full border rounded-lg p-3"
                                type="text"
                                id="apellido"
                                required
                                placeholder="Apellido"
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2" htmlFor="email">Email:</label>
                        <input
                            className="w-full border rounded-lg p-3"
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2">Contraseña:</label>
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

                    <div>
                        <label className="block mb-2" htmlFor="password">Confirmar contraseña:</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="********"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border rounded-lg p-3"
                            />
                    </div>

                    {error && (
                        <p className="text-red-500 mt-4 text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Creando..." : "Crear"}
                        </button>

                    <p className="text-center">
                        Al registrarte aceptas nuestros <span className="text-green-600 font-bold"> Términos y Política de privacidad</span>
                    </p>

                    <p className="text-center">
                        Ya tienes una cuenta?{" "}
                        <Link to="/login" className="text-green-600 font-bold">
                            Iniciar sesion
                        </Link>
                    </p>
                </form>

            </div>
        </div>
    )
};

export default Signup;