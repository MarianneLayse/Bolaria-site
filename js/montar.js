
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

const unitario = (nome, pron, emoji, unit, ultimo) => ({
  nome, pron, emoji,
  passos: [
    {
      titulo: "Quantas unidades?",
      sub: "Digite a quantidade que você precisa",
      grupos: [g("qtd", "Quantidade", [], {
        estilo: "qtd", unit, min: 1, titulo: "Quantidade"
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

const TIPOS = {
  bolo: {
    nome: "Bolo", pron: "seu", emoji: "🎂",
    passos: [
      {
        titulo: "Qual tamanho você precisa?",
        sub: "Preço do bolo sem topo. O topo você escolhe mais adiante",
        grupos: [
          g("tamanho", "Tamanho", [
            ["Baby Mini (15cm)", "10 fatias", { preco: 100, topo: 20 }],
            ["Mini Trad. (15cm)", "15 fatias", { preco: 125, topo: 20 }],
            ["PP Duo (18cm)", "20 fatias", { preco: 135, topo: 20 }],
            ["PP Trad. (18cm)", "30 fatias", { preco: 150, topo: 25 }],
            ["P Trad. (22cm)", "40 fatias", { preco: 170, topo: 30 }],
            ["M Trad. (26cm)", "50 fatias", { preco: 220, topo: 30 }],
            ["G Trad. (30cm) · Novo", "70 fatias", { preco: 380, topo: 50 }],
          ], { estilo: "cards", base: true })
        ],
      },
      {
        titulo: "Massa e recheio",
        sub: "Cada recheio especial soma R$ 20,00 ao bolo",
        grupos: [
          g("massa", "Massa", [
            "Amanteigada", "Mista",
            ["Matilda (Chocolatuda)", undefined, { preco: 15 }]
          ], { titulo: "Sabor da massa" }),
          g("recheio", "Recheio", RECHEIOS, {
            titulo: "Recheio(s)", multi: true, max: 2,
            nota: "especiais +R$ 20,00 cada"
          }),
        ],
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
        titulo: "Qual pacote você quer?",
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
  }),

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
  }),

  pirulito: unitario("Pirulito ao Leite", "seu", "🍭", 5, {
    titulo: "Personalização",
    sub: "Opcional",
    tema: true,
    grupos: [pers()],
  }),

  kit: {
    nome: "Kit Festa", pron: "seu", emoji: "🎉",
    passos: [
      {
        titulo: "Escolha o seu kit",
        sub: "Bolo com topo personalizado, 20 doces e 4 cupcakes",
        grupos: [
          g("kit", "Kit", [
            ["Kit para 10 pessoas", "Baby mini com topo personalizado e 20 doces", { preco: 150 }],
            ["Kit para 20 pessoas", "PP duo com topo personalizado e 20 doces", { preco: 190 }],
            ["Kit para 40 pessoas", "P com topo personalizado e 30 doces", { preco: 250 }],
            ["Kit para 20 pessoas", "PP Duo com topo personalizado, 20 doces e 4 cupcakes", { preco: 210 }],
            ["Kit para 30 pessoas", "PP com topo personalizado, 20 doces e 4 cupcakes", { preco: 230 }],
            ["Kit para 40 pessoas", "P com topo personalizado, 20 doces e 4 cupcakes", { preco: 255 }],
            ["Kit para 10 pessoas", "Baby mini com topo personalizado, 20 doces e 50 coxinhas", { preco: 190 }],
            ["Kit para 20 pessoas", "PP duo com topo personalizado, 20 doces e 50 coxinhas", { preco: 225 }],
          ], { estilo: "cards", base: true })
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
          g("tamanho", "Tamanho", ["Pequena", "Média", "Grande"], {
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
const chave = TIPOS[params.get("tipo")] ? params.get("tipo") : "bolo";
const tipo = TIPOS[chave];
const total_passos = tipo.passos.length + 1;

let passo = 0;
let foto = null;
let fotoUrl = "";

const sel = {};
const qtds = {};
const todos = () => tipo.passos.flatMap((p) => p.grupos);

todos().forEach((gr) => {
  sel[gr.id] = [];
  qtds[gr.id] = 0;
});

const dados = {
  tema: params.get("produto") || "",
  nome: "", whats: "", data: "", obs: ""
};

const tela = document.getElementById("tela");

const ach = (id) => {
  const gr = todos().find((x) => x.id === id);
  return gr && gr.opcoes.find((o) => sel[id].includes(o.id));
};

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
  if (passo < tipo.passos.length) {
    return tipo.passos[passo].grupos.filter(visivel).every(grupoOk);
  }

  return (
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
  } else if (lista.length < gr.max) {
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
        ? "(" + sel[gr.id].length + " selecionados" +
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
      b.textContent = o.nome;
      if (preco) b.appendChild(el("span", "chip-preco", preco));
      b.disabled = gr.multi && !ativa && sel[gr.id].length >= gr.max;
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
    info.textContent = n > 0
      ? n + " × " + R(gr.unit) + " = " + R(n * gr.unit)
      : R(gr.unit) + " cada";

    menos.disabled = n <= 0;
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
  mais.addEventListener("click", () => mudar(qtds[gr.id] + 1));

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

function renderFinal() {
  tela.appendChild(el("h1", "", "Finalizando seu pedido"));
  tela.appendChild(
    el("p", "sub", "Adicione seus dados e uma foto de referência se tiver")
  );

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

  const resumo = el("section", "resumo");
  resumo.appendChild(el("h3", "", "Resumo do pedido"));

  linhasResumo().forEach((l) => {
    const linha = el("div", "linha-resumo");
    linha.appendChild(el("span", "", l.r));

    const dir = el("div", "dir");
    dir.appendChild(el("strong", "", l.txt));
    if (l.preco) dir.appendChild(el("em", "", l.preco));

    linha.appendChild(dir);
    resumo.appendChild(linha);
  });

  const t = total();
  const tot = el("div", "total");
  tot.appendChild(el("span", "", "Total estimado"));
  tot.appendChild(el("strong", "", textoTotal(t)));
  resumo.appendChild(tot);

  if (!t.c && t.v > 0) {
    const ent = el("div", "entrada");
    ent.appendChild(el("span", "", "Entrada de 50% no ato da encomenda"));
    ent.appendChild(el("span", "", R(t.v / 2)));
    resumo.appendChild(ent);
  }

  resumo.appendChild(
    el("p", "nota", "Valor estimado, sujeito a confirmação pela Micka. Aceitamos PIX e cartão de crédito (com acréscimo).")
  );

  tela.appendChild(resumo);
}

function renderTopo() {
  document.getElementById("contador").textContent =
    tipo.emoji + " " + (passo + 1) + "/" + total_passos;

  const ol = document.getElementById("passos");
  ol.replaceChildren();

  for (let i = 0; i < total_passos; i++) {
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

function atualizarBotoes() {
  const prox = document.getElementById("prox");
  document.getElementById("voltar").hidden = passo === 0;

  prox.textContent = passo === total_passos - 1
    ? "💬 Enviar pedido pelo WhatsApp"
    : "Próximo ›";

  prox.disabled = !valido();

  const t = total();

  document.getElementById("rodape").textContent =
    tipo.emoji + " Você está montando: " + tipo.nome +
    (t.v > 0 || t.c ? " · Total: " + textoTotal(t) : "");
}

function renderPasso(rolar = true) {
  renderTopo();
  tela.replaceChildren();

  if (passo < tipo.passos.length) {
    renderEscolhas(tipo.passos[passo]);
  } else {
    renderFinal();
  }

  atualizarBotoes();

  if (rolar) window.scrollTo({ top: 0, behavior: "smooth" });
}

function enviar() {
  let t = "Olá! Quero montar " +
    (tipo.pron === "sua" ? "uma" : "um") +
    " *" + tipo.nome + "* " + tipo.emoji + "\n\n";

  linhasResumo().slice(1).forEach((l) => {
    t += "*" + l.r + ":* " + l.txt +
      (l.preco ? " (" + l.preco + ")" : "") + "\n";
  });

  const tt = total();

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

document.title = "Monte " + tipo.pron + " " + tipo.nome +
  " | Bolaria da Micka";

document.getElementById("emoji-tipo").textContent = tipo.emoji;
document.getElementById("titulo-tipo").textContent =
  "Monte " + tipo.pron + " " + tipo.nome;

document.getElementById("prox").addEventListener("click", () => {
  if (!valido()) return;

  if (passo < total_passos - 1) {
    passo++;
    renderPasso();
  } else {
    enviar();
  }
});

document.getElementById("voltar").addEventListener("click", () => {
  passo--;
  renderPasso();
});

document.getElementById("topo-voltar").addEventListener("click", () => {
  if (passo > 0) {
    passo--;
    renderPasso();
  } else {
    window.location.href = "index.html#personalize";
  }
});

renderPasso(false);
