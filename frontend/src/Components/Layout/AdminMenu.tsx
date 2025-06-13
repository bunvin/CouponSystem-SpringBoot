import { JSX } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminMenu(): JSX.Element {
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault(); // Prevent default link behavior
        
        // Clear the authentication token
        localStorage.removeItem('token');
        
        // You can also clear other user-related data if needed
        localStorage.removeItem('user');
        
        // Optional: Show confirmation message
        console.log('User logged out successfully');
        
        // Redirect to login page
        navigate('/login');
    };

    return (
        <div className="admin-menu">
            <NavLink to="/add-new">Add New</NavLink>
            <NavLink to="/show-all">Show All: Company & Customer & Coupon</NavLink>
            <a 
                href="#" 
                onClick={handleLogout}
                className="logout-link"
            >
                Logout
            </a>
        </div>
    );
}

export default AdminMenu;