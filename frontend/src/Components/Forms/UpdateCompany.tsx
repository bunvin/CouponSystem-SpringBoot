// UpdateCompany.tsx
import { JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { ROLES } from '../Constants';
import Company from "../../Models/Company";
import adminService from "../../Services/AdminService";

function UpdateCompany(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const companyForm = useForm<Company>();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [changePassword, setChangePassword] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            fetchCompanyData();
        }
    }, [id]);

    async function fetchCompanyData() {
        try {
            setLoading(true);
            setError("");
            
            const companyId = parseInt(id!);
            const company = await adminService.getCompanyById(companyId);
            companyForm.reset(company);
            
        } catch (err: any) {
            console.error("Error fetching company:", err);
            setError(err.message || "Failed to load company data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function submitCompany(company: Company) {
        try {
            const companyId = parseInt(id!);
            
            // If password change is not requested, send empty string
            if (!changePassword) {
                company.user.password = "";
            }
            
            await adminService.updateCompany(company, companyId);
            setSuccess("Company updated successfully!");
            setTimeout(() => {
                setSuccess("");
                navigate('/show-all');
            }, 2000);
        } catch (error: any) {
            console.error("Error updating company:", error);
            setError(error.message || "Failed to update company data. Please try again.");
        }
    }

    function renderLoadingState() {
        return <div className="loading">Loading company data...</div>;
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

    function renderCompanyForm() {
        return (
            <div className="update-form-container">
                <h2>Update Company</h2>
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
                        <label>
                            <input
                                type="checkbox"
                                checked={changePassword}
                                onChange={(e) => {
                                    setChangePassword(e.target.checked);
                                    if (!e.target.checked) {
                                        // Clear password field when unchecked
                                        companyForm.setValue("user.password", "");
                                        companyForm.clearErrors("user.password");
                                    } else {
                                        // Clear password field when checked to ensure it's empty
                                        companyForm.setValue("user.password", "");
                                    }
                                }}
                            />
                            Change Password
                        </label>
                    </div>

                    {changePassword && (
                        <div className="form-group">
                            <label htmlFor="company-password">New Password:</label>
                            <input
                                type="password"
                                id="company-password"
                                defaultValue=""
                                {...companyForm.register("user.password", {
                                    required: changePassword ? { value: true, message: "New password is required" } : false,
                                    minLength: changePassword ? { value: 5, message: "Password must be at least 5 characters" } : undefined
                                })}
                            />
                            {companyForm.formState.errors.user?.password && (
                                <span className="error-message">{companyForm.formState.errors.user.password.message}</span>
                            )}
                        </div>
                    )}

                    <input
                        type="hidden"
                        {...companyForm.register("user.userType")}
                        value={ROLES.COMPANY}
                    />

                    <div className="form-actions" style={{ textAlign: 'center' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={companyForm.formState.isSubmitting}
                            className="update-button"
                        >
                            {companyForm.formState.isSubmitting ? "Updating..." : "Update Company"}
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
        
        return renderCompanyForm();
    }

    return (
        <div className="update-entity-container">
            {getMainContent()}
        </div>
    );
}

export default UpdateCompany;