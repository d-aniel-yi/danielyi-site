import type { ReactNode } from "react";
// Keep layout neutral; page handles its own container and spacing
export default function TechnicalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>; 
}


