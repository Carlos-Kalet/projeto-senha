// ===== VARIÁVEIS GLOBAIS =====
let quantidade = 12;
const senhaInput = document.getElementById('senha');
const quantidadeSpan = document.getElementById('quantidade');
const barra = document.getElementById('barra');
const entropiaP = document.getElementById('entropia');

// ===== FUNÇÃO PARA AUMENTAR =====
function aumentar() {
    if (quantidade < 50) {
        quantidade++;
        quantidadeSpan.textContent = quantidade;
        gerarSenha();
    }
}

// ===== FUNÇÃO PARA DIMINUIR =====
function diminuir() {
    if (quantidade > 4) {
        quantidade--;
        quantidadeSpan.textContent = quantidade;
        gerarSenha();
    }
}

// ===== FUNÇÃO PARA COPIAR =====
function copiarSenha() {
    const senha = senhaInput.value;
    if (senha) {
        navigator.clipboard.writeText(senha).then(() => {
            const btn = document.getElementById('copiar');
            btn.textContent = '✅ Copiado!';
            setTimeout(() => {
                btn.textContent = '📋 Copiar';
            }, 2000);
        });
    }
}

// ===== FUNÇÃO PARA GERAR SENHA =====
function gerarSenha() {
    // 1. Definir os caracteres disponíveis
    const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // 2. Verificar quais checkboxes estão marcados
    const incluirMaiusculas = document.getElementById('maiusculas').checked;
    const incluirMinusculas = document.getElementById('minusculas').checked;
    const incluirNumeros = document.getElementById('numeros').checked;
    const incluirSimbolos = document.getElementById('simbolos').checked;
    
    // 3. Construir o alfabeto baseado nas escolhas
    let alfabeto = '';
    if (incluirMaiusculas) alfabeto += maiusculas;
    if (incluirMinusculas) alfabeto += minusculas;
    if (incluirNumeros) alfabeto += numeros;
    if (incluirSimbolos) alfabeto += simbolos;
    
    // 4. Validar se pelo menos uma opção foi selecionada
    if (alfabeto === '') {
        senhaInput.value = 'Selecione uma opção!';
        barra.className = 'forca-fraca';
        barra.textContent = 'Fraca';
        entropiaP.textContent = 'Tempo para quebrar: ~0 dias';
        return;
    }
    
    // 5. Gerar a senha aleatória
    let senha = '';
    for (let i = 0; i < quantidade; i++) {
        const indexAleatorio = Math.floor(Math.random() * alfabeto.length);
        senha += alfabeto[indexAleatorio];
    }
    
    // 6. Exibir a senha
    senhaInput.value = senha;
    
    // 7. Calcular entropia e classificar força
    classificarSenha(senha, alfabeto.length);
}

// ===== FUNÇÃO PARA CLASSIFICAR SENHA =====
function classificarSenha(senha, tamanhoAlfabeto) {
    // 1. Calcular entropia (bits)
    const entropia = Math.log2(Math.pow(tamanhoAlfabeto, senha.length));
    
    // 2. Calcular tempo em dias para quebrar (assumindo 10^9 tentativas/segundo)
    const tentativas = Math.pow(2, entropia);
    const segundos = tentativas / 1000000000;
    const dias = Math.floor(segundos / 86400);
    
    // 3. Exibir entropia formatada
    if (dias < 1) {
        entropiaP.textContent = 'Tempo para quebrar: menos de 1 dia';
    } else if (dias < 30) {
        entropiaP.textContent = `Tempo para quebrar: ~${dias} dias`;
    } else if (dias < 365) {
        entropiaP.textContent = `Tempo para quebrar: ~${Math.floor(dias/30)} meses`;
    } else if (dias < 36500) {
        entropiaP.textContent = `Tempo para quebrar: ~${Math.floor(dias/365)} anos`;
    } else {
        entropiaP.textContent = `Tempo para quebrar: ~${Math.floor(dias/365)} anos (MUITO SEGURA!)`;
    }
    
    // 4. Classificar a força da senha
    if (entropia < 28) {
        barra.className = 'forca-fraca';
        barra.textContent = '🔴 Fraca';
    } else if (entropia < 40) {
        barra.className = 'forca-media';
        barra.textContent = '🟡 Média';
    } else if (entropia < 60) {
        barra.className = 'forca-forte';
        barra.textContent = '🟢 Forte';
    } else {
        barra.className = 'forca-forte';
        barra.textContent = '🟢 Muito Forte';
    }
}

// ===== EVENTOS DOS CHECKBOXES =====
document.querySelectorAll('.caracteristicas input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', gerarSenha);
});

// ===== GERAR SENHA INICIAL =====
gerarSenha();