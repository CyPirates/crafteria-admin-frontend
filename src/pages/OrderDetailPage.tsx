import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/newAxios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Order } from "../types/OrderType";
import { Box, Button } from "@mui/material";
import StlRenderContainer from "../components/specific/manageOrder/StlRenderContainer";
import { Technology } from "../types/CompanyType";
import convertMaterialName from "../utils/convertMaterialName";

type Row = {
    id: number;
    modelFileUrl: string;
    magnification: string;
    quantity: string;
    material: string;
    color: string;
};
const OrderDetailPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");

    const [orderData, setOrderData] = useState<Order | null>(null);
    const [rows, setRows] = useState<Row[]>([]);
    const fetchMaterials = async (id: string) => {
        try {
            const response = await newAxios.get(`/api/v1/technologies/${id}`);
            const data: Technology = response.data.data;
            return {
                material: data.material,
                colorValue: data.colorValue,
            };
        } catch (e) {
            console.error(e);
            return { material: "", colorValue: "" };
        }
    };

    const fetchData = async () => {
        if (!orderId) return;

        try {
            const response = await newAxios.get(`/api/v1/order/dashboard/${orderId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            const fetchedData: Order = response.data.data;
            setOrderData(fetchedData);

            const rowPromises = fetchedData.modelFileUrls.map(async (url, i) => {
                const item = fetchedData.orderItems[i];
                const tech = await fetchMaterials(item.technologyId);
                return {
                    id: i,
                    modelFileUrl: url,
                    magnification: item.magnification,
                    quantity: item.quantity,
                    material: convertMaterialName(tech.material),
                    color: tech.colorValue,
                };
            });

            const resolvedRows = await Promise.all(rowPromises);
            setRows(resolvedRows);
        } catch (error) {
            console.error("주문 정보 로드 실패:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns: GridColDef[] = [
        {
            field: "modelFilePreview",
            headerName: "미리보기",
            width: 120,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                    <StlRenderContainer filePath={params.row.modelFileUrl} width="120px" height="120px" />
                </Box>
            ),
        },
        {
            field: "modelFileDownload",
            headerName: "파일 다운로드",
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                        const link = document.createElement("a");
                        link.href = params.row.modelFileUrl;
                        link.download = params.row.modelFileUrl.split("/").pop();
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                >
                    다운로드
                </Button>
            ),
        },
        { field: "magnification", headerName: "배율", width: 100 },
        { field: "quantity", headerName: "수량", width: 100 },
        { field: "material", headerName: "재료 타입", width: 100 },
        {
            field: "color",
            headerName: "색상",
            width: 100,
            renderCell: (params) => {
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: "16px", height: "16px", backgroundColor: params.row.color }} />
                        <div>{params.row.color}</div>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <h1>주문 상세 정보</h1>
            {orderData ? (
                <>
                    <div>
                        <p>주문 번호: {orderData.orderId}</p>
                        <p>가격: {orderData.purchasePrice}원</p>
                        <p>배송 주소: {orderData.deliveryAddress}</p>
                    </div>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowHeight={() => 120}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 20 },
                            },
                        }}
                        pageSizeOptions={[10]}
                        disableRowSelectionOnClick
                    />
                </>
            ) : (
                <p>주문 정보를 불러오는 중...</p>
            )}
        </div>
    );
};

export default OrderDetailPage;
