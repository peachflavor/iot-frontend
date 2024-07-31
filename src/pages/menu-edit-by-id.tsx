import useSWR from "swr";
import { Menu } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import { Alert, Button, Checkbox, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

const MenuEditPage = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch menu data using SWR
  const { data: menu, isLoading, error } = useSWR<Menu>(`/menus/${menuId}`);
  const [isInitialized, setIsInitialized] = useState(false);

  // Form for editing menu
  const menuEditForm = useForm({
    initialValues: {
      name: "",
      price: 0,
      detail: "",
      ingredient: "",
      is_published: false,
    },
    validate: {
      name: isNotEmpty("กรุณาระบุชื่อเมนู"),
      price: isNotEmpty("กรุณาระบุราคา"),
      detail: isNotEmpty("กรุณาระบุรายละเอียดเมนู"),
      ingredient: isNotEmpty("กรุณาระบุส่วนผสม"),
    },
  });

  // Handle form submission
  const handleSubmit = async (values: typeof menuEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/menus/${menuId}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลเมนูสำเร็จ",
        message: "ข้อมูลเมนูได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menus/${menuId}`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete menu
  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/menus/${menuId}`);
      notifications.show({
        title: "ลบเมนูสำเร็จ",
        message: "ลบเมนูนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/menus");
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle error notifications
  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        notifications.show({
          title: "ไม่พบข้อมูลเมนู",
          message: "ไม่พบข้อมูลเมนูที่ต้องการ",
          color: "red",
        });
    } else if (error.response?.status ?? 0 >= 500) {
        notifications.show({
            title: "ข้อผิดพลาดจากเซิร์ฟเวอร์",
            message: "กรุณาลองอีกครั้งในภายหลัง",
            color: "red",
        });
    }
    } else {
      notifications.show({
        title: "ข้อผิดพลาด",
        message: "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง",
        color: "red",
      });
    }
  };

  // Initialize form values when menu data is available
  useEffect(() => {
    if (!isInitialized && menu) {
      menuEditForm.setValues(menu);
      setIsInitialized(true);
    }
  }, [menu, menuEditForm, isInitialized]);

  return (
    <Layout>
      <Container className="mt-8">
        <h1 className="text-xl">แก้ไขข้อมูลเมนู</h1>

        {isLoading && !error && <Loading />}
        {error && (
          <Alert
            color="red"
            title="เกิดข้อผิดพลาดในการโหลดข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}

        {menu && (
          <form onSubmit={menuEditForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput
              label="ชื่อเมนู"
              placeholder="ชื่อเมนู"
              {...menuEditForm.getInputProps("name")}
            />

            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              min={0}
              {...menuEditForm.getInputProps("price")}
            />

            <TextInput
              label="รายละเอียดเมนู"
              placeholder="รายละเอียดเมนู"
              {...menuEditForm.getInputProps("detail")}
            />

            <TextInput
              label="ส่วนผสม"
              placeholder="ส่วนผสม"
              {...menuEditForm.getInputProps("ingredient")}
            />

            <Checkbox
              label="เผยแพร่"
              {...menuEditForm.getInputProps("is_published", {
                type: "checkbox",
              })}
            />

            <Divider />

            <div className="flex justify-between">
              <Button
                color="red"
                size="xs"
                leftSection={<IconTrash />}
                onClick={() => {
                  modals.openConfirmModal({
                    title: "ยืนยันการลบ",
                    children: (
                      <span className="text-xs">
                        การลบเมนูนี้จะไม่สามารถกู้คืนได้
                      </span>
                    ),
                    labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                    onConfirm: handleDelete,
                    confirmProps: { color: "red" },
                  });
                }}
              >
                ลบเมนูนี้
              </Button>

              <Button type="submit" loading={isLoading || isProcessing}>
                บันทึกข้อมูล
              </Button>
            </div>
          </form>
        )}
      </Container>
    </Layout>
  );
};

export default MenuEditPage;
