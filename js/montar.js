const WHATSAPP = "5586999998679";
const R = (n) => "R$ " + n.toFixed(2).replace(".", ",");

const op = (lista) =>
  lista.map((x, i) =>
    Array.isArray(x)
      ? { nome: x[0], desc: x[1], ...(x[2] || {}), id: i }
      : typeof x === "string"
        ? { nome: x, id: i }
        : { ...x, id: i }
  );

const g = (id, r, opcoes, extra = {}) => ({
  id, r, op: undefined,
  opcoes: op(opcoes),
  estilo: "chips", multi: false, max: 1, obrig: true, ...extra,
});

const pers = () =>
  g("personalizacao", "Personalização",
    [["Adesivo ou tag personalizado", "R$ 1,00 por unidade", { porUnid: 1 }]],
    { estilo: "cards", obrig: false, titulo: "Personalização" });

const unitario = (nome, pron, emoji, unit, ultimo, minimo = 1) => ({
  nome, pron, emoji,
  passos: [
    {
      titulo: "Quantas unidades?",
      sub: minimo > 1
        ? "Pedido mínimo de " + minimo + " unidades"
        : "Digite a quantidade que você precisa",
      grupos: [g("qtd", "Quantidade", [], {
        estilo: "qtd", unit, min: minimo, titulo: "Quantidade"
      })],
    },
    ultimo,
  ],
});

const TRAD = [
  "Brigadeiro Tradicional", "Brigadeiro Branco", "Delícia de Coco",
  "Romeu e Julieta", "Surpresa de Uva", "Prestígio", "Ninho", "Amendoim"
];

const ESP = [
  "Casadinho", "Churros", "Trufa de Maracujá", "Ninho com Nutella",
  "Ferrero Rocher", "Olho de Sogra", "Castanha"
];

const P_T50 = "Tradicionais · 50 unidades";
const P_T100 = "Tradicionais · 100 unidades";
const P_E50 = "Especiais · 50 unidades";
const P_E100 = "Especiais · 100 unidades";

const sabores = (id, lista, n, pacote) =>
  g(id, "Sabores", lista, {
    titulo: "Escolha " + n + (n === 1 ? " sabor" : " sabores"),
    multi: true, max: n, min: n, quando: ["pacote", pacote],
  });

const RECHEIOS = [
  "Brigadeiro Tradicional", "Brigadeiro Branco", "Doce de Leite",
  "Doce de Leite com Coco", "Prestígio (Chocolate com Coco)", "Delícia de Coco",
  ...[
    "Crocante", "Doce de Leite com Crocante", "Olho de Sogra", "Ninho",
    "Oreo", "Abacaxi com Coco", "Doce de Leite com Ameixa"
  ].map((n) => [n, undefined, { preco: 20 }]),
];

const massaBolo = () =>
  g("massa", "Massa", [
    "Amanteigada", "Mista",
    ["Matilda (Chocolatuda)", undefined, { preco: 15 }]
  ], { titulo: "Sabor da massa" });

const recheioBolo = () =>
  g("recheio", "Recheio", RECHEIOS, {
    titulo: "Recheio(s)", multi: true,
    max: () => {
      const t = ach("tamanho");
      const k = ach("kit");
      return (t && t.umRecheio) || (k && k.umRecheio) ? 1 : 2;
    },
    nota: "especiais +R$ 20,00 cada"
  });

const TIPOS = {
  bolo: {
    nome: "Bolo", pron: "seu", emoji: "🎂",
    passos: [
      {
        titulo: "Qual tamanho você precisa?",
        sub: "Preço do bolo sem topo. O topo você escolhe mais adiante",
        grupos: [
          g("tamanho", "Tamanho", [
            ["Baby Mini (15cm)", "10 fatias", { preco: 100, topo: 20, umRecheio: true }],
            ["Mini Trad. (15cm)", "15 fatias", { preco: 125, topo: 20, umRecheio: true }],
            ["PP Duo (18cm)", "20 fatias", { preco: 135, topo: 20, umRecheio: true }],
            ["PP Trad. (18cm)", "30 fatias", { preco: 150, topo: 25,}],
            ["P Trad. (22cm)", "40 fatias", { preco: 170, topo: 30 }],
            ["M Trad. (26cm)", "50 fatias", { preco: 220, topo: 30 }],
            ["G Trad. (30cm) · Novo", "70 fatias", { preco: 380, topo: 50 }],
          ], { estilo: "cards", base: true })
        ],
      },
      {
        titulo: "Massa e recheio",
        sub: "Cada recheio especial soma R$ 20,00 ao bolo. Nos bolos Baby Mini, Mini Trad. e PP Duo, escolha 1 recheio",
        grupos: [massaBolo(), recheioBolo()],
      },
      {
        titulo: "Topo e decoração",
        sub: "Escolha o topo e as decorações do seu bolo",
        tema: true,
        grupos: [
          g("topo", "Topo", [
            "Sem topo",
            ["Topo simples", "Valor varia conforme o tamanho", {
              preco: () => (ach("tamanho") || {}).topo || 0
            }],
            ["Topo 3D ou personalizado", "Valor combinado com a Micka", {
              consulta: true
            }],
          ], { estilo: "cards", titulo: "Topo do bolo" }),
          g("decoracao", "Decoração", [
            ["Glitter", undefined, { preco: 15 }],
            ["Topo em camadas (3D)", undefined, { consulta: true }],
          ], {
            multi: true, max: 2, obrig: false,
            titulo: "Decoração", dica: "(opcional)"
          }),
          g("flores", "Flores 4D", [], {
            estilo: "qtd", unit: 7, min: 0, titulo: "Flores 4D",
            dica: "(opcional, R$ 7,00 cada)"
          }),
        ],
      },
    ],
  },

  brigadeiro: {
    nome: "Docinhos", pron: "seus", emoji: "🍫",
    passos: [
      {
        titulo: "Qual pacote você deseja?",
        sub: "Tradicionais ou especiais, em 50 ou 100 unidades",
        grupos: [
          g("pacote", "Pacote", [
            [P_T50, "2 sabores, 25 de cada", { preco: 80, unid: 50 }],
            [P_T100, "4 sabores, 25 de cada", { preco: 150, unid: 100 }],
            [P_E50, "1 sabor", { preco: 110, unid: 50 }],
            [P_E100, "2 sabores, 50 de cada", { preco: 200, unid: 100 }],
          ], { estilo: "cards", base: true })
        ],
      },
      {
        titulo: "Escolha os sabores",
        sub: "As unidades são divididas igualmente entre os sabores",
        grupos: [
          sabores("sabT50", TRAD, 2, P_T50),
          sabores("sabT100", TRAD, 4, P_T100),
          sabores("sabE50", ESP, 1, P_E50),
          sabores("sabE100", ESP, 2, P_E100),
        ],
      },
      {
        titulo: "Personalização", sub: "Opcional",
        tema: true, grupos: [pers()]
      },
    ],
  },

  bemvivido: unitario("Bem-vivido", "seu", "🍪", 5, {
    titulo: "Cor e personalização",
    sub: "Deixe do seu jeito",
    tema: true,
    grupos: [
      g("cor", "Cor", [
        "Rosa", "Azul", "Verde", "Dourado", "Vermelho", "Colorido"
      ], {
        titulo: "Cor(es)", multi: true, max: 2, obrig: false
      }),
      pers(),
    ],
  }, 12),

  cupcake: unitario("Cupcake", "seu", "🧁", 6, {
    titulo: "Recheio e personalização",
    sub: "Deixe do seu jeito",
    tema: true,
    grupos: [
      g("recheio", "Recheio", [
        "Ninho", "Doce de leite", "Coco", "Brigadeiro"
      ], { titulo: "Recheio", obrig: false }),
      pers(),
    ],
  }, 6),

  pirulito: unitario("Pirulito ao Leite", "seu", "🍭", 5, {
    titulo: "Personalização",
    sub: "Opcional",
    tema: true,
    grupos: [pers()],
  }, 10),

  kit: {
    nome: "Kit Festa", pron: "seu", emoji: "🎉",
    passos: [
      {
        titulo: "Escolha o seu kit",
        sub: "Bolo com topo personalizado e doces para a sua festa",
        grupos: [
          g("kit", "Kit", [
            ["Kit para 10 pessoas", "Baby mini com topo personalizado e 20 doces", { preco: 150, umRecheio: true }],
            ["Kit para 20 pessoas", "PP duo com topo personalizado e 20 doces", { preco: 190, umRecheio: true }],
            ["Kit para 40 pessoas", "P com topo personalizado e 30 doces", { preco: 250 }],
            ["Kit para 20 pessoas", "PP Duo com topo personalizado, 20 doces e 4 cupcakes", { preco: 210, umRecheio: true }],
            ["Kit para 30 pessoas", "PP com topo personalizado, 20 doces e 4 cupcakes", { preco: 230 }],
            ["Kit para 40 pessoas", "P com topo personalizado, 20 doces e 4 cupcakes", { preco: 255 }],
            ["Kit para 60 pessoas", "M com topo personalizado, 50 doces e 4 cupcakes", { preco: 350, umRecheio: true }],
            ["Kit para 10 pessoas", "Baby mini com topo personalizado, 20 doces e 50 coxinhas", { preco: 190, umRecheio: true }],
            ["Kit para 20 pessoas", "PP duo com topo personalizado, 20 doces e 50 coxinhas", { preco: 225, umRecheio: true }],
          ], { estilo: "cards", base: true })
        ],
      },
      {
        titulo: "Massa e recheio do bolo",
        grupos: [massaBolo(), recheioBolo()],
      },
      {
        titulo: "Tipo de brigadeiro",
        sub: "Escolha 1 sabor para os doces do kit",
        grupos: [
          g("brigadeiro", "Brigadeiro", [
            "Coco","Chocolate","Ninho"
          ], {
            titulo: "Sabor do brigadeiro", multi: false, max: 1, min: 1,
            nota: "escolha apenas 1 sabor"
          }),
        ],
      },
      {
        titulo: "Detalhes do kit",
        sub: "Conte como quer o topo e os doces",
        tema: true,
        grupos: [],
      },
    ],
  },

  torta: {
    nome: "Torta", pron: "sua", emoji: "🍰", semPreco: true,
    passos: [
      {
        titulo: "Qual tamanho você precisa?",
        sub: "O valor da torta é combinado com a Micka",
        grupos: [
          g("tamanho", "Tamanho", [["Pequena","(20 fatias)"],["Média","(40 fatias)"]], {
            titulo: "Tamanho"
          })
        ],
      },
      {
        titulo: "Massa e recheio",
        sub: "Você pode escolher até 2 recheios",
        tema: true,
        grupos: [
          g("massa", "Massa", ["Branca", "Red Velvet"], {
            titulo: "Sabor da massa"
          }),
          g("recheio", "Recheio", [
            "Ninho", "Doce de leite", "Pudim", "Brigadeiro"
          ], {
            titulo: "Recheio(s)", multi: true, max: 2
          }),
        ],
      },
    ],
  },
};

const params = new URLSearchParams(window.location.search);
const chaveInicial = TIPOS[params.get("tipo")] ? params.get("tipo") : "bolo";

let chave, tipo, sel, qtds;
let passo = 0;
let modo = "item"; // "item" | "escolher" | "final"
const carrinho = [];
let foto = null;
let fotoUrl = "";

const todos = () => tipo.passos.flatMap((p) => p.grupos);

const dados = { tema: "", nome: "", whats: "", data: "", obs: "" };

const tela = document.getElementById("tela");

const ach = (id) => {
  const gr = todos().find((x) => x.id === id);
  return gr && gr.opcoes.find((o) => sel[id].includes(o.id));
};

function iniciarItem(c, tema = "") {
  chave = c;
  tipo = TIPOS[c];
  sel = {};
  qtds = {};
  todos().forEach((gr) => { sel[gr.id] = []; qtds[gr.id] = 0; });
  dados.tema = tema;
  passo = 0;
  modo = "item";
}

function carregar(s) {
  chave = s.chave;
  tipo = TIPOS[s.chave];
  sel = JSON.parse(JSON.stringify(s.sel));
  qtds = { ...s.qtds };
  dados.tema = s.tema;
}

function fotografar() {
  return {
    chave, tema: dados.tema,
    sel: JSON.parse(JSON.stringify(sel)), qtds: { ...qtds },
    emoji: tipo.emoji, nome: tipo.nome, pron: tipo.pron,
    linhas: linhasResumo().slice(1),
    total: total(),
  };
}

function totalGeral(incluirAtual) {
  const lista = carrinho.map((i) => i.total);
  if (incluirAtual) lista.push(total());
  return {
    v: lista.reduce((a, t) => a + t.v, 0),
    c: lista.some((t) => t.c),
  };
}

const unidades = () => {
  const a = ach("pacote");
  return (a && a.unid) || qtds.qtd || 0;
};

const valorOp = (o) =>
  o.consulta ? null
    : typeof o.preco === "function" ? o.preco()
    : o.porUnid ? o.porUnid * unidades()
    : o.preco || 0;

const visivel = (gr) =>
  !gr.quando || (ach(gr.quando[0]) || {}).nome === gr.quando[1];

const grupos = () => todos().filter(visivel);

const maxDe = (gr) => (typeof gr.max === "function" ? gr.max() : gr.max);

function precoGrupo(gr) {
  if (gr.estilo === "qtd") {
    return { v: qtds[gr.id] * gr.unit, c: false };
  }

  let c = false;

  const vals = gr.opcoes
    .filter((o) => sel[gr.id].includes(o.id))
    .map((o) => {
      const x = valorOp(o);
      if (x === null) c = true;
      return x || 0;
    });

  const v = gr.unico ? Math.max(0, ...vals) : vals.reduce((a, b) => a + b, 0);
  return { v, c };
}

function total() {
  if (tipo.semPreco) return { v: 0, c: true };

  let v = 0, c = false;

  grupos().forEach((gr) => {
    const p = precoGrupo(gr);
    v += p.v;
    c = c || p.c;
  });

  return { v, c };
}

const textoTotal = (t) =>
  t.v > 0
    ? R(t.v) + (t.c ? " + itens sob consulta" : "")
    : t.c ? "sob consulta" : R(0);

function rotuloPreco(gr, o) {
  if (o.consulta) return "sob consulta";
  if (o.porUnid) return "+" + R(o.porUnid) + " cada";

  const v = valorOp(o);
  return v > 0 ? (gr.base ? R(v) : "+" + R(v)) : "";
}

function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

const mascaraTel = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
};

function hojeISO() {
  const h = new Date();
  return h.getFullYear() + "-" +
    String(h.getMonth() + 1).padStart(2, "0") + "-" +
    String(h.getDate()).padStart(2, "0");
}

function formatarData(v) {
  const [a, m, d] = v.split("-");
  return d + "/" + m + "/" + a;
}

function grupoOk(gr) {
  if (gr.estilo === "qtd") return qtds[gr.id] >= (gr.min || 0);

  const minimo = gr.min !== undefined ? gr.min : gr.obrig ? 1 : 0;
  return sel[gr.id].length >= minimo;
}

function valido() {
  if (modo === "item") {
    return tipo.passos[passo].grupos.filter(visivel).every(grupoOk);
  }

  return (
    modo === "final" &&
    carrinho.length > 0 &&
    dados.nome.trim().length > 1 &&
    dados.whats.replace(/\D/g, "").length >= 10 &&
    dados.data !== ""
  );
}

function escolher(gr, nome, id) {
  const lista = sel[gr.id];
  const chave = id !== undefined ? id : nome;
  const i = lista.indexOf(chave);

  if (!gr.multi) {
    sel[gr.id] = i >= 0 ? [] : [chave];
  } else if (i >= 0) {
    lista.splice(i, 1);
  } else if (lista.length < maxDe(gr)) {
    lista.push(chave);
  }

  renderPasso(false);
}

function linhasResumo() {
  const linhas = [
    { r: "Tipo", txt: tipo.emoji + " " + tipo.nome, preco: "" }
  ];

  grupos().forEach((gr) => {
    const txt = gr.estilo === "qtd"
      ? (qtds[gr.id] > 0 ? qtds[gr.id] + " unid." : "")
      : gr.opcoes
          .filter((o) => sel[gr.id].includes(o.id))
          .map((o) => o.nome + (gr.id === "kit" && o.desc ? " (" + o.desc + ")" : ""))
          .join(" + ");

    if (!txt) return;

    const { v, c } = precoGrupo(gr);
    const preco = c
      ? (v ? R(v) + " + sob consulta" : "sob consulta")
      : v > 0 ? R(v) : "";

    linhas.push({ r: gr.r, txt, preco });
  });

  if (dados.tema.trim()) {
    linhas.push({ r: "Tema/nome", txt: dados.tema.trim(), preco: "" });
  }

  return linhas;
}

function campo(rotulo, opcional, tag, attrs, chaveDado, mascara) {
  const l = el("label", "campo");
  l.appendChild(document.createTextNode(rotulo + " "));

  if (opcional) l.appendChild(el("span", "", opcional));

  const i = document.createElement(tag);
  Object.assign(i, attrs);
  i.value = dados[chaveDado];

  i.addEventListener("input", () => {
    if (mascara) i.value = mascara(i.value);
    dados[chaveDado] = i.value;
    atualizarBotoes();
  });

  l.appendChild(i);
  return l;
}

function renderGrupo(gr) {
  const box = el("section", "grupo");

  if (gr.titulo) {
    const h = el("h3", "", gr.titulo + " ");
    const dica = gr.dica ||
      (gr.multi
        ? "(" + sel[gr.id].length + " de " + maxDe(gr) + " selecionados" +
          (gr.nota ? " · " + gr.nota : "") + ")"
        : "");

    h.appendChild(el("span", "", dica));
    box.appendChild(h);
  }

  const cards = gr.estilo === "cards";
  const lista = el("div", cards ? "cards" : "chips");

  gr.opcoes.forEach((o) => {
    const ativa = sel[gr.id].includes(o.id);
    const b = el(
      "button",
      (cards ? "opcao-card" : "chip") + (ativa ? " ativa" : "")
    );

    b.type = "button";
    const preco = rotuloPreco(gr, o);

    if (cards) {
      const t = el("div");
      t.appendChild(el("strong", "", o.nome));

      if (o.desc) t.appendChild(el("small", "", o.desc));

      b.appendChild(t);

      if (preco) b.appendChild(el("span", "preco", preco));
    } else {
      b.textContent = "";

      if (gr.id === "tamanho" && o.desc) {
        const t = el("div", "tamanho-opcao");
        t.appendChild(el("strong", "", o.nome));
        t.appendChild(el("small", "", o.desc));
        b.appendChild(t);
      } else {
        b.appendChild(el("span", "", o.nome));
      }

      if (preco) b.appendChild(el("span", "chip-preco", preco));

      b.disabled = gr.multi && !ativa && sel[gr.id].length >= maxDe(gr);
    }

    b.addEventListener("click", () => escolher(gr, o.nome, o.id));
    lista.appendChild(b);
  });

  box.appendChild(lista);
  return box;
}

function renderQtd(gr) {
  const box = el("section", "grupo");
  const h = el("h3", "", gr.titulo + " ");
  if (gr.dica) h.appendChild(el("span", "", gr.dica));
  box.appendChild(h);

  const linha = el("div", "qtd");
  const menos = el("button", "qtd-btn", "−");
  const mais = el("button", "qtd-btn", "+");

  menos.type = "button";
  mais.type = "button";

  const inp = document.createElement("input");
  inp.type = "number";
  inp.min = "0";
  inp.max = "999";
  inp.inputMode = "numeric";
  inp.value = qtds[gr.id];

  const info = el("small", "qtd-info");

  const atual = () => {
    const n = qtds[gr.id];
    const mn = gr.min || 0;

    if (n > 0 && n < mn) {
      info.textContent = "Pedido mínimo de " + mn + " unidades";
    } else if (n > 0) {
      info.textContent = n + " × " + R(gr.unit) + " = " + R(n * gr.unit);
    } else {
      info.textContent = R(gr.unit) + " cada" +
        (mn > 1 ? " · mínimo de " + mn + " unidades" : "");
    }

    menos.disabled = n <= mn;
  };

  const mudar = (n) => {
    qtds[gr.id] = Math.max(0, Math.min(999, n || 0));
    inp.value = qtds[gr.id];
    atual();
    atualizarBotoes();
  };

  inp.addEventListener("input", () => {
    qtds[gr.id] = Math.max(
      0, Math.min(999, parseInt(inp.value, 10) || 0)
    );
    atual();
    atualizarBotoes();
  });

  menos.addEventListener("click", () => mudar(qtds[gr.id] - 1));
  mais.addEventListener("click", () =>
    mudar(qtds[gr.id] < (gr.min || 0) ? gr.min : qtds[gr.id] + 1)
  );

  linha.append(menos, inp, mais);
  box.append(linha, info);
  atual();

  return box;
}

function renderEscolhas(p) {
  tela.appendChild(el("h1", "", p.titulo));
  tela.appendChild(el("p", "sub", p.sub));

  p.grupos.filter(visivel).forEach((gr) =>
    tela.appendChild(
      gr.estilo === "qtd" ? renderQtd(gr) : renderGrupo(gr)
    )
  );

  if (p.tema) {
    tela.appendChild(
      campo(
        "Tema ou nome", "(opcional)", "input",
        {
          type: "text",
          maxLength: 60,
          placeholder: "Ex: Unicórnio, 15 anos da Maria, Princesa Sofia..."
        },
        "tema"
      )
    );
  }
}

function renderFoto() {
  const box = el("div", "grupo");
  const h = el("h3", "", "Foto de referência ");
  h.appendChild(el("span", "", "(opcional)"));
  box.appendChild(h);

  const zona = el("label", "foto");
  const inp = document.createElement("input");

  inp.type = "file";
  inp.accept = "image/jpeg,image/png,image/webp";
  inp.hidden = true;

  inp.addEventListener("change", () => {
    const f = inp.files[0];
    if (!f) return;

    if (
      !/^image\/(jpeg|png|webp)$/.test(f.type) ||
      f.size > 10 * 1024 * 1024
    ) {
      alert("Use uma foto JPG, PNG ou WEBP de até 10MB.");
      return;
    }

    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    foto = f;
    fotoUrl = URL.createObjectURL(f);
    renderPasso(false);
  });

  if (foto) {
    const img = el("img", "previa");
    img.src = fotoUrl;
    img.alt = "Foto de referência escolhida";
    zona.appendChild(img);
    zona.appendChild(el("span", "trocar", "Clique para trocar a foto"));
  } else {
    zona.appendChild(el("span", "icone", "⬆"));
    zona.appendChild(el("strong", "", "Clique para enviar uma foto"));
    zona.appendChild(el("small", "", "JPG, PNG ou WEBP · Máx. 10MB"));
  }

  zona.appendChild(inp);
  box.appendChild(zona);

  if (foto) {
    box.appendChild(
      el("p", "aviso", "Depois que o WhatsApp abrir, anexe esta mesma foto na conversa.")
    );
  }

  return box;
}

function renderEscolher() {
  tela.appendChild(
    el("h1", "", carrinho.length ? "Adicionar outro item" : "O que você quer pedir?")
  );
  tela.appendChild(el("p", "sub", "Escolha o que mais entra no seu pedido"));

  const lista = el("div", "cards");

  Object.entries(TIPOS).forEach(([k, t]) => {
    const b = el("button", "opcao-card");
    b.type = "button";

    const d = el("div");
    d.appendChild(el("strong", "", t.emoji + " " + t.nome));
    b.appendChild(d);

    b.addEventListener("click", () => {
      iniciarItem(k);
      renderPasso();
    });

    lista.appendChild(b);
  });

  tela.appendChild(lista);
}

function removerItem(i) {
  carrinho.splice(i, 1);
  if (!carrinho.length) modo = "escolher";
  renderPasso();
}

function renderFinal() {
  tela.appendChild(el("h1", "", "Seu pedido"));
  tela.appendChild(
    el("p", "sub", "Confira os itens, adicione outro se quiser e preencha seus dados")
  );

  carrinho.forEach((it, idx) => {
    const box = el("section", "resumo");

    const topo = el("div", "item-topo");
    topo.appendChild(el("h3", "", it.emoji + " " + it.nome));

    const rm = el("button", "remover", "Remover");
    rm.type = "button";
    rm.addEventListener("click", () => removerItem(idx));
    topo.appendChild(rm);
    box.appendChild(topo);

    it.linhas.forEach((l) => {
      const linha = el("div", "linha-resumo");
      linha.appendChild(el("span", "", l.r));

      const dir = el("div", "dir");
      dir.appendChild(el("strong", "", l.txt));
      if (l.preco) dir.appendChild(el("em", "", l.preco));

      linha.appendChild(dir);
      box.appendChild(linha);
    });

    if (it.total.v > 0 || it.total.c) {
      const st = el("div", "linha-resumo");
      st.appendChild(el("span", "", "Subtotal"));

      const dir = el("div", "dir");
      dir.appendChild(el("strong", "", textoTotal(it.total)));
      st.appendChild(dir);

      box.appendChild(st);
    }

    tela.appendChild(box);
  });

  const wrap = el("div", "cards");
  const add = el("button", "opcao-card");
  add.type = "button";

  const d = el("div");
  d.appendChild(el("strong", "", "➕ Adicionar outro item"));
  d.appendChild(el("small", "", "Ex: um bolo e também cupcakes"));
  add.appendChild(d);

  add.addEventListener("click", () => {
    modo = "escolher";
    renderPasso();
  });

  wrap.appendChild(add);
  tela.appendChild(wrap);

  tela.appendChild(
    campo("Seu nome *", "", "input",
      { type: "text", maxLength: 60, placeholder: "Nome completo" },
      "nome")
  );

  tela.appendChild(
    campo("WhatsApp *", "", "input",
      { type: "tel", placeholder: "(86) 99999-0000" },
      "whats", mascaraTel)
  );

  tela.appendChild(
    campo("Data de retirada *", "", "input",
      { type: "date", min: hojeISO() },
      "data")
  );

  tela.appendChild(renderFoto());

  tela.appendChild(
    campo("Observações", "(opcional)", "textarea",
      {
        rows: 3,
        placeholder: "Alguma alergia? Cor específica? Algo especial que você quer na decoração?"
      },
      "obs")
  );

  const tg = totalGeral(false);
  const fim = el("section", "resumo");
  fim.appendChild(el("h3", "", "Total do pedido"));

  const tot = el("div", "total");
  tot.appendChild(el("span", "", "Total estimado"));
  tot.appendChild(el("strong", "", textoTotal(tg)));
  fim.appendChild(tot);

  if (!tg.c && tg.v > 0) {
    const ent = el("div", "entrada");
    ent.appendChild(el("span", "", "Entrada de 50% no ato da encomenda"));
    ent.appendChild(el("span", "", R(tg.v / 2)));
    fim.appendChild(ent);
  }

  fim.appendChild(
    el("p", "nota", "Valor estimado, sujeito a confirmação pela Micka. Aceitamos PIX e cartão de crédito (com acréscimo).")
  );

  tela.appendChild(fim);
}

function renderTopo() {
  const cont = document.getElementById("contador");
  const ol = document.getElementById("passos");
  ol.replaceChildren();

  if (modo !== "item") {
    const n = carrinho.length;
    cont.textContent = modo === "final"
      ? "🛒 " + n + (n === 1 ? " item" : " itens")
      : "➕ Novo item";
    return;
  }

  const n = tipo.passos.length;
  cont.textContent = tipo.emoji + " " + (passo + 1) + "/" + n;

  for (let i = 0; i < n; i++) {
    if (i > 0) {
      ol.appendChild(el("li", "linha" + (i <= passo ? " feita" : "")));
    }

    ol.appendChild(
      el(
        "li",
        "passo" + (i < passo ? " feito" : i === passo ? " atual" : ""),
        i < passo ? "✓" : String(i + 1)
      )
    );
  }
}

function cabecalho() {
  const e = document.getElementById("emoji-tipo");
  const t = document.getElementById("titulo-tipo");

  if (modo === "item") {
    e.textContent = tipo.emoji;
    t.textContent = "Monte " + tipo.pron + " " + tipo.nome;
    document.title = "Monte " + tipo.pron + " " + tipo.nome + " | Bolaria da Micka";
  } else {
    e.textContent = "🛒";
    t.textContent = modo === "final" ? "Seu pedido" : "Adicionar item";
  }
}

function atualizarBotoes() {
  const prox = document.getElementById("prox");
  const noItem = modo === "item";

  document.getElementById("voltar").hidden =
    modo === "escolher" || (noItem && passo === 0 && carrinho.length === 0);

  prox.hidden = modo === "escolher";

  prox.textContent = modo === "final"
    ? "💬 Enviar pedido pelo WhatsApp"
    : passo === tipo.passos.length - 1 ? "Revisar pedido ›" : "Próximo ›";

  prox.disabled = !valido();

  const n = carrinho.length;
  const t = totalGeral(noItem);

  const base = noItem
    ? tipo.emoji + " Você está montando: " + tipo.nome +
      (n ? " · já no pedido: " + n : "")
    : "🛒 " + n + (n === 1 ? " item" : " itens") + " no pedido";

  document.getElementById("rodape").textContent =
    base + (t.v > 0 || t.c ? " · Total: " + textoTotal(t) : "");
}

function ajustar() {
  todos().forEach((gr) => {
    const m = maxDe(gr);
    if (gr.multi && sel[gr.id].length > m) {
      sel[gr.id] = sel[gr.id].slice(0, m);
    }
  });
}

function renderPasso(rolar = true) {
  ajustar();
  renderTopo();
  cabecalho();
  tela.replaceChildren();

  if (modo === "item") renderEscolhas(tipo.passos[passo]);
  else if (modo === "escolher") renderEscolher();
  else renderFinal();

  atualizarBotoes();

  if (rolar) window.scrollTo({ top: 0, behavior: "smooth" });
}

function enviar() {
  const linha = (l) =>
    "*" + l.r + ":* " + l.txt + (l.preco ? " (" + l.preco + ")" : "") + "\n";

  let t;

  if (carrinho.length === 1) {
    const it = carrinho[0];
    t = "Olá! Quero montar " + (it.pron === "sua" ? "uma" : "um") +
      " *" + it.nome + "* " + it.emoji + "\n\n";
    it.linhas.forEach((l) => (t += linha(l)));
  } else {
    t = "Olá! Quero fazer um pedido com *" + carrinho.length + " itens*:\n";

    carrinho.forEach((it, n) => {
      t += "\n*" + (n + 1) + ") " + it.emoji + " " + it.nome + "*\n";
      it.linhas.forEach((l) => (t += linha(l)));

      if (it.total.v > 0 || it.total.c) {
        t += "_Subtotal: " + textoTotal(it.total) + "_\n";
      }
    });
  }

  const tt = totalGeral(false);

  t += "\n*Total estimado:* " + textoTotal(tt);

  if (!tt.c && tt.v > 0) {
    t += "\n*Entrada de 50%:* " + R(tt.v / 2);
  }

  t += "\n\n*Nome:* " + dados.nome.trim();
  t += "\n*WhatsApp:* " + dados.whats;
  t += "\n*Data de retirada:* " + formatarData(dados.data);

  if (dados.obs.trim()) {
    t += "\n*Observações:* " + dados.obs.trim();
  }

  if (foto) {
    t += "\n\n📷 Vou enviar a foto de referência aqui na conversa.";
  }

  window.location.href =
    "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(t);
}

function voltar() {
  if (modo === "final") {
    // reabre o último item para editar
    carregar(carrinho.pop());
    passo = tipo.passos.length - 1;
    modo = "item";
  } else if (modo === "escolher" || (modo === "item" && passo === 0)) {
    if (!carrinho.length) {
      window.location.href = "index.html#personalize";
      return;
    }
    modo = "final";
  } else {
    passo--;
  }

  renderPasso();
}

document.getElementById("prox").addEventListener("click", () => {
  if (!valido()) return;

  if (modo === "final") return enviar();

  if (passo < tipo.passos.length - 1) {
    passo++;
  } else {
    carrinho.push(fotografar());
    modo = "final";
  }

  renderPasso();
});

document.getElementById("voltar").addEventListener("click", voltar);
document.getElementById("topo-voltar").addEventListener("click", voltar);

iniciarItem(chaveInicial, params.get("produto") || "");
renderPasso(false);