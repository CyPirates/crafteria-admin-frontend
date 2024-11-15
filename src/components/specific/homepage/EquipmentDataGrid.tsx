import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import React from "react";
import { newAxios } from "../../../utils/newAxios";
import { Equipment } from "../../../types/CompanyType";
import { width } from "@mui/system";

const EquipmentDataGrid = () => {
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

    useEffect(() => {
        getEquipmentList();
    }, []);

    const getEquipmentList = async () => {
        try {
            const response = await newAxios.get("/api/v1/equipment/manufacturer/3");
            let equipmentList = response.data.data;
            console.log(equipmentList);
            setEquipmentList(equipmentList);
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await newAxios.delete(`/api/v1/equipment/${id}`);
            getEquipmentList();
        } catch (e) {
            console.log(e);
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            let nextStatus;
            status == "Available" ? (nextStatus = "InUse") : (nextStatus = "Available");
            await newAxios.patch(`/api/v1/equipment/${id}/status?status=${nextStatus}`);
            getEquipmentList();
        } catch (e) {
            console.log(e);
        }
    };

    const rows = equipmentList.map((e) => ({
        id: e.id,
        name: e.name,
        status: e.status,
        imageFileUrl: e.imageFileUrl,
    }));

    const columns: GridColDef[] = [
        { field: "id", headerName: "장비ID" },
        {
            field: "name",
            headerName: "장비명",
        },
        {
            field: "imageFileUrl",
            headerName: "이미지",
            width: 170,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                    <img src={params.value} alt="Equipment" style={{ width: 150, height: 150 }} />
                </Box>
            ),
        },
        {
            field: "status",
            headerName: "상태",
            renderCell: (params) => <div>{params.value === "Available" ? "대기중" : "출력중"}</div>,
        },
        {
            field: "statusChange",
            headerName: "상태 관리",
            width: 150,
            renderCell: (params) => (
                <Button variant="contained" onClick={() => handleStatusChange(params.row.id, params.row.status)}>
                    {params.row.status === "Available" ? "출력 시작" : "출력 완료"}
                </Button>
            ),
        },
        {
            field: "delete",
            headerName: "삭제",
            renderCell: (params) => (
                <Button variant="contained" onClick={() => handleDelete(params.row.id)}>
                    삭제
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                rowHeight={150}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                disableRowSelectionOnClick
            />
        </Box>
    );
};

export default EquipmentDataGrid;
