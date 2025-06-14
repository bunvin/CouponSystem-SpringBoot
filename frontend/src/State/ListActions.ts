// ListActions.ts - Action creators and hooks for list management
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListActionType, ListState, CompanyFilters, CustomerFilters, CouponFilters, listStore } from './ListState';
import { AuthState } from './AuthState';
import adminService from '../Services/AdminService';
import companyService from '../Services/CompanyService';
import customerService from '../Services/CustomerService';
import { ROLES } from '../Components/Constants';
import Coupon from '../Models/Coupon';

// Action creators
export const listActions = {
    // Companies
    setCompaniesLoading: (loading: boolean) => ({
        type: ListActionType.SET_COMPANIES_LOADING,
        payload: loading
    }),

    setCompaniesSuccess: (companies: any[]) => ({
        type: ListActionType.SET_COMPANIES_SUCCESS,
        payload: companies
    }),

    setCompaniesError: (error: string) => ({
        type: ListActionType.SET_COMPANIES_ERROR,
        payload: error
    }),

    setCompaniesFilters: (filters: CompanyFilters) => ({
        type: ListActionType.SET_COMPANIES_FILTERS,
        payload: filters
    }),

    // Customers
    setCustomersLoading: (loading: boolean) => ({
        type: ListActionType.SET_CUSTOMERS_LOADING,
        payload: loading
    }),

    setCustomersSuccess: (customers: any[]) => ({
        type: ListActionType.SET_CUSTOMERS_SUCCESS,
        payload: customers
    }),

    setCustomersError: (error: string) => ({
        type: ListActionType.SET_CUSTOMERS_ERROR,
        payload: error
    }),

    setCustomersFilters: (filters: CustomerFilters) => ({
        type: ListActionType.SET_CUSTOMERS_FILTERS,
        payload: filters
    }),

    // Coupons
    setCouponsLoading: (loading: boolean) => ({
        type: ListActionType.SET_COUPONS_LOADING,
        payload: loading
    }),

    setCouponsSuccess: (coupons: Coupon[]) => ({
        type: ListActionType.SET_COUPONS_SUCCESS,
        payload: coupons
    }),

    setCouponsError: (error: string) => ({
        type: ListActionType.SET_COUPONS_ERROR,
        payload: error
    }),

    setCouponsFilters: (filters: CouponFilters) => ({
        type: ListActionType.SET_COUPONS_FILTERS,
        payload: filters
    }),

    // Clear actions
    clearAllFilters: () => ({
        type: ListActionType.CLEAR_ALL_FILTERS
    }),

    resetAllLists: () => ({
        type: ListActionType.RESET_ALL_LISTS
    })
};

// Custom hooks for easier usage
export const useListState = () => {
    return useSelector((state: ListState) => state);
};

export const useListActions = () => {
    const dispatch = listStore.dispatch;
    const user = useSelector((state: AuthState) => state.user);

    const loadCompanies = async (filters?: CompanyFilters) => {
        try {
            dispatch(listActions.setCompaniesLoading(true));
            const companies = await adminService.getAllCompanies();
            dispatch(listActions.setCompaniesSuccess(companies));
            
            if (filters) {
                dispatch(listActions.setCompaniesFilters(filters));
            }
        } catch (error: any) {
            dispatch(listActions.setCompaniesError(error.message || 'Failed to load companies'));
        }
    };

    const loadCustomers = async (filters?: CustomerFilters) => {
        try {
            dispatch(listActions.setCustomersLoading(true));
            const customers = await adminService.getAllCustomers();
            dispatch(listActions.setCustomersSuccess(customers));
            
            if (filters) {
                dispatch(listActions.setCustomersFilters(filters));
            }
        } catch (error: any) {
            dispatch(listActions.setCustomersError(error.message || 'Failed to load customers'));
        }
    };

    const loadCoupons = async () => {
        try {
            dispatch(listActions.setCouponsLoading(true));
            let coupons: Coupon[] = [];

            // Always fetch ALL coupons (no server-side filtering)
            switch (user?.userType) {
                case ROLES.ADMIN:
                    coupons = await adminService.getAllCoupons();
                    break;
                    
                case ROLES.COMPANY:
                    // Always get ALL company coupons
                    coupons = await companyService.getAllCompanyCoupons();
                    break;
                    
                case ROLES.CUSTOMER:
                    // Always get ALL available coupons
                    coupons = await customerService.getAllCoupons();
                    break;
                    
                default:
                    coupons = [];
            }

            // Store the full list - filtering will be done client-side
            dispatch(listActions.setCouponsSuccess(coupons));
            
        } catch (error: any) {
            dispatch(listActions.setCouponsError(error.message || 'Failed to load coupons'));
        }
    };


    const filterCompanies = (filters: CompanyFilters) => {
        dispatch(listActions.setCompaniesFilters(filters));
    };

    const filterCustomers = (filters: CustomerFilters) => {
        dispatch(listActions.setCustomersFilters(filters));
    };

    const filterCoupons = (filters: CouponFilters) => {
        dispatch(listActions.setCouponsFilters(filters));
    };

    const clearAllFilters = () => {
        dispatch(listActions.clearAllFilters());
    };

    const resetAllLists = () => {
        dispatch(listActions.resetAllLists());
    };

    return {
        loadCompanies,
        loadCustomers,
        loadCoupons,      
        filterCompanies, 
        filterCustomers,   
        filterCoupons,  
        clearAllFilters,  
        resetAllLists
    };
};

// Hooks that work with the separate listStore
export const useListDispatch = () => {
    return listStore.dispatch;
};

export const useListSelector = <T>(selector: (state: ListState) => T): T => {
    // Custom implementation for the separate store with subscription
    const [state, setState] = React.useState(listStore.getState());
    
    React.useEffect(() => {
        const unsubscribe = listStore.subscribe(() => {
            setState(listStore.getState());
        });
        return unsubscribe;
    }, []);
    
    return selector(state);
};

// Selector hooks for specific data using the separate store
export const useCompaniesState = () => {
    return useListSelector((state: ListState) => state.companies);
};

export const useCustomersState = () => {
    return useListSelector((state: ListState) => state.customers);
};

export const useCouponsState = () => {
    return useListSelector((state: ListState) => state.coupons);
};

// Hook for getting filtered results count
export const useFilteredCounts = () => {
    const listState = useListSelector((state: ListState) => state);
    
    return {
        companiesCount: listState.companies.filtered.length,
        customersCount: listState.customers.filtered.length,
        couponsCount: listState.coupons.filtered.length,
        totalCompaniesCount: listState.companies.all.length,
        totalCustomersCount: listState.customers.all.length,
        totalCouponsCount: listState.coupons.all.length
    };
};

// Hook for checking if any filters are active
export const useActiveFilters = () => {
    const listState = useListSelector((state: ListState) => state);
    
    const hasCompanyFilters = Object.values(listState.companies.filters).some(v => v !== undefined && v !== '');
    const hasCustomerFilters = Object.values(listState.customers.filters).some(v => v !== undefined && v !== '');
    const hasCouponFilters = Object.values(listState.coupons.filters).some(v => v !== undefined && v !== '');
    
    return {
        hasCompanyFilters,
        hasCustomerFilters,
        hasCouponFilters,
        hasAnyFilters: hasCompanyFilters || hasCustomerFilters || hasCouponFilters
    };
};