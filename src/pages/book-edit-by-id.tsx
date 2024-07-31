import useSWR from "swr";
import { Book } from "../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout";
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Divider,
  NumberInput,
  TextInput,
  FileInput,
} from "@mantine/core";
import Loading from "../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export default function BookEditById() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: book, isLoading, error } = useSWR<Book>(`/books/${bookId}`);
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  const bookEditForm = useForm({
    initialValues: {
      title: "",
      author: "",
      year: new Date().getFullYear(),
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

  const handleSubmit = async (values: typeof bookEditForm.values, isDraft = false) => {
    try {
      setIsProcessing(true);

      // Handle image upload
      let coverImageUrl = null;
      if (values.cover_image && typeof values.cover_image !== "string") {
        const formData = new FormData();
        formData.append("file", values.cover_image);

        const uploadResponse = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        coverImageUrl = uploadResponse.data.url;
      }

      await axios.patch(`/books/${bookId}`, {
        ...values,
        is_published: !isDraft,
        cover_image: coverImageUrl || values.cover_image,
      });

      notifications.show({
        title: isDraft ? "บันทึกเป็นร่างสำเร็จ" : "แก้ไขข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${bookId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการแก้ไข",
            color: "red",
          });
        } else if (status === undefined || status >= 500) {
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

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/books/${bookId}`);
      notifications.show({
        title: "ลบหนังสือสำเร็จ",
        message: "ลบหนังสือเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/books");
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status ?? 0;
        if (status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการลบ",
            color: "red",
          });
        } else if (status >= 500) {
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

  useEffect(() => {
    if (!isSetInitialValues && book) {
      const initialValues = {
        title: book.title,
        author: book.author,
        year: book.year,
        detail: "",
        story: "",
        classification: "",
        is_published: false,
        cover_image: null,
      };
      bookEditForm.setInitialValues(initialValues);
      bookEditForm.setValues(book);
      setIsSetInitialValues(true);
    }
  }, [book, bookEditForm, isSetInitialValues]);

  return (
    <Layout>
      <Container className="mt-8">
        <h1 className="text-xl">แก้ไขข้อมูลหนังสือ</h1>

        {isLoading && !error && <Loading />}
        {error && (
          <Alert
            color="red"
            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}

        {!!book && (
          <form
            onSubmit={bookEditForm.onSubmit((values) => handleSubmit(values, false))}
            className="space-y-8"
          >
            <TextInput
              label="ชื่อหนังสือ"
              placeholder="ชื่อหนังสือ"
              {...bookEditForm.getInputProps("title")}
            />

            <TextInput
              label="ชื่อผู้แต่ง"
              placeholder="ชื่อผู้แต่ง"
              {...bookEditForm.getInputProps("author")}
            />

            <NumberInput
              label="ปีที่พิมพ์"
              placeholder="ปีที่พิมพ์"
              min={1900}
              max={new Date().getFullYear() + 1}
              {...bookEditForm.getInputProps("year")}
            />

            <TextInput
              label="รายละเอียดหนังสือ"
              placeholder="รายละเอียดหนังสือ"
              {...bookEditForm.getInputProps("detail")}
            />

            <TextInput
              label="เรื่องย่อ"
              placeholder="เรื่องย่อ"
              {...bookEditForm.getInputProps("story")}
            />

            <TextInput
              label="หมวดหมู่ (ขั้นด้วย , Ex. นิยาย,สารคดี)"
              placeholder="หมวดหมู่"
              {...bookEditForm.getInputProps("classification")}
            />

            <FileInput
              label="ปกหนังสือ"
              placeholder="เลือกไฟล์รูปภาพ"
              {...bookEditForm.getInputProps("cover_image")}
            />

            <Checkbox
              label="เผยแพร่"
              {...bookEditForm.getInputProps("is_published", {
                type: "checkbox",
              })}
            />

            <Divider />

            <div className="flex justify-between">
              <Button
                color="red"
                leftSection={<IconTrash />}
                size="xs"
                onClick={() => {
                  modals.openConfirmModal({
                    title: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่",
                    children: (
                      <span className="text-xs">
                        เมื่อคุณดำนเนินการลบหนังสือเล่มนี้แล้ว จะไม่สามารถย้อนกลับได้
                      </span>
                    ),
                    labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                    onConfirm: () => {
                      handleDelete();
                    },
                    confirmProps: {
                      color: "red",
                    },
                  });
                }}
              >
                ลบหนังสือนี้
              </Button>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    bookEditForm.onSubmit((values) => handleSubmit(values, true))()
                  }
                  loading={isLoading || isProcessing}
                >
                  บันทึกเป็นร่าง
                </Button>
                <Button type="submit" loading={isLoading || isProcessing}>
                  บันทึก
                </Button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </Layout>
  );
}
