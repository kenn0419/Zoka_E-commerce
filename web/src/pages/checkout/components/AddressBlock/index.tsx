import { useState } from "react";
import styles from "./AddressBlock.module.scss";
import SelectAddressModal from "../../../../components/adress/SelectAddressModal";
import CreateAddressModal from "../../../../components/adress/CreateAddressModal";

interface AddressBlockProps {
  address?: IAddressResponse;
  onChangeAddress: (id: string) => void;
}

export default function AddressBlock({
  address,
  onChangeAddress,
}: AddressBlockProps) {
  const [openSelect, setOpenSelect] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const handleClickChangeAddress = () => {
    setOpenSelect(true);
    setOpenCreate(false);
  };

  const handleClickCreateAddress = () => {
    setOpenSelect(false);
    setOpenCreate(true);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Địa chỉ nhận hàng</div>
      {address ? (
        <div className={styles.content}>
          <strong>{address.receiverName}</strong> | {address.receiverPhone}
          <div>{address.addressText}</div>
        </div>
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.title}>Địa chỉ nhận hàng</div>
          <button onClick={handleClickCreateAddress}>+ Thêm địa chỉ mới</button>
        </div>
      )}

      <button className={styles.change} onClick={handleClickChangeAddress}>
        Thay đổi
      </button>

      <SelectAddressModal
        open={openSelect}
        defaultAddress={address}
        onSelect={onChangeAddress}
        onAddNew={() => {
          setOpenSelect(false);
          setOpenCreate(true);
        }}
        onClose={() => setOpenSelect(false)}
      />

      <CreateAddressModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
}
