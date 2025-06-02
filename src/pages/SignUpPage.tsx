import styled from "@emotion/styled";
import Logo from "../assets/logo.png";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/newAxios";
import { InputUserInfo } from "../types/SignUpType";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [idAvailable, setIdAvailable] = useState<number>(0); // 0 : input nothing, 1: available, 2: unavailable
    const [userInfo, setUserInfo] = useState<InputUserInfo>({
        id: "",
        password: "",
        realname: "",
        phoneNumber: "",
        address: "",
        manufacturerName: "",
        manufacturerDescription: "",
    });

    const checkIdAvailability = async () => {
        if (userInfo.id === "") {
            setIdAvailable(0);
            return;
        }
        const response = await newAxios.post(`/api/v1/auth/check-username?username=${userInfo.id}`);
        if (response.data.data == true) {
            setIdAvailable(1);
        } else {
            setIdAvailable(2);
        }
    };

    const handleSubmit = async () => {
        console.log(userInfo);

        const userData = {
            username: userInfo.id,
            password: userInfo.password,
            realname: userInfo.realname,
            phoneNumber: userInfo.phoneNumber,
            address: userInfo.address,
            manufacturerName: userInfo.manufacturerName,
            manufacturerDescription: userInfo.manufacturerDescription,
        };

        try {
            await newAxios.post("/api/v1/auth/register", userData);
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        checkIdAvailability();
    }, [userInfo.id]);

    return (
        <>
            <PageWrapper>
                <LogoContainer src={Logo} />
                <ContentsContainer>
                    <Title>회원가입</Title>
                    <div>가입 후 승인까지 시간이 소요될 수 있습니다.</div>
                    <UserInfoInputField userInfo={userInfo} setter={setUserInfo} idAvailable={idAvailable} />
                    <StyledButton variant="contained" sx={{ width: "400px" }} onClick={handleSubmit}>
                        가입하기
                    </StyledButton>
                </ContentsContainer>
            </PageWrapper>
        </>
    );
};

const UserInfoInputField = ({ userInfo, setter, idAvailable }: { userInfo: InputUserInfo; setter: React.Dispatch<React.SetStateAction<InputUserInfo>>; idAvailable: number }) => {
    return (
        <>
            <StyledTextField id="id" label="아이디" value={userInfo.id} onChange={(e) => setter((prev) => ({ ...prev, id: e.target.value }))} />
            <div style={{ color: idAvailable === 2 ? "red" : "black" }}>{idAvailable === 0 ? "" : idAvailable === 1 ? "사용 가능한 아이디입니다." : "이미 존재하는 아이디입니다."}</div>
            <StyledTextField id="password" label="비밀번호" type="password" value={userInfo.password} onChange={(e) => setter((prev) => ({ ...prev, password: e.target.value }))} />
            <StyledTextField id="name" label="이름" value={userInfo.realname} onChange={(e) => setter((prev) => ({ ...prev, realname: e.target.value }))} />
            <StyledTextField id="phoneNumber" label="전화번호" value={userInfo.phoneNumber} onChange={(e) => setter((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
            <StyledTextField id="address" label="개인 주소" value={userInfo.address} onChange={(e) => setter((prev) => ({ ...prev, address: e.target.value }))} />
            <StyledTextField id="name" label="업체명" value={userInfo.manufacturerName} onChange={(e) => setter((prev) => ({ ...prev, manufacturerName: e.target.value }))} />
            <StyledTextField id="introduction" label="비고" value={userInfo.manufacturerDescription} onChange={(e) => setter((prev) => ({ ...prev, manufacturerDescription: e.target.value }))} />
        </>
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
    //margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
    width: 400px;
    margin-top: 20px;
`;

const StyledButton = styled(Button)`
    margin: 20px 0;
`;
