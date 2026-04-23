async function carregarMonitores(){
    try {
        const response = await fetch("/alunos?perfil=MONITOR", {
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        });

        const monitoresRetornados = await response.json();
        const select = document.getElementById("monitores")

        monitoresRetornados.forEach((monitor) =>{
            const option = document.createElement("option")
            option.value = monitor.id
            option.textContent = monitor.nome
            select.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

carregarMonitores();
