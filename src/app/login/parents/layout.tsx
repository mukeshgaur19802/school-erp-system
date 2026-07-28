import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parents Portal Login - KIDZ R KIDZ",
  description: "Parent communication and PWA student portal for KIDZ R KIDZ Pre School.",
  manifest: "/manifest-parents.json",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
