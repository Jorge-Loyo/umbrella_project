//Funcionalidades del sidebar

    document.addEventListener("DOMContentLoaded", () => {
        const hamburguer = document.querySelector('#toggle-btn');
        hamburguer.addEventListener("click", function(){
            document.querySelector("#sidebar").classList.toggle("expand");
        });
    });