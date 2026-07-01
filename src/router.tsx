import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import PrivateRoute from "./components/PrivateRoute";
// import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Navigate to="/home" replace /> },
            { path: "/home", element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
            { path: "/catalogo", element: <Catalog /> },
            { path: "/catalogo/:id", element: <ProductDetail /> },
            { path: "/cuenta/pedidos", element: <PrivateRoute><Orders /></PrivateRoute> },
            { path: "/cuenta/configuracion", element: <PrivateRoute><Home /></PrivateRoute> },
            // { path: "/supermercado", element: <PrivateRoute><Catalog /></PrivateRoute> }
        ]
    }
]);