export type InputUserInfo = {
    id: string;
    password: string;
    name: string;
    phoneNumber: string;
    address: string;
};

export type InputCompanyInfo = {
    name: string;
    introduction: string;
    address: string;
    dialNumber: string;
    representativeEquipment: string;
    image: File | string | undefined; // 파일 객체 또는 이미지 URL
};
