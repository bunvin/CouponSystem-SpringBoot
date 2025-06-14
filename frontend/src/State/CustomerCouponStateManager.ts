import Coupon from "../Models/Coupon";

export interface CouponFilters {
    category?: string;
    maxPrice?: number;
    minPrice?: number;
    companyName?: string;
    startDate?: string;
    endDate?: string;
}

export interface CouponSection {
    all: Coupon[];
    filtered: Coupon[];
    loading: boolean;
    error: string | null;
    filters: CouponFilters;
}

export interface CustomerCouponState {
    available: CouponSection;
    purchased: CouponSection;
}

export class CustomerCouponStateManager {
    /**
     * Creates the initial empty state for customer coupons
     */
    static createInitialState(): CustomerCouponState {
        return {
            available: {
                all: [],
                filtered: [],
                loading: false,
                error: null,
                filters: {}
            },
            purchased: {
                all: [],
                filtered: [],
                loading: false,
                error: null,
                filters: {}
            }
        };
    }

    /**
     * Applies filters to an array of coupons
     */
    static filterCoupons(coupons: Coupon[], filters: CouponFilters): Coupon[] {
        return coupons.filter(coupon => {
            // Category filter
            if (filters.category && coupon.category !== filters.category) {
                return false;
            }
            
            // Price range filters
            if (filters.maxPrice && coupon.price > filters.maxPrice) {
                return false;
            }
            if (filters.minPrice && coupon.price < filters.minPrice) {
                return false;
            }
            
            // Company name filter
            if (filters.companyName && coupon.company && 
                !coupon.company.name.toLowerCase().includes(filters.companyName.toLowerCase())) {
                return false;
            }
            
            // Date range filters
            if (filters.startDate && new Date(coupon.startDate) < new Date(filters.startDate)) {
                return false;
            }
            if (filters.endDate && new Date(coupon.endDate) > new Date(filters.endDate)) {
                return false;
            }
            
            return true;
        });
    }

    /**
     * Helper method to update a specific section of the state
     */
    static updateSection(
        state: CustomerCouponState, 
        section: 'available' | 'purchased', 
        updates: Partial<CouponSection>
    ): CustomerCouponState {
        return {
            ...state,
            [section]: {
                ...state[section],
                ...updates
            }
        };
    }

    /**
     * Applies new filters to a specific section and updates the filtered results
     */
    static applyFilters(
        state: CustomerCouponState,
        section: 'available' | 'purchased',
        newFilters: Partial<CouponFilters>
    ): CustomerCouponState {
        const updatedFilters = { ...state[section].filters, ...newFilters };
        const filtered = CustomerCouponStateManager.filterCoupons(state[section].all, updatedFilters);
        
        return {
            ...state,
            [section]: {
                ...state[section],
                filters: updatedFilters,
                filtered: filtered
            }
        };
    }

    /**
     * Clears filters for one section or all sections
     */
    static clearFilters(
        state: CustomerCouponState,
        section?: 'available' | 'purchased'
    ): CustomerCouponState {
        if (section) {
            // Clear filters for specific section
            return {
                ...state,
                [section]: {
                    ...state[section],
                    filters: {},
                    filtered: state[section].all // Show all items when filters are cleared
                }
            };
        } else {
            // Clear filters for both sections
            return {
                available: {
                    ...state.available,
                    filters: {},
                    filtered: state.available.all
                },
                purchased: {
                    ...state.purchased,
                    filters: {},
                    filtered: state.purchased.all
                }
            };
        }
    }

    /**
     * Sets loading state for a specific section
     */
    static setLoading(
        state: CustomerCouponState,
        section: 'available' | 'purchased',
        loading: boolean
    ): CustomerCouponState {
        return CustomerCouponStateManager.updateSection(state, section, { 
            loading, 
            error: loading ? null : state[section].error // Clear error when starting to load
        });
    }

    /**
     * Sets error state for a specific section
     */
    static setError(
        state: CustomerCouponState,
        section: 'available' | 'purchased',
        error: string
    ): CustomerCouponState {
        return CustomerCouponStateManager.updateSection(state, section, { 
            loading: false, 
            error 
        });
    }

    /**
     * Sets coupon data for a specific section and applies current filters
     */
    static setCoupons(
        state: CustomerCouponState,
        section: 'available' | 'purchased',
        coupons: Coupon[]
    ): CustomerCouponState {
        const filtered = CustomerCouponStateManager.filterCoupons(coupons, state[section].filters);
        
        return CustomerCouponStateManager.updateSection(state, section, {
            all: coupons,
            filtered: filtered,
            loading: false,
            error: null
        });
    }

    /**
     * Checks if any filters are active for a specific section or all sections
     */
    static hasFilters(state: CustomerCouponState, section?: 'available' | 'purchased'): boolean {
        if (section) {
            return Object.values(state[section].filters).some(v => v !== undefined && v !== '');
        }
        // Check if any section has filters
        return CustomerCouponStateManager.hasFilters(state, 'available') || 
               CustomerCouponStateManager.hasFilters(state, 'purchased');
    }

    /**
     * Gets filter count for a specific section
     */
    static getFilterCount(state: CustomerCouponState, section: 'available' | 'purchased'): number {
        return Object.values(state[section].filters).filter(v => v !== undefined && v !== '').length;
    }

    /**
     * Gets summary statistics for a section
     */
    static getSectionStats(state: CustomerCouponState, section: 'available' | 'purchased') {
        const sectionData = state[section];
        return {
            total: sectionData.all.length,
            filtered: sectionData.filtered.length,
            loading: sectionData.loading,
            error: sectionData.error,
            hasFilters: CustomerCouponStateManager.hasFilters(state, section),
            filterCount: CustomerCouponStateManager.getFilterCount(state, section)
        };
    }
}