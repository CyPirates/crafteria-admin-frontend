export type Order = {
    orderId: string;
    userId: string;
    purchasePrice: string;
    manufactureId: string;
    status: string;
    modelFileUrls: string[];
    deliveryAddress: string;
    recipientName: string;
    recipientPhone: string;
    recipientEmail: string;
    specialRequest: string;
    orderItems: Items[];
    delivery: Delivery;
};

export type Delivery = {
    deliveryId: string;
    courier: string;
    trackingNumber: string;
    deliveryDate: string;
};

export type Items = {
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    magnification: string;
    quantity: string;
    technologyId: string;
};

export type ClassifiedOrderList = {
    ORDERED: Order[];
    IN_PRODUCTING: Order[];
    DELIVERED: Order[];
    CANCELED: Order[];
};
