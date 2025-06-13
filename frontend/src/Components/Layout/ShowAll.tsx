import React, { useState, useEffect } from 'react';
import adminService from "../../Services/AdminService";
import companyService from "../../Services/CompanyService";
import customerService from "../../Services/CustomerService";
import { ROLES } from "../../Components/Constants"; 
import Company from "../../Models/Company";
import Customer from "../../Models/Customer";
import Coupon from "../../Models/Coupon";
import User from "../../Models/User";

const ShowAll = () => {
    const [user, setUser] = useState<User | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Get user object from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            try {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);
                loadData(parsedUser);
            } catch (err) {
                setError('Invalid user data in storage');
                setLoading(false);
            }
        } else {
            setError('User not logged in');
            setLoading(false);
        }
    }, []);

    const loadData = async (user: User) => {
        try {
            setLoading(true);
            setError('');

            switch (user.userType) {
                case ROLES.ADMIN:
                    await loadAdminData();
                    break;
                case ROLES.COMPANY:
                    await loadCompanyData();
                    break;
                case ROLES.CUSTOMER:
                    await loadCustomerData();
                    break;
                default:
                    setError('Unknown user type');
            }
        } catch (err: any) {
            console.error('Error loading data:', err);
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadAdminData = async () => {
        const [companiesData, customersData, couponsData] = await Promise.all([
            adminService.getAllCompanies(),
            adminService.getAllCustomers(),
            adminService.getAllCoupons()
        ]);
        setCompanies(companiesData);
        setCustomers(customersData);
        setCoupons(couponsData);
    };

    const loadCompanyData = async () => {
        try {
            const couponsData = await companyService.getAllCompanyCoupons();
            setCoupons(couponsData);
        } catch (err) {
            console.error('Error loading company coupons:', err);
            setCoupons([]);
        }
    };

    const loadCustomerData = async () => {
        try {
            const couponsData = await customerService.getAllCoupons();
            setCoupons(couponsData);
        } catch (err) {
            console.error('Error loading available coupons:', err);
            setCoupons([]);
        }
    };

    const handleEdit = (type: string, id: number) => {
        window.location.href = `/${type}/${id}`;
    };

    const handleDelete = async (type: string, id: number) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                switch (type) {
                    case 'company':
                        await adminService.deleteCompany(id);
                        break;
                    case 'customer':
                        await adminService.deleteCustomer(id);
                        break;
                }
                // Reload data after deletion
                if (user) loadData(user);
            } catch (err: any) {
                setError(err.message || `Failed to delete ${type}`);
            }
        }
    };

    const handleDeleteCoupon = async (couponId: number) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                if (user?.userType === ROLES.ADMIN) {
                    // Admin deleting any coupon - you might need an admin method
                    // await adminService.deleteCoupon(couponId);
                    console.log('Admin deleting coupon:', couponId);
                } else {
                    // Company deleting their own coupon
                    await companyService.deleteCoupon(couponId);
                }
                // Reload data after deletion
                if (user) loadData(user);
            } catch (err: any) {
                setError(err.message || 'Failed to delete coupon');
            }
        }
    };

    const handlePurchase = async (couponId: number) => {
        try {
            await customerService.addCouponPurchase(couponId);
            alert('Coupon purchased successfully!');
            // Optionally reload data to update available amounts
            if (user) loadData(user);
        } catch (err: any) {
            setError(err.message || 'Failed to purchase coupon');
        }
    };

    const renderAdminView = () => (
        <div className="admin-dashboard">
            <h1>Admin Dashboard - Show All</h1>
            
            <section className="admin-section">
                <h2>Companies ({companies.length})</h2>
                <div className="cards-grid">
                    {companies.map((company: Company) => (
                        <div key={company.id} className="entity-card company-card">
                            <h3>{company.name}</h3>
                            <p><strong>Email:</strong> {company.user.email}</p>
                            <p><strong>ID:</strong> {company.id}</p>
                            <div className="card-actions">
                                <button onClick={() => handleEdit('company', company.id!)} className="edit-btn">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete('company', company.id!)} className="delete-btn">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="admin-section">
                <h2>Customers ({customers.length})</h2>
                <div className="cards-grid">
                    {customers.map((customer: Customer) => (
                        <div key={customer.id} className="entity-card customer-card">
                            <h3>{customer.firstName} {customer.lastName}</h3>
                            <p><strong>Email:</strong> {customer.user.email}</p>
                            <p><strong>ID:</strong> {customer.id}</p>
                            <div className="card-actions">
                                <button onClick={() => handleEdit('customer', customer.id!)} className="edit-btn">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete('customer', customer.id!)} className="delete-btn">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="admin-section">
                <h2>All Coupons ({coupons.length})</h2>
                <div className="cards-grid">
                    {coupons.map((coupon: Coupon) => renderCouponCard(coupon, 'admin'))}
                </div>
            </section>
        </div>
    );

    const renderCompanyView = () => (
        <div className="company-dashboard">
            <div className="header-section">
                <h1>My Coupons</h1>
                <button 
                    onClick={() => window.location.href = '/add-coupon'} 
                    className="add-coupon-btn"
                >
                    Add New Coupon
                </button>
            </div>
            
            <div className="coupons-section">
                <h2>Your Company's Coupons ({coupons.length})</h2>
                <div className="cards-grid">
                    {coupons.length > 0 ? (
                        coupons.map((coupon: Coupon) => renderCouponCard(coupon, 'company'))
                    ) : (
                        <div className="empty-state">
                            <p>No coupons found. Create your first coupon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderCustomerView = () => (
        <div className="customer-dashboard">
            <div className="header-section">
                <h1>Available Coupons</h1>
                <div className="filter-controls">
                    <button 
                        onClick={() => user && loadData(user)}
                        className="refresh-btn"
                    >
                        Refresh
                    </button>
                </div>
            </div>
            
            <div className="coupons-section">
                <h2>Browse All Coupons ({coupons.length})</h2>
                <div className="cards-grid">
                    {coupons.length > 0 ? (
                        coupons.map((coupon: Coupon) => renderCouponCard(coupon, 'customer'))
                    ) : (
                        <div className="empty-state">
                            <p>No coupons available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderCouponCard = (coupon: Coupon, viewType: string) => (
        <div key={coupon.id} className="entity-card coupon-card">
            <div className="coupon-image">
                {coupon.image ? (
                    <img 
                        src={coupon.image} 
                        alt={coupon.title}
                    />
                ) : (
                    <div>No Image</div>
                )}
            </div>
            <div className="coupon-content">
                <h3>{coupon.title}</h3>
                <p className="coupon-description">{coupon.description}</p>
                <div className="coupon-details">
                    <p><strong>Category:</strong> {coupon.category}</p>
                    <p><strong>Price:</strong> <span className="price-highlight">${coupon.price}</span></p>
                    <p><strong>Amount Available:</strong> {coupon.amount}</p>
                    <p><strong>Start Date:</strong> {new Date(coupon.startDate).toLocaleDateString()}</p>
                    <p><strong>Expires:</strong> {new Date(coupon.endDate).toLocaleDateString()}</p>
                    {viewType !== 'customer' && coupon.company && (
                        <p><strong>Company:</strong> {coupon.company.name}</p>
                    )}
                </div>
                <div className="card-actions">
                    {viewType === 'admin' && (
                        <>
                            <button 
                                onClick={() => handleEdit('coupon', coupon.id!)} 
                                className="edit-btn"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteCoupon(coupon.id!)} 
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </>
                    )}
                    {viewType === 'company' && (
                        <>
                            <button 
                                onClick={() => handleEdit('coupon', coupon.id!)} 
                                className="edit-btn"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteCoupon(coupon.id!)} 
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </>
                    )}
                    {viewType === 'customer' && (
                        <button 
                            onClick={() => handlePurchase(coupon.id!)} 
                            className="purchase-btn"
                        >
                            Purchase
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={() => window.location.href = '/login'}>
                    Go to Login
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="error-container">
                <div className="error-message">No user data found</div>
                <button onClick={() => window.location.href = '/login'}>
                    Go to Login
                </button>
            </div>
        );
    }

    // Render based on user type
    switch (user.userType) {
        case ROLES.ADMIN:
            return renderAdminView();
        case ROLES.COMPANY:
            return renderCompanyView();
        case ROLES.CUSTOMER:
            return renderCustomerView();
        default:
            return <div>Unknown user type</div>;
    }
};

export default ShowAll;