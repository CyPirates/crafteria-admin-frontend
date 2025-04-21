import styled from "@emotion/styled";
import Logo from "../assets/logo.png";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { newAxios } from "../utils/newAxios";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import { InputUserInfo, InputCompanyInfo } from "../types/SignUpType";
import FileDrop from "../components/common/FileDrop";

const SignUpPage = () => {
    const navigate = useNavigate();
    const steps = ["개인 정보", "업체 정보", "재료 별 출력 속도"];
    const [activeStep, setActiveStep] = useState<number>(0);
    const [userInfo, setUserInfo] = useState<InputUserInfo>({
        id: "",
        password: "",
        name: "",
        phoneNumber: "",
        address: "",
    });
    const [companyInfo, setCompanyInfo] = useState<InputCompanyInfo>({
        name: "",
        introduction: "",
        address: "",
        dialNumber: "",
        representativeEquipment: "",
        image: undefined,
        printSpeedFilament: "",
        printSpeedLiquid: "",
        printSpeedPowder: "",
    });
    const { id, password, name, phoneNumber, address } = userInfo;

    const handleSubmit = async () => {
        console.log(userInfo);
        console.log(companyInfo);

        const userData = {
            username: id,
            password: password,
            realname: name,
            phoneNumber: phoneNumber,
            address: address,
        };

        try {
            await newAxios.post("/api/v1/auth/register", userData);
            console.log("회원가입 성공!");
            const loginResponse = await newAxios.post("/api/v1/auth/login", {
                username: id,
                password: password,
            });
            const token = loginResponse.data.data?.accessToken;
            console.log("로그인 성공! 토큰:", token);
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
            await newAxios.post("/api/v1/manufacturers", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("업체 정보 등록 성공!");
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };

    // activeStep이 0일때는 "다음" 버튼을 보여주고, 1일때는 "가입하기" 버튼을 보여주기 위한 함수
    const handleNextButtonClick = () => {
        if (activeStep === steps.length - 1) {
            handleSubmit();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    return (
        <>
            <PageWrapper>
                <LogoContainer src={Logo} />
                <ContentsContainer>
                    <Title>회원가입</Title>
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
                    {activeStep === 0 ? (
                        <UserInfoInputField userInfo={userInfo} setter={setUserInfo} />
                    ) : activeStep === 1 ? (
                        <CompanyInfoInputField companyInfo={companyInfo} setter={setCompanyInfo} />
                    ) : (
                        <PrintSpeedInputField companyInfo={companyInfo} setter={setCompanyInfo} />
                    )}
                    <StyledButton variant="contained" sx={{ width: "400px" }} onClick={handleNextButtonClick}>
                        {activeStep === steps.length - 1 ? "가입하기" : "다음"}
                    </StyledButton>
                </ContentsContainer>
            </PageWrapper>
        </>
    );
};

const UserInfoInputField = ({ userInfo, setter }: { userInfo: InputUserInfo; setter: React.Dispatch<React.SetStateAction<InputUserInfo>> }) => {
    return (
        <>
            <StyledTextField id="id" label="아이디" value={userInfo.id} onChange={(e) => setter((prev) => ({ ...prev, id: e.target.value }))} />
            <StyledTextField id="password" label="비밀번호" type="password" value={userInfo.password} onChange={(e) => setter((prev) => ({ ...prev, password: e.target.value }))} />
            <StyledTextField id="name" label="이름" value={userInfo.name} onChange={(e) => setter((prev) => ({ ...prev, name: e.target.value }))} />
            <StyledTextField id="phoneNumber" label="전화번호" value={userInfo.phoneNumber} onChange={(e) => setter((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
            <StyledTextField id="address" label="개인 주소" value={userInfo.address} onChange={(e) => setter((prev) => ({ ...prev, address: e.target.value }))} />
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

export default SignUpPage;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const LogoContainer = styled.img`
    width: 600px;
`;

const ContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled(Typography)`
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
    width: 400px;
    margin-bottom: 20px;
`;

const StyledBox = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;
const StyledButton = styled(Button)`
    margin-bottom: 20px;
`;

const ImageContainer = styled(Box)`
    width: 200px;
    height: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
`;
