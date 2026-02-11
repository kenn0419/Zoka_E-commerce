import { Modal, Spin } from "antd";
import styles from "./SelectAddressModal.module.scss";
import {
  useAllAddressByUserQuery,
  useSetDefaultAddressMutation,
} from "../../../queries/address.query";
import clsx from "clsx";

interface Props {
  open: boolean;
  defaultAddress?: IAddressResponse;
  onSelect: (id: string) => void;
  onAddNew: () => void;
  onClose: () => void;
}

export default function SelectAddressModal({
  open,
  defaultAddress,
  onSelect,
  onAddNew,
  onClose,
}: Props) {
  const { data, isLoading } = useAllAddressByUserQuery();
  const setDefaultMutation = useSetDefaultAddressMutation();

  const handleSelect = async (id: string) => {
    await setDefaultMutation.mutateAsync(id);
    onSelect(id);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Chọn địa chỉ nhận hàng"
      onCancel={onClose}
      footer={null}
    >
      {isLoading && <Spin />}

      <div className={styles.list}>
        {data?.map((a) => (
          <div
            key={a.id}
            className={clsx(styles.address, {
              [styles.active]: a.id === defaultAddress?.id,
            })}
            onClick={() => handleSelect(a.id)}
          >
            <input
              type="radio"
              checked={a.id === defaultAddress?.id}
              readOnly
            />

            <div className={styles.info}>
              <strong>{a.receiverName}</strong> <span>{a.receiverPhone}</span>
              <div className={styles.text}>{a.addressText}</div>
              {a.id === defaultAddress?.id && (
                <span className={styles.defaultBadge}>Mặc định</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className={styles.addNew} onClick={onAddNew}>
        + Thêm địa chỉ mới
      </button>
    </Modal>
  );
}
