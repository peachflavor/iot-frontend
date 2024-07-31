import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Checkbox, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Menu } from "../lib/models";

const CreateMenuPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onFormSubmit = async (formData: typeof form.values) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post<Menu>("/menus", formData);
      notifications.show({
        title: "เพิ่มเมนูสำเร็จ",
        message: "เมนูใหม่ถูกเพิ่มเข้าสู่ระบบแล้ว",
        color: "green",
      });
      navigate(`/menus/${response.data.id}`);
    } catch (error) {
    if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
            notifications.show({
                title: "ข้อมูลไม่ถูกต้อง",
                message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
                color: "red",
            });
        } else if (error.response?.status ?? 0 >= 500) {
            notifications.show({
                title: "ข้อผิดพลาดในเซิร์ฟเวอร์",
                message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
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
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Container className="mt-6">
        <h1 className="text-2xl font-bold">เพิ่มเมนูใหม่</h1>

        <form onSubmit={form.onSubmit(onFormSubmit)} className="space-y-6">
          <TextInput
            label="ชื่อเมนู"
            placeholder="ป้อนชื่อเมนู"
            {...form.getInputProps("name")}
          />

          <NumberInput
            label="ราคา"
            placeholder="ระบุราคา"
            min={0}
            {...form.getInputProps("price")}
          />
          
          <TextInput
            label="รายละเอียด"
            placeholder="ระบุรายละเอียดเมนู"
            {...form.getInputProps("detail")}
          />

          <TextInput
            label="ส่วนผสม"
            placeholder="ระบุส่วนผสม"
            {...form.getInputProps("ingredient")}
          />

          <Checkbox
            label="เผยแพร่"
            {...form.getInputProps("is_published", { type: "checkbox" })}
          />

          <Divider />

          <Button type="submit" loading={isSubmitting} color="blue">
            บันทึกข้อมูล
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default CreateMenuPage;
