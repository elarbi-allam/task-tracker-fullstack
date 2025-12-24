// Module declarations used by Node/Vite configuration files

declare module "lovable-tagger" {
  export function componentTagger(...args: any[]): any;
}

declare module "@vitejs/plugin-react-swc" {
  // Minimal typing to silence TS for the Vite plugin
  export default function reactSwcPlugin(options?: any): any;
}

declare module "tailwindcss-animate" {
  const plugin: any;
  export default plugin;
}
