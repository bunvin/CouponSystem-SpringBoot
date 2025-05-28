import { JSX } from "react";
import Login from "../Auth/Login";


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