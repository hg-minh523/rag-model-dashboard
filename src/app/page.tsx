'use client'
import { LoginForm } from "@/components/Login";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  );
}
