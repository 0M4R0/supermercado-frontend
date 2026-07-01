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
    ) => Promise<any>;
    signInExistingUser: (
        email: string, 
        password: string
    ) => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);

    const signInNewUser = async (email : string, password : string, nombre: string, apellido: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: email.split("@")[0],
                    nombre, 
                    apellido
                }
            }
        });

        if (error) {
            console.error("Error signing up:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true, session: data.session };
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
    const signInExistingUser = async (email : string, password : string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                console.error("Error signing in:", error.message);
                return { success: false, error: error.message };
            }
            return { success: true, session: data.session };
        } catch (error) {
            console.error("Unexpected error signing in:", error);
            return { success: false, error: "An unexpected error occurred." };
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
        throw new Error("UseAuth must be used within an AuthContextProvider");
    }

    return context;
}