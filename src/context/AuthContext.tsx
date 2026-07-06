import { createContext, useEffect, useContext, useState, type ReactNode } from "react";
import { type Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
    signInNewUser: (
        email: string, 
        password: string, 
        nombre: string, 
        apellido: string
    ) => Promise<{ success: boolean, session: Session | null, error: string | null }>;
    signInExistingUser: (
        email: string, 
        password: string
    ) => Promise<{ success: boolean, session: Session | null, error: string | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
    children: ReactNode;
}

const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
}
const normalizePassword = (password: string) => {
    return password.normalize("NFKC");
}
const normalizeNombre = (nombre: string) => {
    return nombre.trim().normalize("NFKC");
}
const normalizeApellido = (apellido: string) => {
    return apellido.trim().normalize("NFKC");
}
const normalizeDisplayName = (email: string) => {
    return email.split("@")[0];
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);

    const signInNewUser = async (
        email : string, 
        password : string, 
        nombre: string, 
        apellido: string
    ) : Promise<{ success: boolean, session: Session | null, error: string | null }> => {
        const normalizedEmail = normalizeEmail(email);
        const normalizedPassword = normalizePassword(password);
        const normalizedNombre = normalizeNombre(nombre);
        const normalizedApellido = normalizeApellido(apellido);
        const normalizedDisplayName = normalizeDisplayName(email);
        
        const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password: normalizedPassword,
            options: {
                data: {
                    display_name: normalizedDisplayName,
                    nombre: normalizedNombre, 
                    apellido: normalizedApellido
                }
            }
        });

        if (error) {
            return { success: false, session: null, error: error.message };
        }
        return { success: true, session: data.session, error: "" };
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session ) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    // Sign in existing user
    const signInExistingUser = async (
        email : string, 
        password : string
    ) : Promise<{ success: boolean, session: Session | null, error: string | null }> => {
        try {
            const normalizedEmail = normalizeEmail(email);
            const normalizedPassword = normalizePassword(password);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password: normalizedPassword
            });
            if (error) {
                return { success: false, session: null, error: error.message };
            }
            return { success: true, session: data.session, error: "" };
        } catch (error) {
            console.error("Unexpected error signing in:", error);
            return { success: false, session: null, error: "An unexpected error occurred." };
        }
    }

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
        }
        setSession(null);
    }

    return (
        <AuthContext.Provider value={{ session, setSession, signInNewUser, signInExistingUser, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UseAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }

    return context;
}