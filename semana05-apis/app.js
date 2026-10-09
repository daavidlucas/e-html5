const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "Caio", valor: 80.5, status: "pendente" },
  { cliente: "", valor: 50, status: "pago" },
  { cliente: "Duda", valor: -10, status: "pago" },
  { cliente: "Edu", valor: "abc", status: "pago" },
  { cliente: "Fabi", valor: 200, status: "pago" },
  { cliente: "Gui", valor: 45.9, status: "cancelado" },
  { cliente: "Hugo", valor: 59.9, status: "pago" },
];

const pedidoValido = (pedido) =>
  typeof pedido.cliente === "string" &&
  pedido.cliente.trim() !== "" &&
  typeof pedido.valor === "number" &&
  !Number.isNaN(pedido.valor) &&
  pedido.valor > 0;

const pedidosValidos = pedidos.filter(pedidoValido);
const pedidosPagos = pedidosValidos.filter((pedido) => pedido.status === "pago");
const totalFaturado = pedidosPagos.reduce((total, pedido) => total + pedido.valor, 0);
const textosPedidos = pedidosPagos.map((pedido) => `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`);

console.log("Pedidos válidos:", pedidosValidos.length, "de", pedidos.length);
console.log("Pedidos pagos:", pedidosPagos);
console.log(`Total faturado: R$ ${totalFaturado.toFixed(2)}`);
textosPedidos.forEach((texto) => console.log(texto));

const listaPedidos = document.querySelector("#lista-pedidos");
textosPedidos.forEach((texto) => {
  const item = document.createElement("li");
  item.textContent = texto;
  listaPedidos.append(item);
});
document.querySelector("#total-pedidos").textContent = `Total faturado: R$ ${totalFaturado.toFixed(2)}`;

const formCep = document.querySelector("#form-cep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#btn-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCep = document.querySelector("#historico-cep");
const historico = [];

function mostrarHistorico() {
  historicoCep.replaceChildren();
  historico.forEach((registro) => {
    const item = document.createElement("li");
    item.textContent = `${registro.cep} — ${registro.cidade}/${registro.uf}`;
    historicoCep.append(item);
  });
}

function mostrarEndereco(dados) {
  const campos = [
    ["Rua", dados.logradouro],
    ["Bairro", dados.bairro],
    ["Cidade", dados.localidade],
    ["UF", dados.uf],
  ];
  resultadoCep.replaceChildren();
  campos.forEach(([rotulo, valor]) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = rotulo;
    dd.textContent = valor || "-";
    resultadoCep.append(dt, dd);
  });
}

async function buscarCep(cep) {
  statusCep.textContent = "Buscando...";
  botaoCep.disabled = true;
  resultadoCep.replaceChildren();

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    const dados = await response.json();

    if (dados.erro) {
      statusCep.textContent = "CEP não encontrado";
      return;
    }

    mostrarEndereco(dados);
    historico.push({ cep: dados.cep, cidade: dados.localidade, uf: dados.uf });
    mostrarHistorico();
    statusCep.textContent = "";
  } catch (erro) {
    console.error(erro);
    statusCep.textContent = "Falha na conexão. Verifique sua internet e tente novamente.";
  } finally {
    botaoCep.disabled = false;
  }
}

formCep.addEventListener("submit", (e) => {
  e.preventDefault();
  const cep = campoCep.value.trim().replace(/-/g, "");

  if (!/^\d{8}$/.test(cep)) {
    resultadoCep.replaceChildren();
    statusCep.textContent = "CEP inválido: digite exatamente 8 números.";
    return;
  }

  buscarCep(cep);
});

const formPokemon = document.querySelector("#form-pokemon");
const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#btn-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

function mostrarPokemon(dados) {
  const nome = document.createElement("h3");
  nome.textContent = dados.name;

  const tipos = document.createElement("p");
  tipos.textContent = `Tipos: ${dados.types.map((item) => item.type.name).join(", ")}`;

  resultadoPokemon.replaceChildren(nome);

  if (dados.sprites.front_default) {
    const imagem = document.createElement("img");
    imagem.src = dados.sprites.front_default;
    imagem.alt = dados.name;
    resultadoPokemon.append(imagem);
  }

  resultadoPokemon.append(tipos);
}

async function buscarPokemon(nome) {
  statusPokemon.textContent = "Buscando...";
  botaoPokemon.disabled = true;
  resultadoPokemon.replaceChildren();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`);

    if (response.status === 404) {
      statusPokemon.textContent = "Pokémon não encontrado";
      return;
    }
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const dados = await response.json();
    mostrarPokemon(dados);
    statusPokemon.textContent = "";
  } catch (erro) {
    console.error(erro);
    statusPokemon.textContent = "Falha na conexão. Verifique sua internet e tente novamente.";
  } finally {
    botaoPokemon.disabled = false;
  }
}

formPokemon.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = campoPokemon.value.trim().toLowerCase();

  if (nome === "") {
    resultadoPokemon.replaceChildren();
    statusPokemon.textContent = "Digite o nome de um Pokémon.";
    return;
  }

  buscarPokemon(nome);
});
