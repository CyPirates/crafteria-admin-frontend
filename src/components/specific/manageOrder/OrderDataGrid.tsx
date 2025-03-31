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
        { field: "id", headerName: "주문번호", width: 200 },
        { field: "address", headerName: "배송지", width: 300 },
        { field: "price", headerName: "가격", width: 100 },
        {
            field: "button",
            headerName: "",
            flex: 1,
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

    const handleStatusUpdate = async (id: string) => {
        const statusList = ["IN_PRODUCTING", "DELIVERED"];
        const nextStatus = statusList[status];
        try {
            const response = await newAxios.post(`/api/v1/order/manufacturer/change-status/${id}?manufacturerId=4&newStatusKey=${nextStatus}`);
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

    // const handleExportToExcel = () => {
    //     const headerStyle = {
    //         font: { bold: true, color: { rgb: "FFFFFF" }, name: "함초롱바탕", sz: 13 },
    //         fill: { fgColor: { rgb: "4CAF50" } },
    //         alignment: { horizontal: "center", vertical: "center" },
    //         border: {
    //             left: { style: "thin", color: { rgb: "000000" } },
    //             right: { style: "thin", color: { rgb: "000000" } },
    //             top: { style: "thin", color: { rgb: "000000" } },
    //             bottom: { style: "thin", color: { rgb: "000000" } },
    //         },
    //     };

    //     const dataStyle = {
    //         alignment: { horizontal: "center", vertical: "center" },
    //         border: {
    //             left: { style: "thin", color: { rgb: "000000" } },
    //             right: { style: "thin", color: { rgb: "000000" } },
    //             top: { style: "thin", color: { rgb: "000000" } },
    //             bottom: { style: "thin", color: { rgb: "000000" } },
    //         },
    //     };

    //     // 엑셀 워크북과 시트 생성
    //     const workbook = XLSX.utils.book_new();
    //     const sheetData = [];

    //     // 헤더 추가
    //     sheetData.push([
    //         { v: "주문번호", t: "s", s: headerStyle },
    //         { v: "크기", t: "s", s: headerStyle },
    //         { v: "파일링크", t: "s", s: headerStyle },
    //         { v: "배율", t: "s", s: headerStyle },
    //         { v: "수량", t: "s", s: headerStyle },
    //         { v: "가격", t: "s", s: headerStyle },
    //         { v: "주소", t: "s", s: headerStyle },
    //     ]);

    //     // 데이터 추가
    //     rows.forEach((row) => {
    //         sheetData.push([
    //             { v: row.id, t: "s", s: dataStyle },
    //             { v: row.size, t: "s", s: dataStyle },
    //             {
    //                 v: row.fileLink[0], // 하이퍼링크 대상 텍스트
    //                 l: { Target: row.fileLink[0] }, // 하이퍼링크 설정
    //                 t: "s",
    //                 s: dataStyle,
    //             },
    //             { v: row.magnification, t: "s", s: dataStyle },
    //             { v: row.quantity, t: "n", s: dataStyle },
    //             { v: row.price, t: "s", s: dataStyle },
    //             { v: row.address, t: "s", s: dataStyle },
    //         ]);
    //     });

    //     // 시트 생성 및 데이터 추가
    //     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    //     // 컬럼 너비 설정
    //     const columnWidths = [15, 20, 70, 10, 10, 15, 40];
    //     worksheet["!cols"] = columnWidths.map((width) => ({ wpx: width * 7 }));

    //     // 워크북에 시트 추가
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    //     // 엑셀 파일 생성 및 다운로드
    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    //     const link = document.createElement("a");
    //     link.href = URL.createObjectURL(blob);
    //     link.download = "Orders.xlsx";
    //     link.click();
    // };

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
            {/* 엑셀 내보내기 버튼 */}
            <Button variant="contained" color="secondary" sx={{ marginTop: 2, marginLeft: 2 }}>
                엑셀로 내보내기
            </Button>
        </Box>
    );
};

export default OrderDataGrid;
