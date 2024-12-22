import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import type { Navigation } from "@toolpad/core";
import HomePage from "../../pages/HomePage";
import ManageOrderPage from "../../pages/ManageOrderPage";
import ManageReviewPage from "../../pages/ManageReviewPage";
import Logo from "../../assets/logo.png";
import LoginPage from "../../pages/LoginPage";
import EditCompanyInfoPage from "../../pages/EditCompanyInfoPage";
import SignUpPage from "../../pages/SignUpPage";

const NAVIGATION: Navigation = [
    { segment: "dashboard", title: "대쉬보드", icon: <DashboardIcon /> },
    { segment: "orders", title: "주문 관리", icon: <ShoppingCartIcon /> },
    { segment: "reviews", title: "리뷰 관리", icon: <DescriptionIcon /> },
    { kind: "divider" },
];

const demoTheme = createTheme({
    cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function AppRoutes() {
    return (
        <Routes>
            {/* LoginPage는 DashboardLayout 외부에서 렌더링 */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/* DashboardLayout에 포함되는 라우트 */}
            <Route
                path="/*"
                element={
                    <DashboardLayout>
                        <Routes>
                            <Route path="dashboard" element={<HomePage />} />
                            <Route path="orders" element={<ManageOrderPage />} />
                            <Route path="reviews" element={<ManageReviewPage />} />
                            <Route path="/edit-info" element={<EditCompanyInfoPage />} />
                        </Routes>
                    </DashboardLayout>
                }
            />
        </Routes>
    );
}

export default function DashboardLayoutBasic() {
    return (
        <Router>
            <AppProvider
                navigation={NAVIGATION}
                theme={demoTheme}
                branding={{
                    title: "",
                    logo: (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                            }}
                        >
                            <img
                                src={Logo}
                                alt="Crafteria Logo"
                                style={{
                                    height: "80px",
                                    maxHeight: "none",
                                }}
                            />
                        </div>
                    ),
                }}
            >
                {/* AppRoutes 컴포넌트를 통해 라우팅 관리 */}
                <AppRoutes />
            </AppProvider>
        </Router>
    );
}
