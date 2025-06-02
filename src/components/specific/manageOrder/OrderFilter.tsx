import { Box, Typography } from "@mui/material";
import styled from "styled-components";

interface OrderFilterProps {
    filter: number;
    setFilter: (value: number) => void;
}

const OrderFilter = ({ filter, setFilter }: OrderFilterProps) => {
    const filterTexts = ["주문 접수", "출력 중", "출력 완료", "배송 중", "배송 완료"];
    return (
        <Container>
            {filterTexts.map((text, i) => {
                return (
                    <FilterText key={i} onClick={() => setFilter(i)} selected={filter === i}>
                        {text}
                    </FilterText>
                );
            })}
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

const FilterText = styled(Typography)<{ selected: boolean }>`
    cursor: pointer;
    font-weight: ${(props) => (props.selected ? "bold" : "normal")};
    color: ${(props) => (props.selected ? "red" : null)};
`;
