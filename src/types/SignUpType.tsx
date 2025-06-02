export type InputUserInfo = {
    id: string;
    password: string;
    realname: string;
    phoneNumber: string;
    address: string;
    manufacturerName: string;
    manufacturerDescription: string;
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
