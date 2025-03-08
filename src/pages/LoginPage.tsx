import styled from "@emotion/styled";
import { Button, TextField } from "@mui/material";
import Logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { newAxios } from "../utils/newAxios";
import { useDispatch } from "react-redux";
import { login, LoginData } from "../store/loginSlice"; // 변경된 login import
import { useAppDispatch } from "../store/store";

const LoginPage = () => {
    const navigate = useNavigate();
    const [id, setId] = useState<string>(""); // 아이디 상태
    const [password, setPassword] = useState<string>(""); // 비밀번호 상태
    const dispatch = useAppDispatch(); // dispatch

    const handleSubmit = async () => {
        const data = {
            username: id,
            password: password,
        };
        try {
            // 로그인 API 호출
            const response = await newAxios.post("/api/v1/auth/login", data, {
                headers: { "Content-Type": "application/json" },
            });
            console.log(response.data.data);
            if (response.data.status === 200) {
                const loginData: LoginData = response.data.data;
                // console.log(loginData.accessToken);
                // console.log(typeof loginData);
                // // 로그인 성공 시 Redux에 로그인 데이터 저장
                // dispatch(login(loginData));
                localStorage.setItem("accessToken", loginData.accessToken);
                localStorage.setItem("manufacturerId", loginData.manufacturerId);
                navigate("/dashboard"); // 대시보드로 이동
            }
        } catch (e) {
            console.error("로그인 에러:", e);
        }
    };

    return (
        <PageWrapper>
            <LogoContainer src={Logo} />
            <StyledTextField
                id="id"
                label="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)} // 아이디 입력 처리
            />
            <StyledTextField
                id="password"
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 처리
            />
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
