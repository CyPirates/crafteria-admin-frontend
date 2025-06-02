import { Button, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import styled from "styled-components";
import { InputCompanyInfo } from "../types/SignUpType";
import FileDrop from "../components/common/FileDrop";

import Logo from "../assets/logo.png";
import { useState } from "react";
import { newAxios } from "../utils/newAxios";
import { useNavigate } from "react-router-dom";

const RegisterCompanyPage = () => {
    const navigate = useNavigate();
    const steps = ["업체 정보", "재료 별 출력 속도"];
    const [activeStep, setActiveStep] = useState<number>(0);
    const [companyInfo, setCompanyInfo] = useState<InputCompanyInfo>({
        name: "",
        introduction: "",
        address: "",
        dialNumber: "",
        representativeEquipment: "",
        image: undefined,
        printSpeedFilament: "",
        printSpeedPowder: "",
        printSpeedLiquid: "",
    });

    const handleButtonClick = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("accessToken");
        const formData = new FormData();
        formData.append("name", companyInfo.name);
        formData.append("introduction", companyInfo.introduction);
        formData.append("address", companyInfo.address);
        formData.append("dialNumber", companyInfo.dialNumber);
        formData.append("representativeEquipment", companyInfo.representativeEquipment);
        formData.append("printSpeedFilament", companyInfo.printSpeedFilament);
        formData.append("printSpeedLiquid", companyInfo.printSpeedLiquid);
        formData.append("printSpeedPowder", companyInfo.printSpeedPowder);
        if (companyInfo.image) {
            formData.append("image", companyInfo.image);
        }
        console.log("FormData 내용:");
        for (const pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }
        try {
            const response = await newAxios.post("/api/v1/manufacturers", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            localStorage.setItem("manufacturerId", response.data.data.id);
            navigate("/dashboard");
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <>
            <PageWrapper>
                <LogoContainer src={Logo} />
                <ContentsContainer>
                    <Title>회사 정보 등록</Title>
                    <Box sx={{ width: "100%", marginBottom: "20px" }}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: {
                                    optional?: React.ReactNode;
                                } = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </Box>
                    {activeStep === 0 && <CompanyInfoInputField companyInfo={companyInfo} setter={setCompanyInfo} />}
                    {activeStep === 1 && <PrintSpeedInputField companyInfo={companyInfo} setter={setCompanyInfo} />}
                    <StyledButton variant="contained" sx={{ width: "400px" }} onClick={handleButtonClick}>
                        {activeStep === 0 ? "다음" : "제출하기"}
                    </StyledButton>
                </ContentsContainer>
            </PageWrapper>
        </>
    );
};

const CompanyInfoInputField = ({ companyInfo, setter }: { companyInfo: InputCompanyInfo; setter: React.Dispatch<React.SetStateAction<InputCompanyInfo>> }) => {
    return (
        <StyledBox>
            <p>대표 이미지</p>
            <FileDrop setData={setter} />
            <StyledTextField id="name" label="이름" value={companyInfo.name} onChange={(e) => setter((prev) => ({ ...prev, name: e.target.value }))} />
            <StyledTextField id="introduction" label="소개말" value={companyInfo.introduction} onChange={(e) => setter((prev) => ({ ...prev, introduction: e.target.value }))} />
            <StyledTextField id="address" label="업체 주소" value={companyInfo.address} onChange={(e) => setter((prev) => ({ ...prev, address: e.target.value }))} />
            <StyledTextField id="dialNumber" label="전화번호" value={companyInfo.dialNumber} onChange={(e) => setter((prev) => ({ ...prev, dialNumber: e.target.value }))} />
            <StyledTextField
                id="representativeEquipment"
                label="대표장비"
                value={companyInfo.representativeEquipment}
                onChange={(e) => setter((prev) => ({ ...prev, representativeEquipment: e.target.value }))}
            />
        </StyledBox>
    );
};

const PrintSpeedInputField = ({ companyInfo, setter }: { companyInfo: InputCompanyInfo; setter: React.Dispatch<React.SetStateAction<InputCompanyInfo>> }) => {
    return (
        <StyledBox>
            <p>해당사항 없을 시 0으로 입력해주세요.</p>
            <StyledTextField
                id="printSpeedFilament"
                type="number"
                label="필라멘트"
                value={companyInfo.printSpeedFilament}
                onChange={(e) => setter((prev) => ({ ...prev, printSpeedFilament: e.target.value }))}
            />
            <StyledTextField
                id="printSpeedLiquid"
                type="number"
                label="액체"
                value={companyInfo.printSpeedLiquid}
                onChange={(e) => setter((prev) => ({ ...prev, printSpeedLiquid: e.target.value }))}
            />
            <StyledTextField
                id="printSpeedPowder"
                type="number"
                label="분말"
                value={companyInfo.printSpeedPowder}
                onChange={(e) => setter((prev) => ({ ...prev, printSpeedPowder: e.target.value }))}
            />
        </StyledBox>
    );
};
export default RegisterCompanyPage;
const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const LogoContainer = styled.img`
    width: 800px;
`;
const ContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
`;
const Title = styled(Typography)`
    font-size: 25px;
    font-weight: bold;
    //margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
    margin: 20px 0;
`;

const ImageContainer = styled(Box)`
    width: 200px;
    height: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
`;
const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
    width: 400px;
    margin-top: 20px;
`;
