import { DarkThemeToggle, Dropdown, Navbar, Tooltip } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiBox, FiUser, FiShoppingCart, FiSettings, FiUsers, FiTrendingUp, FiHeart } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import UserAvatar from "../../components/UseAvatar";

const NavChabad = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
  
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <Navbar fluid rounded className="navbar-container">
            <Navbar.Brand href="/">
                <img
                    src="/img/LogoChabad (2).png"
                    alt="בית חבד - יפו העתיקה"
                    className="logo-container"
                />
            </Navbar.Brand>

            <div className="flex-container">
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
                                <Dropdown.Item onClick={() => navigate("/beitChabad/admin")}>
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
                    <Tooltip content="Login" placement="bottom" className="tooltip">
                        <Link to="/login" className="mr-4 flex items-center">
                            <FiUser size={20} className="text-gray hover:text-gray-300" />
                        </Link>
                    </Tooltip>
                )}

                <Navbar.Toggle className="toggle-button" />
                <DarkThemeToggle className="theme-toggle" />
            </div>

            <Navbar.Collapse className="nav-items">
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/") ? "font-bold" : ""}`}>
                    בית
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/about") ? "font-bold" : ""}`}>
                    אודות
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/gallery") ? "font-bold" : ""}`}>
                    גלריה
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/contact") ? "font-bold" : ""}`}>
                    מידע למטייל
                </Navbar.Link>

                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/contact") ? "font-bold" : ""}`}>
                    יצירת קשר
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/contact") ? "font-bold" : ""}`}>
                    הרשמה לארוחת שבת
                </Navbar.Link>
                
                <Navbar.Link
                    href="/beitChabad"
                    className={`nav-link nav-link-highlight ${isActive("/beitChabad") ? "font-bold" : ""}`}
                >
                    <FiHeart size={20} className="icon" />
                    אני רוצה לתרום 
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavChabad;
