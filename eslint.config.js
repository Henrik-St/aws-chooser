import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        ignores: ["node_modules/", "dist/", "build/"],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                browser: true,
                console: true,
                document: true,
                window: true,
            },
        },
        plugins: {
            jsdoc,
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": "warn",
            "no-unused-labels": "warn",
            "jsdoc/require-description": "off",
            "jsdoc/require-param-type": "warn",
            "jsdoc/require-param-description": "warn",
            "jsdoc/require-returns": "warn",
            "jsdoc/require-returns-type": "warn",
            "jsdoc/check-alignment": "warn",
            "jsdoc/check-syntax": "warn",
        },
    },
];
