import styled from "@emotion/styled";
import { Button, TextField } from "@mui/material";
import Logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { newAxios } from "../utils/newAxios";
import { useAppDispatch } from "../store/store";
import { login, LoginData } from "../store/loginSlice";

const LoginPage = () => {
    const navigate = useNavigate();
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useAppDispatch();

    const handleSubmit = async () => {
        const data = { username: id, password: password };
        try {
            const response = await newAxios.post("/api/v1/auth/login", data, {
                headers: { "Content-Type": "application/json" },
            });
            console.log(response.data.data);
            if (response.data.status === 200) {
                const loginData: LoginData = response.data.data;
                localStorage.setItem("accessToken", loginData.accessToken);
                localStorage.setItem("manufacturerId", loginData.manufacturerId);
                navigate("/dashboard");
            }
        } catch (e) {
            console.error("로그인 에러:", e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <PageWrapper>
            <LogoContainer src={Logo} />
            <StyledTextField id="id" label="아이디" value={id} onChange={(e) => setId(e.target.value)} onKeyDown={handleKeyDown} />
            <StyledTextField id="password" label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
            <StyledButton variant="contained" sx={{ width: "300px" }} onClick={handleSubmit}>
                로그인
            </StyledButton>
            <StyledButton onClick={() => navigate("/signup")}>회원가입</StyledButton>
        </PageWrapper>
    );
};

export default LoginPage;

// 스타일링
const PageWrapper = styled.div`
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
