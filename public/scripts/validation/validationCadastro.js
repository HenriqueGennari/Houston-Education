
const form = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita redirecionamento padrão

    const formData = new FormData(form);
    const data = Object.fromEntries(formData); // dados que o usuário digitou
    
    if (!data.nome || !data.senha || !data.email || !data.matricula) {
        mensagem.textContent = "Preencha todos os campos.";
        mensagem.style.color = "red";
        return;
    }

    try {

        const res = await fetch('/alunos', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
            if (result.erro === "EMAIL_EXISTE") {
                mensagem.textContent = "Esse email já está cadastrado!";
            } else if (result.erro === "DADOS_INCOMPLETOS") {
                mensagem.textContent = "Preencha todos os campos corretamente!";
            } else {
                mensagem.textContent = "Erro ao cadastrar! Verifique se a matrícula possui 8 dígitos!";
            }
            mensagem.style.color = "red";
            
        } else {
            window.location.href = 'login.html'; 
        }

    } catch (err) {
        mensagem.textContent = "Erro ao cadastrar, usuário existente ou credenciais inválidas!";
        mensagem.style.color = "red";
    }
});