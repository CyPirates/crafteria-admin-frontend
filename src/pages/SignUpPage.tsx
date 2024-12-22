import styled from "@emotion/styled";
import Logo from "../assets/logo.png";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { newAxios } from "../utils/newAxios";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    const handleSubmit = async () => {
        const data = {
            username: id,
            password: password,
            realname: name,
            phoneNumber: phoneNumber,
            address: address,
        };

        try {
            const response = await newAxios.post("/api/v1/auth/register", data);
            console.log(response.data);
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <PageWrapper>
                <LogoContainer src={Logo} />
                <ContentsContainer>
                    <Title>회원가입</Title>
                    <StyledTextField id="id" label="아이디" defaultValue={id} onChange={(e) => setId(e.target.value)} />
                    <StyledTextField id="password" label="비밀번호" type="password" defaultValue={password} onChange={(e) => setPassword(e.target.value)} />
                    <StyledTextField id="name" label="이름" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                    <StyledTextField id="phoneNumber" label="전화번호" defaultValue={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    <StyledTextField id="address" label="주소" defaultValue={address} onChange={(e) => setAddress(e.target.value)} />
                    <StyledButton variant="contained" sx={{ width: "400px" }} onClick={handleSubmit}>
                        가입하기
                    </StyledButton>
                </ContentsContainer>
            </PageWrapper>
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
    margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
    width: 400px;
    margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
    margin-bottom: 20px;
`;
