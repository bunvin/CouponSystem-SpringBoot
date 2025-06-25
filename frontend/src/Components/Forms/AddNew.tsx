import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { ROLES } from '../Constants'
import Company from "../../Models/Company";
import Customer from "../../Models/Customer";
import adminService from "../../Services/AdminService";


function AddNew(): JSX.Element {
    const companyForm = useForm<Company>();
    const customerForm = useForm<Customer>();
    
    const [companySuccess, setCompanySuccess] = useState<string>("");
    const [customerSuccess, setCustomerSuccess] = useState<string>("");

    async function submitCompany(company: Company): Promise<void> {
        try {
            const response = await adminService.addCompany(company);
            if (response) {
                setCompanySuccess("New company added successfully!");
                companyForm.reset({
                    name: "",
                    user: {
                        email: "",
                        password: "",
                        userType: ROLES.COMPANY
                    }
                });
                // Clear success message after 3 seconds
                setTimeout(() => setCompanySuccess(""), 3000);
            }
        } catch (error) {
            console.error("Error adding company:", error);
            setCompanySuccess("Error adding company. Please try again.");
        }
    }

    async function submitCustomer(customer: Customer): Promise<void> {
        try {
            const response = await adminService.addCustomer(customer);
            if (response) {
                setCustomerSuccess("New customer added successfully!");
                customerForm.reset({                    
                    firstName: "",
                    lastName: "",
                    user: {
                        email: "",
                        password: "",
                        userType: ROLES.CUSTOMER
                    }
                });
                setTimeout(() => setCustomerSuccess(""), 3000);
            }
        } catch (error) {
            console.error("Error adding customer:", error);
            setCustomerSuccess("Error adding customer. Please try again.");
        }
    }

    return (
        <div className="dual-forms-container">
            <div className="company-form">
                <h2>Add New Company</h2>
                <form onSubmit={companyForm.handleSubmit(submitCompany)} className="my-form">
                    <div className="form-group">
                        <label htmlFor="company-name">Company Name:</label>
                        <input
                            type="text"
                            id="company-name"
                            {...companyForm.register("name", {
                                required: { value: true, message: "Company name is required" }
                            })}
                        />
                        {companyForm.formState.errors.name && (
                            <span className="error-message">{companyForm.formState.errors.name.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="company-email">Email:</label>
                        <input
                            type="email"
                            id="company-email"
                            {...companyForm.register("user.email", {
                                required: { value: true, message: "Email is required" },
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {companyForm.formState.errors.user?.email && (
                            <span className="error-message">{companyForm.formState.errors.user.email.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="company-password">Password:</label>
                        <input
                            type="password"
                            id="company-password"
                            {...companyForm.register("user.password", {
                                required: { value: true, message: "Password is required" },
                                minLength: { value: 5, message: "Password must be at least 5 characters" }
                            })}
                        />
                        {companyForm.formState.errors.user?.password && (
                            <span className="error-message">{companyForm.formState.errors.user.password.message}</span>
                        )}
                    </div>

                    <input
                        type="hidden"
                        {...companyForm.register("user.userType")}
                        value={ROLES.COMPANY}
                    />
                    <div style={{ textAlign: 'center' }}>
                    <button type="submit" disabled={companyForm.formState.isSubmitting}>
                        {companyForm.formState.isSubmitting ? "Adding Company..." : "Add Company"}
                    </button>
                    </div>
                    
                    {companySuccess && (
                        <div className="success-message">{companySuccess}</div>
                    )}
                </form>
            </div>

            <div className="customer-form">
                <h2>Add New Customer</h2>
                <form onSubmit={customerForm.handleSubmit(submitCustomer)} className="my-form">
                    <div className="form-group">
                        <label htmlFor="customer-first-name">First Name:</label>
                        <input
                            type="text"
                            id="customer-first-name"
                            {...customerForm.register("firstName", {
                                required: { value: true, message: "First name is required" }
                            })}
                        />
                        {customerForm.formState.errors.firstName && (
                            <span className="error-message">{customerForm.formState.errors.firstName.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="customer-last-name">Last Name:</label>
                        <input
                            type="text"
                            id="customer-last-name"
                            {...customerForm.register("lastName", {
                                required: { value: true, message: "Last name is required" }
                            })}
                        />
                        {customerForm.formState.errors.lastName && (
                            <span className="error-message">{customerForm.formState.errors.lastName.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="customer-email">Email:</label>
                        <input
                            type="email"
                            id="customer-email"
                            {...customerForm.register("user.email", {
                                required: { value: true, message: "Email is required" },
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {customerForm.formState.errors.user?.email && (
                            <span className="error-message">{customerForm.formState.errors.user.email.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="customer-password">Password:</label>
                        <input
                            type="password"
                            id="customer-password"
                            {...customerForm.register("user.password", {
                                required: { value: true, message: "Password is required" },
                                minLength: { value: 5, message: "Password must be at least 5 characters" }
                            })}
                        />
                        {customerForm.formState.errors.user?.password && (
                            <span className="error-message">{customerForm.formState.errors.user.password.message}</span>
                        )}
                    </div>

                    <input
                        type="hidden"
                        {...customerForm.register("user.userType")}
                        value={ROLES.CUSTOMER} 
                    />
                    <div style={{ textAlign: 'center' }}>
                    <button type="submit" disabled={customerForm.formState.isSubmitting}>
                        {customerForm.formState.isSubmitting ? "Adding Customer..." : "Add Customer"}
                    </button>
                    </div>
                    
                    {customerSuccess && (
                        <div className="success-message">{customerSuccess}</div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AddNew;