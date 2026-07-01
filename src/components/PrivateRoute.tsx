import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { session } = UseAuth();

    if (!session) {
        return <Navigate to="/login" />;
    }
    return (
        <>
            {children}
        </>
    );
}

export default PrivateRoute;