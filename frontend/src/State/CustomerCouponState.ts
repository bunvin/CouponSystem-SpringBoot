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

    static filterCoupons(coupons: Coupon[], filters: CouponFilters): Coupon[] {
        return coupons.filter(coupon => {
            if (filters.category && coupon.category !== filters.category) {
                return false;
            }
            if (filters.maxPrice && coupon.price > filters.maxPrice) {
                return false;
            }
            if (filters.minPrice && coupon.price < filters.minPrice) {
                return false;
            }
            if (filters.companyName && coupon.company && 
                !coupon.company.name.toLowerCase().includes(filters.companyName.toLowerCase())) {
                return false;
            }
            if (filters.startDate && new Date(coupon.startDate) < new Date(filters.startDate)) {
                return false;
            }
            if (filters.endDate && new Date(coupon.endDate) > new Date(filters.endDate)) {
                return false;
            }
            return true;
        });
    }

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

    static clearFilters(
        state: CustomerCouponState,
        section?: 'available' | 'purchased'
    ): CustomerCouponState {
        if (section) {
            return {
                ...state,
                [section]: {
                    ...state[section],
                    filters: {},
                    filtered: state[section].all
                }
            };
        } else {
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

    static setLoading(
        state: CustomerCouponState,
        section: 'available' | 'purchased',
        loading: boolean
    ): CustomerCouponState {
        return CustomerCouponStateManager.updateSection(state, section, { 
            loading, 
            error: loading ? null : state[section].error 
        });
    }

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

    static hasFilters(state: CustomerCouponState, section?: 'available' | 'purchased'): boolean {
        if (section) {
            return Object.values(state[section].filters).some(v => v !== undefined && v !== '');
        }
        return CustomerCouponStateManager.hasFilters(state, 'available') || 
               CustomerCouponStateManager.hasFilters(state, 'purchased');
    }
}