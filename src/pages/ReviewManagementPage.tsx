import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Button, styled, Typography } from "@mui/material";
import React from "react";
import { newAxios } from "../utils/newAxios";
import { Review } from "../types/ReviewType";

const ManageREviewPage = () => {
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
    const [reviewList, setReviewList] = useState<Review[]>([]);

    const formatDateTime = (isoString: string): string => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const rows = reviewList!.map((review) => ({
        id: review.id,
        content: review.content,
        rating: review.rating,
        createAt: formatDateTime(review.createdAt.toString()),
        imageUrls: review.imageUrls[0],
    }));

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await newAxios.get(`/api/v1/reviews/manufacturer/${4}`);
                const reviews = response.data.data;
                console.log(reviews);
                setReviewList(reviews);
            } catch (e) {
                console.log(e);
            }
        };
        fetchReviews();
    }, []);

    return (
        <>
            <Category>
                <BigText>리뷰 목록</BigText>
            </Category>
            <Box sx={{ width: "92%" }}>
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
            </Box>
        </>
    );
};

const columns: GridColDef[] = [
    { field: "id", headerName: "리뷰번호", width: 96 },
    {
        field: "rating",
        headerName: "평점",
        width: 72,
    },
    {
        field: "content",
        headerName: "내용",
        flex: 1,
    },
    {
        field: "createAt",
        headerName: "날짜",
        width: 240,
    },
];

export default ManageREviewPage;

const Category = styled(Box)`
    width: 100%;
    height: 40px;
    padding: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e6e6e6;

    display: flex;
    align-items: center;
    justify-content: start;
`;

const BigText = styled(Typography)`
    font-weight: bold;
    font-size: 20px;
    margin-left: 60px;
`;
