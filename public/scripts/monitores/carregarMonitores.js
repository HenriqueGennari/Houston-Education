async function carregarDisciplina(){
    try {
        const response = await fetch("/monitores", {
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        });

        const monitoresRetornados = await response.json();
        const select = document.getElementById("monitores")

        monitoresRetornados.forEach((monitor) =>{
            const option = document.createElement("option")
            option.value = monitor.id
            option.textContent = monitor.aluno.nome
            select.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

carregarDisciplina();