import { defineConfig } from "vitest";

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            reporter: ['text', 'html']
        },
        include: [
            'src/**/*.test.js'
        ]

    }
})