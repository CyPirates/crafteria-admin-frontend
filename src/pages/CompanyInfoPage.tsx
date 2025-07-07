import { useEffect, useState } from "react";
import { Company } from "../types/CompanyType";
import { newAxios } from "../utils/newAxios";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/system";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { useColor } from "color-thief-react";
import PrintSpeedDataGrid from "../components/specific/companyInfo/PrintSpeedDataGrid";

const CompanyInfoPage = () => {
    const navigate = useNavigate();
    const manufacturerId = localStorage.getItem("manufacturerId");
    const [data, setData] = useState<Company | undefined>(undefined);
    useEffect(() => {
        const getCompanyData = async () => {
            try {
                const response = await newAxios.get(`/api/v1/manufacturers/${manufacturerId}`);
                let fetchedData = response.data.data;
                setData(fetchedData);
            } catch (e) {
                console.log(e);
            }
        };
        getCompanyData();
    }, []);

    const { data: color } = useColor(data?.imageFileUrl || "", "rgbArray", {
        crossOrigin: "anonymous", // 외부 URL 이미지를 다룰 때 필수
    });

    const toPastel = (rgbArray: number[], adjustmentFactor: number = 0.5) => {
        if (!rgbArray) return [255, 255, 255]; // 기본 흰색
        return rgbArray.map((color) => Math.round(color + (255 - color) * adjustmentFactor));
    };
    const pastelColor = color ? toPastel(color) : [255, 255, 255];

    return (
        <>
            <Grid size={12}>
                <OutlineBox style={{ backgroundColor: `rgb(${pastelColor.join(",")})` }}>
                    <ImageWrapper>
                        <CardMedia component="img" sx={{ width: "100%", height: "100%", objectFit: "cover" }} image={data?.imageFileUrl} alt="profile-image" />
                    </ImageWrapper>
                    <InfoContainer>
                        <LargeText>{data?.name}</LargeText>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "16px" }}>
                            {data?.introduction}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "16px" }}>
                            주소: {data?.address}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "16px" }}>
                            전화번호: {data?.dialNumber}
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
                                        printSpeedFilament: data?.printSpeedFilament,
                                        printSpeedLiquid: data?.printSpeedLiquid,
                                        printSpeedMetalPowder: data?.printSpeedMetalPowder,
                                        printSpeedNylonPowder: data?.printSpeedNylonPowder,
                                    },
                                })
                            }
                        >
                            수정하기
                        </Button>
                    </InfoContainer>
                </OutlineBox>
                <LargeText>출력속도</LargeText>
                {data ? <PrintSpeedDataGrid company={data} setData={setData} /> : null}
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
    height: 320px;
    aspect-ratio: 3.5/1; // 원래 비율 유지
    border: 1px solid #e6e6e6;
    box-shadow: none;
    padding: 2%;
    display: flex;
    align-items: center; // 내용 정렬
    justify-content: start; // 내용 정렬
`;

const ImageWrapper = styled(Box)`
    width: 280px;
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

const LargeText = styled(Typography)`
    font-weight: bold;
    font-size: 30px;
`;
