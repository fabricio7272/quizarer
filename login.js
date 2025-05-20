document.addEventListener("DOMContentLoaded", function () {
    var botaoJogar = document.getElementById("jogarBnt");
    if (botaoJogar) {
        botaoJogar.addEventListener("click", function () {
            var nome = document.getElementById("nome").value;
            if (nome.trim() !== "") {
                localStorage.setItem("nome", nome);
                window.location.href = "/quiz.html";
            } else {
            }
        });
    } 
});