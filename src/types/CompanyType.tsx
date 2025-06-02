export type Company = {
    id: string;
    name: string;
    introduction: string;
    address: string;
    dialNumber: string;
    productionCount: string;
    rating: string;
    representativeEquipment: string;
    imageFileUrl: string;
    printSpeedFilament: string;
    printSpeedPowder: string;
    printSpeedLiquid: string;
};

export type Equipment = {
    id: string;
    name: string;
    description: string;
    status: string;
    imageFileUrl: string;
    manufacturerId: string;
    printSpeed?: string;
};

export type InitCompany = {
    name: string;
    introduction: string;
    address: string;
    dialNumber: string;
    representativeEquipment: string;
    image: File;
};
