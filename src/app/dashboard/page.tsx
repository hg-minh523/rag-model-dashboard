"use client"
import { useSocket } from "@/hooks/useSocket";

export default function Page() {
  const { isConnected } = useSocket();
}
