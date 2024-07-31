import Layout from "../components/layout";
import { useNavigate } from "react-router-dom";
import { Menu } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { Alert, Button, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

export default function OrderCreatePage() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const { data: menus, error } = useSWR<Menu[]>("/menus");

    const orderCreateForm = useForm({
        initialValues: {
            menu_id: "",
            quantity: 1,
            note: "",
        },
        validate: {
            menu_id: isNotEmpty("กรุณาระบุเมนู"),
            quantity: isNotEmpty("กรุณาระบุจำนวน"),
        },
    });

    const handleSubmit = async (values: typeof orderCreateForm.values) => {
        try {
            setIsProcessing(true);
            const response = await axios.post("/orders", values);
            notifications.show({
                title: "สร้างรายการสั่งซื้อสำเร็จ",
                message: `สร้างรายการสั่งซื้อ "${response.data.menu_id}" เรียบร้อยแล้ว`,
                color: "teal",
            });
            navigate("/orders");
        } catch (error) {
            const axiosError = error as AxiosError;
            notifications.show({
                title: "เกิดข้อผิดพลาดในการสร้างรายการสั่งซื้อ",
                message: (axiosError.response?.data as any)?.message ?? axiosError.message,
                color: "red",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Layout>
            <Container>
                <h1>สร้างรายการสั่งซื้อ</h1>
                <Divider />

                {!menus && !error && <Loading />}
                {error && (
                    <Alert
                        color="red"
                        title="เกิดข้อผิดพลาดในการโหลดข้อมูลเมนู"
                        icon={<IconAlertTriangleFilled />}
                    >
                        {error.message}
                    </Alert>
                )}

                <form onSubmit={orderCreateForm.onSubmit(handleSubmit)}>
                    <TextInput
                        label="เมนู"
                        placeholder="เลือกเมนู"
                        value={orderCreateForm.values.menu_id}
                        onChange={(event) => orderCreateForm.setFieldValue("menu_id", event.currentTarget.value)}
                        error={orderCreateForm.errors.menu_id}
                        disabled={isProcessing}
                        radius="md"
                        required
                    />

                    <NumberInput
                        label="จำนวน"
                        placeholder="เลือกจำนวน"
                        value={orderCreateForm.values.quantity}
                        onChange={(value) => orderCreateForm.setFieldValue("quantity", Number(value))}
                        error={orderCreateForm.errors.quantity}
                        disabled={isProcessing}
                        radius="md"
                        required
                    />

                    <TextInput
                        label="หมายเหตุ"
                        placeholder="ระบุหมายเหตุ"
                        value={orderCreateForm.values.note}
                        onChange={(event) => orderCreateForm.setFieldValue("note", event.currentTarget.value)}
                        error={orderCreateForm.errors.note}
                        disabled={isProcessing}
                        radius="md"
                    />

                    <Button
                        type="submit"
                        loading={isProcessing}
                        disabled={isProcessing}
                        radius="md"
                        variant="outline"
                        color="teal"
                    >
                        สร้างรายการสั่งซื้อ
                    </Button>
                </form>
            </Container>
        </Layout>
    );
}
