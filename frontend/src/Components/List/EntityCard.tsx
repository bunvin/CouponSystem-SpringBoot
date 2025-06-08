import { useNavigate } from 'react-router-dom';
import { JSX, useState } from 'react';
import { ROLES } from '../Constants';
import Company from '../../Models/Company';
import Customer from '../../Models/Customer';
import './EntityCard.css';
import adminService from '../../Services/AdminService';

type EntityData = Company | Customer;
type EntityType = 'company' | 'customer';

interface EntityCardProps {
    entity: EntityData;
    type: EntityType;
    onDelete: (id: number) => void;
}

function EntityCard({ entity, type, onDelete }: EntityCardProps): JSX.Element {
    const navigate = useNavigate();
    // Simple boolean state for selection
    const [isSelected, setIsSelected] = useState<boolean>(false);

    function getId(item: EntityData): number {
        return item.id || 0;
    }

    function renderCompanyCard(company: Company) {
        return (
            <div className="card-content">
                <h2 className="card-title">{company.name}</h2>
                <div className="card-details">
                    <p className="card-description">
                        <strong>Email:</strong> {company.user.email}
                    </p>
                    <p className="card-info">
                        <strong>User Type:</strong> {company.user.userType}
                    </p>
                </div>
                <div className="card-actions">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(getId(company));
                        }}
                        className="remove-btn"
                    >
                        Remove
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdate(getId(company));
                        }}
                        className="update-btn"
                    >
                        Update
                    </button>
                </div>
            </div>
        );
    }

    function renderCustomerCard(customer: Customer) {
        return (
            <div className="card-content">
                <h2 className="card-title">{customer.firstName} {customer.lastName}</h2>
                <div className="card-details">
                    <p className="card-description">
                        <strong>Email:</strong> {customer.user.email}
                    </p>
                    <p className="card-info">
                        <strong>User Type:</strong> {customer.user.userType}
                    </p>
                    <p className="card-info">
                        <strong>Customer ID:</strong> {customer.id}
                    </p>
                </div>
                <div className="card-actions">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(getId(customer));
                        }}
                        className="remove-btn"
                    >
                        Remove
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdate(getId(customer));
                        }}
                        className="update-btn"
                    >
                        Update
                    </button>
                </div>
            </div>
        );
    }

    function renderCardContent(): JSX.Element {
        switch (type) {
            case 'company':
                return renderCompanyCard(entity as Company);
            case 'customer':
                return renderCustomerCard(entity as Customer);
            default:
                return <div>Unknown entity type</div>;
        }
    }

    async function onRemove(id: number): Promise<void> {
        const entityName = type;
        const isRemove: boolean = window.confirm(`Are you sure you want to remove this ${entityName}?`);
        if (isRemove) {
            switch(type) {
                case 'company':
                    await adminService.deleteCompany(id);
                    break;
                case 'customer':
                    await adminService.deleteCustomer(id);
            }
            onDelete(id);
        }
    }

    async function onUpdate(id: number): Promise<void> {
        navigate(`/${type}/${id}`);
    }

    // Fixed onCard function - simply toggles the selection state
    function onCard(): void {
        setIsSelected(!isSelected);
    }

    function getImageUrl(): string {
        const id = getId(entity);
        switch (type) {
            case 'company':
                return `https://picsum.photos/200/300?random=company${id}`;
            case 'customer':
                return `https://picsum.photos/200/300?random=customer${id}`;
            default:
                return `https://picsum.photos/200/300?random=${id}`;
        }
    }

    return (
        <div onClick={onCard} className={`EntityCard ${type}-card`}>
            <div className={isSelected ? 'card border' : 'card'}>
                <img 
                    src={getImageUrl()} 
                    alt={`${type} image`} 
                    className="card-image" 
                />
                {renderCardContent()}
            </div>
        </div>
    );
}

export default EntityCard;