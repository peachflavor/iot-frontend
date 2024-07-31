import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Menu } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function MenusPage() {
    const { data: menus, error } = useSWR<Menu[]>("/menus");

    return (
        <Layout>
            <section
                className="h-[500px] w-full text-white bg-pink-200 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                style={{
                    backgroundImage: `url(${cafeBackgroundImage})`,
                }}
            >
                <h1 className="text-5xl mb-2">เมนูของเรา</h1>
                <h2>รายการอาหารและเครื่องดื่มที่เรามีให้บริการ</h2>
            </section>

            <section className="container mx-auto py-8">
                <div className="flex justify-between mb-4">
                    <h1>รายการอาหารและเครื่องดื่ม</h1>
                    <Button
                        component={Link}
                        leftSection={<IconPlus />}
                        to="/menus/create"
                        size="xs"
                        variant="primary"
                        className="flex items-center space-x-2"
                    >
                        เพิ่มเมนู
                    </Button>
                </div>

                {!menus && !error && <Loading />}
                {error && (
                    <Alert
                        color="red"
                        title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
                        icon={<IconAlertTriangleFilled />}
                    >
                        {error.message}
                    </Alert>
                )}

                {menus && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {menus.map((menu) => (
                            <div
                                key={menu.id}
                                className="border border-solid border-neutral-200 bg-white rounded-lg shadow-md"
                            >
                                <img
                                    src={menu.image_url} // Ensure image_url is valid
                                    alt={menu.name}
                                    className="w-full object-cover aspect-[3/4]"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold line-clamp-2">{menu.name}</h2>
                                    <p className="text-xs text-neutral-500">ราคา {menu.price} บาท</p>
                                </div>

                                <div className="flex justify-between p-4 border-t border-neutral-200">
                                    <Button
                                        component={Link}
                                        to={`/orders/${menu.id}`}
                                        size="xs"
                                        variant="default"
                                    >
                                        ซื้อ
                                    </Button>
                                    <Button
                                        component={Link}
                                        to={`/menus/${menu.id}`}
                                        size="xs"
                                        variant="default"
                                    >
                                        ดูรายละเอียด
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </Layout>
    );
}
