import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/newAxios";
import { Typography } from "@mui/material";
import useClassifiedOrderList from "../hooks/useClassifiedOrderList";
import { Order } from "../types/OrderType";
import SalesChart from "../components/specific/dashboard/SalesChart";

const DashboardPage = () => {
    const [orderList, setOrderList] = useState<Order[]>([]);

    const { ordered, inProducting, delivered, canceled } = useClassifiedOrderList({ orderList });

    useEffect(() => {
        const getOrderList = async () => {
            try {
                const response = await newAxios.get("/api/v1/order/manufacturer/4/orders");
                let orderList = response.data.data;
                setOrderList(orderList);
            } catch (e) {
                console.log(e);
            }
        };
        getOrderList();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, width: "80%" }}>
            <Grid container spacing={2}>
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
                    <StyledCard>
                        <Category>
                            <BigText>통계</BigText>
                        </Category>
                        <SalesChart />
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;

const StyledCard = styled(Card)`
    border: 1px solid #e6e6e6;
    box-shadow: none;
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
