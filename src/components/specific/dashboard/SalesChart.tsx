import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { newAxios } from "../../../utils/newAxios";

export default function SalesChart() {
    const [salesAmount, setSalesAmount] = useState<number[]>([]);
    const [orderAmount, setOrderAmount] = useState<number[]>([]);

    const GetDatesFromToday = (n: number): string[] => {
        const today = new Date();
        const dates = [];
        for (let i = n - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            dates.push(date.toISOString().split("T")[0]);
        }
        return dates;
    };
    const dates = GetDatesFromToday(7);
    const datesWithOutYear = dates.map((e) => {
        const [year, month, day] = e.split("-");
        return `${month}-${day}`;
    });

    useEffect(() => {
        const fetchData = async () => {
            const salesData: number[] = [];
            const orderData: number[] = [];

            for (const e of dates) {
                const response = await newAxios.get(`/api/v1/chart/daily?manufacturerId=3&specificDate=${e}`);
                const data = response.data;
                salesData.push(data.totalSalesAmount);
                orderData.push(data.totalOrders);
            }

            setSalesAmount(salesData);
            setOrderAmount(orderData);
        };

        fetchData();
    }, []);

    return (
        <>
            <Container>
                <BarChart xAxis={[{ scaleType: "band", data: datesWithOutYear }]} leftAxis={null} series={[{ data: orderAmount, label: "주문 수" }]} barLabel="value" width={600} height={300} />
                <BarChart
                    xAxis={[{ scaleType: "band", data: datesWithOutYear }]}
                    leftAxis={null}
                    series={[{ data: salesAmount, label: "매출", color: "#4e79a7" }]}
                    barLabel="value"
                    width={600}
                    height={300}
                />
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
`;
