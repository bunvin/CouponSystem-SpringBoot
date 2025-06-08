import { JSX } from "react";
import { NavLink } from "react-router-dom";

function AdminMenu(): JSX.Element {
return <div>
    <NavLink to = "/add-new">Add-New </NavLink>
    <NavLink to = "/show-all">Show all : company & customer & coupon </NavLink>

</div>;
}

export default AdminMenu;