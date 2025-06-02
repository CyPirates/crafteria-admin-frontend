import { useEffect, useState } from "react";
import { Order } from "../types/OrderType";

type OwnProps = {
    orderList: Order[];
};

const useClassifiedOrderList = ({ orderList }: OwnProps) => {
    const [paid, setPaid] = useState<Order[]>([]);
    const [inProducting, setInProducting] = useState<Order[]>([]);
    const [producted, setProducted] = useState<Order[]>([]);
    const [delivering, setDelivering] = useState<Order[]>([]);
    const [delivered, setDelivered] = useState<Order[]>([]);
    const [canceled, setCanceled] = useState<Order[]>([]);

    useEffect(() => {
        const classifiedPaid = orderList.filter((order) => order.status === "PAID");
        const classifiedInProducting = orderList.filter((order) => order.status === "IN_PRODUCTING");
        const classifiedProducted = orderList.filter((order) => order.status === "PRODUCTED");
        const classifiedDelivering = orderList.filter((order) => order.status === "DELIVERING");
        const classifiedDelivered = orderList.filter((order) => order.status === "DELIVERED");
        const classifiedCanceled = orderList.filter((order) => order.status === "CANCELED");

        setPaid(classifiedPaid);
        setInProducting(classifiedInProducting);
        setProducted(classifiedProducted);
        setDelivering(classifiedDelivering);
        setDelivered(classifiedDelivered);
        setCanceled(classifiedCanceled);
    }, [orderList]);

    return { paid, inProducting, producted, delivering, delivered, canceled };
};

export default useClassifiedOrderList;
