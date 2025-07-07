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
    equipmentList: Equipment[];
    totalReviews: string;
    technologies: Technology[];
    printSpeedFilament: string;
    printSpeedLiquid: string;
    printSpeedMetalPowder: string;
    printSpeedNylonPowder: string;
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

export type Technology = {
    technologyId: string;
    manufacturerId: string;
    material: string;
    description: string;
    colorValue: string;
    imageUrl: string;
    pricePerHour: string;
};

export type InitCompany = {
    name: string;
    introduction: string;
    address: string;
    dialNumber: string;
    representativeEquipment: string;
    image: File;
};
