import { Card, Form, Input, Select } from "antd";
import { useActiveCategoriesQuery } from "../../../../../queries/category.query";
import { useState } from "react";

export default function BasicInfo() {
  const [searchCategory, setSearchCategory] = useState("");
  const { data, isLoading } = useActiveCategoriesQuery({
    page: 1,
    limit: 10,
    search: searchCategory,
  });
  return (
    <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
      >
        <Input placeholder="Ví dụ: Áo thun unisex form rộng" />
      </Form.Item>

      <Form.Item
        label="Danh mục"
        name="categoryId"
        rules={[{ required: true, message: "Chọn danh mục" }]}
      >
        <Select
          loading={isLoading}
          placeholder="Chọn danh mục"
          filterOption={false}
          showSearch
          onSearch={(value) => setSearchCategory(value)}
          options={data?.items.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
        />
      </Form.Item>

      <Form.Item label="Mô tả sản phẩm" name="description">
        <Input.TextArea rows={5} />
      </Form.Item>
    </Card>
  );
}
