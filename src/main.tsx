import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.tsx";
import { AuthContextProvider } from "./contexts/AuthContext.tsx";
import { SearchProvider } from "./contexts/SearchContext.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {  FilterProvider } from "./contexts/FilterContext.tsx";
import { AlertProvider } from "./contexts/AlertContext.tsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <FilterProvider>
    <SearchProvider>
      <CartProvider>
      <AlertProvider>
        <DndProvider backend={HTML5Backend}>
    <RouterProvider router={router} />
        </DndProvider>
        </AlertProvider>
      </CartProvider>
    </SearchProvider>
    </FilterProvider>
  </AuthContextProvider>
);