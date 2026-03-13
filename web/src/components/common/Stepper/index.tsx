import { Steps } from "antd";
import styles from "./Stepper.module.scss";

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <Steps
      className={styles.stepper}
      current={currentStep}
      items={[
        { title: "Shopping Cart" },
        { title: "Checkout" },
        { title: "Order Complete" },
      ]}
    />
  );
}
