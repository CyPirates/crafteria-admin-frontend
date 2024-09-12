export type Order = {
    orderId: string;
    userId: string;
    purchasePrice: string;
    manufactureId: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    magnification: string;
    quantity: string;
    deliveryAddress: string;
    status: string;
    modelFileUrl: string;
};

export type ClassifiedOrderList = {
    ORDERED: Order[];
    IN_PRODUCTING: Order[];
    DELIVERED: Order[];
    CANCELED: Order[];
};
