async function carregarDisciplina(){
    try {
        const response = await fetch("/disciplinas", {
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        });

        const disciplinasRetornadas = await response.json();
        const select = document.getElementById("disciplinas")

        disciplinasRetornadas.forEach((disciplina) =>{
            const option = document.createElement("option")
            option.value = disciplina.id
            option.textContent = disciplina.nome
            select.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

carregarDisciplina();