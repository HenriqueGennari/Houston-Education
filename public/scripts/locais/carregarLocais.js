async function carregarLocais(){
    try {
        const response = await fetch("/locais", {
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        });

        const locaisRetornados = await response.json();
        const select = document.getElementById("locais")

        locaisRetornados.forEach((local) =>{
            const option = document.createElement("option")
            option.value = local.id
            option.textContent = local.nome
            select.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

carregarLocais();
