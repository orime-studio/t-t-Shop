import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ChabadHeader from "../routes/BeitHabad/ChabadHeader";
import NavChabad from "../routes/BeitHabad/NavBarChabad";

const BeitChabadLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
{/*         <ChabadHeader/>
 */}        <NavChabad />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default BeitChabadLayout;
