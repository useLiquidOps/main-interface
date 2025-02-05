"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";

export default function GoogleCaptchaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const NEXT_PUBLIC_RECAPTCHA_SITE_KEY =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    throw new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY not found");
  }
  return (
    <GoogleReCaptchaProvider reCaptchaKey={NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
