import { Form, Input, Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import { useAuthStore } from "../../../store/auth.store";
import AuthCard from "../../../components/auth/AuthCard";
import PageHeader from "../../../components/auth/PageHeader";
import styles from "./Signin.module.scss";
import { useSigninMutation } from "../../../queries/auth.query";
import { useEffect } from "react";
import { Role } from "../../../utils/constant.util";
import { includeRole } from "../../../utils/helper.util";

const { Text } = Typography;

export default function SigninPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const signinMutation = useSigninMutation();

  const onFinish = async (values: any) => {
    signinMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  useEffect(() => {
    if (!user) return;

    if (includeRole(user, Role.ADMIN)) {
      navigate(`/${PATH.ADMIN}`, { replace: true });
    } else if (includeRole(user, Role.SHOP)) {
      navigate(`/${PATH.SELLER}`, { replace: true });
    } else {
      navigate(`/${PATH.USER}`, { replace: true });
    }
  }, [user, navigate]);

  return (
    <AuthCard>
      <PageHeader title="Đăng nhập" />

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input size="large" placeholder="example@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>

        <div className={styles.forgotPasswordLink}>
          <Link to={`/${PATH.AUTH}/${PATH.FORGOT_PASSWORD}`}>
            Quên mật khẩu?
          </Link>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={signinMutation.isPending}
        >
          Đăng nhập
        </Button>
      </Form>

      <div className={styles.footer}>
        <Text>Chưa có tài khoản? </Text>
        <Link to={`/${PATH.AUTH}/${PATH.SIGNUP}`}>Đăng ký ngay</Link>
      </div>
    </AuthCard>
  );
}
