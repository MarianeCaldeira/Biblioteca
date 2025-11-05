class Livro {
  constructor(titulo, autor) {
    this.titulo = titulo;
    this.autor = autor;
    this.disponivel = true;
  }

  emprestar() {
    if (!this.disponivel) throw new Error(`O livro "${this.titulo}" já está emprestado.`);
    this.disponivel = false;
  }

  devolver() {
    if (this.disponivel) throw new Error(`O livro "${this.titulo}" já está disponível.`);
    this.disponivel = true;
  }
}

class Biblioteca {
  constructor(nome) {
    this.nome = nome;
    this.livros = [];
  }

  adicionarLivro(livro) {
    this.livros.push(livro);
  }

  async emprestarLivro(titulo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const livro = this.livros.find(l => l.titulo === titulo);
          if (!livro) throw new Error(`Livro "${titulo}" não encontrado.`);
          livro.emprestar();
          resolve(`✅ Você emprestou "${titulo}"`);
        } catch (erro) {
          reject(erro);
        }
      }, 500);
    });
  }

  async devolverLivro(titulo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const livro = this.livros.find(l => l.titulo === titulo);
          if (!livro) throw new Error(`Livro "${titulo}" não encontrado.`);
          livro.devolver();
          resolve(`📚 Você devolveu "${titulo}"`);
        } catch (erro) {
          reject(erro);
        }
      }, 500);
    });
  }
}

// ---- MAIN ----
const biblioteca = new Biblioteca("Biblioteca Central");
biblioteca.adicionarLivro(new Livro("Dom Casmurro", "Machado de Assis"));
biblioteca.adicionarLivro(new Livro("1984", "George Orwell"));
biblioteca.adicionarLivro(new Livro("O Pequeno Príncipe", "Antoine de Saint-Exupéry"));

const lista = document.getElementById("livros-lista");
const msg = document.getElementById("mensagem");
const input = document.getElementById("titulo");

function atualizarLista() {
  lista.innerHTML = "";
  biblioteca.livros.forEach(livro => {
    const div = document.createElement("div");
    div.className = "livro";
    div.innerHTML = `<strong>${livro.titulo}</strong> — ${livro.autor} 
      <span class="${livro.disponivel ? 'disponivel' : 'indisponivel'}">
        (${livro.disponivel ? 'Disponível' : 'Emprestado'})
      </span>`;
    lista.appendChild(div);
  });
}

async function executarAcao(acao) {
  const titulo = input.value.trim();
  if (!titulo) {
    msg.textContent = "Digite o título de um livro!";
    msg.style.color = "orange";
    return;
  }

  try {
    msg.textContent = "⏳ Processando...";
    msg.style.color = "black";
    const resultado = await biblioteca[acao](titulo);
    msg.textContent = resultado;
    msg.style.color = "green";
  } catch (erro) {
    msg.textContent = "⚠️ " + erro.message;
    msg.style.color = "red";
  }

  atualizarLista();
  input.value = "";
}

document.getElementById("emprestar").addEventListener("click", () => executarAcao("emprestarLivro"));
document.getElementById("devolver").addEventListener("click", () => executarAcao("devolverLivro"));

atualizarLista();