import { Box, Typography } from "@mui/material";
import styled from "styled-components";

interface OrderFilterProps {
    filter: number;
    setFilter: (value: number) => void;
}

const OrderFilter = ({ filter, setFilter }: OrderFilterProps) => {
    return (
        <Container>
            <Typography
                onClick={() => setFilter(0)}
                sx={{
                    cursor: "pointer",
                    fontWeight: filter === 0 ? "bold" : "normal",
                    color: filter === 0 ? "red" : null,
                }}
            >
                주문 접수
            </Typography>
            <Typography
                onClick={() => setFilter(1)}
                sx={{
                    cursor: "pointer",
                    fontWeight: filter === 1 ? "bold" : "normal",
                    color: filter === 1 ? "red" : null,
                }}
            >
                출력 중
            </Typography>
            <Typography
                onClick={() => setFilter(2)}
                sx={{
                    cursor: "pointer",
                    fontWeight: filter === 2 ? "bold" : "normal",
                    color: filter === 2 ? "red" : null,
                }}
            >
                출력 완료
            </Typography>
        </Container>
    );
};

export default OrderFilter;

const Container = styled(Box)`
    width: 100%;
    margin-bottom: 1%;
    border-bottom: 2px solid #c2c2c2;
    display: flex;
    gap: 20px;
`;
