import { DarkThemeToggle, Dropdown, Navbar, Tooltip } from "flowbite-react";
import { FiHeart, FiUser } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserAvatar from "../../components/UseAvatar";
import { useAuth } from "../../hooks/useAuth";
import './NavBarChabad.scss';

const NavChabad = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
  
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <Navbar fluid rounded className="nav-chabad-container">
            <Navbar.Brand href="/">
                <img
                    src="/img/LogoChabad (2).png"
                    alt="בית חבד - יפו העתיקה"
                    className="nav-chabad-logo"
                />
            </Navbar.Brand>

            <div className="nav-chabad-flex">
                {isLoggedIn && (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={<UserAvatar firstName={user.name.first} lastName={user.name.last} />}
                    >
                        <Dropdown.Header>
                            <span className="text-xs">{user.name.first} {user.name.last}</span>
                            <span className="text-xs font-medium">{user.email}</span>
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
                        <Link to="/login" className="login-link">
                            <FiUser size={20} className="text-gray hover:text-gray-300" />
                        </Link>
                    </Tooltip>
                )}

                <Navbar.Toggle className="nav-toggle" />
                <DarkThemeToggle className="theme-toggle" />
            </div>

            <Navbar.Collapse className="nav-chabad-links">
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                    בית
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
                    אודות
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/gallery") ? "active" : ""}`}>
                    גלריה
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
                    מידע למטייל
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
                    יצירת קשר
                </Navbar.Link>
                <Navbar.Link href="/beitChabad" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
                    הרשמה לארוחת שבת
                </Navbar.Link>
                
                <Navbar.Link
                    href="/beitChabad"
                    className={`donate-link ${isActive("/beitChabad") ? "active" : ""}`}
                >
                    <FiHeart size={20} className="donate-icon" />
                    אני רוצה לתרום
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavChabad;
