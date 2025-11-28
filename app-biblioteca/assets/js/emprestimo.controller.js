async function carregarEmprestimos() {
  const tabela = document.getElementById("tabelaEmprestimos");
  const erroDiv = document.getElementById("erroEmprestimos");
  const loader = document.getElementById("loaderEmprestimos");
  tabela.innerHTML = "";
  erroDiv.innerHTML = "";
  loader.style.display = "block"; // mostra o loader

  try {
    const resposta = await fetch(API_URL + "/emprestimos");
    if (!resposta.ok) throw new Error("Erro ao acessar a API");

    const emprestimos = await resposta.json();
    //console.log(emprestimos[0]);
    emprestimos.forEach(emprestimo => {
      const row = `<tr>
        <td>${emprestimo.id}</td>
        <td>${emprestimo.livro?.titulo || "N/A"}</td>
        <td>${emprestimo.dtEmprestimo}</td>
        <td>${emprestimo.dtDevolucao || "N/A"}</td>
		    <td>${emprestimo.status}</td>
		    <td>
          <button class="ui mini primary button" onclick="editarEmprestimo(${emprestimo.id}, ${emprestimo.livro?.id || null}, '${emprestimo.dtEmprestimo}', '${emprestimo.dtDevolucao}', '${emprestimo.status}')">Editar</button>
          <button class="ui mini red button" onclick="excluirEmprestimo(${emprestimo.id})">Excluir</button>
        </td>
      </tr>`;
      tabela.innerHTML += row;
    });

  } catch (erro) {
    erroDiv.innerHTML = `
      <div class="ui negative message">
        <div class="header">Erro ao carregar empréstimos</div>
        <p>Não foi possível conectar ao servidor. Verifique se a API está rodando.</p>
      </div>
    `;
  } finally {
    loader.style.display = "none"; // esconde o loader
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarEmprestimos();

  document.getElementById("formEmprestimo").addEventListener("submit", async (e) => {
    e.preventDefault();
	  const id = document.getElementById("emprestimoIdEdit").value;
    const livroId = document.getElementById("livroId").value;
    const dtEmprestimo = document.getElementById("dtEmprestimo").value;
	  const dtDevolucao = document.getElementById("dtDevolucao").value;
	  const statusEmprestimo = document.getElementById("status").value;
  
    try {
      // Consulta o livro selecionado no emprestimo
      const respostaLivro = await fetch(API_URL + "/livros/" + livroId);
      const livro = await respostaLivro.json();

      if (id) {
        // Cria o JSON para enviar ao server (API)
        const emprestimoPayload = {
          id: id,
          livro: livro,
          dtEmprestimo: dtEmprestimo,
          dtDevolucao: dtDevolucao,
          status: statusEmprestimo
        };

        // EDITAR
        await fetch(`${API_URL}/emprestimos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emprestimoPayload)
        });
          } else {
            // Cria o JSON para enviar ao server (API)
            const emprestimoPayload = {
              livro: livro,
              dtEmprestimo: dtEmprestimo,
              dtDevolucao: dtDevolucao,
              status: statusEmprestimo
            };

              // CRIAR
            await fetch(API_URL + "/emprestimos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(emprestimoPayload)
            });
      }
		cancelarEdicao();
		carregarEmprestimos();
    } catch (erro) {
      alert("Não foi possível registrar o empréstimo. Verifique o servidor.");
    }
  });

});

function editarEmprestimo(id, livroId, dtEmprestimo, dtDevolucao, status) {
  document.getElementById("emprestimoIdEdit").value = id;
  document.getElementById("livroId").value = livroId || "";
  document.getElementById("dtEmprestimo").value = dtEmprestimo;
  document.getElementById("dtDevolucao").value = dtDevolucao;
  document.getElementById("status").value = status;
}

function cancelarEdicao() {
  document.getElementById("formEmprestimo").reset();
  document.getElementById("emprestimoIdEdit").value = "";
}

async function excluirEmprestimo(id) {
  if (confirm("Tem certeza que deseja excluir este empréstimo?")) {
    try {
      await fetch(`${API_URL}/emprestimos/${id}`, { method: "DELETE" });
      carregarEmprestimos();
    } catch (erro) {
      alert("Erro ao excluir empréstimo.");
    }
  }
}