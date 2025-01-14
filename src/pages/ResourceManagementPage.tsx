import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import ResourceDataGrid from "../components/specific/resourceManagement/ResourceDataGrid";

const ResourceManagementPage = () => {
    return (
        <>
            <Grid size={12}>
                <Category>
                    <BigText>재료 목록</BigText>
                </Category>
                <ResourceDataGrid />
            </Grid>
        </>
    );
};

export default ResourceManagementPage;

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
