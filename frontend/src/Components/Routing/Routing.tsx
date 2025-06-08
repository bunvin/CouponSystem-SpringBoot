import { JSX } from "react";
import Login from "../Auth/Login";
import { Route, Routes } from "react-router-dom";
import RoutingGuard from "./RoutingGuard";
import AddNew from "../Forms/AddNew";
import ShowAll from "../Layout/ShowAll";


function Routing(): JSX.Element {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/addNew" element={<RoutingGuard child={<AddNew /> } requiredRole="ADMIN" />}/>
                <Route path="/show-all" element={<RoutingGuard child={<ShowAll /> } requiredRole="ADMIN" />}/>
                {/* <Route path="/customer-details" element={<RoutingGuard child={<CustomerForm />} requiredRole="ADMIN" />}/> */}
            </Routes>
        </div>
    )
}

export default Routing;