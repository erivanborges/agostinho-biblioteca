async function carregarLivros() {
  const tabela = document.getElementById("tabelaLivros");
  const erroDiv = document.getElementById("erroLivros");
  const loader = document.getElementById("loaderLivros");
  tabela.innerHTML = "";
  erroDiv.innerHTML = "";
  loader.style.display = "block"; // mostra o loader

  try {
    const resposta = await fetch(API_URL + "/livros");
    if (!resposta.ok) throw new Error("Erro ao acessar a API");
    
    const livros = await resposta.json();
    //console.log(livros[0].titulo);
    livros.forEach(livro => {
      const row = `<tr>
        <td>${livro.id}</td>
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
		    <td>${livro.anoPublicacao}</td>
		    <td>${livro.isbn}</td>
		    <td>${livro.genero}</td>
        <td>${livro.disponivel == 0 ? "Não" : "Sim"}</td>
		    <td>
        <button class="ui mini primary button" onclick="editarLivro(${livro.id}, '${livro.titulo}', '${livro.autor}', '${livro.anoPublicacao}', '${livro.isbn}', '${livro.genero}', '${livro.disponivel}')">Editar</button>
        <button class="ui mini red button" onclick="excluirLivro(${livro.id})">Excluir</button>
        </td>
      </tr>`;
      tabela.innerHTML += row;
    });

  } catch (erro) {
    erroDiv.innerHTML = `
      <div class="ui negative message">
        <div class="header">Erro ao carregar livros</div>
        <p>Não foi possível conectar ao servidor. Verifique se a API está rodando.</p>
      </div>
    `;
  } finally {
    loader.style.display = "none"; // esconde o loader
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarLivros();

  document.getElementById("formLivro").addEventListener("submit", async (e) => {
    e.preventDefault();
	
	  const id = document.getElementById("livroIdEdit").value;
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
	  const anoPublicacao = document.getElementById("anoPublicacao").value;
	  const isbn = document.getElementById("isbn").value;
	  const genero = document.getElementById("genero").value;
    const disponivel = document.getElementById("disponivel").value;
  
    try {
      if (id) {
		  // EDITAR
		await fetch(`${API_URL}/livros/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ titulo, autor, anoPublicacao, isbn, genero, disponivel })
		});
	  
	  } else {
		  // CRIAR
		await fetch(API_URL + "/livros", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ titulo, autor, anoPublicacao, isbn, genero })
		});
	  }
	  cancelarEdicao();
	  carregarLivros();
    } catch (erro) {
      alert("Não foi possível cadastrar o livro. Verifique o servidor.");
    }
  });
  
});

// Preenche o formulário com dados do livro selecionado
function editarLivro(id, titulo, autor, anoPublicacao, isbn, genero, disponivel) {
  document.getElementById("livroIdEdit").value = id;
  document.getElementById("titulo").value = titulo;
  document.getElementById("autor").value = autor;
  document.getElementById("anoPublicacao").value = anoPublicacao;
  document.getElementById("isbn").value = isbn;
  document.getElementById("genero").value = genero;
  document.getElementById("disponivel").value = disponivel;
  // Inserir campos que faltam...
}

// Reseta o formulário
function cancelarEdicao() {
  document.getElementById("formLivro").reset();
  document.getElementById("livroIdEdit").value = "";
}

async function excluirLivro(id) {
  if (confirm("Tem certeza que deseja excluir este livro?")) {
    try {
      await fetch(`${API_URL}/livros/${id}`, { method: "DELETE" });
      carregarLivros();
    } catch (erro) {
      alert("Erro ao excluir livro.");
    }
  }
}

