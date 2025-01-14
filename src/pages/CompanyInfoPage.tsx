import { useEffect, useState } from "react";
import { Company } from "../types/CompanyType";
import { newAxios } from "../utils/newAxios";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/system";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import styled from "@emotion/styled";

const CompanyInfoPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<Company>();
    useEffect(() => {
        const getCompanyData = async () => {
            try {
                const response = await newAxios.get("/api/v1/manufacturers/4");
                let fetchedData = response.data.data;
                setData(fetchedData);
            } catch (e) {
                console.log(e);
            }
        };
        getCompanyData();
    }, []);
    return (
        <>
            <Grid size={12}>
                <OutlineBox>
                    <ImageWrapper>
                        <CardMedia component="img" sx={{ width: "100%", height: "100%", objectFit: "cover" }} image={data?.imageFileUrl} alt="profile-image" />
                    </ImageWrapper>
                    <InfoContainer>
                        <CompanyName>{data?.name}</CompanyName>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "16px" }}>
                            {data?.introduction}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "16px" }}>
                            주소: {data?.address}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "16px" }}>
                            전화번호: {data?.dialNumber}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "16px" }}>
                            대표장비: {data?.representativeEquipment}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                                navigate("/edit-info", {
                                    state: {
                                        imageUrl: data?.imageFileUrl,
                                        name: data?.name,
                                        introduction: data?.introduction,
                                        address: data?.address,
                                        dialNumber: data?.dialNumber,
                                        representativeEquipment: data?.representativeEquipment,
                                    },
                                })
                            }
                        >
                            수정하기
                        </Button>
                    </InfoContainer>
                </OutlineBox>
            </Grid>
        </>
    );
};

export default CompanyInfoPage;

const StyledCard = styled(Card)`
    border: 1px solid #e6e6e6;
    box-shadow: none;
`;

const OutlineBox = styled(StyledCard)`
    width: 100%;
    aspect-ratio: 3.5/1; // 원래 비율 유지
    border: 1px solid #e6e6e6;
    box-shadow: none;
    padding: 2%;
    display: flex;
    align-items: center; // 내용 정렬
    justify-content: start; // 내용 정렬
`;

const ImageWrapper = styled(Box)`
    width: 25%;
    aspect-ratio: 1/1; // 정사각형 비율
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const InfoContainer = styled(Box)`
    margin-left: 2%;
    height: 100%;
    gap: 10px;

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
`;

const CompanyName = styled(Typography)`
    font-weight: bold;
    font-size: 30px;
`;
