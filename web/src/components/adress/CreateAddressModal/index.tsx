import { Modal, Input, Button } from "antd";
import { useState } from "react";
import { useAddressCreationMutation } from "../../../queries/address.query";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateAddressModal({ open, onClose }: Props) {
  const createAddressMutation = useAddressCreationMutation();
  const [form, setForm] = useState<IAddressCreationRequest>({
    receiverName: "",
    receiverPhone: "",
    addressText: "",
  });

  const handleSubmit = async () => {
    createAddressMutation.mutate({
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      addressText: form.addressText,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={"Thêm địa chỉ mới"}
      onCancel={onClose}
      footer={null}
    >
      <Input
        placeholder="Họ và tên"
        value={form.receiverName}
        onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
      />

      <Input
        placeholder="Số điện thoại"
        style={{ marginTop: 12 }}
        value={form.receiverPhone}
        onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
      />

      <Input.TextArea
        placeholder="Địa chỉ cụ thể"
        style={{ marginTop: 12 }}
        rows={3}
        value={form.addressText}
        onChange={(e) => setForm({ ...form, addressText: e.target.value })}
      />

      <Button
        type="primary"
        block
        style={{ marginTop: 16 }}
        onClick={handleSubmit}
      >
        Hoàn thành
      </Button>
    </Modal>
  );
}
