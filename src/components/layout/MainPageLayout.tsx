import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ConstructionIcon from "@mui/icons-material/Construction";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PrintIcon from "@mui/icons-material/Print";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import type { Navigation } from "@toolpad/core";

import DashboardPage from "../../pages/DashboardPage";
import ManageOrderPage from "../../pages/OrderManagementPage";
import ManageReviewPage from "../../pages/ReviewManagementPage";
import Logo from "../../assets/logo.png";
import LoginPage from "../../pages/LoginPage";
import EditCompanyInfoPage from "../../pages/EditCompanyInfoPage";
import SignUpPage from "../../pages/SignUpPage";
import EquipmentManagementPage from "../../pages/EquipmentManagementPage";
import ResourceManagementPage from "../../pages/ResourceManagementPage";
import CompanyInfoPage from "../../pages/CompanyInfoPage";
import OrderDetailPage from "../../pages/OrderDetailPage";
import RegisterCompanyPage from "../../pages/RegisterCompanyPage";

const NAVIGATION: Navigation = [
    { segment: "information", title: "업체정보", icon: <DescriptionIcon /> },
    { segment: "dashboard", title: "대쉬보드", icon: <DashboardIcon /> },
    { kind: "divider" },
    { segment: "resource", title: "재료 관리", icon: <ConstructionIcon /> },
    { segment: "equipment", title: "장비 관리", icon: <PrintIcon /> },
    { segment: "orders", title: "주문/배송 관리", icon: <LocalShippingIcon /> },
    //{ segment: "shippings", title: "배송 관리", icon: <LocalShippingIcon /> },
    { segment: "reviews", title: "리뷰 관리", icon: <ReviewsIcon /> },
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
            <Route path="/register" element={<RegisterCompanyPage />} />

            {/* DashboardLayout에 포함되는 라우트 */}
            <Route
                path="/*"
                element={
                    <DashboardLayout>
                        <Routes>
                            <Route path="information" element={<CompanyInfoPage />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="resource" element={<ResourceManagementPage />} />
                            <Route path="equipment" element={<EquipmentManagementPage />} />
                            <Route path="orders" element={<ManageOrderPage />} />
                            <Route path="reviews" element={<ManageReviewPage />} />
                            <Route path="/edit-info" element={<EditCompanyInfoPage />} />
                            <Route path="/order-detail" element={<OrderDetailPage />} />
                        </Routes>
                    </DashboardLayout>
                }
            />
        </Routes>
    );
}

export default function MainPageLayout() {
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
