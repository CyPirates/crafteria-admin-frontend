import { Order } from "../../../types/OrderType";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
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
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const buttonText = ["시작", "완료"];
    const rows = data.map((order) => ({
        id: order.orderId,
        price: `${order.purchasePrice}원`,
        address: order.deliveryAddress,
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
                                localStorage.setItem(`order-${params.row.id}`, JSON.stringify(selectedOrder));
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
                valueOptions: ["CJ대한통운", "롯데택배", "로젠택배", "우체국택배", "로직스", "경동택배"],
            },
            {
                field: "trackingNumber",
                headerName: "운송장번호",
                width: 300,
                editable: true,
            }
        );
    }

    const handleStatusUpdate = async (id: string) => {
        const manufacturerId = localStorage.getItem("manufacturerId");
        const statusList = ["IN_PRODUCTING", "PRODUCTED", "DELIVERING", "DELIVERED"];
        const nextStatus = statusList[status];
        try {
            const response = await newAxios.post(`/api/v1/order/manufacturer/change-status/${id}?manufacturerId=${manufacturerId}`, { newStatus: nextStatus });
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

    return (
        <Box sx={{ width: "1200px" }}>
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
            {status != 2 && (
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
