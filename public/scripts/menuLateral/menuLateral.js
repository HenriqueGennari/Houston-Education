// Garanta que este seletor está correto para o seu ícone de menu
const botaoMenu = document.querySelector('nav .icone img[src="../assets/img/iconeMenu.png"]');
const menuLateral = document.getElementById('menuLateral');
const overlay = document.getElementById('overlay');

// Função "Toggle" (Alternar)
const toggleMenu = (e) => {
    e.preventDefault(); // Previne o clique
    menuLateral.classList.toggle('ativo');
    overlay.classList.toggle('ativo');
};

// Função SÓ para FECHAR (usada pelo overlay)
const fecharMenu = () => {
    menuLateral.classList.remove('ativo');
    overlay.classList.remove('ativo');
};

// Clicar no ícone agora "troca" (abre ou fecha)
botaoMenu.addEventListener('click', toggleMenu);

// Clicar no overlay SÓ FECHA
overlay.addEventListener('click', fecharMenu);

// Toggle do submenu "Minhas monitorias"
const submenuToggle = document.getElementById('toggleMinhasMonitorias');
if (submenuToggle) {
    submenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        submenuToggle.closest('.submenu').classList.toggle('aberto');
    });
}