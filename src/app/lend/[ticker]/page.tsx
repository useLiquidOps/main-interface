"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReDirectProps {
  params: {
    ticker: string;
  };
}

const ReDirect = ({ params }: ReDirectProps) => {
  const { ticker } = params;
  const router = useRouter();

  useEffect(() => {
    router.push(`/lend/${ticker}/deposit`);
  }, [router]);

  return null;
};

export default ReDirect;
