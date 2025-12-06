// -------------------------------
// TEMA ESCURO GLOBAL
// -------------------------------

// Carrega tema salvo no navegador
if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
}

// Ativa o botão de alternância se existir na página
const toggle = document.getElementById("toggleTheme");

if (toggle) {
    toggle.checked = document.documentElement.classList.contains("dark");

    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    });
}
const slider = document.getElementById("fonte");

// Carrega o valor salvo
const savedSize = localStorage.getItem("fontSize");
if (savedSize) {
    document.documentElement.style.fontSize = savedSize + "px";
    slider.value = savedSize;
}

// Atualiza em tempo real
slider.addEventListener("input", function () {
    document.documentElement.style.fontSize = this.value + "px";
    localStorage.setItem("fontSize", this.value);
});