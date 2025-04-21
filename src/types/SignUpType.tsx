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
    image: File | string | undefined;
    printSpeedFilament: string;
    printSpeedPowder: string;
    printSpeedLiquid: string;
};
