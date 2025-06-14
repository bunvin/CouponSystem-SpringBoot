import { JSX } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthState, AuthActionType, authStore } from "../../State/AuthState";
import { ROLES } from "../Constants";

function NavBar(): JSX.Element {
    const navigate = useNavigate();
    const authState = useSelector((state: AuthState) => state);
    const user = authState.user;
    const userType = user?.userType;

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        
        // Dispatch logout action to Redux store
        authStore.dispatch({
            type: AuthActionType.Logout,
            payload: null
        });
        
        console.log('User logged out successfully');
        navigate('/login');
    };

    // Don't render navbar if user is not logged in
    if (!user) {
        return <></>;
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <NavLink to="/show-all">Show All</NavLink>
                
                {userType === ROLES.ADMIN && (
                    <NavLink to="/add-new">Add New Entity</NavLink>
                )}
                
                {userType === ROLES.COMPANY && (
                    <NavLink to="/add-coupon">Add New Coupon</NavLink>
                )}
                
            </div>
            
            <div className="navbar-right">
                <a 
                    href="#" 
                    onClick={handleLogout}
                    className="logout-link"
                >
                    Logout
                </a>
            </div>
        </nav>
    );
}

export default NavBar;