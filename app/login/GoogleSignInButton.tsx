"use client";

import { signIn } from "next-auth/react";
import styles from "./login.module.css";

export default function GoogleSignInButton() {
  return (
    <button className={styles.googleButton} type="button" onClick={() => void signIn("google", { redirectTo: "/" })}>
      Продолжить с Google
    </button>
  );
}
