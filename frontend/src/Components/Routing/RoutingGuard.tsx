import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../State/AuthState";


interface RoutingProps {
    child: JSX.Element,
    requiredRole?: string;
}

function RoutingGuard(routingProps: RoutingProps): JSX.Element {
    
    const navigate = useNavigate();

    useEffect(() => {
        const user = authStore.getState().user;
        
        if (user == null) {
            navigate('/login');
            return;
        }
        
        //Check if specific role is required
        if (routingProps.requiredRole) {
            if (user.userType !== routingProps.requiredRole) {
                navigate('/login');
            }
        }
    }, []);
    
    return routingProps.child;
}

export default RoutingGuard;