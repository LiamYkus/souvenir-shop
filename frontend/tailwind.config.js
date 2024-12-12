/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "1300px": "1300px",
        "400px": "400px",
      },
      colors: {
        "blue": "#1DA1F2",
        "black": "#14171A",
        "dark-gray": "#657786",
        "light-gray": "#AAB8C2",
        "extra-light-gray": "#E1E8ED",
        "extra-extra-light-gray": "#F5F8FA",
      },
    },
  },
  plugins: [require("daisyui")],
};
