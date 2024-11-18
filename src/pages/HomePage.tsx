import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/newAxios";
import { Company } from "../types/CompanyType";
import { Typography } from "@mui/material";
import useClassifiedOrderList from "../hooks/useClassifiedOrderList";
import { Order } from "../types/OrderType";
import EquipmentDataGrid from "../components/specific/homepage/EquipmentDataGrid";

const HomePage = () => {
    const [data, setData] = useState<Company>();
    const [orderList, setOrderList] = useState<Order[]>([]);

    const { ordered, inProducting, delivered, canceled } = useClassifiedOrderList({ orderList });

    useEffect(() => {
        const getCompanyData = async () => {
            try {
                const response = await newAxios.get("/api/v1/manufacturers/3");
                let fetchedData = response.data.data;
                setData(fetchedData);
            } catch (e) {
                console.log(e);
            }
        };

        const getOrderList = async () => {
            try {
                const response = await newAxios.get("/api/v1/order/manufacturer/3/orders");
                let orderList = response.data.data;
                setOrderList(orderList);
            } catch (e) {
                console.log(e);
            }
        };
        getCompanyData();
        getOrderList();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, width: "80%" }}>
            <Grid container spacing={2}>
                {/* 회사 정보 랜더링 */}
                <Grid size={12}>
                    <OutlineBox>
                        <ImageWrapper>
                            <CardMedia component="img" sx={{ width: "100%", height: "100%", objectFit: "cover" }} image={data?.imageFileUrl} alt="profile-image" />
                        </ImageWrapper>
                        <TextContainer>
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
                        </TextContainer>
                    </OutlineBox>
                </Grid>

                {/* 주문 현황 랜더링 */}
                <Grid size={12}>
                    <OrderStatusColntainer>
                        <Category>
                            <BigText>주문 / 출력 현황</BigText>
                        </Category>
                        <StatusCardsContainer>
                            <StatusCard>
                                <div>주문 접수</div>
                                <BigText>{ordered.length}건</BigText>
                            </StatusCard>
                            <Divider />
                            <StatusCard>
                                <div>출력 중</div>
                                <BigText>{inProducting.length}건</BigText>
                            </StatusCard>
                            <Divider />
                            <StatusCard>
                                <div>출력 완료</div>
                                <BigText>{delivered.length}건</BigText>
                            </StatusCard>
                        </StatusCardsContainer>
                    </OrderStatusColntainer>
                </Grid>

                <Grid size={12}>
                    <StyledCard>도표 자리</StyledCard>
                </Grid>
                <Grid size={12}>
                    <Category>
                        <BigText>장비 목록</BigText>
                    </Category>
                    <EquipmentDataGrid />
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;

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

const TextContainer = styled(Box)`
    margin-left: 2%;
    height: 100%;
    gap: 20px;

    display: flex;
    flex-direction: column;
    align-items: start;
`;

const CompanyName = styled(Typography)`
    font-weight: bold;
    font-size: 30px;
`;

const Category = styled(Box)`
    width: 100%;
    height: 40px;
    padding: 10px;
    border-bottom: 1px solid #e6e6e6;

    display: flex;
    align-items: center;
    justify-content: start;
`;

const BigText = styled(Typography)`
    font-weight: bold;
    font-size: 20px;
`;

const OrderStatusColntainer = styled(StyledCard)`
    width: 100%;
    aspect-ratio: 7.5/1;
    display: flex;
    flex-direction: column; // 세로 방향으로 정렬
`;

const StatusCardsContainer = styled(Box)`
    display: flex;
    flex: 1;
    //padding: 10px;
    align-items: stretch; // 카드가 세로 방향으로 맞추어 배치되도록
`;

const StatusCard = styled(Card)`
    flex: 1; // 카드가 가로 방향으로 균등하게 배치되도록
    height: 100%;
    border: none; // 테두리 제거
    box-shadow: none;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Divider = styled(Box)`
    width: 1px;
    background-color: #e6e6e6;
    height: 100%; // 전체 높이에 맞추기
`;
