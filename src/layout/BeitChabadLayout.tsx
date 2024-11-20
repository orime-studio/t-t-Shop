import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const BeitChabadLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default BeitChabadLayout;
