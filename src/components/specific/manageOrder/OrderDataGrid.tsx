import { Order } from "../../../types/OrderType";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { Button } from "@mui/material";
import React from "react";
import { newAxios } from "../../../utils/newAxios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx-js-style"; // XLSX 라이브러리 추가

type OrderList = {
    data: Order[];
    status: number;
    onStatusUpdate: () => void;
};

const OrderDataGrid = ({ data, status, onStatusUpdate }: OrderList) => {
    console.log(data);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const buttonText = ["시작", "완료"];
    const rows = data.map((order) => ({
        id: order.orderId,
        price: `${order.purchasePrice}원`,
        address: order.deliveryAddress,
        courier: order.delivery?.courier || "CJ대한통운",
        trackingNumber: order.delivery?.trackingNumber || "",
        deliveryId: order.delivery?.deliveryId || "",
    }));
    const columns: GridColDef[] = [
        { field: "id", headerName: "주문번호", width: 140 },
        { field: "address", headerName: "배송지", width: 300 },
        { field: "price", headerName: "가격", width: 100 },
        {
            field: "button",
            headerName: "",
            width: 100,
            renderCell: (params) => {
                const selectedOrder = data.find((order) => order.orderId === params.row.id);
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            if (selectedOrder) {
                                window.open(`/order-detail?orderId=${selectedOrder.orderId}`);
                            }
                        }}
                    >
                        자세히
                    </Button>
                );
            },
        },
    ];

    if (status >= 2) {
        columns.push(
            {
                field: "courier",
                headerName: "택배사",
                width: 120,
                editable: true,
                type: "singleSelect",
                cellClassName: "editable-cell",
                valueOptions: ["CJ대한통운", "롯데택배", "로젠택배", "우체국택배", "로직스", "경동택배"],
            },
            {
                field: "trackingNumber",
                headerName: "운송장번호",
                width: 300,
                cellClassName: "editable-cell",
                editable: true,
            },
            {
                field: "shippingControlButton",
                headerName: "",
                width: 250,
                renderCell: (params) => {
                    if (status === 4) return;
                    return (
                        <>
                            {status === 3 ? (
                                <Button variant="contained" color="primary" size="small" style={{ marginRight: "10px" }} onClick={() => handleEditShippingInfo(params)}>
                                    배송정보 수정
                                </Button>
                            ) : null}
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => {
                                    handleShippingStatusControl(params);
                                }}
                            >
                                {status === 2 ? "배송 시작" : "배송 완료"}
                            </Button>
                        </>
                    );
                },
            }
        );
    }

    const handleStatusUpdate = async (id: string) => {
        const manufacturerId = localStorage.getItem("manufacturerId");
        const statusList = ["IN_PRODUCTING", "PRODUCTED", "DELIVERING", "DELIVERED"];
        const nextStatus = statusList[status];
        try {
            const response = await newAxios.post(
                `/api/v1/order/manufacturer/change-status/${id}?manufacturerId=${manufacturerId}`,
                { newStatus: nextStatus },
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            console.log(response.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleButtonClick = async () => {
        console.log(rowSelectionModel);
        for (const id of rowSelectionModel) {
            const row = rows.find((row) => row.id === id);
            if (row) {
                await handleStatusUpdate(row.id);
            }
        }
        onStatusUpdate();
    };

    const handleShippingStatusControl = async (params: GridRenderCellParams<any>) => {
        if (status === 2) {
            handleShippingStart(params);
        } else {
            handleShippingEnd(params);
        }
    };

    const handleShippingStart = async (params: GridRenderCellParams<any>) => {
        const { id, courier, trackingNumber } = params.row;
        const formData = new FormData();
        formData.append("orderId", id);
        formData.append("courier", courier);
        formData.append("trackingNumber", trackingNumber);
        try {
            const response = await newAxios.post("/api/v1/deliveries", formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            onStatusUpdate();
        } catch (e) {
            console.log(e);
        }
    };

    const handleShippingEnd = async (params: GridRenderCellParams<any>) => {
        await handleStatusUpdate(params.row.id);
        onStatusUpdate();
    };

    const handleEditShippingInfo = async (params: GridRenderCellParams<any>) => {
        const { id, courier, trackingNumber, deliveryId } = params.row;
        const manufacturerId = localStorage.getItem("manufacturerId");

        const formData = new FormData();
        formData.append("orderId", id);
        formData.append("courier", courier);
        formData.append("trackingNumber", trackingNumber);
        try {
            const response = await newAxios.put(`/api/v1/deliveries/${deliveryId}`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            onStatusUpdate();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Box
            sx={{
                width: "1400px",
                // 편집 가능한 셀 강조 스타일
                "& .editable-cell": { border: "1px solid #147aff" }, // 예: 연한 노란색 배경
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 20,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                checkboxSelection={status >= 2 ? false : true}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                disableRowSelectionOnClick
            />
            {status < 2 && (
                <Button variant="contained" color="primary" onClick={handleButtonClick} sx={{ marginTop: 2 }}>
                    {`선택된 항목 출력 ${buttonText[status]}`}
                </Button>
            )}
            {/* 엑셀 내보내기 버튼 */}
            <Button variant="contained" color="secondary" sx={{ marginTop: 2, marginLeft: 2 }}>
                엑셀로 내보내기
            </Button>
        </Box>
    );
};

export default OrderDataGrid;
