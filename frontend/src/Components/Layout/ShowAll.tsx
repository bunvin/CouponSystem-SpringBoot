import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ROLES } from "../../Components/Constants";
import Company from "../../Models/Company";
import Customer from "../../Models/Customer";
import Coupon from "../../Models/Coupon";
import FilterComponent from '../Filter/FilterComponents';
import { 
    useListActions, 
    useCompaniesState, 
    useCustomersState, 
    useCouponsState,
    useFilteredCounts,
    useActiveFilters 
} from "../../State/ListActions";
import { AuthState } from "../../State/AuthState";
import adminService from "../../Services/AdminService";
import companyService from "../../Services/CompanyService";
import customerService from "../../Services/CustomerService";

const ShowAll = () => {
    const user = useSelector((state: AuthState) => state.user);
    const companiesState = useCompaniesState();
    const customersState = useCustomersState();
    const couponsState = useCouponsState();
    const filteredCounts = useFilteredCounts();
    const activeFilters = useActiveFilters();
    
    const {
        loadCompanies,
        loadCustomers,
        loadCoupons,
        filterCoupons,
        clearAllFilters
    } = useListActions();

    const [error, setError] = useState('');

    useEffect(() => {
        // Load initial data based on user role
        if (user) {
            loadInitialData();
        } else {
            setError('User not logged in');
        }
    }, [user]);

    const loadInitialData = async () => {
        try {
            setError('');
            
            switch (user?.userType) {
                case ROLES.ADMIN:
                    await Promise.all([
                        loadCompanies(),
                        loadCustomers(),
                        loadCoupons()
                    ]);
                    break;
                case ROLES.COMPANY:
                    await loadCoupons();
                    break;
                case ROLES.CUSTOMER:
                    await loadCoupons();
                    break;
                default:
                    setError('Unknown user type');
            }
        } catch (err: any) {
            console.error('Error loading initial data:', err);
            setError(err.message || 'Failed to load data');
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
                        await loadCompanies(); // Reload companies
                        break;
                    case 'customer':
                        await adminService.deleteCustomer(id);
                        await loadCustomers(); // Reload customers
                        break;
                }
            } catch (err: any) {
                setError(err.message || `Failed to delete ${type}`);
            }
        }
    };

    const handleDeleteCoupon = async (couponId: number) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                if (user?.userType === ROLES.COMPANY) {
                    await companyService.deleteCoupon(couponId);
                } else {
                    // For admin, we might need to add this to AdminService
                    // For now, try using company service
                    await companyService.deleteCoupon(couponId);
                }
                await loadCoupons(); // Reload coupons
            } catch (err: any) {
                setError(err.message || 'Failed to delete coupon');
            }
        }
    };

    const handlePurchase = async (couponId: number) => {
        try {
            await customerService.addCouponPurchase(couponId);
            alert('Coupon purchased successfully!');
            await loadCoupons(); // Reload to update available amounts
        } catch (err: any) {
            setError(err.message || 'Failed to purchase coupon');
        }
    };

    const renderAdminView = () => (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard - Show All</h1>
                {activeFilters.hasAnyFilters && (
                    <button onClick={clearAllFilters} className="clear-all-filters-btn">
                        Clear All Filters
                    </button>
                )}
            </div>
            
            <section className="admin-section">
                <div className="section-header">
                    <h2>Companies ({filteredCounts.companiesCount} of {filteredCounts.totalCompaniesCount})</h2>
                </div>
                <FilterComponent entityType="companies" />
                
                {companiesState.loading ? (
                    <div className="loading">Loading companies...</div>
                ) : companiesState.error ? (
                    <div className="error-message">{companiesState.error}</div>
                ) : (
                    <div className="cards-grid">
                        {companiesState.filtered.map((company: Company) => (
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
                )}
            </section>

            <section className="admin-section">
                <div className="section-header">
                    <h2>Customers ({filteredCounts.customersCount} of {filteredCounts.totalCustomersCount})</h2>
                </div>
                <FilterComponent entityType="customers" />
                
                {customersState.loading ? (
                    <div className="loading">Loading customers...</div>
                ) : customersState.error ? (
                    <div className="error-message">{customersState.error}</div>
                ) : (
                    <div className="cards-grid">
                        {customersState.filtered.map((customer: Customer) => (
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
                )}
            </section>

            <section className="admin-section">
                <div className="section-header">
                    <h2>All Coupons ({filteredCounts.couponsCount} of {filteredCounts.totalCouponsCount})</h2>
                </div>
                <FilterComponent entityType="coupons" />
                
                {couponsState.loading ? (
                    <div className="loading">Loading coupons...</div>
                ) : couponsState.error ? (
                    <div className="error-message">{couponsState.error}</div>
                ) : (
                    <div className="cards-grid">
                        {couponsState.filtered.map((coupon: Coupon) => renderCouponCard(coupon, 'admin'))}
                    </div>
                )}
            </section>
        </div>
    );

    const renderCompanyView = () => (
        <div className="company-dashboard">
            <div className="header-section">
                <h1>My Coupons</h1>
                <div className="header-actions">
                    <button 
                        onClick={() => window.location.href = '/add-coupon'} 
                        className="add-coupon-btn"
                    >
                        Add New Coupon
                    </button>
                    {activeFilters.hasCouponFilters && (
                        <button onClick={clearAllFilters} className="clear-filters-btn">
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>
            
            <div className="coupons-section">
                <div className="section-header">
                    <h2>Your Company's Coupons ({filteredCounts.couponsCount} of {filteredCounts.totalCouponsCount})</h2>
                </div>
                <FilterComponent entityType="coupons" />
                
                {couponsState.loading ? (
                    <div className="loading">Loading coupons...</div>
                ) : couponsState.error ? (
                    <div className="error-message">{couponsState.error}</div>
                ) : couponsState.filtered.length > 0 ? (
                    <div className="cards-grid">
                        {couponsState.filtered.map((coupon: Coupon) => renderCouponCard(coupon, 'company'))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No coupons found. {activeFilters.hasCouponFilters ? 'Try adjusting your filters or' : ''} Create your first coupon!</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCustomerView = () => (
        <div className="customer-dashboard">
            <div className="header-section">
                <h1>Available Coupons</h1>
                <div className="header-actions">
                    <button 
                        onClick={() => loadCoupons()}
                        className="refresh-btn"
                    >
                        Refresh
                    </button>
                    {activeFilters.hasCouponFilters && (
                        <button onClick={clearAllFilters} className="clear-filters-btn">
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>
            
            <div className="coupons-section">
                <div className="section-header">
                    <h2>Browse All Coupons ({filteredCounts.couponsCount} of {filteredCounts.totalCouponsCount})</h2>
                </div>
                <FilterComponent entityType="coupons" />
                
                {couponsState.loading ? (
                    <div className="loading">Loading coupons...</div>
                ) : couponsState.error ? (
                    <div className="error-message">{couponsState.error}</div>
                ) : couponsState.filtered.length > 0 ? (
                    <div className="cards-grid">
                        {couponsState.filtered.map((coupon: Coupon) => renderCouponCard(coupon, 'customer'))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No coupons available {activeFilters.hasCouponFilters ? 'matching your filters' : 'at the moment'}.</p>
                    </div>
                )}
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
                    <div className="no-image">No Image</div>
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
                            disabled={coupon.amount === 0}
                        >
                            {coupon.amount === 0 ? 'Out of Stock' : 'Purchase'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

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