"use client";

import { useEffect, useState } from "react";

type ConnectionState = "loading" | "success" | "error";

export default function HealthStatus() {
  const [state, setState] = useState<ConnectionState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let active = true;

    async function checkHealth() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) throw new Error("Missing API URL");
        const response = await fetch(`${apiUrl.replace(/\/$/, "")}/health`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Health request failed");
        const data: unknown = await response.json();
        if (
          typeof data !== "object" || data === null ||
          !("status" in data) || data.status !== "ok"
        ) throw new Error("Unexpected health response");
        if (active) setState("success");
      } catch {
        if (active) setState("error");
      } finally {
        clearTimeout(timeout);
      }
    }

    void checkHealth();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  return (
    <section className="w-full rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-lg font-semibold">การเชื่อมต่อ Backend</h2>
      <p role="status" className="mt-3 text-zinc-600 dark:text-zinc-400">
        {state === "loading" && "กำลังตรวจสอบการเชื่อมต่อ…"}
        {state === "success" && "Backend เชื่อมต่อสำเร็จ"}
        {state === "error" && "เชื่อมต่อ Backend ไม่ได้ กรุณาตรวจสอบว่าเปิด Backend แล้ว"}
      </p>
      <button
        type="button"
        disabled={state === "loading"}
        onClick={() => {
          setState("loading");
          setAttempt((value) => value + 1);
        }}
        className="mt-4 rounded-lg bg-foreground px-4 py-2 text-background disabled:opacity-50"
      >
        ตรวจสอบอีกครั้ง
      </button>
    </section>
  );
}
