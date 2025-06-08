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
            
        } catch (err) {
            console.error("Error fetching company:", err);
            setError("Failed to load company data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function submitCompany(company: Company) {
        try {
            const companyId = parseInt(id!);
            await adminService.updateCompany(company, companyId);
            setSuccess("Company updated successfully!");
            setTimeout(() => {
                setSuccess("");
                navigate('/show-all');
            }, 2000);
        } catch (error) {
            console.error("Error updating company:", error);
            setError("Error updating company. Please try again.");
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