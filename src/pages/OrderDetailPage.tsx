import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/newAxios";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

import { Order } from "../types/OrderType";
import { Box, Button } from "@mui/material";
import StlRenderContainer from "../components/specific/manageOrder/StlRenderContainer";

const OrderDetailPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");

    // 상태로 주문 데이터 관리
    const [orderData, setOrderData] = useState<Order | null>(() => {
        const savedData = localStorage.getItem(`order-${orderId}`);
        return savedData ? JSON.parse(savedData) : null;
    });

    // 주문 데이터 불러오기
    const fetchData = async () => {
        if (!orderId) return;

        try {
            const response = await newAxios.get(`/api/v1/order/${orderId}`);
            const fetchedData = response.data.data;

            // 가져온 데이터 localStorage에 저장
            localStorage.setItem(`order-${orderId}`, JSON.stringify(fetchedData));
            setOrderData(fetchedData);
        } catch (error) {
            console.error("Failed to fetch order data:", error);
        }
    };

    useEffect(() => {
        if (!orderData) {
            fetchData();
        }
    }, [orderId]);

    const rows = orderData!.modelFileUrls.map((e, i) => {
        const itemData = orderData?.orderItems[i];
        return {
            id: i,
            modelFileUrl: e,
            magnification: itemData?.magnification,
            quantity: itemData?.quantity,
        };
    });
    const columns: GridColDef[] = [
        {
            field: "modelFilePreview",
            headerName: "미리보기",
            width: 120,
            renderCell: (params) => {
                return (
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                        <StlRenderContainer filePath={params.row.modelFileUrl} width="120px" height="120px" />
                    </Box>
                );
            },
        },
        {
            field: "modelFileDownload",
            headerName: "다운로드",
            width: 100,
            renderCell: (params) => {
                //modelFileUrl in rows is download link for modelFile. make button for download each file
                return (
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
                );
            },
        },
        { field: "magnification", headerName: "배율", width: 100 },
        { field: "quantity", headerName: "수량", width: 100 },
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
                                paginationModel: {
                                    pageSize: 20,
                                },
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
