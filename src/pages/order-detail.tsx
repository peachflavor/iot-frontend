import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Order } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button, Container, Divider } from "@mantine/core";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetail() {
    const { orderId } = useParams<{ orderId: string }>();
    const { data: order, error } = useSWR<Order>(`/orders/${orderId}`);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete(`/orders/${orderId}`);
            notifications.show({
                title: "ลบรายการสั่งซื้อสำเร็จ",
                message: `ลบรายการสั่งซื้อ "${orderId}" เรียบร้อยแล้ว`,
                color: "teal",
            });
            navigate("/orders");
        } catch (error) {
            const axiosError = error as AxiosError;
            notifications.show({
                title: "เกิดข้อผิดพลาดในการลบรายการสั่งซื้อ",
                message: (axiosError.response?.data as any)?.message ?? axiosError.message,
                color: "red",
            });
        }
    };

    if (!order && !error) {
        return <Loading />;
    }

    if (error) {
        return (
            <Alert
                color="red"
                title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
                icon={<IconAlertTriangleFilled />}
            >
                {error.message}
            </Alert>
        );
    }

    return (
        <Layout>
            <Container>
                <section
                    className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                    style={{
                        backgroundImage: `url(${cafeBackgroundImage})`,
                    }}
                >
                    <h1 className="text-5xl mb-2">รายละเอียดรายการสั่งซื้อ</h1>
                    <h2>รายละเอียดของรายการสั่งซื้อ</h2>
                </section>

                <h1>รายละเอียดรายการสั่งซื้อ</h1>
                <Divider />

                <div className="flex justify-between items-center mb-4">
                    <h2>รายละเอียดรายการสั่งซื้อ</h2>
                    <Button
                        variant="outline"
                        color="red"
                        onClick={() => {
                            modals.openConfirmModal({
                                title: "ยืนยันการลบรายการสั่งซื้อ",
                                children: (
                                    <div>
                                        คุณต้องการลบรายการสั่งซื้อ "{orderId}" ใช่หรือไม่?
                                    </div>
                                ),
                                confirmProps: { color: 'red' },
                                onConfirm: handleDelete,
                            });
                        }}
                        leftSection={<IconTrash />}
                    >
                        ลบรายการสั่งซื้อ
                    </Button>
                </div>

                <div>
                    {order && (
                        <>
                            <p>รหัสรายการสั่งซื้อ: {order.id}</p>
                            <p>ชื่อ: {order.name}</p>
                            <p>ราคา: {order.price}</p>
                            <p>รวมทั้งหมด: {order.total}</p>
                            <p>หมายเหตุ: {order.note}</p>
                        </>
                    )}
                </div>
            </Container>
        </Layout>
    );
}
