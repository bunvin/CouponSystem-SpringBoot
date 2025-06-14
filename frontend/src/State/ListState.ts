import { createStore } from "redux";
import Company from "../Models/Company";
import Customer from "../Models/Customer";
import Coupon from "../Models/Coupon";

export interface CompanyFilters {
    name?: string;
    email?: string;
}

export interface CustomerFilters {
    name?: string;
    email?: string;
}

export interface CouponFilters {
    category?: string;
    maxPrice?: number;
    minPrice?: number;
    companyName?: string;
    startDate?: string;
    endDate?: string;
}

export class ListState {
    companies: {
        all: Company[];
        filtered: Company[];
        loading: boolean;
        error: string | null;
        filters: CompanyFilters;
    };
    customers: {
        all: Customer[];
        filtered: Customer[];
        loading: boolean;
        error: string | null;
        filters: CustomerFilters;
    };
    coupons: {
        all: Coupon[];
        filtered: Coupon[];
        loading: boolean;
        error: string | null;
        filters: CouponFilters;
    };

    constructor() {
        this.companies = {
            all: [],
            filtered: [],
            loading: false,
            error: null,
            filters: {}
        };
        this.customers = {
            all: [],
            filtered: [],
            loading: false,
            error: null,
            filters: {}
        };
        this.coupons = {
            all: [],
            filtered: [],
            loading: false,
            error: null,
            filters: {}
        };
    }
}

export enum ListActionType {
    // Companies
    SET_COMPANIES_LOADING = "SET_COMPANIES_LOADING",
    SET_COMPANIES_SUCCESS = "SET_COMPANIES_SUCCESS",
    SET_COMPANIES_ERROR = "SET_COMPANIES_ERROR",
    SET_COMPANIES_FILTERS = "SET_COMPANIES_FILTERS",
    FILTER_COMPANIES = "FILTER_COMPANIES",
    
    // Customers
    SET_CUSTOMERS_LOADING = "SET_CUSTOMERS_LOADING",
    SET_CUSTOMERS_SUCCESS = "SET_CUSTOMERS_SUCCESS",
    SET_CUSTOMERS_ERROR = "SET_CUSTOMERS_ERROR",
    SET_CUSTOMERS_FILTERS = "SET_CUSTOMERS_FILTERS",
    FILTER_CUSTOMERS = "FILTER_CUSTOMERS",
    
    // Coupons
    SET_COUPONS_LOADING = "SET_COUPONS_LOADING",
    SET_COUPONS_SUCCESS = "SET_COUPONS_SUCCESS",
    SET_COUPONS_ERROR = "SET_COUPONS_ERROR",
    SET_COUPONS_FILTERS = "SET_COUPONS_FILTERS",
    FILTER_COUPONS = "FILTER_COUPONS",
    
    // Clear actions
    CLEAR_ALL_FILTERS = "CLEAR_ALL_FILTERS",
    RESET_ALL_LISTS = "RESET_ALL_LISTS"
}

export interface ListAction {
    type: ListActionType;
    payload?: any;
}

// Helper functions for filtering
function filterCompanies(companies: Company[], filters: CompanyFilters): Company[] {
    return companies.filter(company => {
        if (filters.name && !company.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }
        if (filters.email && !company.user.email.toLowerCase().includes(filters.email.toLowerCase())) {
            return false;
        }
        return true;
    });
}

function filterCustomers(customers: Customer[], filters: CustomerFilters): Customer[] {
    return customers.filter(customer => {
        if (filters.name) {
            const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
            if (!fullName.includes(filters.name.toLowerCase())) {
                return false;
            }
        }
        if (filters.email && !customer.user.email.toLowerCase().includes(filters.email.toLowerCase())) {
            return false;
        }
        return true;
    });
}

function filterCoupons(coupons: Coupon[], filters: CouponFilters): Coupon[] {
    
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

// function filterCoupons(coupons: Coupon[], filters: CouponFilters): Coupon[] {
//     console.log('=== FILTERING COUPONS ===');
//     console.log('Input coupons:', coupons);
//     console.log('Filters to apply:', filters);

//     return coupons.filter(coupon => {
//         if (filters.category) {
//             // Convert filters.category (string) to the CATEGORIES enum type if necessary
//             const categoryEnum = (coupon.category.constructor as any)[filters.category as keyof typeof coupon.category.constructor];
//             if (coupon.category !== categoryEnum) {
//                 return false;
//             }
//         }
//         if (filters.maxPrice && coupon.price > filters.maxPrice) {
//             return false;
//         }
//         if (filters.minPrice && coupon.price < filters.minPrice) {
//             return false;
//         }
//         if (filters.companyName && coupon.company && 
//             !coupon.company.name.toLowerCase().includes(filters.companyName.toLowerCase())) {
//             return false;
//         }
//         if (filters.startDate && new Date(coupon.startDate) < new Date(filters.startDate)) {
//             return false;
//         }
//         if (filters.endDate && new Date(coupon.endDate) > new Date(filters.endDate)) {
//             return false;
//         }
//         return true;
//     });
// }

export function listReducer(listState: ListState = new ListState(), action: ListAction): ListState {
    const newState: ListState = { ...listState };

    switch (action.type) {
        // Companies
        case ListActionType.SET_COMPANIES_LOADING:
            newState.companies = {
                ...listState.companies,
                loading: action.payload,
                error: action.payload ? null : listState.companies.error
            };
            break;

        case ListActionType.SET_COMPANIES_SUCCESS:
            newState.companies = {
                ...listState.companies,
                all: action.payload,
                filtered: filterCompanies(action.payload, listState.companies.filters),
                loading: false,
                error: null
            };
            break;

        case ListActionType.SET_COMPANIES_ERROR:
            newState.companies = {
                ...listState.companies,
                loading: false,
                error: action.payload
            };
            break;

        case ListActionType.SET_COMPANIES_FILTERS:
            newState.companies = {
                ...listState.companies,
                filters: { ...listState.companies.filters, ...action.payload },
                filtered: filterCompanies(listState.companies.all, { ...listState.companies.filters, ...action.payload })
            };
            break;

        case ListActionType.FILTER_COMPANIES:
            newState.companies = {
                ...listState.companies,
                filtered: filterCompanies(listState.companies.all, listState.companies.filters)
            };
            break;

        // Customers
        case ListActionType.SET_CUSTOMERS_LOADING:
            newState.customers = {
                ...listState.customers,
                loading: action.payload,
                error: action.payload ? null : listState.customers.error
            };
            break;

        case ListActionType.SET_CUSTOMERS_SUCCESS:
            newState.customers = {
                ...listState.customers,
                all: action.payload,
                filtered: filterCustomers(action.payload, listState.customers.filters),
                loading: false,
                error: null
            };
            break;

        case ListActionType.SET_CUSTOMERS_ERROR:
            newState.customers = {
                ...listState.customers,
                loading: false,
                error: action.payload
            };
            break;

        case ListActionType.SET_CUSTOMERS_FILTERS:
            newState.customers = {
                ...listState.customers,
                filters: { ...listState.customers.filters, ...action.payload },
                filtered: filterCustomers(listState.customers.all, { ...listState.customers.filters, ...action.payload })
            };
            break;

        case ListActionType.FILTER_CUSTOMERS:
            newState.customers = {
                ...listState.customers,
                filtered: filterCustomers(listState.customers.all, listState.customers.filters)
            };
            break;

        // Coupons
        case ListActionType.SET_COUPONS_LOADING:
            newState.coupons = {
                ...listState.coupons,
                loading: action.payload,
                error: action.payload ? null : listState.coupons.error
            };
            break;

        case ListActionType.SET_COUPONS_SUCCESS:
            newState.coupons = {
                ...listState.coupons,
                all: action.payload,
                // Initially show all data, filters will be applied separately
                filtered: action.payload,
                loading: false,
                error: null
            };
            break;

        case ListActionType.SET_COUPONS_ERROR:
            newState.coupons = {
                ...listState.coupons,
                loading: false,
                error: action.payload
            };
            break;

        case ListActionType.SET_COUPONS_FILTERS:
            newState.coupons = {
                ...listState.coupons,
                filters: { ...listState.coupons.filters, ...action.payload },
                // Apply filters to the full 'all' list, not the current filtered list
                filtered: filterCoupons(listState.coupons.all, { ...listState.coupons.filters, ...action.payload })
            };
            break;

        case ListActionType.FILTER_COUPONS:
            newState.coupons = {
                ...listState.coupons,
                filtered: filterCoupons(listState.coupons.all, listState.coupons.filters)
            };
            break;

        // Clear actions
        case ListActionType.CLEAR_ALL_FILTERS:
            newState.companies = {
                ...listState.companies,
                filters: {},
                filtered: listState.companies.all // Direct copy, no filtering
            };
            newState.customers = {
                ...listState.customers,
                filters: {},
                filtered: listState.customers.all // Direct copy, no filtering
            };
            newState.coupons = {
                ...listState.coupons,
                filters: {},
                filtered: listState.coupons.all // Direct copy, no filtering
            };
            break;
    }

    return newState;
}

export const listStore = createStore(listReducer);