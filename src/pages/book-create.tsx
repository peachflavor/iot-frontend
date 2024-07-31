import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  NumberInput,
  TextInput,
  FileInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Book } from "../lib/models";

export default function BookCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const bookCreateForm = useForm({
    initialValues: {
      title: "",
      author: "",
      year: 2024,
      detail: "",
      story: "",
      classification: "",
      is_published: false,
      cover_image: null,
    },

    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      author: isNotEmpty("กรุณาระบุชื่อผู้แต่ง"),
      year: isNotEmpty("กรุณาระบุปีที่พิมพ์หนังสือ"),
      detail: isNotEmpty("กรุณาระบุรายละเอียดหนังสือ"),
      story: isNotEmpty("กรุณาระบุเรื่องย่อหนังสือ"),
      classification: isNotEmpty("กรุณาระบุหมวดหมู่หนังสือ"),
    },
  });

  const handleSubmit = async (values: typeof bookCreateForm.values, isDraft = false) => {
    try {
      setIsProcessing(true);

      // Handle image upload
      let coverImageUrl = null;
      if (values.cover_image) {
        const formData = new FormData();
        formData.append("file", values.cover_image);

        const uploadResponse = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        coverImageUrl = uploadResponse.data.url;
      }

      const response = await axios.post<Book>("/books", {
        ...values,
        is_published: !isDraft,
        cover_image: coverImageUrl,
      });

      notifications.show({
        title: isDraft ? "บันทึกเป็นร่างสำเร็จ" : "เพิ่มข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการบันทึกเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">เพิ่มหนังสือในระบบ</h1>

          <form
            onSubmit={bookCreateForm.onSubmit((values) => handleSubmit(values, false))}
            className="space-y-8"
          >
            <TextInput
              label="ชื่อหนังสือ"
              placeholder="ชื่อหนังสือ"
              {...bookCreateForm.getInputProps("title")}
            />

            <TextInput
              label="ชื่อผู้แต่ง"
              placeholder="ชื่อผู้แต่ง"
              {...bookCreateForm.getInputProps("author")}
            />

            <NumberInput
              label="ปีที่พิมพ์"
              placeholder="ปีที่พิมพ์"
              min={1900}
              max={new Date().getFullYear() + 1}
              {...bookCreateForm.getInputProps("year")}
            />

            <TextInput
              label="รายละเอียดหนังสือ"
              placeholder="รายละเอียดหนังสือ"
              {...bookCreateForm.getInputProps("detail")}
            />

            <TextInput
              label="เรื่องย่อ"
              placeholder="เรื่องย่อ"
              {...bookCreateForm.getInputProps("story")}
            />

            <TextInput
              label="หมวดหมู่ (ขั้นด้วย , Ex. นิยาย,สารคดี)"
              placeholder="หมวดหมู่"
              {...bookCreateForm.getInputProps("classification")}
            />

            <FileInput
              label="ปกหนังสือ"
              placeholder="เลือกไฟล์รูปภาพ"
              {...bookCreateForm.getInputProps("cover_image")}
            />

            <Checkbox
              label="เผยแพร่"
              {...bookCreateForm.getInputProps("is_published", {
                type: "checkbox",
              })}
            />

            <Divider />

            <div className="flex space-x-4">
              <Button type="submit" loading={isProcessing}>
                บันทึกข้อมูล
              </Button>
              <Button
                variant="outline"
                onClick={() => bookCreateForm.onSubmit((values) => handleSubmit(values, true))()}
                loading={isProcessing}
              >
                บันทึกเป็นร่าง
              </Button>
            </div>
          </form>
        </Container>
      </Layout>
    </>
  );
}
