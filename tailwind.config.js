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
                100: "#404a52",
                200: "#363f45",
                300: "#2c3339",
                400: "#22282c",
                500: "#181C1F",
                600: "#171b1d",
                700: "#16191c",
                800: "#14181a",
                900: "#131619",
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
