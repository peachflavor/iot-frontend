import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Order } from "../lib/models";
import Loading from "../components/loading";
import { Alert} from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function StaffPage() {
  const { data: orders, error } = useSWR<Order[]>("/orders"); // Adjusted the endpoint to "/orders"

  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">รายการออเดอร์</h1>
        <h2>รายการที่ออเดอร์มาทั้งหมด</h2>
      </section>

      <section className="container mx-auto py-8">
        <div className="flex justify-between mb-4">
          <h1>รายการออเดอร์</h1>
        </div>

        {!orders && !error && <Loading />}
        {error && (
          <Alert
            color="red"
            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}

        {orders && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-solid border-neutral-200 bg-white rounded-lg shadow-md"
              >
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{order.id}</h2>
                  <p className="text-sm text-neutral-500">ชื่อ: {order.name}</p>
                  <p className="text-sm text-neutral-500">ราคา: {order.price}</p>
                  <p className="text-sm text-neutral-500">รวมทั้งหมด: {order.total}</p>
                  <p className="text-sm text-neutral-500">หมายเหตุ: {order.note}</p>
                  <Link to={`/orders/${order.id}`} className="block mt-4">
                    ดูรายละเอียด
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
