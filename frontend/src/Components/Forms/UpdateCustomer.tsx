import { JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { ROLES } from '../Constants';
import Customer from "../../Models/Customer";
import adminService from "../../Services/AdminService";

function UpdateCustomer(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const customerForm = useForm<Customer>();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [changePassword, setChangePassword] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            fetchCustomerData();
        }
    }, [id]);

    async function fetchCustomerData() {
        try {
            setLoading(true);
            setError("");
            
            const customerId = parseInt(id!);
            const customer = await adminService.getCustomerById(customerId);
            customerForm.reset(customer);
            
        } catch (err) {
            console.error("Error fetching customer:", err);
            setError("Failed to load customer data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function submitCustomer(customer: Customer) {
        try {
            const customerId = parseInt(id!);
            
            // If password change is not requested, send empty string
            if (!changePassword) {
                customer.user.password = "";
            }
            
            await adminService.updateCustomer(customer, customerId);
            setSuccess("Customer updated successfully!");
            setTimeout(() => {
                setSuccess("");
                navigate('/show-all');
            }, 2000);
        } catch (error) {
            console.error("Error updating customer:", error);
            setError("Error updating customer. Please try again.");
        }
    }

    function renderLoadingState() {
        return <div className="loading">Loading customer data...</div>;
    }

    function renderErrorState() {
        return (
            <div>
                <div className="error-message">{error}</div>
                <button onClick={() => navigate(-1)} className="back-button">
                    Go Back
                </button>
            </div>
        );
    }

    function renderCustomerForm() {
        return (
            <div className="update-form-container">
                <h2>Update Customer</h2>
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
                        <label>
                            <input
                                type="checkbox"
                                checked={changePassword}
                                onChange={(e) => {
                                    setChangePassword(e.target.checked);
                                    if (!e.target.checked) {
                                        // Clear password field when unchecked
                                        customerForm.setValue("user.password", "");
                                        customerForm.clearErrors("user.password");
                                    } else {
                                        // Clear password field when checked to ensure it's empty
                                        customerForm.setValue("user.password", "");
                                    }
                                }}
                            />
                            Change Password
                        </label>
                    </div>

                    {changePassword && (
                        <div className="form-group">
                            <label htmlFor="customer-password">New Password:</label>
                            <input
                                type="password"
                                id="customer-password"
                                defaultValue=""
                                {...customerForm.register("user.password", {
                                    required: changePassword ? { value: true, message: "New password is required" } : false,
                                    minLength: changePassword ? { value: 5, message: "Password must be at least 5 characters" } : undefined
                                })}
                            />
                            {customerForm.formState.errors.user?.password && (
                                <span className="error-message">{customerForm.formState.errors.user.password.message}</span>
                            )}
                        </div>
                    )}

                    <input
                        type="hidden"
                        {...customerForm.register("user.userType")}
                        value={ROLES.CUSTOMER}
                    />

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={customerForm.formState.isSubmitting}
                            className="update-button"
                        >
                            {customerForm.formState.isSubmitting ? "Updating..." : "Update Customer"}
                        </button>
                    </div>
                    
                    {success && (
                        <div className="success-message">{success}</div>
                    )}
                    {error && (
                        <div className="error-message">{error}</div>
                    )}
                </form>
            </div>
        );
    }

    function getMainContent() {
        if (loading) {
            return renderLoadingState();
        }
        
        if (error) {
            return renderErrorState();
        }
        
        return renderCustomerForm();
    }

    return (
        <div className="update-entity-container">
            {getMainContent()}
        </div>
    );
}

export default UpdateCustomer;