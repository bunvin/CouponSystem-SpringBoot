import axios from "axios";
import appConfig from "../Config/AppConfig";
import Company from "../Models/Company";
import Customer from "../Models/Customer";
import Coupon from "../Models/Coupon";

class AdminService {

    address = appConfig.apiAddress + '/admin';

    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    public async getAllCompanies(): Promise<Company[]> {
        const response = await axios.get<Company[]>(this.address+'/companies' 
        );
        return response.data;
    }

    public async addCompany(company: Company): Promise<Company> {
        console.log("company: ",company);
        console.log(JSON.stringify(company))

        const response = await axios.post<Company>(this.address + '/companies', company 
        );
        return response.data;
    } 

    public async updateCompany(company: Company, id:number): Promise<void> {
        const response = await axios.post<Company>(this.address+'/companies/'+id, company 
        );
        console.log(response.data);
    } 


    public async getCompanyById(id:number): Promise<Company> {
        const response = await axios.get<Company>(this.address+'/companies/'+id 
        );
        return response.data;
    }

    public async deleteCompany(id:number): Promise<void> {
        const response = await axios.delete<void>(this.address+'/companies/'+id 
        );
        return response.data;
    }

    //CUSTOMER
    public async addCustomer(customer: Customer): Promise<Customer> {
        const response = await axios.post<Customer>(this.address + '/customers', customer 
        );
        return response.data;
    } 

    public async updateCustomer(customer: Customer, id:number): Promise<void> {
        const response = await axios.post<Customer>(this.address+'/customers/'+id, customer 
        );
        console.log(response.data);
    } 

    public async getAllCustomers(): Promise<Customer[]> {
        const response = await axios.get<Customer[]>(this.address+'/customers' 
        );
        return response.data;
    }

    public async getCustomerById(id:number): Promise<Customer> {
        const response = await axios.get<Customer>(this.address+'/customers/'+id 
        );
        return response.data;
    }

    public async deleteCustomer(id:number): Promise<void> {
        const response = await axios.delete<void>(this.address+'/customers/'+id 
        );
        return response.data;
    }

    //COUPONS
    public async getAllCoupons(): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons' 
        );
        return response.data;
    }

}

const adminService = new AdminService();
export default adminService;

