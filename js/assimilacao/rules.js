// Tabelas fixas e mapeamento das faces dos dados customizados do sistema:
// A = Joaninha (Sucesso) | B = Cervo (Adaptação) | C = Coruja (Pressão)
export const SYSTEM_DATA = {
  instincts: ['Influência', 'Percepção', 'Potência', 'Reação', 'Resolução', 'Sagacidade'],
  knowledges: ['Biologia', 'Erudição', 'Engenharia', 'Geografia', 'Medicina', 'Segurança'],
  practices: ['Armas', 'Atletismo', 'Expressão', 'Furtividade', 'Manufaturas', 'Sobrevivência'],
  healthLevels: ['Saudável', 'Escoriação', 'Laceração', 'Ferimentos', 'Debilitação', 'Incapacitação'],
  dieFaces: {
    6:  ['', '', 'C', 'C', 'BC', 'A'],
    10: ['', '', 'C', 'C', 'BC', 'A', 'AA', 'AB', 'ABC', 'AAC'],
    12: ['', '', 'C', 'C', 'BC', 'A', 'AA', 'AB', 'ABC', 'AAC', 'ABBC', 'CC']
  }
};

export const SYMBOL_ICONS = {
  A: `<svg class="die-svg" viewBox="0 0 64 64" aria-label="Joaninha"><path d="M25 14l-5-7m19 7l5-7" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M17 24L7 19m10 14H4m14 10L8 51m39-27l10-5m-10 14h13m-14 10l10 8" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M23 19c0-5 18-5 18 0v3H23v-3z"/><path d="M16 36c0-11 7-15 16-15s16 4 16 15c0 12-7 19-16 19s-16-7-16-19zm14.5-10v24h3V26h-3zm-7.5 2a3 2.2 0 1 0 0 4.4 3 2.2 0 1 0 0-4.4zm18 0a3 2.2 0 1 0 0 4.4 3 2.2 0 1 0 0-4.4zm-17 12a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zm16 0a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7z" fill-rule="evenodd"/></svg>`,
  B: `<svg class="die-svg" viewBox="0 0 64 64" aria-label="Cervo"><path d="M24 27c-8-4-14-12-13-21 3 5 7 8 11 9-1-4 0-8 2-11 1 5 3 9 5 12m11 11c8-4 14-12 13-21-3 5-7 8-11 9 1-4 0-8-2-11-1 5-3 9-5 12" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 28l-9-3 3 7 6 1zm20 0l9-3-3 7-6 1z"/><path d="M22 27h20l3 14-8 16H27l-8-16 3-14zm4 11l3 2-3 2-2-2zm12 0l-3 2 3 2 2-2zm-8 14h4l-2 3-2-3z" fill-rule="evenodd"/></svg>`,
  C: `<svg class="die-svg" viewBox="0 0 64 64" aria-label="Coruja"><path d="M12 11l11 7h18l11-7-2 15 6 5-6 5 4 9-9-1-5 9-7-5-7 5-5-9-9 1 4-9-6-5 6-5-2-15zm11 18c-4 0-7 3-7 6s3 5 7 5 6-2 6-5-2-6-6-6zm18 0c-4 0-6 3-6 6s2 5 6 5 7-2 7-5-3-6-7-6zm-9 11l-3 5h6l-3-5z" fill-rule="evenodd"/></svg>`,
  TREE: `<svg class="die-svg sm" viewBox="0 0 64 64" aria-label="Árvore"><path d="M32 6C18 6 10 16 12 26c-5 3-6 11 1 15h14v17h10V41h14c7-4 6-12 1-15 2-10-6-20-20-20z"/></svg>`
};

const SYMBOL_LABELS = {
  A: 'Sucesso (Joaninha)',
  B: 'Adaptação (Cervo)',
  C: 'Pressão (Coruja)'
};

export function countSymbol(text, symbol) {
  return text.split(symbol).length - 1;
}

export function getSymbolIcon(symbol, isSmall = false) {
  const rawSvg = SYMBOL_ICONS[symbol] || '';
  const svg = isSmall ? rawSvg.replace('class="die-svg"', 'class="die-svg sm"') : rawSvg;
  return `<span class="sym-${symbol}" title="${SYMBOL_LABELS[symbol] || ''}">${svg}</span>`;
}

export function formatSymbolsHTML(symbolsText, isSmall = false) {
  if (!symbolsText) return '<span class="sym-empty">vazio</span>';
  const icons = symbolsText.split('').map(char => getSymbolIcon(char, isSmall)).join('');
  return `<span class="sym-group">${icons}</span>`;
}

// Formato de cada dado (viewBox 100x100): corpo + linhas de faceta para dar volume.
const DIE_SHAPES = {
  6:  `<rect class="die-body" x="6" y="6" width="88" height="88" rx="16"/><rect class="die-facet" x="16" y="16" width="68" height="68" rx="10"/>`,
  10: `<polygon class="die-body" points="50,3 96,42 50,97 4,42"/><polyline class="die-facet" points="4,42 50,62 96,42"/><line class="die-facet" x1="50" y1="62" x2="50" y2="97"/>`,
  12: `<polygon class="die-body" points="50,4 96,37 78,94 22,94 4,37"/><polygon class="die-facet" points="50,20 80,42 69,80 31,80 20,42"/>`
};

// Símbolos dentro da face do dado; com 3+ símbolos usa ícones menores.
export function dieSymbolsHTML(symbolsText) {
  const many = symbolsText.length > 2;
  const inner = symbolsText
    ? symbolsText.split('').map(char => getSymbolIcon(char, many)).join('')
    : '<span class="die-blank">—</span>';
  return `<span class="die-symbols ${many ? 'many' : ''}">${inner}</span>`;
}

// Dado desenhado no formato do tipo (d6 quadrado, d10 losango, d12 pentágono).
export function renderDieFace(sides, symbolsText) {
  const shape = DIE_SHAPES[sides] || DIE_SHAPES[6];
  return `<span class="die-wrap"><svg class="die-shape" viewBox="0 0 100 100" aria-hidden="true">${shape}</svg>${dieSymbolsHTML(symbolsText)}</span><span class="die-type">d${sides}</span>`;
}

// Localiza todas as mutações equipadas na ficha cruzando com o catálogo JSON e inferindo efeitos ativáveis
export function getEquippedMutations(character, assimilationCatalog = {}) {
  const allMutations = Object.values(assimilationCatalog)
    .flat()
    .flatMap(card => card.mutations || []);

  const assimilationLevel = 10 - character.determinationLevel;
  const equipped = [];

  (character.assimilations || []).forEach((block, slotIdx) => {
    String(block || '')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .forEach((line, lineIdx) => {
        const rawName = line.split('(')[0].split(':')[0].trim();
        const catalogEntry = allMutations.find(
          mut => mut.name.toLowerCase() === rawName.toLowerCase()
        );

        const costText = catalogEntry?.cost || line;
        const descText = catalogEntry?.desc || (line.includes(':') ? line.slice(line.indexOf(':') + 1).trim() : line);
        const reqMatch = String(costText).match(/assim\.?\s*(\d+)\+/i);
        const minAssimilation = reqMatch ? Number(reqMatch[1]) : 0;
        const isLocked = minAssimilation > 0 && assimilationLevel < minAssimilation;

        let effects = catalogEntry?.effects ? [...catalogEntry.effects] : [];
        const lower = descText.toLowerCase();

        // Fallback de troca de dado caso o JSON ainda não tenha o array `effects`
        if (!effects.length) {
          const swapMatch = lower.match(/substitui[^.]*?d(6|10)\s*por\s*d(10|12)/);
          if (swapMatch) {
            const targetInst = SYSTEM_DATA.instincts.find(i => lower.includes(i.toLowerCase()));
            const targetSkill = [...SYSTEM_DATA.knowledges, ...SYSTEM_DATA.practices].find(s => lower.includes(s.toLowerCase()));
            effects.push({
              when: targetInst ? `ins:${targetInst}` : targetSkill ? `skill:${targetSkill}` : 'always',
              type: 'replaceDie',
              from: Number(swapMatch[1]),
              to: Number(swapMatch[2]),
              all: true,
              label: `Todos d${swapMatch[1]} → d${swapMatch[2]}`
            });
          }
        }

        // Garante botão de ativação (activeAction) para TODAS as mutações ativáveis/gastáveis
        const hasRollOrPassiveOnly = effects.some(e =>
          ['addA', 'addB', 'addC', 'ignoreC', 'bToA', 'replaceDie', 'extraKeep', 'perKeptDieA', 'perKeptDieB', 'discernimentoB', 'doubleA', 'useAssimAsInstinct', 'ignoreHealthPenalty'].includes(e.type)
        );
        const alreadyHasActiveBtn = effects.some(e => e.type === 'activeAction');

        if (!alreadyHasActiveBtn && !hasRollOrPassiveOnly) {
          const apMatch = lower.match(/(?:gasta|por)\s*(\d+)\s*(?:pontos?\s*de\s*)?assimila[çc][ãa]o/);
          const dpMatch = lower.match(/(?:gasta|por)\s*(\d+)\s*(?:pontos?\s*de\s*)?determina[çc][ãa]o/);
          const spendsAllAp = /gasta\s*tod[ao]s?\s*(?:os\s*pontos\s*de\s*)?assimila[çc][ãa]o/.test(lower);
          const healMatch = lower.match(/regenera\s*\+?(\d+)\s*(?:pontos?\s*de\s*)?sa[úu]de/);

          const costAp = spendsAllAp ? Math.max(1, character.assimilationPoints) : (apMatch ? Number(apMatch[1]) : 0);
          const costDp = dpMatch ? Number(dpMatch[1]) : 0;
          const heal = healMatch ? Number(healMatch[1]) : 0;

          if (costAp > 0 || costDp > 0 || heal > 0 || /regenera completamente|redistribui pontos|age por instinto sem gastar|perde 1 assimila[çc][ãa]o no lugar/.test(lower)) {
            const costLabel = costAp > 0 ? ` (-${costAp} Assim.)` : costDp > 0 ? ` (-${costDp} Det.)` : '';
            const shortDesc = descText.length > 34 ? `${descText.slice(0, 34).trim()}...` : descText;
            effects.push({
              type: 'activeAction',
              costAp,
              costDp,
              heal,
              healFull: lower.includes('regenera completamente'),
              label: `${shortDesc}${costLabel}`
            });
          }
        }

        equipped.push({
          id: `mut-${slotIdx}-${lineIdx}`,
          name: catalogEntry?.name || rawName,
          cost: costText,
          desc: descText,
          minAssimilation,
          locked: isLocked,
          effects: isLocked ? [] : effects
        });
      });
  });

  return equipped;
}

// Calcula limites máximos (5 ou 6), bônus/penalidades fixos e aptidões zeradas por mutações
export function getAptitudeModifiers(character, assimilationCatalog = {}) {
  const modifiers = {
    instincts: { caps: [5, 5, 5, 5, 5, 5], bonuses: [0, 0, 0, 0, 0, 0], zeroed: Array(6).fill(false) },
    knowledges: { caps: [5, 5, 5, 5, 5, 5], bonuses: [0, 0, 0, 0, 0, 0], zeroed: Array(6).fill(false) },
    practices: { caps: [5, 5, 5, 5, 5, 5], bonuses: [0, 0, 0, 0, 0, 0], zeroed: Array(6).fill(false) }
  };

  const groupLabels = {
    instincts: SYSTEM_DATA.instincts,
    knowledges: SYSTEM_DATA.knowledges,
    practices: SYSTEM_DATA.practices
  };

  getEquippedMutations(character, assimilationCatalog).forEach(mut => {
    mut.effects.forEach(effect => {
      if (effect.optional) return;
      const labels = groupLabels[effect.group];
      if (!labels) return;
      const idx = labels.findIndex(name => name.toLowerCase() === effect.target?.toLowerCase());
      if (idx === -1) return;

      if (effect.type === 'aptitudeMod') {
        modifiers[effect.group].bonuses[idx] += effect.value;
        if (effect.canExceedMax) modifiers[effect.group].caps[idx] = 6;
      } else if (effect.type === 'aptitudeZero') {
        modifiers[effect.group].zeroed[idx] = true;
      }
    });
  });

  return modifiers;
}

// Retorna os valores efetivos (base + mutações) de Instintos, Conhecimentos e Práticas
export function getEffectiveAptitudes(character, assimilationCatalog = {}) {
  const mods = getAptitudeModifiers(character, assimilationCatalog);
  const applyGroup = (groupName, minVal) =>
    character[groupName].map((baseVal, idx) => {
      if (mods[groupName].zeroed[idx]) return 0;
      const total = Math.max(minVal, baseVal + mods[groupName].bonuses[idx]);
      return Math.min(mods[groupName].caps[idx], total);
    });

  return {
    instincts: applyGroup('instincts', 1),
    knowledges: applyGroup('knowledges', 0),
    practices: applyGroup('practices', 0),
    modifiers: mods
  };
}

// Extrai modificadores de Saúde vindos de mutações (ex: Vigoroso +1 PV/nível, Resistente, Falência)
export function getHealthModifiers(character, assimilationCatalog = {}) {
  const healthMods = {
    extraHpPerLevel: 0,
    ignoreTier4: false,
    doublePenalty: false
  };

  getEquippedMutations(character, assimilationCatalog).forEach(mut => {
    mut.effects.forEach(effect => {
      if (effect.type !== 'healthMod') return;
      if (effect.hpPerLevel) healthMods.extraHpPerLevel += effect.hpPerLevel;
      if (effect.ignoreTier4) healthMods.ignoreTier4 = true;
      if (effect.doublePenalty) healthMods.doublePenalty = true;
    });
  });

  return healthMods;
}

// Calcula os status derivados da ficha (Cabo de Guerra e pontos de Saúde)
export function calculateDerivedStats(character, assimilationCatalog = {}) {
  const assimilationLevel = 10 - character.determinationLevel;
  const { instincts: effectiveInstincts } = getEffectiveAptitudes(character, assimilationCatalog);
  const healthMods = getHealthModifiers(character, assimilationCatalog);

  const hpPerLevel = 1 + effectiveInstincts[2] + effectiveInstincts[4] + healthMods.extraHpPerLevel;
  const maxHp = hpPerLevel * 6;
  const currentHp = Math.max(0, maxHp - character.damageTaken);
  const currentLevelIndex = Math.min(5, Math.floor(character.damageTaken / hpPerLevel));

  return {
    assimilationLevel,
    hpPerLevel,
    maxHp,
    currentHp,
    currentLevelIndex,
    healthMods
  };
}

// Retorna as penalidades mecânicas do nível de saúde atual para o rolador
export function getHealthPenalty(character, assimilationCatalog = {}, ignorePenalties = false) {
  const stats = calculateDerivedStats(character, assimilationCatalog);
  if (ignorePenalties) {
    return { ...stats, dicePenalty: 0, extraAssimilationCost: 0, warning: '' };
  }

  const multiplier = stats.healthMods.doublePenalty ? 2 : 1;

  if (stats.currentHp <= 0 || stats.currentLevelIndex >= 5) {
    const pen = 2 * multiplier;
    return {
      ...stats,
      dicePenalty: pen,
      extraAssimilationCost: 2,
      warning: `Incapacitação (Nível 1): -${pen} dados e exige 2 Assimilação para agir.`
    };
  }
  if (stats.currentLevelIndex === 4) {
    const pen = 2 * multiplier;
    return {
      ...stats,
      dicePenalty: pen,
      extraAssimilationCost: 0,
      warning: `Debilitação (Nível 2): -${pen} dados em todos os testes.`
    };
  }
  if (stats.currentLevelIndex === 3) {
    const pen = 1 * multiplier;
    return {
      ...stats,
      dicePenalty: pen,
      extraAssimilationCost: 0,
      warning: `Ferimentos (Nível 3): -${pen} dado(s) em todos os testes.`
    };
  }

  return {
    ...stats,
    dicePenalty: 0,
    extraAssimilationCost: 0,
    warning: ''
  };
}

// Soma os símbolos apenas dos dados mantidos pelo jogador e aplica efeitos de Características/Mutações
export function calculateRollTotals(pendingRoll) {
  const keptDice = [...pendingRoll.selected].map(index => pendingRoll.dice[index]);
  const keptFaces = keptDice.map(die => die.symbols).join('');

  let successes = countSymbol(keptFaces, 'A');
  let adaptations = countSymbol(keptFaces, 'B');
  let pressures = countSymbol(keptFaces, 'C');
  const modifiers = pendingRoll.modifiers || {};

  // Efeitos por dado mantido (Ofuscação, Auxílio das Sombras, Discernimento)
  if (modifiers.perKeptDieA) successes += keptDice.length * modifiers.perKeptDieA;
  if (modifiers.perKeptDieB) adaptations += keptDice.length * modifiers.perKeptDieB;
  if (modifiers.discernimentoB && keptDice.some(die => countSymbol(die.symbols, 'B') > 0)) {
    adaptations += modifiers.discernimentoB;
  }

  // Conversões de símbolos ocorrem antes dos bônus fixos
  const convertedAdaptations = Math.min(adaptations, modifiers.bToA || 0);
  adaptations -= convertedAdaptations;
  successes += convertedAdaptations;

  const convertedPressures = Math.min(pressures, modifiers.cToB || 0);
  pressures -= convertedPressures;
  adaptations += convertedPressures;

  successes += modifiers.A || 0;
  adaptations += modifiers.B || 0;
  pressures += modifiers.C || 0;

  if (modifiers.doubleA) successes *= 2;
  if (modifiers.halveA) successes = Math.floor(successes / 2);

  // Descoordenação (9♠): se obtiver 2+ Joaninhas, 1 vira Coruja
  if (modifiers.aToCIfTwo && successes >= 2) {
    successes -= 1;
    pressures += 1;
  }

  return {
    A: Math.max(0, successes),
    B: Math.max(0, adaptations),
    C: Math.max(0, pressures - (modifiers.ignoreC || 0))
  };
}