// js/assimilacao/items.js

export function parseItemTextEffect(name, desc) {
  const lower = `${name} ${desc}`.toLowerCase();
  if (!desc.trim()) return null;

  const apts = [
    'influência', 'percepção', 'potência', 'reação', 'resolução', 'sagacidade',
    'biologia', 'erudição', 'engenharia', 'geografia', 'medicina', 'segurança',
    'armas', 'atletismo', 'expressão', 'furtividade', 'manufatura', 'sobrevivência'
  ];
  const foundApt = apts.find(a => lower.includes(a));
  const when = foundApt ? `skill:${foundApt[0].toUpperCase() + foundApt.slice(1)}` : 'always';

  const bundle = {
    dice: [],           // Ex: [{ sides: 10, count: 4 }]
    replacePool: false, // true quando não tem '+' na frente (ex: "4d10")
    addA: 0,
    addB: 0,
    addC: 0,
    ignoreC: 0,
    extraDice: 0,
    bToA: 0
  };
  const labels = [];

  // 1. Captura dados específicos com tipo (ex: "4d10" substitui; "+2d6" soma)
  const typedDiceMatches = [...lower.matchAll(/(\+\s*)?(\d+)\s*d\s*(6|10|12)\b/g)];
  typedDiceMatches.forEach(m => {
    const isBonus = Boolean(m[1]);
    const count = Number(m[2]);
    const sides = Number(m[3]);
    if (count > 0) {
      if (!isBonus) bundle.replacePool = true;
      bundle.dice.push({ sides, count });
      labels.push(`${isBonus ? '+' : ''}${count}d${sides}`);
    }
  });

  // 2. Captura dados genéricos sem tipo (ex: "+1 dado", "+2 dados")
  const genericDie = lower.match(/\+\s*(\d+)\s*dados?\b/);
  if (genericDie) {
    bundle.extraDice += Number(genericDie[1]);
    labels.push(`+${genericDie[1]} dado`);
  }

  // 3. Captura Joaninhas / Sucessos (+4 sucessos, +1 joaninha, -1 joaninha)
  const bonusA = lower.match(/\+\s*(\d+)\s*(?:sucessos?|joaninha)/);
  if (bonusA) {
    bundle.addA += Number(bonusA[1]);
    labels.push(`+${bonusA[1]} Joaninha`);
  }
  const penaltyA = lower.match(/-\s*(\d+)\s*(?:sucessos?|joaninha)/);
  if (penaltyA) {
    bundle.addA -= Number(penaltyA[1]);
    labels.push(`-${penaltyA[1]} Joaninha`);
  }

  // 4. Captura Cervos / Adaptações (+1 cervo, +2 adaptações)
  const bonusB = lower.match(/\+\s*(\d+)\s*(?:adapta[çc][ãa]o|adapta[çc][õo]es|cervo)/);
  if (bonusB) {
    bundle.addB += Number(bonusB[1]);
    labels.push(`+${bonusB[1]} Cervo`);
  }

  // 5. Captura Corujas / Pressão (+1 coruja, anula 1 coruja)
  const bonusC = lower.match(/\+\s*(\d+)\s*(?:press[ãa]o|coruja)/);
  if (bonusC) {
    bundle.addC += Number(bonusC[1]);
    labels.push(`+${bonusC[1]} Coruja`);
  }
  const ignoreC = lower.match(/(?:anula|ignora|remove)\s*(\d+)\s*(?:press[ãa]o|coruja)/);
  if (ignoreC) {
    bundle.ignoreC += Number(ignoreC[1]);
    labels.push(`Anula ${ignoreC[1]} Coruja`);
  }

  // 6. Conversão de Cervo para Joaninha
  if (/cervos?\s*por\s*joaninha/.test(lower)) {
    bundle.bToA = 99;
    labels.push('Cervos → Joaninha');
  }

  if (!labels.length) return null;

  return {
    when,
    type: 'itemBundle',
    bundle,
    optional: true,
    label: labels.join(' • ')
  };
}

export function getEquippedItemModifiers(char, matchesCondition) {
  return (char.items || [])
    .map((item, idx) => {
      if (!item.name || !item.equipped) return null;
      const effect = parseItemTextEffect(item.name, item.desc || '');
      if (!effect || !matchesCondition(effect.when, item.desc)) return null;

      return {
        slotIdx: `item-${idx}`,
        source: 'item',
        name: item.name,
        optional: true,
        effect
      };
    })
    .filter(Boolean);
}

export function renderInventoryItemsBlock(sheetModule, host) {
  const char = sheetModule.state;
  if (!Array.isArray(char.items)) char.items = [];

  const container = host.querySelector('#equippedItemsHost');
  if (!container) return;

  container.innerHTML = `
    <div style="background:#f5efe2; border:1px solid var(--paper-line); border-radius:6px; padding:8px; margin-bottom:8px;">
      <div style="display:flex; gap:6px; margin-bottom:6px;">
        <input type="text" id="inpNewItemName" placeholder="Nome do item (ex: Bomba de sucatas)" style="flex:1; padding:4px 8px;" />
        <button type="button" id="btnAddQuickItem" class="btn btn-primary btn-sm">+ Criar</button>
      </div>
      <input type="text" id="inpNewItemDesc" placeholder="Ex: 4d10 + 4 sucessos (só item) ou +2d6 em Armas (soma)" style="width:100%; padding:4px 8px; font-size:0.82rem;" />
    </div>

    <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:8px;">
      ${char.items.map((item, idx) => {
        const preview = parseItemTextEffect(item.name, item.desc || '');
        return `
          <div style="background:#fff; border:1px solid ${item.equipped ? 'var(--col-ass)' : 'var(--paper-line)'}; border-radius:6px; padding:6px 8px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <input type="checkbox" class="chk-equip-item" data-idx="${idx}" ${item.equipped ? 'checked' : ''} title="Equipar no rolador" />
              <input type="text" class="edit-item-name" data-idx="${idx}" value="${item.name}" style="flex:1; font-weight:700; border:none; border-bottom:1px solid var(--paper-line);" />
              ${preview ? `<span style="font-size:0.72rem; background:#f3ead8; padding:1px 6px; border-radius:99px; font-weight:600;">${preview.label}</span>` : ''}
              <button type="button" class="btn btn-danger btn-sm del-item-btn" data-idx="${idx}">×</button>
            </div>
            <input type="text" class="edit-item-desc" data-idx="${idx}" value="${item.desc || ''}" placeholder="Descrição ou modificador..." style="width:100%; margin-top:4px; font-size:0.8rem; border:none; color:#444;" />
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.querySelector('#btnAddQuickItem')?.addEventListener('click', () => {
    const nameEl = container.querySelector('#inpNewItemName');
    const descEl = container.querySelector('#inpNewItemDesc');
    if (!nameEl.value.trim()) return nameEl.focus();

    char.items.push({ name: nameEl.value.trim(), desc: descEl.value.trim(), equipped: true });
    sheetModule.saveState();
    sheetModule.refreshApplicableTraits();
    renderInventoryItemsBlock(sheetModule, host);
  });

  container.querySelectorAll('.chk-equip-item').forEach(chk => {
    chk.addEventListener('change', () => {
      char.items[Number(chk.dataset.idx)].equipped = chk.checked;
      sheetModule.saveState();
      sheetModule.refreshApplicableTraits();
      renderInventoryItemsBlock(sheetModule, host);
    });
  });

  container.querySelectorAll('.edit-item-name').forEach(inp => {
    inp.addEventListener('input', () => {
      char.items[Number(inp.dataset.idx)].name = inp.value;
      sheetModule.saveState();
      sheetModule.refreshApplicableTraits();
    });
  });

  container.querySelectorAll('.edit-item-desc').forEach(inp => {
    inp.addEventListener('input', () => {
      char.items[Number(inp.dataset.idx)].desc = inp.value;
      sheetModule.saveState();
      sheetModule.refreshApplicableTraits();
      renderInventoryItemsBlock(sheetModule, host);
    });
  });

  container.querySelectorAll('.del-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      char.items.splice(Number(btn.dataset.idx), 1);
      sheetModule.saveState();
      sheetModule.refreshApplicableTraits();
      renderInventoryItemsBlock(sheetModule, host);
    });
  });
}