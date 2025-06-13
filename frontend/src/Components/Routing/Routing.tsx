import { JSX } from "react";
import Login from "../Auth/Login";
import { Route, Routes } from "react-router-dom";
import RoutingGuard from "./RoutingGuard";
import AddNew from "../Forms/AddNew";
import ShowAll from "../Layout/ShowAll";
import UpdateCompany from "../Forms/UpdateCompany";
import UpdateCustomer from "../Forms/UpdateCustomer";
import AddNewCoupon from "../Forms/AddNewCoupon";
import UpdateCoupon from "../Forms/UpdateCoupon";


function Routing(): JSX.Element {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/show-all" element={<ShowAll />} />

                <Route path="/add-new" element={<RoutingGuard child={<AddNew /> } requiredRole="ADMIN" />}/>
                <Route path="/company/:id" element={<RoutingGuard child={<UpdateCompany />} requiredRole="ADMIN" />}/>
                <Route path="/customer/:id" element={<RoutingGuard child={<UpdateCustomer />} requiredRole="ADMIN" />}/>
                <Route path="/company/:id" element={<RoutingGuard child={<UpdateCompany />} requiredRole="ADMIN" />}/>

                <Route path="/add-coupon" element={<RoutingGuard child={<AddNewCoupon />} requiredRole="COMPANY" />}/>
                <Route path="/coupon/:id" element={<RoutingGuard child={<AddNewCoupon />} requiredRole="COMPANY" />}/>

            </Routes>
        </div>
    )
}

export default Routing;