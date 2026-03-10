import { Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./MyAddress.module.scss";
import AddressCard from "../../../components/common/AddressCard";
import {
  useAllAddressByUserQuery,
  useSetDefaultAddressMutation,
} from "../../../queries/address.query";

export default function MyAddressPage() {
  const allUserAddressQuery = useAllAddressByUserQuery();
  const setDefaultAddressMutation = useSetDefaultAddressMutation();

  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddressMutation.mutate(addressId);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Shipping Addresses</h1>
          <p>Manage your delivery locations for faster checkout experience.</p>
        </div>

        <Button type="primary" icon={<PlusOutlined />}>
          Add New Address
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {allUserAddressQuery.data?.map((address) => (
          <Col xs={24} md={12} key={address.id}>
            <AddressCard
              data={address}
              isLoading={allUserAddressQuery.isLoading}
              onSetDefault={handleSetDefaultAddress}
            />
          </Col>
        ))}

        <Col xs={24} md={12}>
          <div className={styles.addCard}>
            <PlusOutlined />
            <h3>Add New Address</h3>
            <p>For gifts or office delivery</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}
