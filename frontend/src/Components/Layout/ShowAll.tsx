import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ROLES } from "../../Components/Constants";
import Company from "../../Models/Company";
import Customer from "../../Models/Customer";
import Coupon from "../../Models/Coupon";
import { 
    CustomerCouponState, 
    CustomerCouponStateManager,
    CouponFilters 
} from "../../State/CustomerCouponState";
import { 
    useListActions, 
    useCompaniesState, 
    useCustomersState, 
    useCouponsState
} from "../../State/ListActions";
import { AuthState } from "../../State/AuthState";
import adminService from "../../Services/AdminService";
import companyService from "../../Services/CompanyService";
import customerService from "../../Services/CustomerService";
import { jwtDecode } from 'jwt-decode';

const ShowAll = () => {
    const user = useSelector((state: AuthState) => state.user);
    const companiesState = useCompaniesState();
    const customersState = useCustomersState();
    const couponsState = useCouponsState();
    
    const {
        loadCompanies,
        loadCustomers,
        loadCoupons
    } = useListActions();

    const [error, setError] = useState('');
    
    // Use CustomerCouponState for customer view
    const [customerCoupons, setCustomerCoupons] = useState<CustomerCouponState>(
        CustomerCouponStateManager.createInitialState()
    );

    useEffect(() => {
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
                    // Load global coupons first as fallback, then load customer-specific data
                    await loadCoupons();
                    await loadCustomerCoupons();
                    break;
                default:
                    setError('Unknown user type');
            }
        } catch (err: any) {
            console.error('Error loading initial data:', err);
            setError(err.message || 'Failed to load data');
        }
    };

    function getCustomerIdFromToken(): number | null {
            const token = localStorage.getItem("token");
            if (!token) {
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

    const loadCustomerCoupons = async () => {
        try {
            // Get customer ID from user state - check both id and customerId fields
            const customerId = user?.customerId || user?.id;
            if (!customerId) {
                throw new Error('Customer ID not found');
            }
            
            // Load purchased coupons first
            setCustomerCoupons(prev => 
                CustomerCouponStateManager.setLoading(prev, 'purchased', true)
            );

            let purchasedCoupons: Coupon[] = [];
            try {
                purchasedCoupons = await customerService.getAllCustomerCoupons(customerId) || [];
                console.log('Loaded purchased coupons:', purchasedCoupons.length);
            } catch (error) {
                console.warn('Error getting purchased coupons:', error);
                purchasedCoupons = [];
            }
            
            setCustomerCoupons(prev => 
                CustomerCouponStateManager.setCoupons(prev, 'purchased', purchasedCoupons)
            );

            // Load available coupons (and filter out purchased ones)
            setCustomerCoupons(prev => 
                CustomerCouponStateManager.setLoading(prev, 'available', true)
            );

            let allCoupons: Coupon[] = [];
            try {
                allCoupons = await customerService.getAllCoupons();
                
                // If no coupons from customerService, try to get from global coupons
                if (!allCoupons || allCoupons.length === 0) {
                    allCoupons = couponsState.all || [];
                }
            } catch (error) {
                console.warn('Error getting customer coupons, trying global coupons:', error);
                allCoupons = couponsState.all || [];
            }

            // Filter out already purchased coupons from available coupons
            const purchasedCouponIds = new Set(purchasedCoupons.map(c => c.id));
            const availableCoupons = allCoupons.filter(coupon => !purchasedCouponIds.has(coupon.id));
            
            console.log('All coupons:', allCoupons.length, 'Purchased:', purchasedCoupons.length, 'Available:', availableCoupons.length);
            
            setCustomerCoupons(prev => 
                CustomerCouponStateManager.setCoupons(prev, 'available', availableCoupons)
            );

        } catch (err: any) {
            console.error('Error loading customer coupons:', err);
            setCustomerCoupons(prev => {
                let newState = CustomerCouponStateManager.setError(prev, 'available', err.message);
                return CustomerCouponStateManager.setError(newState, 'purchased', err.message);
            });
        }
    };

    const handleCustomerCouponFilter = (type: 'available' | 'purchased', filters: CouponFilters) => {
        setCustomerCoupons(prev => 
            CustomerCouponStateManager.applyFilters(prev, type, filters)
        );
    };

    const clearCustomerFilters = (type?: 'available' | 'purchased') => {
        setCustomerCoupons(prev => 
            CustomerCouponStateManager.clearFilters(prev, type)
        );
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
                        await loadCompanies();
                        break;
                    case 'customer':
                        await adminService.deleteCustomer(id);
                        await loadCustomers();
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
                }
                await loadCoupons(); // Use global state for admin/company
            } catch (err: any) {
                setError(err.message || 'Failed to delete coupon');
            }
        }
    };

    const handlePurchase = async (couponId: number) => {
        try {
            // Get customer ID from user state - check both customerId and id fields
            const customerId = user?.customerId || user?.id;
            if (!customerId) {
                throw new Error('Customer ID not found');
            }
            
            // Pass customer ID if your service requires it
            await customerService.addCouponPurchase(couponId);
            alert('Coupon purchased successfully!');
            await loadCustomerCoupons(); // Reload customer-specific lists
        } catch (err: any) {
            setError(err.message || 'Failed to purchase coupon');
        }
    };

    const handleCancelPurchase = async (couponId: number) => {
    try {
        const customerId = getCustomerIdFromToken();
        if (!customerId) {
            throw new Error('Customer ID not found in token. Please log in again.');
        }
        
        console.log("Attempting to cancel purchase for coupon:", couponId, "customer:", customerId);
        
        await customerService.deleteCouponPurchase(couponId);
        alert('Coupon purchase cancelled successfully!');
        await loadCustomerCoupons(); // Reload customer-specific lists
    } catch (err: any) {
        console.error("Cancel purchase error:", err);
        setError(err.message || 'Failed to cancel coupon purchase');
    }
};

    // Consolidated coupon card rendering function
    const renderCouponCard = (coupon: Coupon, viewType: string, isPurchased: boolean = false) => (
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
                    {coupon.company && (
                        <p><strong>Company:</strong> {coupon.company.name}</p>
                    )}
                    {isPurchased && (
                        <p><strong>Status:</strong> <span style={{color: '#28a745', fontWeight: 'bold'}}>Purchased</span></p>
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
                    {viewType === 'customer' && !isPurchased && (
                        <button 
                            onClick={() => handlePurchase(coupon.id!)} 
                            className="purchase-btn"
                            disabled={coupon.amount === 0}
                        >
                            {coupon.amount === 0 ? 'Out of Stock' : 'Purchase'}
                        </button>
                    )}
                    {viewType === 'customer' && isPurchased && (
                        <button 
                            onClick={() => handleCancelPurchase(coupon.id!)} 
                            className="delete-btn"
                        >
                            Cancel Purchase
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderAdminView = () => (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard - Show All</h1>
            </div>
            
            <section className="admin-section">
                <div className="section-header">
                    <h2>Companies ({companiesState.all.length})</h2>
                </div>
                
                {companiesState.loading ? (
                    <div className="loading">Loading companies...</div>
                ) : companiesState.error ? (
                    <div className="error-message">{companiesState.error}</div>
                ) : (
                    <div className="cards-grid">
                        {companiesState.all.map((company: Company) => (
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
                    <h2>Customers ({customersState.all.length})</h2>
                </div>
                
                {customersState.loading ? (
                    <div className="loading">Loading customers...</div>
                ) : customersState.error ? (
                    <div className="error-message">{customersState.error}</div>
                ) : (
                    <div className="cards-grid">
                        {customersState.all.map((customer: Customer) => (
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
                    <h2>All Coupons ({couponsState.all.length})</h2>
                </div>
                
                {couponsState.loading ? (
                    <div className="loading">Loading coupons...</div>
                ) : couponsState.error ? (
                    <div className="error-message">{couponsState.error}</div>
                ) : (
                    <div className="cards-grid">
                        {couponsState.all.map((coupon: Coupon) => renderCouponCard(coupon, 'admin'))}
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
                </div>
            </div>
            
            <div className="coupons-section">
                <div className="section-header">
                    <h2>Your Company's Coupons ({couponsState.all.length})</h2>
                </div>
                
                {couponsState.loading ? (
                    <div className="loading">Loading coupons...</div>
                ) : couponsState.error ? (
                    <div className="error-message">{couponsState.error}</div>
                ) : couponsState.all.length > 0 ? (
                    <div className="cards-grid">
                        {couponsState.all.map((coupon: Coupon) => renderCouponCard(coupon, 'company'))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No coupons found. Create your first coupon!</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCustomerView = () => {
        const hasAvailableFilters = CustomerCouponStateManager.hasFilters(customerCoupons, 'available');
        const hasPurchasedFilters = CustomerCouponStateManager.hasFilters(customerCoupons, 'purchased');
        const hasAnyCustomerFilters = CustomerCouponStateManager.hasFilters(customerCoupons);

        return (
            <div className="customer-dashboard">
                <div className="header-section">
                    <h1>My Coupons Dashboard</h1>
                    <div className="header-actions">
                        <button 
                            onClick={() => loadCustomerCoupons()}
                            className="refresh-btn"
                        >
                            Refresh All
                        </button>
                        {hasAnyCustomerFilters && (
                            <button onClick={() => clearCustomerFilters()} className="clear-filters-btn">
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Purchased Coupons Section */}
                <div className="coupons-section">
                    <div className="section-header">
                        <h2>My Purchased Coupons ({customerCoupons.purchased.filtered.length} of {customerCoupons.purchased.all.length})</h2>
                        {hasPurchasedFilters && (
                            <button onClick={() => clearCustomerFilters('purchased')} className="clear-filters-btn">
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Inline Filter for Purchased Coupons */}
                    <div className="customer-filter">
                        <div className="filter-row">
                            <div className="filter-field">
                                <label>Category:</label>
                                <select 
                                    value={customerCoupons.purchased.filters.category || ''} 
                                    onChange={(e) => handleCustomerCouponFilter('purchased', { category: e.target.value || undefined })}
                                >
                                    <option value="">All Categories</option>
                                    <option value="FOOD">Food</option>
                                    <option value="ELECTRICITY">Electricity</option>
                                    <option value="RESTAURANT">Restaurant</option>
                                    <option value="VACATION">Vacation</option>
                                </select>
                            </div>
                            <div className="filter-field">
                                <label>Min Price:</label>
                                <input 
                                    type="number" 
                                    value={customerCoupons.purchased.filters.minPrice || ''} 
                                    onChange={(e) => handleCustomerCouponFilter('purchased', { minPrice: e.target.value ? Number(e.target.value) : undefined })}
                                    placeholder="Min price"
                                />
                            </div>
                            <div className="filter-field">
                                <label>Max Price:</label>
                                <input 
                                    type="number" 
                                    value={customerCoupons.purchased.filters.maxPrice || ''} 
                                    onChange={(e) => handleCustomerCouponFilter('purchased', { maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                                    placeholder="Max price"
                                />
                            </div>
                            <div className="filter-field">
                                <label>Company:</label>
                                <input 
                                    type="text" 
                                    value={customerCoupons.purchased.filters.companyName || ''} 
                                    onChange={(e) => handleCustomerCouponFilter('purchased', { companyName: e.target.value || undefined })}
                                    placeholder="Company name"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {customerCoupons.purchased.loading ? (
                        <div className="loading">Loading purchased coupons...</div>
                    ) : customerCoupons.purchased.error ? (
                        <div className="error-message">{customerCoupons.purchased.error}</div>
                    ) : customerCoupons.purchased.filtered.length > 0 ? (
                        <div className="cards-grid">
                            {customerCoupons.purchased.filtered.map((coupon: Coupon) => 
                                renderCouponCard(coupon, 'customer', true)
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>
                                {hasPurchasedFilters 
                                    ? 'No purchased coupons match your filters. Try adjusting your search criteria.' 
                                    : customerCoupons.available.all.length > 0 
                                        ? 'You haven\'t purchased any coupons yet. Browse the available coupons below to get started!' 
                                        : 'You haven\'t purchased any coupons yet.'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Available Coupons Section */}
                <div className="coupons-section">
                    <div className="section-header">
                        <h2>Available Coupons ({customerCoupons.available.filtered.length} of {customerCoupons.available.all.length})</h2>
                        {hasAvailableFilters && (
                            <button onClick={() => clearCustomerFilters('available')} className="clear-filters-btn">
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Inline Filter for Available Coupons */}
                    <div className="customer-filter">
                        <div className="filter-row">
                            <div className="filter-field">
                                <label>Category:</label>
                                <select 
                                    value={customerCoupons.available.filters.category || ''} 
                                    onChange={(e) => handleCustomerCouponFilter('available', { category: e.target.value || undefined })}
                                >
                                    <option value="">All Categories</option>
                                    <option value="FOOD">Food</option>
                                    <option value="ELECTRICITY">Electricity</option>
                                    <option value="RESTAURANT">Restaurant</option>
                                    <option value="VACATION">Vacation</option>
                                </select>
                            </div>
                            <div className="filter-field">
                                <label>Min Price:</label>
                                <input 
                                    type="number" 
                                    value={customerCoupons.available.filters.minPrice || ''} 
                                    onChange={(e) => handleCustomerCouponFilter('available', { minPrice: e.target.value ? Number(e.target.value) : undefined })}
                                    placeholder="Min price"
                                />
                            </div>
                            <div className="filter-field">
                                <label>Max Price:</label>
                                <input 
                                    type="number" 
                                    value={customerCoupons.available.filters.maxPrice || ''} 
                                    onChange={(e) => handleCustomerCouponFilter('available', { maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                                    placeholder="Max price"
                                />
                            </div>
                            <div className="filter-field">
                                <label>Company:</label>
                                <input 
                                    type="text" 
                                    value={customerCoupons.available.filters.companyName || ''} 
                                    onChange={(e) => handleCustomerCouponFilter('available', { companyName: e.target.value || undefined })}
                                    placeholder="Company name"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {customerCoupons.available.loading ? (
                        <div className="loading">Loading available coupons...</div>
                    ) : customerCoupons.available.error ? (
                        <div className="error-message">{customerCoupons.available.error}</div>
                    ) : customerCoupons.available.filtered.length > 0 ? (
                        <div className="cards-grid">
                            {customerCoupons.available.filtered.map((coupon: Coupon) => 
                                renderCouponCard(coupon, 'customer', false)
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>
                                {hasAvailableFilters 
                                    ? 'No available coupons match your current filters. Try adjusting or clearing your search criteria.' 
                                    : 'No coupons are currently available. Please check back later or contact support.'
                                }
                            </p>
                            {hasAvailableFilters && (
                                <button 
                                    onClick={() => clearCustomerFilters('available')} 
                                    className="clear-filters-btn"
                                    style={{marginTop: '10px'}}
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

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