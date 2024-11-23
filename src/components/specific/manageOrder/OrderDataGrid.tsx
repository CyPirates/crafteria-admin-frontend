// OrderDataGrid.tsx
import { Order } from "../../../types/OrderType";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { Button } from "@mui/material";
import React from "react";
import { newAxios } from "../../../utils/newAxios";
import { Link } from "react-router-dom";

type OrderList = {
    data: Order[];
    status: number;
    onStatusUpdate: () => void; // 콜백 함수 추가
};

const OrderDataGrid = ({ data, status, onStatusUpdate }: OrderList) => {
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const buttonText = ["시작", "완료"];
    const rows = data.map((order) => ({
        id: order.orderId,
        size: `${order.widthSize} x ${order.lengthSize} x ${order.heightSize}`,
        fileLink: order.modelFileUrls,
        magnification: order.magnification,
        quantity: order.quantity,
        price: `${order.purchasePrice}원`,
        address: order.deliveryAddress,
    }));

    const handleStatusUpdate = async (id: string) => {
        const statusList = ["IN_PRODUCTING", "DELIVERED"];
        const nextStatus = statusList[status];
        try {
            const response = await newAxios.post(`/api/v1/order/manufacturer/change-status/${id}?manufacturerId=3&newStatusKey=${nextStatus}`);
            console.log(response.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleButtonClick = async () => {
        for (const id of rowSelectionModel) {
            const row = rows.find((row) => row.id === id);
            if (row) {
                await handleStatusUpdate(row.id);
            }
        }
        onStatusUpdate(); // 상태 업데이트 후 콜백 호출
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
                checkboxSelection
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
        </Box>
    );
};

const columns: GridColDef[] = [
    { field: "id", headerName: "주문번호", width: 80 },
    {
        field: "size",
        headerName: "크기(mm)",
        width: 200,
    },
    {
        field: "magnification",
        headerName: "배율",
        width: 100,
    },
    {
        field: "quantity",
        headerName: "수량",
        width: 100,
    },
    {
        field: "price",
        headerName: "가격",
        width: 100,
    },
    {
        field: "address",
        headerName: "배송지",
        flex: 1,
    },
    {
        field: "fileLink",
        headerName: "파일",
        width: 100,
        renderCell: (params) => <Link to={params.value[0]}>다운로드</Link>,
    },
];

export default OrderDataGrid;
