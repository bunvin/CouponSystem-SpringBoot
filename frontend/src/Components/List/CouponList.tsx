import { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CouponCard from "./CouponCard";
import Coupon from "../../Models/Coupon";
import adminService from "../../Services/AdminService";
import { AuthState } from "../../State/AuthState";
import { ROLES } from "../Constants";

interface CouponListProps {
    title?: string;
}

function CouponList({ title }: CouponListProps): JSX.Element {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get user role from AuthState
    const userRole = useSelector((state: AuthState) => state.user?.userType || ROLES.ADMIN);

    useEffect(() => {
        fetchCoupons();
    }, []);

    async function fetchCoupons() {
        try {
            setLoading(true);
            setError(null);
            
            const data = await adminService.getAllCoupons();
            setCoupons(data);
        } catch (err) {
            console.error("Error fetching coupons:", err);
            setError("Failed to load coupons. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleDelete(id: number) {
        // Remove the deleted coupon from the local state
        setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon.id !== id));
    }

    function handleBuy(id: number) {
        // TODO: Implement buy coupon logic
        console.log(`Buy coupon with id: ${id}`);
        // You can add API call here to purchase the coupon
        // After successful purchase, you might want to update the coupon status
    }

    function handleCancelBuy(id: number) {
        // TODO: Implement cancel buy coupon logic
        console.log(`Cancel buy coupon with id: ${id}`);
        // You can add API call here to cancel the coupon purchase
        // After successful cancellation, you might want to update the coupon status
    }

    function handleRefresh() {
        fetchCoupons();
    }

    function checkIfPurchased(couponId: number): boolean {
        // TODO: Implement logic to check if current user purchased this coupon
        // This would typically involve checking against user's purchased coupons
        // For now, returning false as placeholder
        return false;
    }

    function renderLoadingState() {
        return (
            <div className="entity-list">
                <div className="loading">Loading coupons...</div>
            </div>
        );
    }

    function renderErrorState() {
        return (
            <div className="entity-list">
                <div className="error">
                    {error}
                    <button onClick={handleRefresh} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    function renderEmptyState() {
        return (
            <div className="empty-state">
                No coupons found.
            </div>
        );
    }

    function renderCouponGrid() {
        return (
            <div className="entity-grid">
                {coupons.map((coupon) => (
                    <CouponCard
                        key={coupon.id}
                        coupon={coupon}
                        userRole={userRole}
                        onDelete={handleDelete}
                        onBuy={handleBuy}
                        onCancelBuy={handleCancelBuy}
                        isPurchased={checkIfPurchased(coupon.id || 0)}
                    />
                ))}
            </div>
        );
    }

    function renderMainContent() {
        if (loading) {
            return renderLoadingState();
        }

        if (error) {
            return renderErrorState();
        }

        return (
            <div className="entity-list">
                <div className="entity-list-header">
                    <h2>{title || "Coupons"}</h2>
                    <button onClick={handleRefresh} className="refresh-button">
                        Refresh
                    </button>
                </div>
                
                {coupons.length === 0 ? renderEmptyState() : renderCouponGrid()}
            </div>
        );
    }

    return renderMainContent();
}

export default CouponList;