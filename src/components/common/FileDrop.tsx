import { useState } from "react";
import styled from "styled-components";
import { InputCompanyInfo } from "../../types/SignUpType";

type OwnProps = {
    setData: React.Dispatch<React.SetStateAction<InputCompanyInfo>>;
};

const FileDrop = ({ setData }: OwnProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDragStart = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsActive(true);
    };

    const handleDragEnd = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsActive(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsActive(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setData((prev) => ({ ...prev, image: file }));
        }
    };

    return (
        <Label isActive={isActive} onDragEnter={handleDragStart} onDragOver={handleDragOver} onDragLeave={handleDragEnd} onDrop={handleDrop}>
            <input type="file" onChange={handleOnChange} style={{ display: "none" }} />
            {selectedFile ? <img src={URL.createObjectURL(selectedFile)} width="200px" height="200px" /> : <p>파일을 드롭하거나 클릭하여 업로드</p>}
        </Label>
    );
};

export default FileDrop;

const Label = styled.label<{ isActive: boolean }>`
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    border: 2px dashed ${({ isActive }) => (isActive ? "#000000" : "#999999")};
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    transition: border 0.2s ease-in-out;

    &:hover {
        border: 2px dashed #000000;
    }
`;
