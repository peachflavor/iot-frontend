import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Checkbox, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import Layout from "../components/layout";
import Loading from "../components/loading";
import { Menu } from "../lib/models";
import { isNotEmpty, useForm } from "@mantine/form";

const EditMenuPage = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const { data: menu, error, isLoading } = useSWR<Menu>(`/menus/${menuId}`);

  const form = useForm({
    initialValues: {
      name: "",
      price: 0,
      detail: "",
      ingredient: "",
      is_published: false,
    },
    validate: {
      name: isNotEmpty("กรุณากรอกชื่อเมนู"),
      price: isNotEmpty("กรุณากรอกราคา"),
      detail: isNotEmpty("กรุณากรอกรายละเอียดเมนู"),
      ingredient: isNotEmpty("กรุณากรอกส่วนผสม"),
    },
  });

  useEffect(() => {
    if (menu && !hasInitialized) {
      form.setValues(menu);
      setHasInitialized(true);
    }
  }, [menu, form, hasInitialized]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/menus/${menuId}`, values);
      notifications.show({
        title: "การแก้ไขสำเร็จ",
        message: "ข้อมูลเมนูได้รับการอัพเดตเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menus/${menuId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) {
          notifications.show({
            title: "ไม่พบเมนู",
            message: "ไม่พบข้อมูลเมนูที่ต้องการแก้ไข",
            color: "red",
          });
        } else if (status ?? 0 >= 500) {
            notifications.show({
                title: "ข้อผิดพลาดของเซิร์ฟเวอร์",
                message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์ กรุณาลองใหม่",
                color: "red",
            });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาด",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่ หรือดูข้อมูลเพิ่มเติมที่ Console",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/menus/${menuId}`);
      notifications.show({
        title: "ลบเมนูสำเร็จ",
        message: "เมนูถูกลบออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/menus");
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status ?? 0;
        if (status === 404) {
            notifications.show({
                title: "ไม่พบเมนู",
                message: "ไม่พบข้อมูลเมนูที่ต้องการลบ",
                color: "red",
            });
        } else if (status >= 500) {
            notifications.show({
                title: "ข้อผิดพลาดของเซิร์ฟเวอร์",
                message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์ กรุณาลองใหม่",
                color: "red",
            });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาด",
          message: "เกิดข้อผิดพลาด กรุณาลองใหม่ หรือดูข้อมูลเพิ่มเติมที่ Console",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <Container className="mt-8">
        <h1 className="text-xl font-bold">แก้ไขเมนู</h1>

        {isLoading && !error && <Loading />}
        {error && (
          <Alert
            color="red"
            title="ข้อผิดพลาดในการโหลดข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}

        {menu && (
          <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
            <TextInput
              label="ชื่อเมนู"
              placeholder="กรุณากรอกชื่อเมนู"
              {...form.getInputProps("name")}
            />

            <NumberInput
              label="ราคา"
              placeholder="กรุณากรอกราคา"
              min={0}
              {...form.getInputProps("price")}
            />

            <TextInput
              label="รายละเอียด"
              placeholder="กรุณากรอกรายละเอียดเมนู"
              {...form.getInputProps("detail")}
            />

            <TextInput
              label="ส่วนผสม"
              placeholder="กรุณากรอกส่วนผสม"
              {...form.getInputProps("ingredient")}
            />

            <Checkbox
              label="เผยแพร่"
              {...form.getInputProps("is_published", { type: "checkbox" })}
            />

            <Divider />

            <div className="flex justify-between">
              <Button
                color="red"
                leftSection={<IconTrash />}
                size="xs"
                onClick={() => {
                  modals.openConfirmModal({
                    title: "ยืนยันการลบ",
                    children: (
                      <span className="text-xs">
                        การลบเมนูจะไม่สามารถย้อนกลับได้
                      </span>
                    ),
                    labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                    onConfirm: handleDelete,
                    confirmProps: {
                      color: "red",
                    },
                  });
                }}
              >
                ลบเมนูนี้
              </Button>

              <Button type="submit" loading={isProcessing}>
                บันทึกการเปลี่ยนแปลง
              </Button>
            </div>
          </form>
        )}
      </Container>
    </Layout>
  );
};

export default EditMenuPage;
