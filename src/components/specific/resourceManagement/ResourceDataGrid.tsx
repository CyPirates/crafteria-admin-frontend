import React, { useEffect, useState } from "react";
import { CompactPicker } from "react-color";
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
import { convertImageUrlToFile } from "../../../utils/convertUrlToFile";
import { newAxios } from "../../../utils/newAxios";
import convertMaterialName from "../../../utils/convertMaterialName";

type Resource = {
    technologyId: string;
    manufacturerId: string;
    material: string;
    description: string;
    colorValue: string;
    imageUrl: string;
    pricePerHour: string;
};

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const newId = "NEW" + Math.random().toString(36).substr(2, 9); // 예시로 고유 ID 생성
        setRows((oldRows) => [...oldRows, { id: newId, type: "필라멘트", color: "#000000", imageFileUrl: "", file: null, description: "설명", price: 0, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [newId]: { mode: GridRowModes.Edit, fieldToFocus: "type" },
        }));
    };
    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                재료 추가
            </Button>
        </GridToolbarContainer>
    );
}

const ResourceDataGrid = () => {
    const manufacturerId = localStorage.getItem("manufacturerId");
    const [rows, setRows] = useState<GridRowsProp>([]);
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

    const getResourceList = async () => {
        try {
            const response = await newAxios.get(`/api/v1/technologies/manufacturer/${manufacturerId}`);
            const equipmentList = response.data.data;
            setRows(
                equipmentList.map((e: Resource) => ({
                    id: e.technologyId,
                    type: convertMaterialName(e.material),
                    description: e.description,
                    imageFileUrl: e.imageUrl,
                    color: e.colorValue,
                    price: e.pricePerHour,
                }))
            );
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getResourceList();
    }, []);

    const postEquipmentData = async (target: GridRowModel | null) => {
        if (target === null) return;
        let material = convertMaterialName(target.type);

        const formData = new FormData();
        formData.append("manufacturerId", manufacturerId!);
        formData.append("material", material);
        formData.append("description", target.description);
        formData.append("colorValue", target.color);
        formData.append("pricePerHour", target.price);

        // 이미지 처리: URL 또는 파일 모두 image로 추가
        if (target!.file) {
            formData.append("imageFile", target.file); // 신규 업로드된 파일
        } else if (target.imageFileUrl) {
            // const response = await fetch(target.imageFileUrl);
            // const file = await response.blob();
            // formData.append("image", file);
            const imageFile = await convertImageUrlToFile(target.imageFileUrl);
            //formData.append("image", imageFile);
        }

        try {
            if (target.id.toString().toUpperCase().startsWith("NEW")) {
                // 신규 항목 저장
                await newAxios.post("/api/v1/technologies", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                // 기존 항목 수정
                await newAxios.put(`/api/v1/technologies/${target.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            // 데이터 갱신
            console.log("Saved successfully");
            getResourceList();
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
            await newAxios.delete(`/api/v1/technologies/${id}`);
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
        {
            field: "type",
            headerName: "종류",
            width: 220,
            editable: true,
            type: "singleSelect",
            valueOptions: ["필라멘트", "분말", "액상"],
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
            field: "color",
            headerName: "색상",
            width: 160,
            editable: true,
        },
        {
            field: "description",
            headerName: "설명",
            width: 160,
            editable: true,
        },
        {
            field: "price",
            headerName: "시간당 가격",
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
            <div>{rows.length}</div>
        </Box>
    );
};

export default ResourceDataGrid;
