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
      <div className={styles.address}>
        {address ? (
          <div className={styles.content}>
            <strong>
              {address.receiverName} {address.receiverPhone}
            </strong>
            <div className={styles.addressText}>{address.addressText}</div>
          </div>
        ) : (
          <>
            <div className={styles.title}>Địa chỉ nhận hàng</div>
            <button onClick={handleClickCreateAddress}>
              + Thêm địa chỉ mới
            </button>
          </>
        )}
        <button className={styles.change} onClick={handleClickChangeAddress}>
          Thay đổi
        </button>
      </div>

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
