import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Portal Login - KIDZ R KIDZ",
  description: "Class Teacher app workspace portal for KIDZ R KIDZ Pre School.",
  manifest: "/manifest-teacher.json",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
