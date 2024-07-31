import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Order } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function StaffPage() {
  const { data: orders, error } = useSWR<Order[]>("/orders");

  return (
    <Layout>
      <section
        className="relative h-[500px] w-full bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${cafeBackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">รายการออเดอร์</h1>
          <p className="text-lg md:text-xl">รายการที่ออเดอร์มาทั้งหมด</p>
        </div>
      </section>

      <section className="container mx-auto py-8">
        {!orders && !error && <Loading />}
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
          {orders?.map((order) => (
            <div
              key={order.id}
              className="border border-neutral-300 bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-5">
                <h2 className="text-lg font-semibold truncate">{order.name}</h2>
                <p className="text-sm text-gray-600 mt-1">จำนวน {order.total} ชิ้น</p>
                <p className="text-sm text-gray-600 mt-1">ราคาทั้งหมด {order.price} บาท</p>
              </div>
              <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
                <Button
                  component={Link}
                  to={`/orders/${order.id}`}
                  size="sm"
                  variant="outline"
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
