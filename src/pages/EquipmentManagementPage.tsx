import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import EquipmentDataGrid from "../components/specific/dashboard/EquipmentDataGrid";

const EquipmentManagementPage = () => {
    return (
        <>
            <Grid size={12}>
                <Category>
                    <BigText>장비 목록</BigText>
                </Category>
                <EquipmentDataGrid />
            </Grid>
        </>
    );
};

export default EquipmentManagementPage;

const Category = styled(Box)`
    width: 100%;
    height: 40px;
    margin-top: 20px;
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
