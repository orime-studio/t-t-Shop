
import { DarkThemeToggle, Dropdown, Navbar, Tooltip } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiBox, FiUser, FiShoppingCart, FiSettings, FiUsers, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import UserAvatar from "../../components/UseAvatar";





const NavChabad = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
  
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <Navbar fluid rounded style={{ width: '100%', direction: 'rtl' }}>
            <Navbar.Brand href="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">בית חבד - יפו</span>
            </Navbar.Brand>

            <div className="flex md:order-2 items-center">
               

                {isLoggedIn && user?.isAdmin && (
                    <>
                        <Link to="/admin/dashboard" className="mr-5 hidden md:block">
                            <Tooltip
                                content="Manage Shop"
                                placement="top"
                                className="text-xs bg-gray-700 text-white rounded px-2 py-1"
                            >
                                <FiSettings size={20} className="text-gray hover:text-gray-300" />
                            </Tooltip>
                        </Link>
                        {/* Add other admin links if needed */}
                    </>
                )}

                {isLoggedIn && (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <UserAvatar firstName={user.name.first} lastName={user.name.last} />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-xs">{user.name.first} {user.name.last}</span>
                            <span className="block truncate text-xs font-medium">{user.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Divider />
                        {user.isAdmin && (
                            <>
                                <Dropdown.Item onClick={() => navigate("/admin/dashboard")}>
                                    ניהול תוכן
                                </Dropdown.Item>
                                <Dropdown.Divider />
                            </>
                        )}
              
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => { logout(); navigate("/"); }}>התנתק</Dropdown.Item>
                    </Dropdown>
                )}

                {!isLoggedIn && (
                    <Tooltip content="Login" placement="bottom" className="text-xs bg-gray-700 text-white rounded px-1 py-1">
                        <Link to="/login" className="mr-4 flex items-center">
                            <FiUser size={20} className="text-gray hover:text-gray-300" />
                        </Link>
                    </Tooltip>
                )}

                <Navbar.Toggle />
                <DarkThemeToggle />
            
            </div>
            <Navbar.Collapse className="pr-4">
    <Navbar.Link href="/" className={`text-xs mr-0 ${isActive("/") ? "font-bold" : ""}`}>
        בית
    </Navbar.Link>
    <Navbar.Link href="/about" className={`text-xs mr-8 ${isActive("/about") ? "font-bold" : ""}`}>
        אודות
    </Navbar.Link>
    <Navbar.Link href="/gallery" className={`text-xs mr-0 ${isActive("/gallery") ? "font-bold" : ""}`}>
        גלריה
    </Navbar.Link>
    <Navbar.Link href="/contact" className={`text-xs mr-0 ${isActive("/contact") ? "font-bold" : ""}`}>
        יצירת קשר
    </Navbar.Link>
</Navbar.Collapse>

        </Navbar>
    );
}

export default NavChabad;