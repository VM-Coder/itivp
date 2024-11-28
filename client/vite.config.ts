import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
        plugins: [react()],
        resolve: {
                alias: [
                        {
                                find: "@src",
                                replacement: path.resolve("src"),
                        },
                        {
                                find: "@assets",
                                replacement: path.resolve("src/components/assets"),
                        },
                        {
                                find: "@app",
                                replacement: path.resolve("src/components/app"),
                        },
                        {
                                find: "@pages",
                                replacement: path.resolve("src/components/pages"),
                        },
                        {
                                find: "@features",
                                replacement: path.resolve("src/components/features"),
                        },
                        {
                                find: "@widgets",
                                replacement: path.resolve("src/components/widgets"),
                        },
                        {
                                find: "@entities",
                                replacement: path.resolve("src/components/entities"),
                        },
                        {
                                find: "@shared",
                                replacement: path.resolve("src/components/shared"),
                        },
                ],
        },
});
