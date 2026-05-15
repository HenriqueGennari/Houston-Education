
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
            if (result.erro === "EMAIL_EXISTE" || result.erro === "MATRICULA_EXISTE") {
                mensagem.textContent = "Matrícula ou email já cadastrados";
            } else if (result.erro === "DADOS_INCOMPLETOS") {
                mensagem.textContent = "Preencha todos os campos corretamente!";
            } else if (result.errors) {
                mensagem.textContent = "Erro ao cadastrar! Verifique se a matrícula possui 8 dígitos!";
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

// Toggle visibilidade da senha
const btnToggleSenhaCadastro = document.getElementById("btnToggleSenhaCadastro");
const inputSenhaCadastro = document.getElementById("inputSenhaCadastro");

if (btnToggleSenhaCadastro && inputSenhaCadastro) {
    btnToggleSenhaCadastro.addEventListener("click", () => {
        const icone = btnToggleSenhaCadastro.querySelector("i");
        if (inputSenhaCadastro.type === "password") {
            inputSenhaCadastro.type = "text";
            icone.classList.remove("fa-eye");
            icone.classList.add("fa-eye-slash");
        } else {
            inputSenhaCadastro.type = "password";
            icone.classList.remove("fa-eye-slash");
            icone.classList.add("fa-eye");
        }
    });
}