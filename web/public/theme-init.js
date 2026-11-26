// Applies the saved/system theme before first paint (external file so CSP needs no 'unsafe-inline').
(function () {
  try {
    var saved = localStorage.getItem("jobflow-theme");
    var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
