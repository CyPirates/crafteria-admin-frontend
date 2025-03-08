import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
    GridSlots,
    GridToolbarContainer,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { newAxios } from "../../../utils/newAxios";
import { Equipment } from "../../../types/CompanyType";
import { convertImageUrlToFile } from "../../../utils/convertUrlToFile";

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        setRows((oldRows) => [...oldRows, { id: "N/A", name: "", status: "Available", imageFileUrl: "", file: null, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            ["N/A"]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                장비 추가
            </Button>
        </GridToolbarContainer>
    );
}

const EquipmentDataGrid = () => {
    const manufacturerId = localStorage.getItem("manufacturerId");
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [targetRow, setTargetRow] = useState<GridRowModel | null>(null);
    useEffect(() => {
        getEquipmentList();
    }, []);

    const getEquipmentList = async () => {
        try {
            const response = await newAxios.get(`/api/v1/equipment/manufacturer/${manufacturerId}`);
            const equipmentList = response.data.data;
            setRows(
                equipmentList.map((e: Equipment) => ({
                    id: e.id,
                    name: e.name,
                    status: e.status,
                    imageFileUrl: e.imageFileUrl,
                }))
            );
        } catch (e) {
            console.error(e);
        }
    };

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

    const postEquipmentData = async (target: GridRowModel | null) => {
        if (target === null) return;

        const formData = new FormData();
        formData.append("name", target.name); // 이름 추가
        formData.append("manufacturerId", manufacturerId!);
        formData.append("status", target.status);

        // 이미지 처리: URL 또는 파일 모두 image로 추가
        if (target!.file) {
            formData.append("image", target.file); // 신규 업로드된 파일
        } else if (target.imageFileUrl) {
            // const response = await fetch(target.imageFileUrl);
            // const file = await response.blob();
            // formData.append("image", file);
            const imageFile = await convertImageUrlToFile(target.imageFileUrl);
            //formData.append("image", imageFile);
        }

        try {
            if (target.id === "N/A") {
                // 신규 항목 저장
                await newAxios.post("/api/v1/equipment", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                // 기존 항목 수정
                await newAxios.put(`/api/v1/equipment/${target.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            // 데이터 갱신
            console.log("Saved successfully");
            getEquipmentList();
        } catch (error) {
            console.error("Error saving equipment:", error);
        }
    };

    useEffect(() => {
        postEquipmentData(targetRow);
    }, [targetRow]);

    const handleDeleteClick = async (id: string) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?"); // 경고창 표시
        if (!confirmed) return; // 사용자가 취소를 선택한 경우 함수 종료

        try {
            // 로컬 상태에서 먼저 제거
            setRows((oldRows) => oldRows.filter((row) => row.id !== id));

            // 서버에서 삭제 요청
            await newAxios.delete(`/api/v1/equipment/${id}`);

            // 필요 시 서버 상태를 다시 동기화
            getEquipmentList();
        } catch (e) {
            console.error("Error deleting equipment:", e);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setRows((oldRows) => oldRows.map((row) => (row.id === id ? { ...row, imageFileUrl: reader.result as string, file } : row)));
            };
            reader.readAsDataURL(file);
        }
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
        { field: "id", headerName: "장비ID", width: 150, editable: false },
        {
            field: "name",
            headerName: "장비명",
            width: 200,
            editable: true,
        },
        {
            field: "imageFileUrl",
            headerName: "이미지",
            width: 170,
            renderCell: (params) => {
                const hasImage = !!params.row.imageFileUrl;

                return hasImage ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <img src={params.row.imageFileUrl} alt="Uploaded" style={{ width: 150, height: 150 }} />
                    </Box>
                ) : (
                    <Box>
                        <input accept="image/*" id={`upload-${params.id}`} type="file" style={{ display: "none" }} onChange={(e) => handleFileUpload(e, params.id as string)} />
                        <label htmlFor={`upload-${params.id}`}>
                            <Button variant="contained" startIcon={<UploadIcon />} component="span">
                                업로드
                            </Button>
                        </label>
                    </Box>
                );
            },
        },
        {
            field: "status",
            headerName: "상태",
            width: 60,
            renderCell: (params) => <div>{params.value === "Available" ? "대기중" : "출력중"}</div>,
        },
        {
            field: "handleStatus",
            headerName: "",
            width: 96,
            renderCell: (params) => {
                const handleStatusChange = async () => {
                    try {
                        const newStatus = params.row.status === "Available" ? "InUse" : "Available"; // 상태 변경 로직
                        await newAxios.patch(`/api/v1/equipment/${params.row.id}/status?status=${newStatus}`); // 상태 업데이트 API 호출
                        setRows((oldRows) => oldRows.map((row) => (row.id === params.row.id ? { ...row, status: newStatus } : row)));
                    } catch (error) {
                        console.error("Failed to change status:", error);
                    }
                };
                if (params.row.id === "N/A") return null;

                return (
                    <Button variant="contained" size="small" color={params.row.status === "Available" ? "primary" : "secondary"} onClick={handleStatusChange}>
                        {params.row.status === "Available" ? "출력시작" : "출력완료"}
                    </Button>
                );
            },
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

                return [
                    <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(params.id as string)} />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(params.id as string)} />,
                ];
            },
        },
    ];

    return (
        <Box sx={{ width: "100%" }}>
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
                slots={{
                    toolbar: EditToolbar as GridSlots["toolbar"],
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
};

export default EquipmentDataGrid;
