const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        spacing: {
            xs: "4px",
            sm: "6px",
            md: "8px",
            lg: "16px",
            xl: "32px",
            "2xl": "64px",
        },
        colors: {
            black: "#000",
            white: "#fbfbfb",
            red: "red",
            gray: colors.gray,
            transparent: colors.transparent,

            primary: {
                100: "#2A3C3E" /* Darkest */,
                200: "#384F52",
                300: "#486366",
                400: "#5A777A",
                500: "#6F8B8E",
                600: "#85A0A3",
                700: "#9DB5B7",
                800: "#B8CACC",
                900: "#D4DFE0" /* Darkest */,
            },
            secondary: "#272C32",
            background: "#272C32",
        },
        fontSize: {
            sx: "0.7rem",
            sm: "0.8rem",
            md: "1rem",
            base: "1rem",
            lg: "1.1rem",
            xl: "1.2rem",
            "2xl": "1.4rem",
            "3xl": "1.6rem",
            "4xl": "1.8rem",
        },
        extend: {},
    },
    plugins: [],
};
