import { usePasswordChangeMutation } from "../../../queries/profile.query";
import styles from "./ChangePassword.module.scss";
import { Button, Divider, Form, Input, message } from "antd";

export default function ChangePasswordPage() {
  const [passwordForm] = Form.useForm();
  const changePasswordMutation = usePasswordChangeMutation();

  const handlePasswordSubmit = (values: any) => {
    const payload: IProfilePasswordChangeRequest = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      newConfirmPassword: values.newConfirmPassword,
    };
    changePasswordMutation.mutate(payload, {
      onSuccess: () => {
        message.success("Password changed successfully");
        passwordForm.resetFields();
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message);
      },
    });
  };
  return (
    <div className={styles.card}>
      <h2 className={styles.sectionTitle}>Change Password</h2>

      <Form
        layout="vertical"
        form={passwordForm}
        onFinish={handlePasswordSubmit}
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, min: 8 }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="newConfirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Divider />

        <Button type="primary" htmlType="submit">
          Update Password
        </Button>
      </Form>
    </div>
  );
}
