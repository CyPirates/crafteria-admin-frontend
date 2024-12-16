import styled from "styled-components";
import GoogleLoginLogo from "../assets/googleLogin.svg";
import Logo from "../assets/logo.png";

const LoginPage = () => {
    const handleOnClick = () => {
        window.location.href = "https://api.crafteria.co.kr/oauth2/authorization/google?role=dashboard";
    };
    return (
        <>
            <PageWrapper>
                <img src={Logo} />
                <LoginButton src={GoogleLoginLogo} onClick={handleOnClick} />
            </PageWrapper>
        </>
    );
};

export default LoginPage;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const LoginButton = styled.img`
    width: 300px;

    &:hover {
        cursor: pointer;
    }
`;
