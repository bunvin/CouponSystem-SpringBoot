import { JSX, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Coupon from "../../Models/Coupon";
import companyService from "../../Services/CompanyService";
import { authStore } from "../../State/AuthState";
import { CATEGORIES } from "../../Components/Constants";

interface CouponFormData {
    category: "FOOD" | "ELECTRICITY" | "RESTAURANT" | "VACATION";
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    amount: number;
    price: number;
    image: string;
}

function AddNewCoupon(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const couponForm = useForm<CouponFormData>();
    
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [currentCompanyId, setCurrentCompanyId] = useState<number | null>(null);
    const [currentCompanyName, setCurrentCompanyName] = useState<string | null>(null);

    // Convert enum to array with proper typing
    const categories = Object.keys(CATEGORIES)
        .filter(key => isNaN(Number(key))) // Filter out numeric keys
        .map(category => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
        }));

    // Get today's date in YYYY-MM-DD format
    function getTodayDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    useEffect(() => {
        getCurrentCompany();
        if (id) {
            setIsEditMode(true);
            loadCoupon(parseInt(id));
        } else {
            // Set default start date to today for new coupons
            couponForm.setValue("startDate", getTodayDate());
        }
    }, [id]);

    function getCurrentCompany(): void {
        try {
            // Get company ID from auth state
            const authState = authStore.getState();
            if (authState.user && authState.user.companyId && authState.user.companyName) {
                setCurrentCompanyId(authState.user.companyId);
                setCurrentCompanyName(authState.user.companyName);
            } else {
                setError("User not authenticated or no company information available");
            }
        } catch (error) {
            console.error("Error getting current company:", error);
            setError("Error getting company information");
        }
    }

    async function loadCoupon(couponId: number): Promise<void> {
        try {
            setLoading(true);
            const coupon = await companyService.getSingleCoupon(couponId);
            if (coupon) {
                couponForm.reset({
                    category: coupon.category as unknown as "FOOD" | "ELECTRICITY" | "RESTAURANT" | "VACATION",
                    title: coupon.title,
                    description: coupon.description,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                    amount: coupon.amount,
                    price: coupon.price,
                    image: coupon.image
                });
            }
        } catch (error) {
            console.error("Error loading coupon:", error);
            setError("Error loading coupon data");
        } finally {
            setLoading(false);
        }
    }

    async function submitCoupon(formData: CouponFormData): Promise<void> {
        try {
            setError("");
            setSuccess("");
            
            // Add debugging
            console.log("=== Submitting Coupon ===");
            console.log("Form data:", formData);
            console.log("Selected category:", formData.category);
            
            const authState = authStore.getState();
            if (!authState.user || !authState.token) {
                setError("Please log in to continue");
                return;
            }
            
            if (!currentCompanyId) {
                setError("Company information not available");
                return;
            }
            
            // Create coupon data with proper typing
            const couponData: any = {
                ...formData,
                company: { id: currentCompanyId }
            };
            
            console.log("Coupon data being sent:", couponData);

            let response;
            if (isEditMode && id) {
                await companyService.updateCoupon(parseInt(id), couponData);
                setSuccess("Coupon updated successfully!");
            } else {
                response = await companyService.addCoupon(couponData);
                if (response) {
                    setSuccess("New coupon added successfully!");
                    couponForm.reset({
                        category: "FOOD",
                        title: "",
                        description: "",
                        startDate: getTodayDate(), // Reset to today's date
                        endDate: "",
                        amount: 0,
                        price: 0,
                        image: ""
                    });
                }
            }
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'adding'} coupon:`, error);
            setError(`Error ${isEditMode ? 'updating' : 'adding'} coupon. Please try again.`);
        }
    }

    function handleCancel(): void {
        navigate('/show-all'); // Adjust navigation path as needed
    }

    if (loading) {
        return <div className="loading">Loading coupon data...</div>;
    }

    return (
        <div className="coupon-form-container">
            <div className="coupon-form">
                <h2>{isEditMode ? 'Update Coupon by '+currentCompanyName : 'Add New Coupon to '+currentCompanyName}</h2>
                <form onSubmit={couponForm.handleSubmit(submitCoupon)} className="my-form">
                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            {...couponForm.register("category", {
                                required: { value: true, message: "Category is required" }
                            })}
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                        {couponForm.formState.errors.category && (
                            <span className="error-message">{couponForm.formState.errors.category.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            {...couponForm.register("title", {
                                required: { value: true, message: "Title is required" },
                                maxLength: { value: 100, message: "Title cannot exceed 100 characters" }
                            })}
                        />
                        {couponForm.formState.errors.title && (
                            <span className="error-message">{couponForm.formState.errors.title.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            {...couponForm.register("description", {
                                required: { value: true, message: "Description is required" },
                                maxLength: { value: 500, message: "Description cannot exceed 500 characters" }
                            })}
                            rows={4}
                        />
                        {couponForm.formState.errors.description && (
                            <span className="error-message">{couponForm.formState.errors.description.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="start-date">Start Date:</label>
                        <input
                            type="date"
                            id="start-date"
                            {...couponForm.register("startDate", {
                                required: { value: true, message: "Start date is required" }
                            })}
                        />
                        {couponForm.formState.errors.startDate && (
                            <span className="error-message">{couponForm.formState.errors.startDate.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="end-date">Expiration Date:</label>
                        <input
                            type="date"
                            id="end-date"
                            {...couponForm.register("endDate", {
                                required: { value: true, message: "Expiration date is required" },
                                validate: (value) => {
                                    const startDate = couponForm.getValues("startDate");
                                    if (startDate && value && new Date(value) <= new Date(startDate)) {
                                        return "Expiration date must be after start date";
                                    }
                                    return true;
                                }
                            })}
                        />
                        {couponForm.formState.errors.endDate && (
                            <span className="error-message">{couponForm.formState.errors.endDate.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            {...couponForm.register("amount", {
                                required: { value: true, message: "Amount is required" },
                                min: { value: 1, message: "Amount must be at least 1" },
                                max: { value: 10000, message: "Amount cannot exceed 10,000" }
                            })}
                        />
                        {couponForm.formState.errors.amount && (
                            <span className="error-message">{couponForm.formState.errors.amount.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price:</label>
                        <input
                            type="number"
                            step="0.01"
                            id="price"
                            {...couponForm.register("price", {
                                required: { value: true, message: "Price is required" },
                                min: { value: 0.01, message: "Price must be greater than 0" },
                                max: { value: 99999.99, message: "Price cannot exceed 99,999.99" }
                            })}
                        />
                        {couponForm.formState.errors.price && (
                            <span className="error-message">{couponForm.formState.errors.price.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Image URL:</label>
                        <input
                            type="url"
                            id="image"
                            {...couponForm.register("image", {
                                pattern: {
                                    value: /^https?:\/\/.+/,
                                    message: "Please enter a valid URL"
                                }
                            })}
                        />
                        {couponForm.formState.errors.image && (
                            <span className="error-message">{couponForm.formState.errors.image.message}</span>
                        )}
                    </div>

                    <div className="form-buttons">
                        <button type="submit" disabled={couponForm.formState.isSubmitting}>
                            {couponForm.formState.isSubmitting 
                                ? (isEditMode ? "Updating Coupon..." : "Adding Coupon...") 
                                : (isEditMode ? "Update Coupon" : "Add Coupon")
                            }
                        </button>
                        <button type="button" onClick={handleCancel} className="cancel-button">
                            Cancel
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
        </div>
    );
}

export default AddNewCoupon;