import LoginForm from "@/components/LoginForm";
import styles from "../login.module.css";

export default function ClientLoginPage() {
  return (
    <div className={styles.page}>
      <LoginForm type="client" />
    </div>
  );
}
