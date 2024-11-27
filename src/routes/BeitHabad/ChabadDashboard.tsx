import { Tabs } from "flowbite-react";
import { FiBox } from "react-icons/fi";
import './ChabadDashboard.scss';
import AdminParashot from "./AdminParashot";

const ChabadDashboard = () => {
    return (
        <Tabs aria-label="Tabs with icons" className="tabs rtl-tabs">
            <Tabs.Item active title="נתוני פרשות" icon={FiBox}>
                <AdminParashot />
            </Tabs.Item>
        </Tabs>
    );
};

export default ChabadDashboard;
