import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Order } from "../types/OrderType";
import useClassifiedOrderList from "../hooks/useClassifiedOrderList";
import { newAxios } from "../utils/newAxios";
import OrderFilter from "../components/specific/manageOrder/OrderFilter";
import styled from "styled-components";
import OrderDataGrid from "../components/specific/manageOrder/OrderDataGrid";

const ManageOrderPage = () => {
    const [filter, setFilter] = useState<number>(0); // 0: 주문접수, 1: 출력 중, 2: 출력 완료
    const [orderList, setOrderList] = useState<Order[]>([]);
    const { ordered, inProducting, delivered, canceled } = useClassifiedOrderList({ orderList });
    const classifiedOrderArray = [ordered, inProducting, delivered];

    const getOrderList = async () => {
        try {
            const response = await newAxios.get("/api/v1/order/manufacturer/4/orders");
            let orderList = response.data.data;
            setOrderList(orderList);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getOrderList();
    }, []);

    const handleStatusUpdate = () => {
        getOrderList(); // 상태 업데이트 후 데이터 다시 가져오기
    };

    return (
        <PageWrapper>
            <OrderFilter filter={filter} setFilter={setFilter} />

            {/* 선택된 주문 상태의 리스트를 보여줌 */}
            <OrderCardContainer>
                {classifiedOrderArray[filter].length === 0 ? (
                    <Typography>해당 상태의 주문이 없습니다.</Typography>
                ) : (
                    <OrderDataGrid data={classifiedOrderArray[filter]} status={filter} onStatusUpdate={handleStatusUpdate} />
                )}
            </OrderCardContainer>
        </PageWrapper>
    );
};

export default ManageOrderPage;

const PageWrapper = styled(Box)`
    width: 100%;
    margin-left: 2%;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
`;

const OrderCardContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
`;
