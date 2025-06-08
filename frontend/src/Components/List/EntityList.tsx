import { JSX, useEffect, useState } from "react";
import EntityCard from "./EntityCard";
import Company from "../../Models/Company";
import Customer from "../../Models/Customer";
import adminService from "../../Services/AdminService";

interface EntityListProps {
    entityType: 'companies' | 'customers';
    title?: string;
}

type EntityData = Company | Customer;

function EntityList({ entityType, title }: EntityListProps): JSX.Element {
    const [entities, setEntities] = useState<EntityData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEntities();
    }, [entityType]);

    const fetchEntities = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let data: EntityData[] = [];
            
            switch (entityType) {
                case 'companies':
                    data = await adminService.getAllCompanies();
                    break;
                case 'customers':
                    data = await adminService.getAllCustomers();
                    break;
                default:
                    throw new Error(`Unknown entity type: ${entityType}`);
            }
            
            setEntities(data);
        } catch (err) {
            console.error(`Error fetching ${entityType}:`, err);
            setError(`Failed to load ${entityType}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        // Remove the deleted entity from the local state
        setEntities(prevEntities => prevEntities.filter((entity: any) => entity.id !== id));
    };

    const handleRefresh = () => {
        fetchEntities();
    };

    if (loading) {
        return (
            <div className="entity-list">
                <div className="loading">Loading {entityType}...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="entity-list">
                <div className="error">
                    {error}
                    <button onClick={handleRefresh} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="entity-list">
            <div className="entity-list-header">
                <h2>{title || `${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`}</h2>
                <button onClick={handleRefresh} className="refresh-button">
                    Refresh
                </button>
            </div>
            
            {entities.length === 0 ? (
                <div className="empty-state">
                    No {entityType} found.
                </div>
            ) : (
                <div className="entity-grid">
                    {entities.map((entity: any) => (
                        <EntityCard
                            key={entity.id}
                            entity={entity}
                            type={entityType === 'companies' ? 'company' : 'customer'}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default EntityList;