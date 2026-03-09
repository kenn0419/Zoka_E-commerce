import { Button, Input, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./ForgotPassword.module.scss";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import {
  useResendOtpMutation,
  useSendOtpMutation,
} from "../../../queries/auth.query";
import { formatTime } from "../../../utils/helper.util";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const sendOtpMutation = useSendOtpMutation();
  const resendOtpMutation = useResendOtpMutation();
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (!identifier) {
      message.error("Please enter email");
      return;
    }
    sendOtpMutation.mutate(identifier, {
      onSuccess: () => {
        message.success("OTP resent!");
        setCountdown(300);
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message || "Resend failed");
      },
    });
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
  };

  const handleVerify = () => {
    const code = otp.join("");

    if (code.length !== 8) {
      message.error("Please enter full OTP");
      return;
    }

    sessionStorage.setItem("reset-email", identifier);
    sessionStorage.setItem("reset-otp", code);
    navigate(`/${PATH.AUTH}/${PATH.RESET_PASSWORD}`);
  };

  const handleResend = () => {
    if (countdown > 0) {
      message.warning("Please wait email.");
      return;
    }

    resendOtpMutation.mutate(identifier);
    setCountdown(300);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to={`/${PATH.AUTH}/${PATH.SIGNIN}`} className={styles.back}>
          <ArrowLeftOutlined /> Back to Login
        </Link>

        <h1 className={styles.title}>Forgot Password?</h1>

        <p className={styles.desc}>
          Enter your email to receive a verification code.
        </p>

        <div className={styles.field}>
          <label>Your Email</label>

          <div className={styles.sendWrapper}>
            <Input
              size="large"
              placeholder="user@email.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <Button className={styles.sendBtn} onClick={handleSendCode}>
              Send Code
            </Button>
          </div>
        </div>

        <div className={styles.otpSection}>
          <label>Verification Code</label>

          <div className={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
              />
            ))}
          </div>

          <div className={styles.resend}>
            <span>Didn't receive code?</span>

            {countdown > 0 ? (
              <b>Resend in 00:{formatTime(countdown)}</b>
            ) : (
              <button onClick={handleResend}>Resend</button>
            )}
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          className={styles.verifyBtn}
          onClick={handleVerify}
        >
          Verify & Reset Password
        </Button>
      </div>
    </div>
  );
}
