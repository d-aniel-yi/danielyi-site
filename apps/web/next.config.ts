import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /.mdx?$/,
  options: {
    // Use a module specifier, not a filesystem path (fixes Windows path issues)
    providerImportSource: "@/mdx-components",
  },
});

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
