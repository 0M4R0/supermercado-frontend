import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterBanner from "../components/home/RegisterBanner";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";

export default function Home() {
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[70vh] flex-col items-center px-4 py-10">
      <Hero onExplore={() => navigate("/catalogo")} />
      <Categories />
      {!session && <RegisterBanner onSignup={() => navigate("/signup")} />}
    </main>
  );
}
