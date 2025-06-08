import { JSX } from "react";
import EntityList from "../List/EntityList";



function ShowAll():JSX.Element{
    return <div>
        <EntityList entityType="companies" title="Company Management" />
        <EntityList entityType="customers" title="Customer Management" />

    </div>

}

export default ShowAll;