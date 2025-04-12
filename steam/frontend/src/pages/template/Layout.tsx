import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
            <Header></Header>
            <div className="min-h-screen">
                <Outlet/>
            </div>
            <Footer></Footer>
        </section>
    );
}

export default Layout;