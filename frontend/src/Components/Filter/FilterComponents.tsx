import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ListState, ListActionType, CompanyFilters, CustomerFilters, CouponFilters, listStore } from '../../State/ListState';
import { AuthState } from '../../State/AuthState';
import { ROLES, CATEGORIES } from '../Constants';

interface FilterComponentProps {
    entityType: 'companies' | 'customers' | 'coupons';
    onApplyServerFilter?: (filters: any) => void; // For server-side filtering
}

const FilterComponent: React.FC<FilterComponentProps> = ({ entityType, onApplyServerFilter }) => {
    // Use separate stores
    const [listState, setListState] = useState<ListState>(listStore.getState());
    const userRole = useSelector((state: AuthState) => state.user?.userType);
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [localFilters, setLocalFilters] = useState<any>({});

    // Get current filters from state
    const currentFilters = listState[entityType].filters;

    // Subscribe to list store changes
    useEffect(() => {
        const unsubscribe = listStore.subscribe(() => {
            setListState(listStore.getState());
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters]);

    const handleInputChange = (field: string, value: string | number) => {
        setLocalFilters((prev: any) => ({
            ...prev,
            [field]: value === '' ? undefined : value
        }));
    };

    const applyFilters = () => {
        // Clean up empty values
        const cleanFilters = Object.fromEntries(
            Object.entries(localFilters).filter(([_, value]) => value !== undefined && value !== '')
        );

        // Update Redux state for client-side filtering
        listStore.dispatch({
            type: getSetFiltersActionType(entityType),
            payload: cleanFilters
        });

        // Call server-side filtering if provided
        if (onApplyServerFilter) {
            onApplyServerFilter(cleanFilters);
        }
    };

    const clearFilters = () => {
        setLocalFilters({});
        
        listStore.dispatch({
            type: ListActionType.CLEAR_ALL_FILTERS
        });
    };

    const getSetFiltersActionType = (type: string) => {
        switch (type) {
            case 'companies':
                return ListActionType.SET_COMPANIES_FILTERS;
            case 'customers':
                return ListActionType.SET_CUSTOMERS_FILTERS;
            case 'coupons':
                return ListActionType.SET_COUPONS_FILTERS;
            default:
                return ListActionType.SET_COUPONS_FILTERS;
        }
    };

    const renderCompanyFilters = () => (
        <div className="filter-fields">
            <div className="filter-field">
                <label htmlFor="company-name">Company Name:</label>
                <input
                    id="company-name"
                    type="text"
                    placeholder="Search by company name..."
                    value={localFilters.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                />
            </div>
            <div className="filter-field">
                <label htmlFor="company-email">Email:</label>
                <input
                    id="company-email"
                    type="email"
                    placeholder="Search by email..."
                    value={localFilters.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                />
            </div>
        </div>
    );

    const renderCustomerFilters = () => (
        <div className="filter-fields">
            <div className="filter-field">
                <label htmlFor="customer-name">Customer Name:</label>
                <input
                    id="customer-name"
                    type="text"
                    placeholder="Search by first or last name..."
                    value={localFilters.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                />
            </div>
            <div className="filter-field">
                <label htmlFor="customer-email">Email:</label>
                <input
                    id="customer-email"
                    type="email"
                    placeholder="Search by email..."
                    value={localFilters.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                />
            </div>
        </div>
    );

    const renderCouponFilters = () => (
        <div className="filter-fields">
            <div className="filter-row">
                <div className="filter-field">
                    <label htmlFor="coupon-category">Category:</label>
                    <select
                        id="coupon-category"
                        value={localFilters.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value={CATEGORIES.FOOD}>Food</option>
                        <option value={CATEGORIES.ELECTRICITY}>Electricity</option>
                        <option value={CATEGORIES.RESTAURANT}>Restaurant</option>
                        <option value={CATEGORIES.VACATION}>Vacation</option>
                    </select>
                </div>
                
                <div className="filter-field">
                    <label htmlFor="min-price">Min Price:</label>
                    <input
                        id="min-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={localFilters.minPrice || ''}
                        onChange={(e) => handleInputChange('minPrice', parseFloat(e.target.value))}
                    />
                </div>
                
                <div className="filter-field">
                    <label htmlFor="max-price">Max Price:</label>
                    <input
                        id="max-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="999.99"
                        value={localFilters.maxPrice || ''}
                        onChange={(e) => handleInputChange('maxPrice', parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {userRole === ROLES.ADMIN && (
                <div className="filter-row">
                    <div className="filter-field">
                        <label htmlFor="company-name-filter">Company:</label>
                        <input
                            id="company-name-filter"
                            type="text"
                            placeholder="Search by company name..."
                            value={localFilters.companyName || ''}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div className="filter-row">
                <div className="filter-field">
                    <label htmlFor="start-date">Start Date (from):</label>
                    <input
                        id="start-date"
                        type="date"
                        value={localFilters.startDate || ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                </div>
                
                <div className="filter-field">
                    <label htmlFor="end-date">End Date (until):</label>
                    <input
                        id="end-date"
                        type="date"
                        value={localFilters.endDate || ''}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const getEntityLabel = () => {
        switch (entityType) {
            case 'companies':
                return 'Companies';
            case 'customers':
                return 'Customers';
            case 'coupons':
                return 'Coupons';
            default:
                return 'Items';
        }
    };

    const hasActiveFilters = Object.values(currentFilters).some(value => value !== undefined && value !== '');

    return (
        <div className={`filter-component ${isExpanded ? 'expanded' : ''}`}>
            <div className="filter-header">
                <button
                    className="filter-toggle"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <span className="filter-icon">🔍</span>
                    Filter {getEntityLabel()}
                    {hasActiveFilters && <span className="active-indicator">●</span>}
                    <span className={`arrow ${isExpanded ? 'up' : 'down'}`}>▼</span>
                </button>
                
                {hasActiveFilters && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Clear All
                    </button>
                )}
            </div>

            {isExpanded && (
                <div className="filter-content">
                    {entityType === 'companies' && renderCompanyFilters()}
                    {entityType === 'customers' && renderCustomerFilters()}
                    {entityType === 'coupons' && renderCouponFilters()}
                    
                    <div className="filter-actions">
                        <button className="apply-filters-btn" onClick={applyFilters}>
                            Apply Filters
                        </button>
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterComponent;