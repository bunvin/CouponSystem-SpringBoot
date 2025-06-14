import { useNavigate } from 'react-router-dom';
import { JSX, useState } from 'react';
import { ROLES } from '../Constants';
import Coupon from '../../Models/Coupon';
import { jwtDecode } from 'jwt-decode';

interface CouponCardProps {
    coupon: Coupon;
    userRole: ROLES;
    customerId?: number;
    onDelete?: (id: number) => void;
    onBuy?: (couponId: number, customerId: number) => void;
    onCancelBuy?: (couponId: number, customerId: number) => void;
    isPurchased?: boolean; 
}

function CouponCard({ 
    coupon, 
    userRole, 
    onDelete, 
    onBuy, 
    onCancelBuy, 
    isPurchased = false 
}: CouponCardProps): JSX.Element {
    const navigate = useNavigate();
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const couponId = coupon.id || 0;

    // Function to get customer ID from token
    function getCustomerIdFromToken(): number | null {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return null;
        }
        
        try {
            const decodedToken: any = jwtDecode(token);            
            const customerId = decodedToken.customerId;            
            return customerId || null;
            
        } catch (error) {
            console.error("Error decoding token in CouponCard:", error);
            return null;
        }
    };

    function onUpdate(id: number) {
        navigate(`/coupon/${id}`);
    }

    function handleDelete(id: number) {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            onDelete?.(id);
        }
    }

    function handleBuy() {
        const customerId = getCustomerIdFromToken();
        if (customerId) {
            onBuy?.(couponId, customerId);
        } else {
            alert('Unable to purchase: Customer ID not found. Please log in again.');
        }
    }

    function handleCancelBuy() {
        const customerId = getCustomerIdFromToken();
        if (customerId) {
            if (window.confirm('Are you sure you want to cancel the purchase of this coupon?')) {
                onCancelBuy?.(couponId, customerId);
            }
        } else {
            alert('Unable to cancel purchase: Customer ID not found. Please log in again.');
        }
    }

    function onCard() {
        setIsSelected(!isSelected);
    }

    function getImageUrl(): string {
        const id = couponId;
        return coupon.image || `https://picsum.photos/200/300?random=coupon${id}`;
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    function renderCustomerButtons() {
        if (isPurchased) {
            return (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCancelBuy();
                    }}
                    className="remove-btn"
                >
                    Cancel Purchase
                </button>
            );
        } else {
            return (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleBuy();
                    }}
                    className="update-btn"
                >
                    Buy
                </button>
            );
        }
    }

    function renderCompanyButtons() {
        return (
            <div className="card-actions">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(couponId);
                    }}
                    className="remove-btn"
                >
                    Delete
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(couponId);
                    }}
                    className="update-btn"
                >
                    Update
                </button>
            </div>
        );
    }

    function renderActionButtons() {
        switch (userRole) {
            case ROLES.CUSTOMER:
                return (
                    <div className="card-actions">
                        {renderCustomerButtons()}
                    </div>
                );
            case ROLES.COMPANY:
                return renderCompanyButtons();
            case ROLES.ADMIN:
                return null; // No buttons for admin
            default:
                return null;
        }
    }

    function renderCouponContent() {
        
        return (
            <div className="card-content">
                <h2 className="card-title">{coupon.title}</h2>
                
                {/* Show company name prominently for customers */}
                {userRole === ROLES.CUSTOMER && (
                    <div className="company-badge">
                        <span className="company-name">by {coupon.company.name}</span>
                    </div>
                )}
                
                <div className="card-details">
                    <p className="card-description">
                        <strong>Description:</strong> {coupon.description}
                    </p>
                    <p className="card-info">
                        <strong>Category:</strong> {coupon.category}
                    </p>
                    
                    {/* Show company name for admin and company roles */}
                    {userRole !== ROLES.CUSTOMER && (
                        <p className="card-info">
                            <strong>Company:</strong> {coupon.company.name}
                        </p>
                    )}
                    
                    <p className="card-info">
                        <strong>Amount Available:</strong> {coupon.amount}
                    </p>
                    <p className="card-info">
                        <strong>Price:</strong> <span className="price-highlight">${coupon.price}</span>
                    </p>
                    <p className="card-info">
                        <strong>Valid From:</strong> {formatDate(coupon.startDate)}
                    </p>
                    <p className="card-info">
                        <strong>Valid Until:</strong> {formatDate(coupon.endDate)}
                    </p>
                    {isPurchased && userRole === ROLES.CUSTOMER && (
                        <p className="card-info purchased-indicator">
                            <strong>Status:</strong> <span style={{color: 'green'}}>Purchased</span>
                        </p>
                    )}
                </div>
                {renderActionButtons()}
            </div>
        );
    }

    return (
        <div onClick={onCard} className={`EntityCard coupon-card`}>
            <div className={isSelected ? 'card border' : 'card'}>
                <img 
                    src={getImageUrl()} 
                    alt="coupon image" 
                    className="card-image" 
                />
                {renderCouponContent()}
            </div>
        </div>
    );
}

export default CouponCard;