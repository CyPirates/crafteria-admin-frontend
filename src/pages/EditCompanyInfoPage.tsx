import styled from "@emotion/styled";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { newAxios } from "../utils/newAxios";

const EditCompanyInfoPage = () => {
    const data = useLocation().state;
    const navigate = useNavigate();
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // 미리보기용 상태 추가
    const [name, setName] = useState<string>(data.name);
    const [introduction, setIntroduction] = useState<string>(data.introduction);
    const [address, setAddress] = useState<string>(data.address);
    const [dialNumber, setDialNumber] = useState<string>(data.dialNumber);
    const [equipment, setEquipment] = useState<string>(data.representativeEquipment);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const reader = new FileReader();
        setImage(file);
        if (file) {
            setImage(file); // 업로드된 파일을 상태에 저장

            // FileReader로 파일을 읽어 미리보기 URL을 생성
            reader.onloadend = () => {
                if (reader.result) {
                    setImagePreview(reader.result as string); // 미리보기 URL로 상태 업데이트
                }
            };

            reader.readAsDataURL(file); // 파일을 DataURL 형식으로 읽기
        }
    };

    const handleEditSubmit = async () => {
        const submittedData = new FormData();
        submittedData.append("name", name);
        submittedData.append("introduction", introduction);
        submittedData.append("address", address);
        submittedData.append("dialNumber", dialNumber);
        submittedData.append("representativeEquipment", equipment);

        if (image) {
            // 사용자가 업로드한 이미지를 추가
            submittedData.append("image", image);
        } else {
            // 기본 이미지 URL을 Blob으로 변환하여 추가
            fetch(data.imageUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    submittedData.append("image", blob, "default-image.jpg");
                })
                .catch((err) => console.error("이미지 변환 실패:", err));
        }

        try {
            const response = await newAxios.put(`/api/v1/manufacturers/${4}`, submittedData, { headers: { "Content-Type": "multipart/form-data" } });
            console.log(response.data);
            navigate("/dashboard");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <PageWrapper>
                <ImageContainer>
                    {/* 이미지가 있을 경우 미리보기 이미지를 표시하고, 없으면 기본 이미지 URL을 표시 */}
                    <img style={{ width: "200px", height: "200px", objectFit: "cover" }} src={imagePreview ? imagePreview : data.imageUrl} alt="Preview" />
                    <input accept="image/*" id="image" type="file" style={{ display: "none" }} onChange={handleFileUpload} />
                    <label htmlFor="image">
                        <Button component="span">이미지 수정</Button>
                    </label>
                </ImageContainer>
                <TextFieldContainer>
                    <StyledTextField required id="name" label="이름" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                    <StyledTextField required id="introduction" label="소개말" defaultValue={introduction} onChange={(e) => setIntroduction(e.target.value)} />
                    <StyledTextField required id="address" label="주소" defaultValue={address} onChange={(e) => setAddress(e.target.value)} />
                    <StyledTextField required id="dialNumber" label="전화번호" defaultValue={dialNumber} onChange={(e) => setDialNumber(e.target.value)} />
                    <StyledTextField required id="equipment" label="대표장비" defaultValue={equipment} onChange={(e) => setEquipment(e.target.value)} />
                </TextFieldContainer>
                <Button variant="contained" onClick={() => handleEditSubmit()}>
                    수정 완료
                </Button>
            </PageWrapper>
        </>
    );
};

export default EditCompanyInfoPage;

const PageWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ImageContainer = styled(Box)`
    width: 200px;
    height: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TextFieldContainer = styled.div`
    margin-top: 50px;
    padding: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 20px;
`;

const StyledTextField = styled(TextField)`
    width: 100%;
`;
