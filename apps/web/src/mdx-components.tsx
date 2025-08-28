import type { MDXComponents } from "mdx/types";
import { ApiHealth } from "@/components/status/ApiHealth";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ApiHealth,
    ...components,
  };
}


