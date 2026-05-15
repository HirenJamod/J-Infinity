import LoginForm from "@/components/LoginForm";
import styles from "../login.module.css";

export default function AdminLoginPage() {
  return (
    <div className={styles.page}>
      <LoginForm type="admin" />
    </div>
  );
}
