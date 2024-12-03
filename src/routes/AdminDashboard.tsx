import { Tabs } from "flowbite-react";
import { FiBox, FiUsers, FiClipboard, FiTrendingUp, FiFileText, FiMessageCircle, FiImage } from "react-icons/fi";
import AdminProducts from "./AdminProducts";
import Users from "./Users";
import AdminOrders from "./AdminOrders";
import SalesChart from "./SalesByDate";
import './AdminDashboard.scss';
import AdminMessages from "./AdminMessage";
import AdminArticles from "./ArticleComponrnts/AdminArticle";
import CarouselManager from "../components/CarouselAdmin";

const AdminDashboard = () => {
    return (
        <Tabs aria-label="Tabs with icons" className="tabs">
            <Tabs.Item active title="Manage Products" icon={FiBox}>
                <AdminProducts />
            </Tabs.Item>
            <Tabs.Item title="Manage Users" icon={FiUsers}>
                <Users />
            </Tabs.Item>
            <Tabs.Item title="Manage Orders" icon={FiClipboard}>
                <AdminOrders />
            </Tabs.Item>
            <Tabs.Item title="Analytics" icon={FiTrendingUp}>
                <SalesChart />
            </Tabs.Item>
            <Tabs.Item title="Articles" icon={FiFileText}>
                <AdminArticles />
            </Tabs.Item>
            <Tabs.Item title="Leads" icon={FiMessageCircle}>
                <AdminMessages />
            </Tabs.Item>
            <Tabs.Item title="Carousel" icon={FiImage}>
                <CarouselManager />
            </Tabs.Item>
        </Tabs>
    );
};

export default AdminDashboard;
