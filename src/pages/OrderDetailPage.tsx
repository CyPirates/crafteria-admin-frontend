import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/newAxios";
import { Order } from "../types/OrderType";

const OrderDetailPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");

    // 상태로 주문 데이터 관리
    const [orderData, setOrderData] = useState<Order | null>(() => {
        const savedData = localStorage.getItem(`order-${orderId}`);
        return savedData ? JSON.parse(savedData) : null;
    });

    // 주문 데이터 불러오기
    const fetchData = async () => {
        if (!orderId) return;

        try {
            const response = await newAxios.get(`/api/v1/order/${orderId}`);
            const fetchedData = response.data.data;

            // 가져온 데이터 localStorage에 저장
            localStorage.setItem(`order-${orderId}`, JSON.stringify(fetchedData));
            setOrderData(fetchedData);
        } catch (error) {
            console.error("Failed to fetch order data:", error);
        }
    };

    useEffect(() => {
        if (!orderData) {
            fetchData();
        }
    }, [orderId]); // orderId 변경 시 실행

    return (
        <div>
            <h1>주문 상세 정보</h1>
            {orderData ? (
                <div>
                    <p>주문 번호: {orderData.orderId}</p>
                    <p>가격: {orderData.purchasePrice}원</p>
                    <p>배송 주소: {orderData.deliveryAddress}</p>
                    <p>상태: {orderData.orderItems[0].widthSize}</p>
                    {/* 추가 정보 표시 가능 */}
                </div>
            ) : (
                <p>주문 정보를 불러오는 중...</p>
            )}
        </div>
    );
};

export default OrderDetailPage;
