"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ReDirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("lend/tAR/deposit");
  }, [router]);

  return null;
};

export default ReDirect;
