import { createBrowserRouter } from "react-router-dom";
import CarouselComponent from "../components/Carousel";
import BeitChabadLayout from "../layout/BeitChabadLayout";
import Root from "../layout/root";
import About from "./About";
import AdminDashboard from "./AdminDashboard";
import ArticleList from "./ArticleComponrnts/ArticleList";
import ArticlePage from "./ArticleComponrnts/ArticlePage";
import CreateArticle from "./ArticleComponrnts/CreateArticle";
import EditArticle from "./ArticleComponrnts/EditArticle";
import ChabadDashboard from "./BeitHabad/ChabadDashboard";
import CreateNewParasha from "./BeitHabad/createNewParasha";
import EditParasha from "./BeitHabad/EditParasha";
import HomePage from "./BeitHabad/HomePage";
import ParashaDetail from "./BeitHabad/ParashaDetail";
import ParashaList from "./BeitHabad/ParashaList";
import Cart from "./Cart";
import Contact from "./Contact";
import CreatePage from "./CreatePage";
import CreateProduct from "./CreateProduct";
import Error from "./Error";
import Login from "./Login";
import OrderConfirmation from "./OrderConfirmation";
import PageDetail from "./Page";
import PagesList from "./Pages";
import Product from "./Product";
import Products from "./Products";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import ProtectedRouteUser from "./ProtectedRouteUser";
import Register from "./Register";
import EditProduct from "./UpdateProduct";
import UpdateUser from "./UpdateUser";
import UserOrders from "./UserOrders";
import MainPage from "./homePage/MainPage";
import ImpactReport from "./homePage/ImpactReport";
import NewProductsGallery from "./homePage/NewProductsGallery";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,
        children: [
            { index: true, element: <MainPage /> },
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            { path: "/products/:id", element: <Product /> },
            {
                path: "/admin/create-product", element:
                    <ProtectedRouteAdmin>
                        <CreateProduct />
                    </ProtectedRouteAdmin>
            },
            {
                path: "/admin/products/:id", element:
                    <ProtectedRouteAdmin>
                        <EditProduct />
                    </ProtectedRouteAdmin>
            },
            {
                path: "/users/:id", element:
                    <ProtectedRouteUser>
                        <UpdateUser />
                    </ProtectedRouteUser>
            },
            {
                path: "/cart", element: <Cart />,
            },
            {
                path: "/products", element: <NewProductsGallery />,
            },
            {
                path: "/order-confirmation/:orderId", element: <OrderConfirmation />
            },
            {
                path: "/orders", element: <UserOrders />
            },
            {
                path: "/admin/dashboard", element:
                    <ProtectedRouteAdmin>
                        <AdminDashboard />
                    </ProtectedRouteAdmin>
            },
            {
                path: "/contact", element: <Contact />
            },
            {
                path: "/about", element: <About />
            },
            {
                path: "/pages", element: <PagesList />
            },
            {
                path: "/pages/:id", element: <PageDetail />
            },
            {
                path: "/create-page", element: <CreatePage />
            },
            {
                path: "/articles", element: <ArticleList />
            },
            {
                path: "/article/:id", element: <ArticlePage />
            },
            {
                path: "/create-article", element: <CreateArticle />
            },
            {
                path: "/edit-article/:id", element: <EditArticle />
            },
            {
                path: "home", element: <MainPage />
            },
            {
                path: "/impact-report", element: <ImpactReport />
            }

        ],
    },
    // ניתוב עצמאי ל-beitChabad עם Footer בלבד
    {
        path: "/beitChabad",
        element: <BeitChabadLayout />,
        errorElement: <Error />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "admin/parasha/create",
                element: (
                    <ProtectedRouteAdmin>
                        <CreateNewParasha />
                    </ProtectedRouteAdmin>
                ),
            },
            {
                path: "admin/parasha/edit/:id",
                element: (
                    <ProtectedRouteAdmin>
                        <EditParasha />
                    </ProtectedRouteAdmin>
                ),
            },
            {
                path: "parasha/:id",
                element: <ParashaDetail />,
            },
            {
                path: "parasha",
                element: <ParashaList />,
            },
            {
                path: "admin",
                element: (
                    <ProtectedRouteAdmin>
                        <ChabadDashboard />
                    </ProtectedRouteAdmin>
                ),
            },

        ],
    },
]);