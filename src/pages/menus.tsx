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
        className="relative h-[500px] w-full bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${cafeBackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">เมนู</h1>
          <p className="text-lg md:text-xl">รายการเมนูทั้งหมด</p>
        </div>
      </section>

      <section className="container mx-auto py-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">รายการเมนู</h1>
          <Button
            component={Link}
            leftSection={<IconPlus />}
            to="/menus/create"
            size="md"
            variant="outline"
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
            className="mb-6"
          >
            {error.message}
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menus?.map((menu) => (
            <div
              className="border border-neutral-300 bg-white rounded-lg shadow-lg overflow-hidden"
              key={menu.id}
            >
              <img
                src="https://placehold.co/300x400"
                alt={menu.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-5">
                <h2 className="text-lg font-semibold truncate">{menu.name}</h2>
                <p className="text-sm text-gray-600 mt-1">ราคา {menu.price} บาท</p>
              </div>

              <div className="flex justify-around border-t border-gray-200 bg-gray-50 p-3">
                <Button
                  component={Link}
                  to={`/orders/${menu.id}`}
                  size="sm"
                  variant="light"
                  className="flex-grow mx-1"
                >
                  ซื้อ
                </Button>
                <Button
                  component={Link}
                  to={`/menus/${menu.id}`}
                  size="sm"
                  variant="light"
                  className="flex-grow mx-1"
                >
                  ดูรายละเอียด
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
