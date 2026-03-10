import { Button, DatePicker, Form, Input, message, Select } from "antd";
import styles from "./ProfilePage.module.scss";
import dayjs from "dayjs";
import { useAuthStore } from "../../../store/auth.store";
import { useProfileChangeMutation } from "../../../queries/profile.query";

export default function MyProfilePage() {
  const [profileForm] = Form.useForm();
  const { user, setUser } = useAuthStore();
  const changeProfileMutation = useProfileChangeMutation();

  const handleProfileSubmit = (values: any) => {
    const payload = {
      ...values,
      birthday: values.birthday?.format("YYYY-MM-DD"),
    };

    changeProfileMutation.mutate(payload, {
      onSuccess: (data) => {
        message.success("Profile updated successfully.");
        setUser(data);
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message);
      },
    });
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.subtitle}>Personal Information</h1>

      <div className={styles.card}>
        <Form
          layout="vertical"
          form={profileForm}
          onFinish={handleProfileSubmit}
          initialValues={{
            fullName: user?.fullName,
            email: user?.email,
            phone: user?.phone,
            gender: user?.gender,
            birthday: dayjs(user?.birthday),
          }}
        >
          <div className={styles.grid}>
            <Form.Item name="email" label="Email Address">
              <Input disabled />
            </Form.Item>

            <Form.Item name="fullName" label="Full Name">
              <Input />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number">
              <Input />
            </Form.Item>

            <Form.Item name="gender" label="Gender">
              <Select
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </Form.Item>

            <Form.Item className={styles.full} name="birthday" label="Birthday">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <div className={styles.actions}>
            <Button
              type="primary"
              htmlType="submit"
              loading={changeProfileMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
