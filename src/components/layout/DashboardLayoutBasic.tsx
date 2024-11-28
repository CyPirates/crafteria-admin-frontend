import * as React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import type { Navigation } from "@toolpad/core";
import HomePage from "../../pages/HomePage";
import ManageOrderPage from "../../pages/ManageOrderPage";
import ManageReviewPage from "../../pages/ManageReviewPage";
import Logo from "../../assets/logo.png";

const NAVIGATION: Navigation = [
    { segment: "dashboard", title: "대쉬보드", icon: <DashboardIcon /> },
    { segment: "orders", title: "주문 관리", icon: <ShoppingCartIcon /> },
    { segment: "reviews", title: "리뷰 관리", icon: <DescriptionIcon /> },
    { kind: "divider" },
    // { kind: "header", title: "Analytics" },
    // {
    //     segment: "reports",
    //     title: "Reports",
    //     icon: <BarChartIcon />,
    //     children: [
    //         { segment: "sales", title: "Sales", icon: <DescriptionIcon /> },
    //         { segment: "traffic", title: "Traffic", icon: <DescriptionIcon /> },
    //     ],
    // },
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

function DemoPageContent() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <Box
            sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="/orders" element={<ManageOrderPage />} />
                <Route path="/reviews" element={<ManageReviewPage />} />
            </Routes>
        </Box>
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
                                alignItems: "center", // 상하 가운데 정렬
                                justifyContent: "center", // 좌우 가운데 정렬 (옵션)
                                height: "100%", // 부모 컨테이너 높이를 따라감
                            }}
                        >
                            <img
                                src={Logo}
                                alt="Crafteria Logo"
                                style={{
                                    height: "80px", // 원하는 높이
                                    maxHeight: "none", // 제한 해제
                                }}
                            />
                        </div>
                    ),
                }}
            >
                <DashboardLayout>
                    <DemoPageContent />
                </DashboardLayout>
            </AppProvider>
        </Router>
    );
}
