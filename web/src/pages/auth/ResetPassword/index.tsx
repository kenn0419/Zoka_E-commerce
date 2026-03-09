import { Button, Input, message } from "antd";
import styles from "./ResetPassword.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import { useResetPasswordMutation } from "../../../queries/auth.query";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const resetPasswordMutation = useResetPasswordMutation();

  const email = sessionStorage.getItem("reset-email");
  const otp = sessionStorage.getItem("reset-otp");

  useEffect(() => {
    if (!email || !otp) {
      navigate(`/${PATH.AUTH}/${PATH.FORGOT_PASSWORD}`);
    }
  }, [email, otp, navigate]);

  const handleReset = () => {
    if (!password || !confirmPassword) {
      message.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    if (email && otp) {
      resetPasswordMutation.mutate(
        { email, otp, newPassword: password },
        {
          onSuccess: () => {
            message.success("Password reset successfully!");
            navigate(`/${PATH.AUTH}/${PATH.SIGNIN}`);
          },
          onError: (err: any) => {
            message.error(err?.response?.data?.message || "Resend failed");
          },
        },
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>

        <div className={styles.field}>
          <label>New Password</label>
          <Input.Password
            size="large"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Confirm Password</label>
          <Input.Password
            size="large"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          type="primary"
          size="large"
          className={styles.resetBtn}
          onClick={handleReset}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
}
