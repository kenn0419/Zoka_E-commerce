import { Button, Card, Skeleton, Space, Tag } from "antd";
import styles from "./AddressCard.module.scss";
import { DeleteOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";

interface Props {
  data: IAddressResponse;
  isLoading: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: (id: string) => void;
}

export default function AddressCard({
  data,
  isLoading,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  if (isLoading) {
    return <Skeleton active />;
  }
  return (
    <Card className={`${styles.card} ${data.isDefault ? styles.default : ""}`}>
      {data.isDefault && (
        <Tag color="green" className={styles.defaultTag}>
          Default
        </Tag>
      )}

      <div className={styles.header}>
        <div className={styles.icon}>{<HomeOutlined />}</div>

        <div className={styles.info}>
          <h3>{data.receiverName}</h3>
          <p>{data.receiverPhone}</p>
        </div>
      </div>

      <div className={styles.address}>{data.addressText}</div>

      <div className={styles.footer}>
        <Space>
          <Button icon={<EditOutlined />} type="text" onClick={onEdit} />

          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={onDelete}
          />
        </Space>

        {!data.isDefault && onSetDefault && (
          <Button type="link" onClick={() => onSetDefault(data.id)}>
            Set as Default
          </Button>
        )}
      </div>
    </Card>
  );
}
