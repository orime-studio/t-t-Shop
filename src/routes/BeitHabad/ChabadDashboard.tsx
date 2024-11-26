import { Tabs } from "flowbite-react";
import { FiBox } from "react-icons/fi";
import AdminParashot from "./AdminParashot";

const ChabadDashboard = () => {
    return (
        <Tabs aria-label="Tabs with icons" className="tabs">
            <Tabs.Item active title="Manage Products" icon={FiBox}>
                <AdminParashot />
            </Tabs.Item>
        </Tabs>
    );
};

export default ChabadDashboard;
