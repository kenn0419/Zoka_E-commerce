import React from "react";
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { message } from "antd";
import { ORDER_STATUS_LABEL } from "../../utils/constant.util";

interface Props {
  order: IOrderResponse;
  visible: boolean;
  onClose: () => void;
  onSave: (where: string, status: IOrderStatus) => Promise<void>;
}

export const OrderStatusChangeModal: React.FC<Props> = ({
  order,
  visible,
  onClose,
  onSave,
}) => {
  return (
    <ModalForm
      title="Cập nhật trạng thái đơn hàng"
      open={visible}
      modalProps={{ onCancel: onClose }}
      initialValues={order}
      onFinish={async (values) => {
        try {
          await onSave(order.id, values.status);
          message.success("Cập nhật thành công!");
          onClose();
          return true;
        } catch {
          message.error("Cập nhật thất bại!");
          return false;
        }
      }}
    >
      <ProFormText name="code" label="Mã đơn" disabled />

      <ProFormSelect
        name="status"
        label="Trạng thái"
        valueEnum={ORDER_STATUS_LABEL}
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};
