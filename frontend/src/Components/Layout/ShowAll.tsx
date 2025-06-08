import { JSX } from "react";
import EntityList from "../List/EntityList";
import CouponList from "../List/CouponList";



function ShowAll():JSX.Element{
    return <div>
        <EntityList entityType="companies" title="Company Management" />
        <EntityList entityType="customers" title="Customer Management" />
        <CouponList title="Available Coupons" />

    </div>

}

export default ShowAll;


// // For Customer
// <CouponCard 
//     coupon={coupon} 
//     userRole={ROLES.CUSTOMER} 
//     onBuy={handleBuyCoupon}
//     onCancelBuy={handleCancelPurchase}
//     isPurchased={false}
// />

// // For Company
// <CouponCard 
//     coupon={coupon} 
//     userRole={ROLES.COMPANY} 
//     onDelete={handleDeleteCoupon}
// />

// // For Admin (view-only)
// <CouponCard 
//     coupon={coupon} 
//     userRole={ROLES.ADMIN}
// />