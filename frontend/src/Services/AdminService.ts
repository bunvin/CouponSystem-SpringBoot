import axios, { AxiosError } from "axios";
import appConfig from "../Config/AppConfig";
import Company from "../Models/Company";
import Customer from "../Models/Customer";
import Coupon from "../Models/Coupon";
import BackendErrorResponse from "../Models/BackendErrorResponse";

class AdminService {

    address = appConfig.apiAddress + '/admin';

    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        
        // Check if token exists
        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }
        
        // Check if token is expired (basic check)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp < currentTime) {
                localStorage.removeItem('token'); // Clear expired token
                throw new Error('Session expired. Please login again.');
            }
        } catch (e) {
            // If token parsing fails, it's invalid
            localStorage.removeItem('token');
            throw new Error('Invalid token. Please login again.');
        }
        
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Helper method to handle errors consistently
    private handleError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<BackendErrorResponse>;
            
            // Check for your custom backend error format first
            if (axiosError.response?.data?.message && axiosError.response?.data?.code) {
                throw new Error(axiosError.response.data.message);
            }
            // Fallback to other possible error formats
            if (axiosError.response?.data?.message) {
                throw new Error(axiosError.response.data.message);
            }
            // Check if the response data itself is a string
            if (typeof axiosError.response?.data === 'string') {
                throw new Error(axiosError.response.data);
            }
            
            // If there's a response status, provide a meaningful message
            if (axiosError.response?.status) {
                switch (axiosError.response.status) {
                    case 401:
                        localStorage.removeItem('token');
                        throw new Error('Unauthorized access. Please login again.');
                    case 404:
                        throw new Error('Resource not found.');
                    case 500:
                        throw new Error('Internal server error. Please try again later.');
                    default:
                        throw new Error(`Server error: ${axiosError.response.status}`);
                }
            }
            
            // Network error or no response
            if (axiosError.message) {
                throw new Error(`Network error: ${axiosError.message}`);
            }
        }
        
        // Unknown error type
        throw new Error('An unexpected error occurred');
    }

    public async getAllCompanies(): Promise<Company[]> {
        try {
            const response = await axios.get<Company[]>(this.address + '/companies', {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async addCompany(company: Company): Promise<Company> {
        try {
            console.log("company: ", company);
            console.log(JSON.stringify(company));

            const response = await axios.post<Company>(this.address + '/companies', company, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async updateCompany(company: Company, companyId: number): Promise<void> {
        try {
            const response = await axios.post<Company>(this.address + '/companies/' + companyId, company, {
                headers: this.getAuthHeaders()
            });
            console.log(response.data);
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getCompanyById(id: number): Promise<Company> {
        try {
            const response = await axios.get<Company>(this.address + '/companies/' + id, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async deleteCompany(id: number): Promise<void> {
        try {
            const response = await axios.delete<void>(this.address + '/companies/' + id, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    //CUSTOMER
    public async addCustomer(customer: Customer): Promise<Customer> {
        try {
            const response = await axios.post<Customer>(this.address + '/customers', customer, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async updateCustomer(customer: Customer, id: number): Promise<void> {
        try {
            const response = await axios.post<Customer>(this.address + '/customers/' + id, customer, {
                headers: this.getAuthHeaders()
            });
            console.log(response.data);
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getAllCustomers(): Promise<Customer[]> {
        try {
            const response = await axios.get<Customer[]>(this.address + '/customers', {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async getCustomerById(id: number): Promise<Customer> {
        try {
            const response = await axios.get<Customer>(this.address + '/customers/' + id, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async deleteCustomer(id: number): Promise<void> {
        try {
            const response = await axios.delete<void>(this.address + '/customers/' + id, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    //COUPONS
    public async getAllCoupons(): Promise<Coupon[]> {
        try {
            const response = await axios.get<Coupon[]>(this.address + '/coupons', {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }
}

const adminService = new AdminService();
export default adminService;