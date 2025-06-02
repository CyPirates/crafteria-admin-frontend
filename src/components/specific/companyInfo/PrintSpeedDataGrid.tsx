import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridRowEditStopReasons } from "@mui/x-data-grid";
import { newAxios } from "../../../utils/newAxios";
import { Company } from "../../../types/CompanyType";
import { convertImageUrlToFile } from "../../../utils/convertUrlToFile";

const PrintSpeedDataGrid = (props: { company: Company; setData: React.Dispatch<React.SetStateAction<Company | undefined>> }) => {
    const { company, setData } = props;
    const { printSpeedFilament, printSpeedLiquid, printSpeedPowder } = company;
    const [rows, setRows] = useState<GridRowsProp>([
        { id: "printSpeedFilament", type: "필라멘트", speedPerHour: printSpeedFilament },
        { id: "printSpeedLiquid", type: "액체", speedPerHour: printSpeedLiquid },
        { id: "printSpeedPowder", type: "분말", speedPerHour: printSpeedPowder },
    ]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [targetRow, setTargetRow] = useState<GridRowModel | null>(null);

    const handleEditClick = (id: string) => {
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleSaveClick = async (id: string) => {
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.View },
        }));
    };
    const handleCancelClick = (id: string) => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const postSpeedData = async (target: GridRowModel | null) => {
        if (target === null) return;
        const manufacturerId = localStorage.getItem("manufacturerId");

        const formData = new FormData();
        fetch(company.imageFileUrl)
            .then((res) => res.blob())
            .then((blob) => {
                formData.append("image", blob, "default-image.jpg");
            })
            .catch((err) => console.error("이미지 변환 실패:", err));
        Object.entries(company).forEach(([key, value]) => {
            if (key === "imageFileUrl") return;
            formData.append(key, value);
        });
        formData.set(target.id, target.speedPerHour);

        try {
            await newAxios.put(`/api/v1/manufacturers/${manufacturerId}`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });

            console.log("Saved successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error saving equipment:", error);
        }
    };

    useEffect(() => {
        postSpeedData(targetRow);
    }, [targetRow]);

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const processRowUpdate = (newRow: GridRowModel) => {
        // 업데이트된 행을 즉시 상태에 반영
        console.log("Processing row update:", newRow);
        setTargetRow(newRow); // 새로운 행을 targetRow에 저장
        setRows((oldRows) => oldRows.map((row) => (row.id === newRow.id ? { ...newRow, isNew: false } : row)));
        return { ...newRow, isNew: false }; // 반환값에 새로운 값 포함
    };
    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const columns: GridColDef[] = [
        {
            field: "type",
            headerName: "종류",
            width: 220,
        },
        {
            field: "speedPerHour",
            headerName: "출력 속도(mm3/시간)",
            width: 160,
            editable: true,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 150,
            getActions: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => handleSaveClick(params.id as string)} />,
                        <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={() => handleCancelClick(params.id as string)} />,
                    ];
                }

                return [<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(params.id as string)} />];
            },
        },
    ];

    return (
        <Box sx={{ width: "600px" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                //onStateChange={(e) => console.log(e)}
            />
        </Box>
    );
};

export default PrintSpeedDataGrid;
