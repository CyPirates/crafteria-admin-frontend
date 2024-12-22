import styled from "@emotion/styled";
import { Button, TextField } from "@mui/material";
import Logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { newAxios } from "../utils/newAxios";

const LoginPage = () => {
    const navigate = useNavigate();
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = async () => {
        const data = {
            username: id,
            password: password,
        };

        try {
            const response = await newAxios.post("/api/v1/auth/login", data);
            if (response.data.status == 200) {
                localStorage.setItem("accessToken", response.data.data.accessToken);
                navigate("/dashboard");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <PageWrapper>
                <LogoContainer src={Logo} />
                <StyledTextField id="id" label="아이디" defaultValue={id} onChange={(e) => setId(e.target.value)} />
                <StyledTextField id="password" label="비밀번호" type="password" defaultValue={password} onChange={(e) => setPassword(e.target.value)} />
                <StyledButton variant="contained" sx={{ width: "300px" }} onClick={handleSubmit}>
                    로그인
                </StyledButton>
                <StyledButton onClick={() => navigate("/signup")}>회원가입</StyledButton>
            </PageWrapper>
        </>
    );
};

export default LoginPage;

const PageWrapper = styled.div`
    //height: 99vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const LogoContainer = styled.img`
    width: 800px;
`;

const StyledTextField = styled(TextField)`
    width: 300px;
    margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
    margin-bottom: 20px;
`;
