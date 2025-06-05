import React from "react";
import Login from "../Auth/Login";
import { JSX } from "react/jsx-runtime";
import AdminMenu from "./AdminMenu";
import Routing from "../Routing/Routing";


function Layout(): JSX.Element {
    return (
        <div className='Layout'>
            <header>
            </header>
            <div className='content'>
                <menu>
                    <AdminMenu />
                </menu>
                <main>
                  <Routing />
                </main>
            </div>
            <footer>

            </footer>
        </div>
    );
}

export default Layout;