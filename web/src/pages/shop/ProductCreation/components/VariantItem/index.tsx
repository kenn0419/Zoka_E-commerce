import { Card, Input, InputNumber, Upload, Button, Form } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

interface Props {
  field: any;
  remove: (index: number) => void;
}

export default function VariantItem({ field, remove }: Props) {
  return (
    <Card
      style={{ marginBottom: 16 }}
      extra={
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => remove(field.name)}
        >
          Xóa
        </Button>
      }
    >
      <Form.Item
        label="Tên phân loại"
        name={[field.name, "name"]}
        rules={[{ required: true, message: "Nhập tên phân loại" }]}
      >
        <Input placeholder="Màu đỏ / Size M" />
      </Form.Item>

      <Form.Item
        label="Giá"
        name={[field.name, "price"]}
        rules={[{ required: true, message: "Nhập giá" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Số lượng"
        name={[field.name, "stock"]}
        rules={[{ required: true, message: "Nhập số lượng" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Ảnh phân loại"
        name={[field.name, "images"]}
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
      >
        <Upload beforeUpload={() => false} multiple>
          <Button icon={<UploadOutlined />}>Upload ảnh</Button>
        </Upload>
      </Form.Item>
    </Card>
  );
}
