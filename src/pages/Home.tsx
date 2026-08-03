import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterBanner from "../components/home/RegisterBanner";
import Hero from "../components/home/Hero";

export default function Home() {
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-10 text-center">
      <Hero onExplore={() => navigate("/catalogo")}/>
      {!session && <RegisterBanner onSignup={() => navigate("/signup")} />}
    </main>
  );
}
