import { JSX } from "react";
import Login from "../Auth/Login";
import CompanyForm from "../Forms/CompanyForm";
import CustomerForm from "../Forms/CustomerForm";
import { Route, Routes } from "react-router-dom";
import RoutingGuard from "./RoutingGuard";

function Routing(): JSX.Element {
    return (
        <div>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/company-details" element={<RoutingGuard child={<CompanyForm /> } requiredRole="ADMIN" />}/>
                <Route path="/customer-details" element={<RoutingGuard child={<CustomerForm />} requiredRole="ADMIN" />}/>
            </Routes>
        </div>
    )
}