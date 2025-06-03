import React from "react";
import Login from "../Auth/Login";
import { JSX } from "react/jsx-runtime";


function Layout(): JSX.Element {
    return (
        <div className='Layout'>
            <header>
            </header>
            <div className='content'>
                <menu>
                </menu>
                <main>
                  <Login />
                </main>
            </div>
            <footer>

            </footer>
        </div>
    );
}

export default Layout;