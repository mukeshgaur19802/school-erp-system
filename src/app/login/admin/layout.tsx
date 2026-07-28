import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal Login - KIDZ R KIDZ",
  description: "Authorized Administrator desk access portal for KIDZ R KIDZ Pre School.",
  manifest: "/manifest-admin.json",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
