import { useEffect, useState } from "react";
import { Order } from "../types/OrderType";

type OwnProps = {
    orderList: Order[];
};

const useClassifiedOrderList = ({ orderList }: OwnProps) => {
    const [paid, setPaid] = useState<Order[]>([]);
    const [inProducting, setInProducting] = useState<Order[]>([]);
    const [delivering, setDelivering] = useState<Order[]>([]);
    const [canceled, setCanceled] = useState<Order[]>([]);

    useEffect(() => {
        const classifiedPaid = orderList.filter((order) => order.status === "PAID");
        const classifiedInProducting = orderList.filter((order) => order.status === "IN_PRODUCTING");
        const classifiedDelivering = orderList.filter((order) => order.status === "DELIVERING");
        const classifiedCanceled = orderList.filter((order) => order.status === "CANCELED");

        setPaid(classifiedPaid);
        setInProducting(classifiedInProducting);
        setDelivering(classifiedDelivering);
        setCanceled(classifiedCanceled);
    }, [orderList]);

    return { paid, inProducting, delivering, canceled };
};

export default useClassifiedOrderList;
