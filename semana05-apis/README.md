# Consumo de APIs e DOM – Semana 05

Mini projeto em JavaScript que consome APIs reais com `fetch` e `async/await` e atualiza a página dinamicamente, tratando os quatro estados da tela: **carregando**, **erro**, **vazio** e **sucesso**.

## Como executar

1. Deixe `index.html` e `app.js` na mesma pasta.
2. Abra o `index.html` no navegador (duplo clique, ou **Open with Live Server** no VS Code).
3. É preciso ter internet para as buscas de CEP e de Pokémon.
4. Aperte **F12** e abra o **Console** para ver os resultados da Parte 1.

## Estrutura

| Arquivo | Função |
|---|---|
| `index.html` | Página com as três seções (pedidos, CEP e Pokédex) |
| `app.js` | Todo o código |
| `README.md` | Documentação e reflexão |

## Parte 1 – Pedidos

Fluxo aplicado ao array `pedidos`:

1. **Validar:** `filter` mantém só os pedidos com cliente não vazio (`trim() !== ""`) e valor numérico maior que 0.
2. **Filtrar:** `filter` de novo, para ficar só com `status === "pago"`.
3. **Somar:** `reduce` acumula o total faturado, começando em `0`.
4. **Formatar:** `map` gera textos como `Bia — R$ 120.00`, usando `toFixed(2)`.

Dos 8 pedidos de exemplo, 5 são válidos, 3 são pagos e o total faturado é **R$ 379.90**.

## Parte 2 – Buscador de CEP

**Validação:** o texto passa por `.trim()` e `.replace(/-/g, "")` (aceita `65010-000`) e depois é testado com a expressão `/^\d{8}$/`, que exige exatamente 8 dígitos.

**Os quatro estados:**

| Estado | Quando acontece | O que a tela faz |
|---|---|---|
| Carregando | Durante o `fetch` | Mostra "Buscando..." e desabilita o botão |
| Erro | Falha de rede (`catch`) ou resposta HTTP com erro (`!response.ok`) | Mostra "Falha na conexão..." |
| Vazio | A API devolve a chave `erro` | Mostra "CEP não encontrado" |
| Sucesso | Endereço encontrado | Limpa o resultado anterior com `replaceChildren()`, cria `<dt>` e `<dd>` com `createElement` e `textContent` (Rua, Bairro, Cidade, UF) e limpa o aviso |

O `finally` reabilita o botão em qualquer caso, para ele nunca ficar travado.

**Bônus:** cada busca bem-sucedida entra no array `historico` (objetos com `cep`, `cidade` e `uf`) e a lista é redesenhada na tela.

## Parte 3 – Mini Pokédex

- O nome digitado passa por `.trim()` e `.toLowerCase()`. Se ficar vazio, nada é buscado.
- A busca usa `https://pokeapi.co/api/v2/pokemon/{nome}`.
- Mostra nome, imagem (`sprites.front_default`) e tipos (`types.map(...)`).
- O `fetch` **não rejeita** a promessa em erros HTTP como o 404. Por isso o código confere `response.status === 404` ("Pokémon não encontrado") e `!response.ok` (falha na conexão) antes de ler o JSON.

## Parte 4 – Reflexão

**Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?**

Com `await` em sequência, cada requisição só começa depois que a anterior terminou. O tempo total é a **soma** dos tempos:

```js
const a = await fetch(urlA);
const b = await fetch(urlB);
const c = await fetch(urlC);
```

Com `Promise.all`, as três requisições são disparadas ao mesmo tempo (em paralelo) e o código espera todas terminarem juntas. O tempo total fica próximo ao da requisição **mais lenta**, e não da soma:

```js
const [a, b, c] = await Promise.all([fetch(urlA), fetch(urlB), fetch(urlC)]);
```

Exemplo: se cada requisição leva 1 segundo, a versão sequencial leva cerca de 3 segundos e a versão com `Promise.all` leva cerca de 1 segundo. Isso aproveita melhor o tempo de rede, já que a espera é de rede e não de processamento.

Só faz sentido usar `Promise.all` quando as requisições são **independentes**. Se uma precisar do resultado da outra, o `await` em sequência é o correto. Além disso, se uma das promessas do `Promise.all` falhar, o conjunto inteiro é rejeitado.
