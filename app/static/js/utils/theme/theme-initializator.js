// Minimal inline script for immediate theme application
(function () {
    const savedTheme = localStorage.getItem("theme") || "system";
    const isDark =
        savedTheme === "dark" ||
        (savedTheme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
        document.documentElement.classList.add("dark");
    }
})();
