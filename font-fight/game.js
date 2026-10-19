(function () {
  "use strict";
  // Global error handlers - show on-screen message for critical failures
  function showError(msg) {
    console.warn("[FontFight]", msg);
    var d = document.getElementById("ff-error");
    if (!d) {
      d = document.createElement("div");
      d.id = "ff-error";
      d.style.cssText =
        "position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#7f1d1d;color:#fff;padding:10px 18px;border-radius:8px;font:14px system-ui;z-index:99999;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.5)";
      d.onclick = function () {
        location.reload();
      };
      document.body.appendChild(d);
    }
    d.textContent = "Something went wrong \u2014 tap to reload";
    d.style.display = "block";
    setTimeout(function () {
      d.style.display = "none";
    }, 8000);
  }
  window.addEventListener("error", function (e) {
    showError(e.message || "Script error");
  });
  window.addEventListener("unhandledrejection", function (e) {
    showError((e.reason && e.reason.message) || "Promise rejected");
  });
  const $ = (id) => document.getElementById(id),
    TAU = Math.PI * 2,
    clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
    rnd = (a, b) => a + Math.random() * (b - a),
    pick = (a) => a[Math.floor(Math.random() * a.length)];
  const ELEMENTS = {
    Fire: { color: "#ff4b24", pale: "#ffd072", strong: "Nature", weak: "Ice" },
    Ice: { color: "#5edcff", pale: "#e8fdff", strong: "Fire", weak: "Storm" },
    Storm: { color: "#ffe34c", pale: "#fffbd0", strong: "Ice", weak: "Shadow" },
    Shadow: {
      color: "#b45cff",
      pale: "#f0d7ff",
      strong: "Storm",
      weak: "Cosmic",
    },
    Light: {
      color: "#208cff",
      pale: "#dff7ff",
      strong: "Cosmic",
      weak: "Nature",
    },
    Nature: {
      color: "#55e87d",
      pale: "#d6ff83",
      strong: "Light",
      weak: "Fire",
    },
    Cosmic: {
      color: "#a06bff",
      pale: "#e8d8ff",
      strong: "Shadow",
      weak: "Light",
    },
  };
  const MAPS = [
    {
      name: "Neon Nexus",
      mult: 1.0,
      desc: "The classic arena",
      bg1: "#0a0a1e",
      bg2: "#1a1a3a",
      accent: "#00ffff",
    },
    {
      name: "Void Expanse",
      mult: 1.4,
      desc: "Open cosmic battlefield",
      bg1: "#050514",
      bg2: "#140a2a",
      accent: "#a064ff",
    },
    {
      name: "Crystal Caverns",
      mult: 1.3,
      desc: "Underground crystal maze",
      bg1: "#05141a",
      bg2: "#0a2a3a",
      accent: "#00dcff",
    },
    {
      name: "Ember Wastes",
      mult: 1.5,
      desc: "Volcanic wasteland",
      bg1: "#1e0a05",
      bg2: "#4a1a0a",
      accent: "#ff6400",
    },
    {
      name: "Storm Peaks",
      mult: 1.2,
      desc: "Mountain storm summit",
      bg1: "#0f0f19",
      bg2: "#23233f",
      accent: "#96b4ff",
    },
  ];
  let currentMap = 0;
  const R = [
    { id: 0, name: "RAMPAGE", font: "Anton", element: "Fire", hp: 174, atk: 82, spd: 63, ult: "Inferno Breaker" },
    { id: 1, name: "VOLTAGE", font: "Monoton", element: "Storm", hp: 130, atk: 75, spd: 94, ult: "Thunder Crown" },
    { id: 2, name: "NOCTURNE", font: "UnifrakturCook", element: "Shadow", hp: 150, atk: 86, spd: 67, ult: "Eclipse Maw" },
    { id: 3, name: "TURBO", font: "Faster One", element: "Storm", hp: 115, atk: 70, spd: 100, ult: "Mach Lightning" },
    { id: 4, name: "TITAN", font: "Black Ops One", element: "Nature", hp: 205, atk: 93, spd: 48, ult: "Worldbreaker" },
    { id: 5, name: "GLITCH", font: "Rubik Glitch", element: "Light", hp: 134, atk: 76, spd: 92, ult: "Reality Error" },
    { id: 6, name: "DREAD", font: "Nosifer", element: "Fire", hp: 147, atk: 91, spd: 64, ult: "Bloodflare" },
    { id: 7, name: "PIXEL", font: "Press Start 2P", element: "Light", hp: 126, atk: 74, spd: 82, ult: "Critical Overflow" },
    { id: 8, name: "ROYAL", font: "Cinzel", element: "Light", hp: 168, atk: 84, spd: 60, ult: "Solar Decree" },
    { id: 9, name: "CHAOS", font: "Creepster", element: "Fire", hp: 141, atk: 88, spd: 79, ult: "Wildfire Grin" },
    { id: 10, name: "BRAWL", font: "Bungee", element: "Nature", hp: 186, atk: 90, spd: 53, ult: "Seismic Type" },
    { id: 11, name: "ORBIT", font: "Orbitron", element: "Ice", hp: 144, atk: 78, spd: 87, ult: "Absolute Zero" },
    { id: 12, name: "VENOM", font: "Metal Mania", element: "Nature", hp: 150, atk: 87, spd: 72, ult: "Toxic Bloom" },
    { id: 13, name: "PHANTOM", font: "Pirata One", element: "Shadow", hp: 138, atk: 82, spd: 90, ult: "Ghost Fleet" },
    { id: 14, name: "HAVOC", font: "Bangers", element: "Fire", hp: 158, atk: 92, spd: 74, ult: "Meteor Riot" },
    { id: 15, name: "FROST", font: "Iceberg", element: "Ice", hp: 166, atk: 79, spd: 69, ult: "Cryo Prison" },
    { id: 16, name: "WRAITH", font: "Frijole", element: "Shadow", hp: 142, atk: 89, spd: 81, ult: "Soul Spiral" },
    { id: 17, name: "NOVA", font: "Russo One", element: "Light", hp: 131, atk: 85, spd: 93, ult: "Supernova Type" },
    { id: 18, name: "BOLT", font: "Jersey 10", element: "Storm", hp: 122, atk: 73, spd: 99, ult: "Zero Frame" },
    { id: 19, name: "REBEL", font: "Permanent Marker", element: "Fire", hp: 157, atk: 86, spd: 78, ult: "Anarchy Arc" },
    { id: 20, name: "REAPER", font: "Special Elite", element: "Shadow", hp: 149, atk: 94, spd: 66, ult: "Final Draft" },
    { id: 21, name: "ARCADE", font: "Silkscreen", element: "Light", hp: 139, atk: 77, spd: 89, ult: "Extra Life" },
    { id: 22, name: "DRIFT", font: "Racing Sans One", element: "Ice", hp: 131, atk: 80, spd: 96, ult: "Whiteout Rush" },
    { id: 23, name: "KRAKEN", font: "Graduate", element: "Nature", hp: 192, atk: 88, spd: 51, ult: "Abyssal Roots" },
    { id: 24, name: "HEX", font: "VT323", element: "Shadow", hp: 120, atk: 81, spd: 98, ult: "Cursed Code" },
    { id: 25, name: "BLAZE", font: "Luckiest Guy", element: "Fire", hp: 154, atk: 90, spd: 76, ult: "Sunspike" },
    { id: 26, name: "TEMPEST", font: "Fjalla One", element: "Storm", hp: 146, atk: 83, spd: 86, ult: "Sky Rupture" },
    { id: 27, name: "RONIN", font: "Kaushan Script", element: "Ice", hp: 160, atk: 91, spd: 71, ult: "Mooncut Blizzard" },
    { id: 28, name: "COLOSSUS", font: "Archivo Black", element: "Nature", hp: 210, atk: 95, spd: 43, ult: "Continental Shift" },
    { id: 29, name: "VOID", font: "Rubik Glitch", element: "Cosmic", hp: 133, atk: 84, spd: 95, ult: "Event Horizon" },
    { id: 30, name: "JUGGERNAUT", font: "Alfa Slab One", element: "Cosmic", hp: 205, atk: 88, spd: 45, ult: "Event Horizon Crush" },
    { id: 31, name: "BRAWLER", font: "Titan One", element: "Cosmic", hp: 168, atk: 90, spd: 62, ult: "Gravity Slam" },
    { id: 32, name: "SPECTRE", font: "Righteous", element: "Cosmic", hp: 131, atk: 78, spd: 95, ult: "Phantom Nebula" },
    { id: 33, name: "NEBULA", font: "Audiowide", element: "Cosmic", hp: 152, atk: 82, spd: 78, ult: "Stellar Nursery" },
    { id: 34, name: "CIRCUIT", font: "Wallpoet", element: "Cosmic", hp: 125, atk: 75, spd: 98, ult: "Quantum Overload" },
    { id: 35, name: "DEVOUR", font: "Eater", element: "Cosmic", hp: 176, atk: 94, spd: 55, ult: "Consume the Stars" },
    { id: 36, name: "CARNAGE", font: "Butcherman", element: "Cosmic", hp: 157, atk: 93, spd: 68, ult: "Blood Moon Rising" },
    { id: 37, name: "COSMOS", font: "Geostar Fill", element: "Cosmic", hp: 147, atk: 80, spd: 85, ult: "Big Bang Requiem" },
    { id: 38, name: "INFERNO", font: "Rubik Burned", element: "Cosmic", hp: 163, atk: 92, spd: 60, ult: "Supernova Burn" },
    { id: 39, name: "VELVET", font: "Fascinate Inline", element: "Cosmic", hp: 136, atk: 77, spd: 90, ult: "Silk Nebula" },
    { id: 40, name: "SAVAGE", font: "Lacquer", element: "Cosmic", hp: 173, atk: 89, spd: 72, ult: "Untamed Void" },
    { id: 41, name: "IRONCLAD", font: "Staatliches", element: "Cosmic", hp: 200, atk: 85, spd: 48, ult: "Dreadnought Protocol" },
    { id: 42, name: "TITANFALL", font: "Bowlby One", element: "Cosmic", hp: 189, atk: 87, spd: 58, ult: "Orbital Drop" },
    { id: 43, name: "HEXTECH", font: "Chakra Petch", element: "Cosmic", hp: 141, atk: 83, spd: 88, ult: "Circuit Nova" },
    { id: 44, name: "STARDUST", font: "Zen Dots", element: "Cosmic", hp: 152, atk: 79, spd: 82, ult: "Dust to Stars" },
  ];
  /* Every contender owns a distinct combat signature: geometry, motion, projectile silhouette and cinematic grammar. */
  const FX = [
    { sig: 0, c: "#ff2915", c2: "#ffc43d", shape: "tri", motion: "fountain", shot: "flame", ult: "meteor" },
    { sig: 1, c: "#ffe834", c2: "#59f3ff", shape: "zig", motion: "chain", shot: "bolt", ult: "crown" },
    { sig: 2, c: "#7b2cff", c2: "#e3b3ff", shape: "crescent", motion: "orbit", shot: "eclipse", ult: "maw" },
    { sig: 3, c: "#fff04a", c2: "#25bdff", shape: "line", motion: "speed", shot: "drill", ult: "mach" },
    { sig: 4, c: "#54df70", c2: "#b7ff6d", shape: "rock", motion: "quake", shot: "boulder", ult: "world" },
    { sig: 5, c: "#26a9ff", c2: "#ff56da", shape: "pixel", motion: "glitch", shot: "cube", ult: "error" },
    { sig: 6, c: "#ff183d", c2: "#ff866e", shape: "drop", motion: "saw", shot: "blood", ult: "bloodflare" },
    { sig: 7, c: "#48d7ff", c2: "#ffffff", shape: "square", motion: "grid", shot: "pixel", ult: "overflow" },
    { sig: 8, c: "#1989ff", c2: "#ffd769", shape: "diamond", motion: "ray", shot: "lance", ult: "decree" },
    { sig: 9, c: "#ff6a16", c2: "#dc2aff", shape: "spiral", motion: "chaos", shot: "grin", ult: "wildfire" },
    { sig: 10, c: "#72ed66", c2: "#dfff56", shape: "hex", motion: "impact", shot: "fist", ult: "seismic" },
    { sig: 11, c: "#7aeaff", c2: "#c9f8ff", shape: "comet", motion: "orbit", shot: "iceball", ult: "zero" },
    { sig: 12, c: "#3cff6e", c2: "#d0ff35", shape: "thorn", motion: "vine", shot: "spore", ult: "bloom" },
    { sig: 13, c: "#895cff", c2: "#d9f5ff", shape: "wisp", motion: "float", shot: "ghost", ult: "fleet" },
    { sig: 14, c: "#ff3b1f", c2: "#ffe563", shape: "star", motion: "scatter", shot: "meteor", ult: "riot" },
    { sig: 15, c: "#6eeeff", c2: "#ffffff", shape: "shard", motion: "crystal", shot: "icicle", ult: "prison" },
    { sig: 16, c: "#c066ff", c2: "#e7c0ff", shape: "ribbon", motion: "spiral", shot: "soul", ult: "soulstorm" },
    { sig: 17, c: "#1e9cff", c2: "#fff27b", shape: "star", motion: "nova", shot: "prism", ult: "supernova" },
    { sig: 18, c: "#ffe820", c2: "#55dfff", shape: "frame", motion: "stutter", shot: "boltbox", ult: "zeroframe" },
    { sig: 19, c: "#ff3c21", c2: "#fff0c6", shape: "slash", motion: "brush", shot: "arc", ult: "anarchy" },
    { sig: 20, c: "#8e54ff", c2: "#e7d7ff", shape: "glyph", motion: "ash", shot: "skull", ult: "finaldraft" },
    { sig: 21, c: "#16bcff", c2: "#ff48db", shape: "pixel", motion: "arcade", shot: "disk", ult: "extralife" },
    { sig: 22, c: "#b6f5ff", c2: "#66bfff", shape: "mist", motion: "drift", shot: "wind", ult: "whiteout" },
    { sig: 23, c: "#35db78", c2: "#52caff", shape: "tentacle", motion: "coil", shot: "bubble", ult: "abyss" },
    { sig: 24, c: "#a05cff", c2: "#7affcf", shape: "code", motion: "rain", shot: "codebolt", ult: "curse" },
    { sig: 25, c: "#ff4d1f", c2: "#fff35c", shape: "petal", motion: "sun", shot: "sunshot", ult: "sunspike" },
    { sig: 26, c: "#ffe05a", c2: "#75e7ff", shape: "crescent", motion: "cyclone", shot: "gale", ult: "rupture" },
    { sig: 27, c: "#8de7ff", c2: "#dde7ff", shape: "slash", motion: "moon", shot: "blade", ult: "blizzard" },
    { sig: 28, c: "#4de06e", c2: "#dfef9b", shape: "rock", motion: "gravity", shot: "slab", ult: "continent" },
    { sig: 29, c: "#a06bff", c2: "#e8d8ff", shape: "orb", motion: "vortex", shot: "voidorb", ult: "horizon" },
    { sig: 30, c: "#8a5cff", c2: "#d0b8ff", shape: "orb", motion: "vortex", shot: "voidorb", ult: "horizon" },
    { sig: 31, c: "#9a6bff", c2: "#e0ccff", shape: "star", motion: "orbit", shot: "meteor", ult: "supernova" },
    { sig: 32, c: "#b48cff", c2: "#f0e0ff", shape: "wisp", motion: "float", shot: "ghost", ult: "abyss" },
    { sig: 33, c: "#a06bff", c2: "#e8d8ff", shape: "comet", motion: "nova", shot: "prism", ult: "supernova" },
    { sig: 34, c: "#7a5cff", c2: "#c8b8ff", shape: "square", motion: "grid", shot: "codebolt", ult: "zero" },
    { sig: 35, c: "#6a3aff", c2: "#b898ff", shape: "crescent", motion: "vortex", shot: "eclipse", ult: "maw" },
    { sig: 36, c: "#8a4cff", c2: "#d8a8ff", shape: "shard", motion: "chaos", shot: "blade", ult: "bloodflare" },
    { sig: 37, c: "#aa7bff", c2: "#f0e8ff", shape: "star", motion: "orbit", shot: "prism", ult: "supernova" },
    { sig: 38, c: "#9a5cff", c2: "#e8ccff", shape: "tri", motion: "fountain", shot: "meteor", ult: "supernova" },
    { sig: 39, c: "#ba8cff", c2: "#f5e8ff", shape: "diamond", motion: "float", shot: "lance", ult: "decree" },
    { sig: 40, c: "#7a4cff", c2: "#c8a8ff", shape: "spiral", motion: "vortex", shot: "voidorb", ult: "horizon" },
    { sig: 41, c: "#8a6bff", c2: "#d8ccff", shape: "hex", motion: "gravity", shot: "slab", ult: "continent" },
    { sig: 42, c: "#95a0ff", c2: "#e0d8ff", shape: "rock", motion: "impact", shot: "boulder", ult: "seismic" },
    { sig: 43, c: "#7ab8ff", c2: "#d0e8ff", shape: "pixel", motion: "glitch", shot: "cube", ult: "error" },
    { sig: 44, c: "#a88cff", c2: "#f0e0ff", shape: "star", motion: "nova", shot: "prism", ult: "supernova" },
  ];
  const UPGRADES = [
    { name: "Reinforced glyphs", desc: "+22% maximum health.", icon: "HP" },
    { name: "Kerning fury", desc: "+18% attack power.", icon: "ATK" },
    {
      name: "Overclocked ink",
      desc: "+20% movement and attack speed.",
      icon: "SPD",
    },
    {
      name: "Ultimate battery",
      desc: "Begin next round at 55% charge.",
      icon: "ULT",
    },
    {
      name: "Prismatic armor",
      desc: "Reduce incoming damage by 16%.",
      icon: "DEF",
    },
    { name: "Critical serif", desc: "+18% critical chance.", icon: "CRIT" },
    {
      name: "Elemental surge",
      desc: "Stronger elemental advantage.",
      icon: "ELEM",
    },
  ];
  let chosen = [null, null],
    mode = "select",
    round = 1,
    wins = [0, 0],
    fighters = [],
    particles = [],
    projectiles = [],
    rings = [],
    bolts = [],
    logs = [],
    dmgNums = [],
    paused = false,
    muted = false,
    actx = null,
    shake = 0,
    flash = 0,
    hitstop = 0,
    slowmo = 0,
    cinematic = null,
    roundEnd = 0,
    last = 0,
    W = 800,
    H = 500,
    DPR = 1,
    matchStats = null,
    upgradeMods = [{}, {}];
  const keys = new Set(),
    joy = { active: false, id: null, cx: 0, cy: 0, dx: 0, dy: 0 },
    action = { attack: 0, dash: 0, ult: 0 };
  function buf(kind) {
    const t = action[kind];
    if (t && performance.now() - t < 160) return true;
    if (t) action[kind] = 0;
    return false;
  }
  const cv = $("cv"),
    ctx = cv.getContext("2d"),
    stage = $("stage");
  function elem(d) {
    return ELEMENTS[d.element];
  }
  function font(d, px) {
    return `400 ${px}px "${d.font}",system-ui,sans-serif`;
  }
  let rosterFilter = "All";
  function buildElemFilter() {
    const root = $("elemFilter");
    if (!root) return;
    root.innerHTML = "";
    [
      "All",
      "Fire",
      "Ice",
      "Storm",
      "Shadow",
      "Light",
      "Nature",
      "Cosmic",
    ].forEach((el) => {
      const b = document.createElement("button");
      b.className = "elem-pill" + (rosterFilter === el ? " on" : "");
      b.type = "button";
      if (el !== "All") {
        const c = ELEMENTS[el].color;
        b.style.color = c;
      }
      b.textContent = el;
      b.onclick = () => {
        rosterFilter = el;
        buildElemFilter();
        buildRoster();
        sfx("ui");
      };
      root.appendChild(b);
    });
  }
  function buildRoster() {
    const root = $("roster");
    root.innerHTML = "";
    R.forEach((d, idx) => {
      if (rosterFilter !== "All" && d.element !== rosterFilter) return;
      const e = elem(d),
        b = document.createElement("button");
      b.className = "font-card";
      b.type = "button";
      b.dataset.id = d.id;
      b.style.animationDelay = idx * 18 + "ms";
      b.innerHTML = `<span class="element" style="color:${e.color}">${d.element} · ${d.ult}</span><span class="preview" style="font-family:'${d.font}',system-ui;color:${e.color}">${d.name}</span>${bar("HP", d.hp / 131, d.hp, "#32d886")}${bar("ATK", d.atk / 100, d.atk, "#ff4f6f")}${bar("SPD", d.spd / 100, d.spd, "#39a9ff")}`;
      b.onclick = () => selectFighter(d);
      root.appendChild(b);
    });
  }
  function bar(n, v, x, c) {
    return `<span class="tinybar"><span>${n}</span><i style="--v:${v * 100}%;--c:${c}"></i><b>${x}</b></span>`;
  }
  function selectFighter(d) {
    audioInit();
    if (chosen[0] && chosen[0].id === d.id) chosen[0] = null;
    else if (chosen[1] && chosen[1].id === d.id) chosen[1] = null;
    else if (!chosen[0]) chosen[0] = d;
    else if (!chosen[1]) chosen[1] = d;
    else chosen = [d, null];
    sfx("ui");
    renderSelection();
  }
  function renderSelection() {
    [0, 1].forEach((i) => {
      const s = $("slot" + (i + 1)),
        d = chosen[i],
        w = s.querySelector(".pickword"),
        m = s.querySelector(".pickmeta");
      s.classList.toggle("filled", !!d);
      if (d) {
        w.textContent = d.name;
        w.style.fontFamily = `"${d.font}",system-ui`;
        w.style.color = FX[d.id].c;
        m.textContent = `${d.element} · ${d.ult}`;
      } else {
        w.textContent = "Choose";
        w.style.fontFamily = "inherit";
        w.style.color = "";
        m.textContent = i
          ? "Then choose their rival"
          : "Tap any contender below";
      }
    });
    document.querySelectorAll(".font-card").forEach((c) => {
      c.classList.toggle(
        "chosen1",
        chosen[0] && +c.dataset.id === chosen[0].id,
      );
      c.classList.toggle(
        "chosen2",
        chosen[1] && +c.dataset.id === chosen[1].id,
      );
    });
    $("pickPrompt").textContent = !chosen[0]
      ? "Choose your fighter"
      : !chosen[1]
        ? "Choose the AI rival"
        : "Rivals locked";
    $("fightBtn").disabled = !(chosen[0] && chosen[1]);
    $("fightBtn").textContent =
      chosen[0] && chosen[1]
        ? `${chosen[0].name} VS ${chosen[1].name}`
        : "Choose two fighters";
  }
  function randomRivals() {
    let a = pick(R),
      b;
    do b = pick(R);
    while (b === a);
    chosen = [a, b];
    renderSelection();
    sfx("ui");
  }
  function advantage(a, b) {
    if (ELEMENTS[a.element].strong === b.element) return 1;
    if (ELEMENTS[a.element].weak === b.element) return -1;
    return 0;
  }
  function matchupText() {
    const a = advantage(chosen[0], chosen[1]);
    if (a > 0) return `${chosen[0].element} breaks ${chosen[1].element}`;
    if (a < 0) return `${chosen[1].element} breaks ${chosen[0].element}`;
    return "Neutral elements";
  }
  function copyDef(d, side, net) {
    const m = upgradeMods[side];
    return {
      def: d,
      fx: FX[d.id],
      side,
      player: net ? true : side === 0,
      isLocal: net ? !!net.local : side === 0,
      x: side ? W * 0.82 : W * 0.18,
      y: H * 0.55,
      vx: 0,
      vy: 0,
      max: d.hp * (m.hp || 1),
      hp: d.hp * (m.hp || 1),
      atk: d.atk * (m.atk || 1),
      spd: d.spd * (m.spd || 1),
      armor: m.armor || 0,
      crit: 0.06 + (m.crit || 0),
      elementAmp: 1 + (m.elementAmp || 0),
      energy: m.startEnergy || 0,
      attackCD: 0.35,
      dashCD: 0,
      iframe: 0,
      stun: 0,
      flash: 0,
      dash: 0,
      dead: false,
      ultUsed: 0,
      hits: 0,
      damage: 0,
      taken: 0,
      crits: 0,
      bob: rnd(0, 10),
      facing: side ? -1 : 1,
      trail: [],
      aiThink: 0,
      aiX: 0,
      aiY: 0,
    };
  }
  function buildMapGrid(onPick) {
    const grid = $("mapGrid");
    grid.innerHTML = "";
    MAPS.forEach((m, i) => {
      const card = document.createElement("div");
      card.className = "map-card";
      card.innerHTML = `<div class="map-prev" style="background:linear-gradient(165deg,${m.bg1},${m.bg2})"><div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 60%,${m.accent}33,transparent 70%)"></div><div style="position:absolute;bottom:8px;left:12px;font-size:11px;font-weight:800;letter-spacing:2px;color:${m.accent}">${m.mult}x SIZE</div></div><div class="map-info"><div class="map-name">${m.name}</div><div class="map-meta"><span class="map-size">${m.mult === 1 ? "Standard" : m.mult > 1.3 ? "Large" : "Bigger"}</span></div><div class="map-desc">${m.desc}</div></div>`;
      card.onclick = () => {
        onPick(i);
        sfx("ui");
      };
      grid.appendChild(card);
    });
  }
  function showMapSelect(onPick) {
    buildMapGrid((i) => {
      hideMapSelect();
      onPick(i);
    });
    $("mapSelect").classList.add("show");
    $("mapClose").onclick = () => {
      hideMapSelect();
      onPick(0);
    };
  }
  function hideMapSelect() {
    $("mapSelect").classList.remove("show");
  }
  function startMatch() {
    audioInit();
    round = 1;
    wins = [0, 0];
    upgradeMods = [{}, {}];
    matchStats = {
      damage: [0, 0],
      hits: [0, 0],
      ults: [0, 0],
      crits: [0, 0],
      started: performance.now(),
    };
    $("selectScreen").classList.add("hidden");
    $("arenaScreen").classList.remove("hidden");
    showMapSelect((i) => {
      currentMap = i;
      resize();
      showVersus();
    });
  }
  let vsTimer = null;
  function showVersus(a, b, metaText, isGuest) {
    mode = "versus";
    a = a || chosen[0];
    b = b || chosen[1];
    const c1 = FX[a.id].c,
      c2 = FX[b.id].c;
    $("v1").textContent = a.name;
    $("v1").style.cssText = `font-family:"${a.font}";color:${c1}`;
    $("v2").textContent = b.name;
    $("v2").style.cssText = `font-family:"${b.font}";color:${c2}`;
    $("vsEl1").textContent = a.element.toUpperCase();
    $("vsEl1").style.color = c1;
    $("vsEl2").textContent = b.element.toUpperCase();
    $("vsEl2").style.color = c2;
    const vs = $("versus");
    vs.style.setProperty("--c1", c1);
    vs.style.setProperty("--c2", c2);
    vs.style.setProperty("--c1a", c1 + "66");
    vs.style.setProperty("--c2a", c2 + "66");
    // V8.0: apply element FX classes
    const sl = $("vsLeft"),
      sr = $("vsRight");
    sl.className = "vs-side vs-left vs-fx-" + a.element.toLowerCase();
    sr.className = "vs-side vs-right vs-fx-" + b.element.toLowerCase();
    // Clear previous particles and impact states
    sl.querySelector(".vs-particles").innerHTML = "";
    sr.querySelector(".vs-particles").innerHTML = "";
    sl.classList.remove("go");
    sr.classList.remove("go");
    $("vmeta").textContent = metaText || matchupText();
    $("countdown").textContent = `ROUND ${round}`;
    // V8.0: 3-layer particles per element
    function makeParticles(side, el, col) {
      const cont = side.querySelector(".vs-particles");
      const layers = {
        Fire: [
          ["🔥", 26, 34, "rise", 3],
          ["✦", 10, 16, "riseFast", 8],
          ["·", 4, 7, "drift", 12],
        ],
        Ice: [
          ["❄", 24, 32, "fall", 4],
          ["◇", 10, 15, "fallFast", 8],
          ["·", 4, 6, "drift", 10],
        ],
        Storm: [
          ["⚡", 28, 36, "flash", 3],
          ["ϟ", 12, 18, "flicker", 7],
          ["·", 3, 6, "static", 12],
        ],
        Shadow: [
          ["☁", 30, 40, "riseSlow", 3],
          ["●", 10, 16, "float", 7],
          ["·", 3, 5, "drift", 10],
        ],
        Light: [
          ["✦", 24, 32, "rise", 4],
          ["✧", 10, 16, "twinkle", 8],
          ["·", 3, 6, "drift", 12],
        ],
        Nature: [
          ["🍃", 22, 30, "swayFall", 4],
          ["✿", 10, 15, "fall", 7],
          ["·", 3, 6, "drift", 12],
        ],
        Cosmic: [
          ["✦", 24, 34, "twinkle", 5],
          ["✧", 10, 16, "float", 9],
          ["·", 3, 6, "drift", 16],
        ],
      };
      const cfg = layers[el] || layers.Fire;
      cfg.forEach(([ch, minS, maxS, anim, count], li) => {
        for (let k = 0; k < count; k++) {
          const d = document.createElement("i");
          d.textContent = ch;
          d.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:${Math.random() * 100}%;font-size:${minS + Math.random() * (maxS - minS)}px;color:${col};opacity:${0.5 + Math.random() * 0.4};pointer-events:none;z-index:4;animation:vsP_${anim} ${2 + Math.random() * 3}s ease-in-out infinite;animation-delay:${Math.random() * 2}s`;
          // Layer depth: big=slower, tiny=faster
          if (li === 0) d.style.filter = `drop-shadow(0 0 8px ${col})`;
          cont.appendChild(d);
        }
      });
    }
    makeParticles(sl, a.element, c1);
    makeParticles(sr, b.element, c2);
    // V8.0: per-element impact timing (ms within 5s)
    const impactAt = {
      Storm: 1500,
      Ice: 2500,
      Light: 2500,
      Nature: 3000,
      Cosmic: 3200,
      Fire: 3500,
      Shadow: 4000,
    };
    vsImpactTimers.forEach((t) => clearTimeout(t));
    vsImpactTimers = [];
    [
      [sl, a.element],
      [sr, b.element],
    ].forEach(([side, el]) => {
      vsImpactTimers.push(
        setTimeout(() => {
          if (mode === "versus") side.classList.add("go");
        }, impactAt[el] || 2500),
      );
    });
    $("vsSkip").classList.add("hidden");
    vs.classList.remove("hidden");
    sfx("versus");
    // VSFX: Canvas particles for Fire vs Storm
    const elems = [a.element, b.element].sort().join('+');
    if (elems === 'Fire+Storm') {
      const cv = $("vsCanvas");
      if (cv) {
        VSFX.init(cv);
        // Text zones for readability (RAMPAGE top-left, VOLTAGE bottom-right, VS center)
        VSFX.setTextZones([
          {x: 0.05, y: 0.15, w: 0.4, h: 0.15},  // RAMPAGE
          {x: 0.55, y: 0.70, w: 0.4, h: 0.15},  // VOLTAGE
          {x: 0.35, y: 0.40, w: 0.3, h: 0.20},  // VS
        ]);
        VSFX.start();
      }
    }
    if (vsTimer) clearTimeout(vsTimer);
    if (!isGuest) vsTimer = setTimeout(vsGo, 5000);
  }
  let vsImpactTimers = [];
  function vsGo() {
    if (mode !== "versus") return;
    // Stop VSFX canvas
    if (typeof VSFX !== 'undefined') VSFX.stop();
    if (vsTimer) {
      clearTimeout(vsTimer);
      vsTimer = null;
    }
    vsImpactTimers.forEach((t) => clearTimeout(t));
    const sl = $("vsLeft"),
      sr = $("vsRight");
    sl.classList.remove("go");
    sr.classList.remove("go");
    sl.querySelector(".vs-particles").innerHTML = "";
    sr.querySelector(".vs-particles").innerHTML = "";
    $("versus").classList.add("hidden");
    if (netMode && isHost) netRoomSend({ t: "begin" });
    beginRound();
  }
  function beginRound() {
    resize();
    mode = "fight";
    paused = false;
    particles = [];
    projectiles = [];
    rings = [];
    bolts = [];
    logs = [];
    dmgNums = [];
    shake = 0;
    flash = 0;
    slowmo = 0;
    cinematic = null;
    netUltFxs = [];
    roundEnd = 0;
    fighters = netMode
      ? [
          copyDef(netHostPick, 0, { local: isHost }),
          copyDef(netGuestPick, 1, { local: !isHost }),
        ]
      : [copyDef(chosen[0], 0), copyDef(chosen[1], 1)];
    window._ghostA = 0;
    window._ghostB = 0;
    upgradeMods.forEach((m) => (m.startEnergy = 0));
    setControlColors();
    updateHud();
    addLog(`Move, dash and attack — you are ${chosen[0].name}`);
    sfx("fight");
  }
  function resize() {
    const r = stage.getBoundingClientRect();
    const mm = MAPS[currentMap].mult;
    W = Math.max(300, r.width) * mm;
    H = Math.max(260, r.height) * mm;
    DPR = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
  }
  window.addEventListener("resize", resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
  function audioInit() {
    try {
      if (!actx)
        actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
    } catch (e) {
      console.warn("[audioInit]", e);
    }
  }
  function tone(type, f1, f2, d, g = 0.08, delay = 0) {
    if (muted || !actx) return;
    const t = actx.currentTime + delay,
      o = actx.createOscillator(),
      gain = actx.createGain();
    o.type = type;
    o.connect(gain);
    gain.connect(actx.destination);
    o.frequency.setValueAtTime(Math.max(20, f1), t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + d);
    gain.gain.setValueAtTime(g, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.start(t);
    o.stop(t + d + 0.02);
  }
  function noise(d = 0.12, g = 0.06) {
    if (muted || !actx) return;
    const len = Math.max(1, actx.sampleRate * d),
      buf = actx.createBuffer(1, len, actx.sampleRate),
      data = buf.getChannelData(0);
    for (let i = 0; i < len; i++)
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = actx.createBufferSource(),
      gain = actx.createGain();
    s.buffer = buf;
    s.connect(gain);
    gain.connect(actx.destination);
    gain.gain.value = g;
    s.start();
  }
  function sfx(t) {
    audioInit();
    if (t === "hit") {
      tone("square", 180, 65, 0.11, 0.07);
      noise(0.08, 0.04);
    } else if (t === "crit") {
      tone("sawtooth", 620, 120, 0.18, 0.1);
      noise(0.12, 0.07);
    } else if (t === "dash") {
      tone("sawtooth", 380, 90, 0.12, 0.06);
    } else if (t === "ult") {
      tone("sawtooth", 70, 800, 0.7, 0.11);
      tone("sine", 200, 1100, 0.8, 0.08, 0.15);
    } else if (t === "ko") {
      tone("square", 260, 35, 0.55, 0.13);
      noise(0.4, 0.09);
    } else if (t === "fight") {
      tone("square", 180, 520, 0.14, 0.08);
      tone("square", 240, 760, 0.2, 0.07, 0.16);
    } else if (t === "versus") {
      tone("sawtooth", 90, 260, 0.35, 0.07);
    } else tone("sine", 520, 820, 0.08, 0.05);
  }
  function toggleSound() {
    muted = !muted;
    document.querySelectorAll(".soundbtn").forEach((b) => {
      b.classList.toggle("off", muted);
      b.textContent = muted ? "Muted" : "Sound";
    });
    if (!muted) {
      audioInit();
      sfx("ui");
    }
  }
  function addLog(t) {
    logs.unshift(t);
    logs = logs.slice(0, 6);
    $("battleLog").textContent = t;
  }
  function ring(x, y, color, r = 140, life = 0.4, w = 4, kind = "circle") {
    rings.push({ x, y, color, r, t: 0, life, w, kind });
  }
  function particle(
    f,
    x,
    y,
    vx,
    vy,
    life = 0.5,
    size = 4,
    shape = f.fx.shape,
    motion = f.fx.motion,
    color = Math.random() < 0.72 ? f.fx.c : f.fx.c2,
    extra = {},
  ) {
    particles.push(
      Object.assign(
        {
          x,
          y,
          px: x,
          py: y,
          vx,
          vy,
          life,
          max: life,
          size,
          shape,
          motion,
          color,
          rot: rnd(0, TAU),
          spin: rnd(-8, 8),
          grav: 0,
        },
        extra,
      ),
    );
    if (particles.length > 1100) particles.splice(0, particles.length - 1100);
  }
  function signatureBurst(f, x, y, n = 26, power = 340, life = 0.6) {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, TAU),
        bias = f.fx.motion === "ray" || f.fx.motion === "speed" ? 0.25 : 1,
        s = rnd(0.25, 1) * power;
      let vx = Math.cos(a) * s,
        vy = Math.sin(a) * s * bias;
      if (f.fx.motion === "fountain") {
        vy = -Math.abs(vy) - 80;
        vx *= 0.55;
      }
      if (f.fx.motion === "rain") {
        vy = Math.abs(vy) + 120;
        vx *= 0.25;
      }
      if (f.fx.motion === "grid") {
        vx = Math.round(vx / 90) * 90;
        vy = Math.round(vy / 90) * 90;
      }
      particle(
        f,
        x,
        y,
        vx,
        vy,
        rnd(life * 0.6, life),
        rnd(2, 6),
        f.fx.shape,
        f.fx.motion,
        undefined,
        { grav: f.fx.motion === "fountain" ? 240 : 0, phase: rnd(0, TAU) },
      );
    }
  }
  function ambient(f, dt) {
    const amount = f.energy >= 100 ? 7 : 3;
    if (Math.random() > dt * (f.energy >= 100 ? 35 : 18)) return;
    for (let i = 0; i < amount; i++) {
      const a = rnd(0, TAU),
        r = rnd(34, 70);
      particle(
        f,
        f.x + Math.cos(a) * r,
        f.y + Math.sin(a) * r,
        -Math.sin(a) * r * 1.4,
        Math.cos(a) * r * 1.4,
        rnd(0.35, 0.85),
        rnd(1.5, 4),
        f.fx.shape,
        f.fx.motion,
        undefined,
        { phase: a, orbitX: f.x, orbitY: f.y },
      );
    }
  }
  function makeProjectile(f, t, angleOffset = 0, scale = 1) {
    const dx = t.x - f.x,
      dy = t.y - f.y,
      a = Math.atan2(dy, dx) + angleOffset + (!f.player ? rnd(-0.07, 0.07) : 0),
      s =
        (f.fx.shot === "wind" ? 460 : f.fx.shot === "slab" ? 350 : 560) +
        f.spd * 1.2;
    projectiles.push({
      x: f.x + Math.cos(a) * 45,
      y: f.y + Math.sin(a) * 24,
      px: f.x,
      py: f.y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      source: f,
      target: t,
      color: f.fx.c,
      color2: f.fx.c2,
      shot: f.fx.shot,
      shape: f.fx.shape,
      motion: f.fx.motion,
      life: 1.45,
      size:
        (f.fx.shot === "slab" ? 17 : f.fx.shot === "meteor" ? 13 : 8) * scale,
      dmg: f.atk * rnd(0.1, 0.14) * scale,
      crit: Math.random() < f.crit,
      age: 0,
      phase: rnd(0, TAU),
      homing: ["ghost", "soul", "voidorb", "bubble"].includes(f.fx.shot)
        ? 1
        : 0,
    });
  }
  function basicAttack(f, t) {
    if (f.dead || t.dead || f.attackCD > 0 || f.stun > 0) return;
    f.facing = t.x > f.x ? 1 : -1;
    f.attackCD = clamp(1.12 - f.spd / 155, 0.28, 0.75);
    const shot = f.fx.shot;
    if (
      ["fist", "blood", "arc", "blade", "skull"].includes(shot) &&
      Math.hypot(t.x - f.x, t.y - f.y) < 155
    ) {
      const a = Math.atan2(t.y - f.y, t.x - f.x);
      f.x += Math.cos(a) * 28;
      f.y += Math.sin(a) * 18;
      hit(f, t, f.atk * rnd(0.13, 0.18), Math.random() < f.crit, false);
      signatureBurst(f, t.x, t.y, shot === "blade" ? 38 : 24, 420, 0.5);
      ring(
        t.x,
        t.y,
        f.fx.c,
        110,
        0.28,
        5,
        shot === "blade" ? "slash" : "circle",
      );
    } else if (shot === "disk" || shot === "pixel") {
      makeProjectile(f, t, -0.09, 0.72);
      makeProjectile(f, t, 0.09, 0.72);
    } else if (shot === "bolt" || shot === "codebolt") {
      makeProjectile(f, t, 0, 1);
      bolts.push({
        x1: f.x,
        y1: f.y,
        x2: t.x,
        y2: t.y,
        color: f.fx.c,
        life: 0.11,
        max: 0.11,
        jag: shot === "codebolt" ? 9 : 5,
      });
    } else if (shot === "meteor") {
      makeProjectile(f, t, -0.15, 0.72);
      makeProjectile(f, t, 0, 0.78);
      makeProjectile(f, t, 0.15, 0.72);
    } else makeProjectile(f, t);
    f.energy = clamp(f.energy + 10, 0, 100);
    signatureBurst(f, f.x + f.facing * 35, f.y, 9, 150, 0.3);
    sfx("ui");
  }
  function dashFighter(f, dx, dy) {
    if (f.dead || f.stun > 0 || f.dashCD > 0 || f.dash > 0) return;
    if (!dx && !dy) {
      dx = f.facing;
      dy = 0;
    }
    const l = Math.hypot(dx, dy) || 1;
    f.vx = (dx / l) * (720 + f.spd * 2.2);
    f.vy = (dy / l) * (720 + f.spd * 2.2);
    f.dash = 0.18;
    f.iframe = 0.28;
    f.dashCD = 0.82;
    signatureBurst(f, f.x, f.y, 22, 300, 0.4);
    ring(f.x, f.y, f.fx.c, 85, 0.3, 4, "dash");
    sfx("dash");
  }
  function triggerUltimate(f, t) {
    if (f.dead || t.dead || f.energy < 100) return;
    if (netMode && netActive) {
      if (netUltFxs.some((u) => u.f === f)) return;
      f.energy = 0;
      f.ultUsed++;
      matchStats.ults[f.side]++;
      netUltFxs.push({ f, t, time: 0, hit: false, predicted: false });
      f._ultTgt = t;
      if (typeof ULTFX !== "undefined" && ULTFX[f.sig]) {
        try {
          ULTFX[f.sig].opening(f);
        } catch (e) {
          console.warn("[ultFx opening]", e);
        }
      }
      ultFxSpawn(f);
      if (isHost)
        netRoomSend({
          t: "ult-fx",
          by: f.side === 0 ? "host" : "guest",
          from: netMe(),
        });
      return;
    }
    if (cinematic) return;
    f.energy = 0;
    f.ultUsed++;
    matchStats.ults[f.side]++;
    cinematic = { f, t, time: 0, hit: false };
    mode = "cinematic";
    sfx("ult");
    f._ultTgt = t;
    if (typeof ULTFX !== "undefined" && ULTFX[f.sig]) {
      try {
        ULTFX[f.sig].opening(f);
      } catch (e) {
        console.warn("[ultFx opening]", e);
      }
    }
    addLog(`${f.def.name}: ${f.def.ult.toUpperCase()}!`);
    for (let i = 0; i < 100; i++) {
      const a = rnd(0, TAU),
        r = rnd(30, Math.max(W, H) * 0.65),
        spd = rnd(60, 340);
      particle(
        f,
        f.x + Math.cos(a) * r,
        f.y + Math.sin(a) * r,
        -Math.cos(a) * spd,
        -Math.sin(a) * spd,
        rnd(0.5, 1.25),
        rnd(2, 8),
        f.fx.shape,
        f.fx.ult,
        undefined,
        { phase: a },
      );
    }
    ring(f.x, f.y, f.fx.c, Math.max(W, H) * 0.75, 1, 9, f.fx.ult);
  }
  function ultFxSpawn(f) {
    sfx("ult");
    addLog(`${f.def.name}: ${f.def.ult.toUpperCase()}!`);
    for (let i = 0; i < 100; i++) {
      const a = rnd(0, TAU),
        r = rnd(30, Math.max(W, H) * 0.65),
        spd = rnd(60, 340);
      particle(
        f,
        f.x + Math.cos(a) * r,
        f.y + Math.sin(a) * r,
        -Math.cos(a) * spd,
        -Math.sin(a) * spd,
        rnd(0.5, 1.25),
        rnd(2, 8),
        f.fx.shape,
        f.fx.ult,
        undefined,
        { phase: a },
      );
    }
    ring(f.x, f.y, f.fx.c, Math.max(W, H) * 0.75, 1, 9, f.fx.ult);
  }
  function updateNetUltFx(dt) {
    if (!fighters.length || !netUltFxs.length) return;
    for (let ui = netUltFxs.length - 1; ui >= 0; ui--) {
      const u = netUltFxs[ui];
      u.time += dt;
      const f = u.f;
      for (let i = 0; i < 10; i++) {
        const a = rnd(0, TAU),
          r = rnd(30, Math.max(W, H) * 0.55),
          pull = u.time < 0.65 ? -1 : 1;
        particle(
          f,
          f.x + Math.cos(a) * r,
          f.y + Math.sin(a) * r,
          Math.cos(a) * pull * r * 2.4,
          Math.sin(a) * pull * r * 2.4,
          rnd(0.35, 0.9),
          rnd(2, 8),
          f.fx.shape,
          f.fx.ult,
          undefined,
          { phase: a },
        );
      }
      if (u.time > 0.68 && !u.hit) {
        u.hit = true;
        const s = f.fx.sig;
        if (isHost) {
          const dmg = f.atk * rnd(0.43, 0.55);
          hit(f, u.t, dmg, true, true);
        } else {
          signatureBurst(f, u.t.x, u.t.y, 150, 760, 1.05);
          ring(u.t.x, u.t.y, f.fx.c, Math.max(W, H) * 0.65, 0.8, 10, f.fx.ult);
          shake = Math.max(shake, 30);
          hitstop = Math.max(hitstop, 0.15);
          flash = Math.max(flash, 0.55);
          sfx("crit");
        }
        ultimateSecondary(f, u.t, s);
      }
      if (u.time > 1.65) netUltFxs.splice(ui, 1);
    }
  }
  function hit(src, tgt, dmg, crit, ultimate) {
    if (tgt.dead || tgt.iframe > 0) return false;
    if (!src.player) dmg *= 0.82;
    const adv = advantage(src.def, tgt.def),
      mult = adv > 0 ? 1.2 * src.elementAmp : adv < 0 ? 0.84 : 1;
    dmg *= mult * (crit ? 1.65 : 1) * (1 - tgt.armor);
    tgt.hp = Math.max(0, tgt.hp - dmg);
    src.damage += dmg;
    src.hits++;
    tgt.taken += dmg;
    matchStats.damage[src.side] += dmg;
    matchStats.hits[src.side]++;
    if (crit) {
      src.crits++;
      matchStats.crits[src.side]++;
    }
    tgt.energy = clamp(tgt.energy + (ultimate ? 30 : 15), 0, 100);
    tgt.flash = 0.13;
    tgt.stun = ultimate ? 0.42 : 0.09;
    signatureBurst(
      src,
      tgt.x,
      tgt.y,
      ultimate ? 150 : crit ? 54 : 30,
      ultimate ? 760 : crit ? 550 : 380,
      ultimate ? 1.05 : 0.58,
    );
    ring(
      tgt.x,
      tgt.y,
      src.fx.c,
      ultimate ? Math.max(W, H) * 0.65 : crit ? 190 : 105,
      ultimate ? 0.8 : 0.35,
      ultimate ? 10 : 4,
      src.fx.ult,
    );
    shake = Math.max(shake, ultimate ? 30 : crit ? 16 : 8);
    hitstop = Math.max(hitstop, ultimate ? 0.15 : crit ? 0.075 : 0.04);
    flash = Math.max(flash, ultimate ? 0.55 : crit ? 0.16 : 0.05);
    sfx(ultimate ? "crit" : crit ? "crit" : "hit");
    addLog(
      `${src.def.name} ${ultimate ? "unleashes " + src.def.ult : crit ? "lands a CRITICAL" : "hits"} — ${Math.round(dmg)}`,
    );
    dmgNums.push({
      x: tgt.x + rnd(-24, 24),
      y: tgt.y - 46,
      txt: Math.round(dmg),
      crit,
      ult: ultimate,
      life: ultimate ? 1.15 : 0.85,
      max: ultimate ? 1.15 : 0.85,
      vy: -110,
    });
    if (tgt.hp <= 0) knockout(tgt, src);
    return true;
  }
  function playerVector() {
    let x =
        (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
        (keys.has("a") || keys.has("arrowleft") ? 1 : 0),
      y =
        (keys.has("s") || keys.has("arrowdown") ? 1 : 0) -
        (keys.has("w") || keys.has("arrowup") ? 1 : 0);
    x += joy.dx;
    y += joy.dy;
    const l = Math.hypot(x, y);
    return l > 1 ? { x: x / l, y: y / l } : { x, y };
  }
  function projectileThreat(f) {
    return projectiles.find(
      (p) => p.source !== f && Math.hypot(p.x - f.x, p.y - f.y) < 145,
    );
  }
  function updateAI(f, t, dt) {
    f.aiThink -= dt;
    if (f.aiThink <= 0) {
      f.aiThink = rnd(0.16, 0.34);
      const dx = t.x - f.x,
        dy = t.y - f.y,
        d = Math.hypot(dx, dy) || 1,
        preferred = ["fist", "blood", "arc", "blade", "skull"].includes(
          f.fx.shot,
        )
          ? 115
          : 260;
      let toward = d > preferred + 45 ? 1 : d < preferred - 50 ? -1 : 0;
      f.aiX = (dx / d) * toward + (-dy / d) * rnd(-0.75, 0.75);
      f.aiY = (dy / d) * toward + (dx / d) * rnd(-0.75, 0.75);
      const th = projectileThreat(f);
      if (th && f.dashCD <= 0 && Math.random() < 0.5)
        dashFighter(f, -th.vy, th.vx);
      else if (f.dashCD <= 0 && d > 320 && Math.random() < 0.18)
        dashFighter(f, dx, dy);
      else if (f.dashCD <= 0 && d < 105 && Math.random() < 0.22)
        dashFighter(f, -dx, -dy);
      if (f.attackCD <= 0 && d < (preferred < 150 ? 165 : 520))
        basicAttack(f, t);
      if (f.energy >= 100 && d < 520 && Math.random() < 0.55)
        triggerUltimate(f, t);
    }
    const l = Math.hypot(f.aiX, f.aiY) || 1;
    moveFighter(f, f.aiX / l, f.aiY / l, dt);
  }
  function moveFighter(f, dx, dy, dt) {
    if (f.dash > 0) {
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.vx *= 0.94;
      f.vy *= 0.94;
      for (let i = 0; i < 4; i++)
        particle(
          f,
          f.x - rnd(0, 24) * Math.sign(f.vx),
          f.y - rnd(-12, 12),
          -f.vx * 0.1,
          -f.vy * 0.1,
          0.28,
          rnd(2, 6),
          f.fx.shape,
          "trail",
        );
      return;
    }
    const l = Math.hypot(dx, dy);
    if (l > 0.05) {
      const s = 95 + f.spd * 1.28;
      f.x += (dx / l) * s * dt;
      f.y += (dy / l) * s * dt;
      f.facing = dx ? Math.sign(dx) : f.facing;
      if (Math.random() < dt * 22)
        particle(
          f,
          f.x - rnd(0, 24) * f.facing,
          f.y + 32,
          rnd(-30, 30),
          rnd(-20, 20),
          0.3,
          rnd(1, 4),
          f.fx.shape,
          "trail",
        );
    }
    f.x = clamp(f.x, 58, W - 58);
    f.y = clamp(f.y, 62, H - 62);
  }
  function updateFight(dt) {
    if (roundEnd > 0) {
      roundEnd -= dt;
      if (roundEnd <= 0) afterRound();
      updateFx(dt);
      return;
    }
    const p = fighters[0],
      ai = fighters[1];
    for (const f of fighters) {
      f.flash = Math.max(0, f.flash - dt);
      f.stun = Math.max(0, f.stun - dt);
      f.iframe = Math.max(0, f.iframe - dt);
      f.attackCD = Math.max(0, f.attackCD - dt);
      f.dashCD = Math.max(0, f.dashCD - dt);
      f.dash = Math.max(0, f.dash - dt);
      f.bob += dt * 3;
      ambient(f, dt);
    }
    if (!p.dead && p.stun <= 0) {
      const v = playerVector();
      moveFighter(p, v.x, v.y, dt);
      if (buf("attack")) {
        basicAttack(p, ai);
        action.attack = 0;
      }
      if (buf("dash")) {
        dashFighter(p, v.x, v.y);
        action.dash = 0;
      }
      if (buf("ult")) {
        if (p.energy >= 100) triggerUltimate(p, ai);
        else addLog(`Ultimate charging — ${Math.floor(p.energy)}%`);
        action.ult = 0;
      }
    }
    if (netMode && isHost) {
      if (!ai.dead && ai.stun <= 0) applyRemoteInput(ai, p, dt);
    } else if (!ai.dead && ai.stun <= 0 && mode === "fight")
      updateAI(ai, p, dt);
    separateFighters();
    updateProjectiles(dt);
    updateFx(dt);
    updateHud();
  }
  function separateFighters() {
    if (fighters.length < 2) return;
    const a = fighters[0],
      b = fighters[1],
      dx = b.x - a.x,
      dy = b.y - a.y,
      d = Math.hypot(dx, dy) || 1;
    if (d < 92) {
      const push = (92 - d) / 2;
      a.x -= (dx / d) * push;
      a.y -= (dy / d) * push;
      b.x += (dx / d) * push;
      b.y += (dy / d) * push;
    }
  }
  function updateCinematic(dt) {
    const c = cinematic;
    if (!c) return;
    c.time += dt;
    const f = c.f;
    const ux =
      typeof ULTFX !== "undefined" && ULTFX[f.sig] ? ULTFX[f.sig] : null;
    if (ux) {
      try {
        ux.beats(f, c.t, dt);
      } catch (e) {
        console.warn("[ultFx beats]", e);
      }
    } else {
      for (let i = 0; i < 10; i++) {
        const a = rnd(0, TAU),
          r = rnd(30, Math.max(W, H) * 0.55),
          pull = c.time < 0.65 ? -1 : 1;
        particle(
          f,
          f.x + Math.cos(a) * r,
          f.y + Math.sin(a) * r,
          Math.cos(a) * pull * r * 2.4,
          Math.sin(a) * pull * r * 2.4,
          rnd(0.35, 0.9),
          rnd(2, 8),
          f.fx.shape,
          f.fx.ult,
          undefined,
          { phase: a },
        );
      }
    }
    if (c.time > 0.68 && !c.hit) {
      c.hit = true;
      const dmg = f.atk * rnd(0.43, 0.55);
      hit(f, c.t, dmg, true, true);
      if (ux) {
        try {
          ux.impact(f, c.t);
        } catch (e) {
          console.warn("[ultFx impact]", e);
        }
      }
    }
    updateProjectiles(dt * 0.4);
    updateFx(dt * 0.55);
    if (c.time > 1.65) {
      cinematic = null;
      mode = "fight";
    }
    updateHud();
  }
  function ultimateSecondary(f, t, s) {
    const mode = s % 6;
    if (mode === 0) {
      for (let i = 0; i < 5; i++)
        ring(t.x, t.y, f.fx.c, 120 + i * 65, 0.55 + i * 0.08, 8, f.fx.ult);
    } else if (mode === 1) {
      for (let i = 0; i < 10; i++)
        bolts.push({
          x1: rnd(0, W),
          y1: 0,
          x2: t.x + rnd(-100, 100),
          y2: t.y,
          color: i % 2 ? f.fx.c : f.fx.c2,
          life: 0.45,
          max: 0.45,
          jag: 6 + (s % 5),
        });
    } else if (mode === 2) {
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * TAU;
        projectiles.push({
          x: t.x + Math.cos(a) * W * 0.55,
          y: t.y + Math.sin(a) * H * 0.55,
          px: t.x,
          py: t.y,
          vx: -Math.cos(a) * 650,
          vy: -Math.sin(a) * 650,
          source: f,
          target: t,
          color: f.fx.c,
          color2: f.fx.c2,
          shot: f.fx.shot,
          shape: f.fx.shape,
          motion: f.fx.motion,
          life: 0.7,
          size: 9,
          dmg: 0,
          crit: false,
          age: 0,
          phase: a,
          visual: true,
        });
      }
    } else if (mode === 3) {
      ring(W / 2, H / 2, f.fx.c, Math.max(W, H), 0.8, 22, "grid");
      flash = 0.8;
    } else if (mode === 4) {
      for (let i = 0; i < 12; i++)
        bolts.push({
          x1: f.x,
          y1: f.y,
          x2: rnd(0, W),
          y2: rnd(0, H),
          color: i % 3 ? f.fx.c : f.fx.c2,
          life: 0.5,
          max: 0.5,
          jag: 2 + (i % 8),
        });
    } else {
      for (let i = 0; i < 160; i++) {
        const a = rnd(0, TAU),
          sp = rnd(180, 900);
        particle(
          f,
          t.x,
          t.y,
          Math.cos(a) * sp,
          Math.sin(a) * sp,
          rnd(0.5, 1.2),
          rnd(2, 10),
          f.fx.shape,
          f.fx.ult,
        );
      }
    }
  }
  function updateProjectiles(dt) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.life -= dt;
      p.age += dt;
      p.px = p.x;
      p.py = p.y;
      if (p.homing && p.target && !p.target.dead) {
        const a = Math.atan2(p.target.y - p.y, p.target.x - p.x),
          s = Math.hypot(p.vx, p.vy);
        p.vx = p.vx * 0.94 + Math.cos(a) * s * 0.06;
        p.vy = p.vy * 0.94 + Math.sin(a) * s * 0.06;
      }
      if (["wind", "gale"].includes(p.shot))
        p.vy += Math.sin(p.age * 15 + p.phase) * 260 * dt;
      if (["cube", "pixel", "boltbox"].includes(p.shot))
        p.y += Math.sin(p.age * 22 + p.phase) * 70 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      for (let k = 0; k < 3; k++) {
        const f = p.source;
        particle(
          f,
          p.x - (rnd(0, 18) * p.vx) / 600,
          p.y - (rnd(0, 18) * p.vy) / 600,
          rnd(-30, 30),
          rnd(-30, 30),
          0.3,
          rnd(1, p.size * 0.65),
          f.fx.shape,
          f.fx.motion,
        );
      }
      if (
        !p.visual &&
        p.life > 0 &&
        p.target &&
        !p.target.dead &&
        Math.hypot(p.x - p.target.x, p.y - p.target.y) < 43
      ) {
        hit(p.source, p.target, p.dmg, p.crit, false);
        projectiles.splice(i, 1);
      } else if (
        p.life <= 0 ||
        p.x < -80 ||
        p.x > W + 80 ||
        p.y < -80 ||
        p.y > H + 80
      )
        projectiles.splice(i, 1);
    }
  }
  function updateFx(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      p.px = p.x;
      p.py = p.y;
      p.rot += p.spin * dt;
      const m = p.motion;
      if (
        m === "spiral" ||
        m === "orbit" ||
        m === "coil" ||
        m === "vortex" ||
        m === "soulstorm"
      ) {
        const a = (p.phase || 0) + (p.max - p.life) * 6,
          r = (80 * p.life) / p.max;
        p.x += Math.cos(a) * r * dt * 3;
        p.y += Math.sin(a) * r * dt * 3;
      } else if (
        m === "zig" ||
        m === "chain" ||
        m === "stutter" ||
        m === "glitch" ||
        m === "error"
      ) {
        p.x += p.vx * dt + (Math.random() - 0.5) * 12;
        p.y += p.vy * dt + (Math.random() - 0.5) * 12;
      } else if (
        m === "wave" ||
        m === "cyclone" ||
        m === "moon" ||
        m === "blizzard" ||
        m === "whiteout"
      ) {
        p.x += p.vx * dt;
        p.y += p.vy * dt + Math.sin((p.phase || 0) + (p.max - p.life) * 18) * 5;
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      p.vy += (p.grav || 0) * dt;
      p.vx *= 0.977;
      p.vy *= 0.977;
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      rings[i].t += dt;
      if (rings[i].t >= rings[i].life) rings.splice(i, 1);
    }
    for (let i = bolts.length - 1; i >= 0; i--) {
      bolts[i].life -= dt;
      if (bolts[i].life <= 0) bolts.splice(i, 1);
    }
    shake *= Math.exp(-9 * dt);
    flash = Math.max(0, flash - dt);
    for (let i = dmgNums.length - 1; i >= 0; i--) {
      const n = dmgNums[i];
      n.life -= dt;
      if (n.life <= 0) {
        dmgNums.splice(i, 1);
        continue;
      }
      n.y += n.vy * dt;
      n.vy *= 0.94;
    }
  }
  function knockout(loser, winner) {
    if (loser.dead) return;
    loser.dead = true;
    winner.energy = 0;
    slowmo = 1.2;
    roundEnd = 1.45;
    wins[winner.side]++;
    signatureBurst(winner, loser.x, loser.y, 220, 840, 1.2);
    ring(loser.x, loser.y, "#ffffff", Math.max(W, H) * 0.75, 0.9, 12, "ko");
    shake = 36;
    flash = 0.85;
    sfx("ko");
    $("koTitle").classList.remove("show");
    void $("koTitle").offsetWidth;
    $("koTitle").classList.add("show");
    addLog(`${winner.def.name} wins round ${round}!`);
    updateHud();
  }
  function afterRound() {
    if (netMode && isHost) {
      afterRoundNet();
      return;
    }
    const champ = wins.findIndex((x) => x >= 2);
    if (champ >= 0) {
      showResult(champ);
      return;
    }
    const winner = fighters.find((f) => !f.dead).side;
    showUpgrade(winner);
  }
  function showUpgrade(winner) {
    const loser = 1 - winner;
    const consolation = UPGRADES.slice().sort(() => Math.random() - 0.5)[0];
    if (winner === 0) {
      mode = "upgrade";
      const d = chosen[0];
      $("upgradeH").textContent = `Winner's spoils \u2014 power up ${d.name}`;
      $("upgradeP").textContent =
        `You took round ${round}. Pick your reward \u2014 the AI only gets a weaker consolation prize.`;
      const pool = UPGRADES.slice()
          .sort(() => Math.random() - 0.5)
          .slice(0, 3),
        row = $("upgradeRow");
      row.innerHTML = "";
      pool.forEach((u) => {
        const b = document.createElement("button");
        b.className = "upgrade-card";
        b.innerHTML = `<div class="upgrade-icon">${u.icon}</div><strong>${u.name}</strong><span>${u.desc}</span>`;
        b.onclick = () => {
          applyUpgrade(0, u, false);
          applyUpgrade(1, consolation, true);
          $("upgrade").classList.add("hidden");
          round++;
          showVersus();
          sfx("ui");
        };
        row.appendChild(b);
      });
      $("upgrade").classList.remove("hidden");
    } else {
      const u = UPGRADES.slice().sort(() => Math.random() - 0.5)[0];
      applyUpgrade(1, u, false);
      applyUpgrade(0, consolation, true);
      mode = "upgrade";
      $("upgradeH").textContent = `${chosen[1].name} takes round ${round}`;
      $("upgradeP").textContent =
        `The AI claims ${u.name}. Your consolation prize: ${consolation.name} (weakened). Win the round, win the real loot.`;
      const row = $("upgradeRow");
      row.innerHTML = "";
      const b = document.createElement("button");
      b.className = "upgrade-card";
      b.innerHTML = `<div class="upgrade-icon">\u00bb</div><strong>Continue</strong><span>Head into round ${round + 1}</span>`;
      b.onclick = () => {
        $("upgrade").classList.add("hidden");
        round++;
        showVersus();
        sfx("ui");
      };
      row.appendChild(b);
      $("upgrade").classList.remove("hidden");
    }
  }
  function applyUpgrade(side, u, weak) {
    const m = upgradeMods[side];
    if (u.icon === "HP") m.hp = (m.hp || 1) * (weak ? 1.11 : 1.22);
    else if (u.icon === "ATK") m.atk = (m.atk || 1) * (weak ? 1.09 : 1.18);
    else if (u.icon === "SPD") m.spd = (m.spd || 1) * (weak ? 1.1 : 1.2);
    else if (u.icon === "ULT") m.startEnergy = weak ? 25 : 55;
    else if (u.icon === "DEF")
      m.armor = clamp((m.armor || 0) + (weak ? 0.08 : 0.16), 0, 0.48);
    else if (u.icon === "CRIT") m.crit = (m.crit || 0) + (weak ? 0.09 : 0.18);
    else if (u.icon === "ELEM")
      m.elementAmp = (m.elementAmp || 0) + (weak ? 0.11 : 0.22);
    addLog(`${chosen[side].name} gains ${u.name}${weak ? " (weakened)" : ""}`);
  }
  function showResult(side) {
    mode = "result";
    netUltFxs = [];
    const d = chosen[side],
      sec = Math.max(
        1,
        Math.round((performance.now() - matchStats.started) / 1000),
      ),
      youWon = side === 0,
      banner = $("resultBanner"),
      fighterEl = $("resultFighter"),
      fx = FX[d.id];
    let title = "VICTORY";
    if (netMode) {
      title = youWon ? "YOU WIN" : "YOU LOSE";
    } else if (youWon) {
      title =
        wins[0] === 2 && wins[1] === 0
          ? "FLAWLESS VICTORY"
          : wins[1] === 0
            ? "DOMINANT VICTORY"
            : "VICTORY";
    } else {
      title = "DEFEAT";
    }
    banner.textContent = title;
    banner.classList.toggle("defeat", !youWon);
    fighterEl.textContent = d.name;
    fighterEl.style.fontFamily = `"${d.font}",system-ui,sans-serif`;
    fighterEl.style.color = fx.c;
    fighterEl.style.textShadow = `0 0 24px ${fx.c},0 0 60px ${fx.c2}`;
    const oppName = netMode ? (youWon ? netRemoteName : netLocalName) : "AI";
    $("resultP").textContent = netMode
      ? `${wins[0]}–${wins[1]} vs ${oppName} · ${d.element} · ${d.ult}`
      : `${wins[0]}–${wins[1]} · ${d.element} champion · ${d.ult}`;
    $("resultStats").innerHTML =
      `<div><b>${Math.round(matchStats.damage[0])}</b><span>damage</span></div><div><b>${matchStats.hits[0]}</b><span>hits</span></div><div><b>${matchStats.ults[0]}</b><span>ults</span></div><div><b>${sec}s</b><span>time</span></div>`;
    $("result").classList.remove("hidden");
    const card = document.querySelector(".result-card");
    card.style.borderColor = fx.c + "55";
    card.style.boxShadow = `0 0 60px ${fx.c}44,0 0 120px rgba(0,100,255,.1)`;
    if (youWon) {
      sfx("win");
      const colors = [fx.c, fx.c2, "#ffd700", "#ffffff"];
      for (let i = 0; i < 40; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random() * 100 + "%";
        c.style.background = colors[i % 4];
        c.style.animationDelay = Math.random() * 0.8 + "s";
        c.style.transform = `rotate(${Math.random() * 360}deg)`;
        card.appendChild(c);
        setTimeout(() => c.remove(), 4000);
      }
      const stats = [
        Math.round(matchStats.damage[0]),
        matchStats.hits[0],
        matchStats.ults[0],
        sec,
      ];
      const labels = ["damage", "hits", "ults", "time"];
      const statDivs = document.querySelectorAll(".result-stats>div b");
      statDivs.forEach((el, idx) => {
        const target = stats[idx];
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const iv = setInterval(() => {
          cur += step;
          if (cur >= target) {
            cur = target;
            clearInterval(iv);
          }
          el.textContent = idx === 3 ? cur + "s" : cur;
        }, 33);
      });
    }
    if (netMode) netResultUI();
  }
  function updateHud() {
    if (!fighters.length) return;
    const a = fighters[0],
      b = fighters[1];
    $("nameL").textContent =
      (netMode ? netLocalName + " · " : "YOU · ") + a.def.name;
    $("nameL").style.cssText = `font-family:"${a.def.font}";color:${a.fx.c}`;
    $("nameR").textContent =
      b.def.name + (netMode ? " · " + netRemoteName : " · AI");
    $("nameR").style.cssText = `font-family:"${b.def.font}";color:${b.fx.c}`;
    $("hpL").style.width = clamp((a.hp / a.max) * 100, 0, 100) + "%";
    $("hpR").style.width = clamp((b.hp / b.max) * 100, 0, 100) + "%";
    const pctA = a.hp / a.max,
      pctB = b.hp / b.max;
    $("hpNumL").textContent = Math.ceil(a.hp);
    $("hpNumR").textContent = Math.ceil(b.hp);
    $("hpL").classList.toggle("critical", pctA < 0.3);
    $("hpL").classList.toggle("hurt", pctA >= 0.3 && pctA < 0.6);
    $("hpR").classList.toggle("critical", pctB < 0.3);
    $("hpR").classList.toggle("hurt", pctB >= 0.3 && pctB < 0.6);
    if (!window._ghostA || a.hp > window._ghostA) window._ghostA = a.hp;
    if (!window._ghostB || b.hp > window._ghostB) window._ghostB = b.hp;
    $("hpGhostL").style.width =
      clamp((window._ghostA / a.max) * 100, 0, 100) + "%";
    $("hpGhostR").style.width =
      clamp((window._ghostB / b.max) * 100, 0, 100) + "%";
    window._ghostA += (a.hp - window._ghostA) * 0.08;
    window._ghostB += (b.hp - window._ghostB) * 0.08;
    $("ultL").style.width = a.energy + "%";
    $("ultR").style.width = b.energy + "%";
    $("winsL").textContent = "●".repeat(wins[0]) + "○".repeat(2 - wins[0]);
    $("winsR").textContent = "●".repeat(wins[1]) + "○".repeat(2 - wins[1]);
    $("roundTxt").textContent = "ROUND " + round;
    $("matchup").innerHTML = `ELEMENT MATCHUP<b>${matchupText()}</b>`;
    const ub = $("ultControl"),
      db = $("dashControl");
    ub.classList.toggle("ready", a.energy >= 100);
    ub.querySelector("span").textContent =
      a.energy >= 100 ? "ULT READY" : `ULT ${Math.floor(a.energy)}%`;
    db.classList.toggle("cooling", a.dashCD > 0);
    db.querySelector("span").textContent =
      a.dashCD > 0 ? `DASH ${a.dashCD.toFixed(1)}` : "DASH";
  }
  function setControlColors() {
    const c = FX[chosen[0].id].c;
    document.documentElement.style.setProperty("--player", c);
    document.documentElement.style.setProperty(
      "--player2",
      FX[chosen[0].id].c2,
    );
  }
  function drawShape(p, alpha = 1) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot || 0);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.color;
    const s = p.size;
    ctx.beginPath();
    switch (p.shape) {
      case "tri":
        ctx.moveTo(0, -s * 1.6);
        ctx.lineTo(s, s);
        ctx.lineTo(-s, s);
        ctx.closePath();
        break;
      case "zig":
        ctx.moveTo(-s, -s);
        ctx.lineTo(0, -s * 0.2);
        ctx.lineTo(-s * 0.2, s * 0.2);
        ctx.lineTo(s, s);
        ctx.lineTo(0.15 * s, 0.15 * s);
        ctx.lineTo(0.4 * s, -0.25 * s);
        ctx.closePath();
        break;
      case "crescent":
        ctx.arc(0, 0, s, Math.PI * 0.35, Math.PI * 1.65);
        ctx.arc(s * 0.55, 0, s * 0.75, Math.PI * 1.65, Math.PI * 0.35, true);
        break;
      case "line":
        ctx.rect(-s * 2, -s * 0.25, s * 4, s * 0.5);
        break;
      case "rock":
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * TAU,
            r = s * (i % 2 ? 1 : 0.75);
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        break;
      case "pixel":
      case "square":
      case "frame":
        ctx.rect(-s, -s, s * 2, s * 2);
        break;
      case "drop":
        ctx.moveTo(0, -s * 1.5);
        ctx.quadraticCurveTo(s * 1.3, 0, 0, s * 1.4);
        ctx.quadraticCurveTo(-s * 1.3, 0, 0, -s * 1.5);
        break;
      case "diamond":
        ctx.moveTo(0, -s * 1.5);
        ctx.lineTo(s, 0);
        ctx.lineTo(0, s * 1.5);
        ctx.lineTo(-s, 0);
        ctx.closePath();
        break;
      case "spiral":
        ctx.arc(0, 0, s, 0, TAU);
        break;
      case "hex":
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * TAU;
          ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
        }
        ctx.closePath();
        break;
      case "comet":
        ctx.moveTo(s * 2, 0);
        ctx.lineTo(-s, s * 0.65);
        ctx.lineTo(-s, -s * 0.65);
        ctx.closePath();
        break;
      case "thorn":
        ctx.moveTo(s * 1.8, 0);
        ctx.lineTo(-s, s * 0.65);
        ctx.lineTo(-s, -s * 0.65);
        ctx.closePath();
        break;
      case "wisp":
        ctx.arc(0, 0, s, 0, TAU);
        break;
      case "star":
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + (i * Math.PI) / 5,
            r = i % 2 ? s * 0.45 : s * 1.5;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        break;
      case "shard":
        ctx.moveTo(0, -s * 1.8);
        ctx.lineTo(s * 0.7, s * 0.65);
        ctx.lineTo(0, s * 1.3);
        ctx.lineTo(-s * 0.7, s * 0.65);
        ctx.closePath();
        break;
      case "ribbon":
        ctx.rect(-s * 2, -s * 0.25, s * 4, s * 0.5);
        break;
      case "slash":
        ctx.moveTo(-s * 2, s * 0.6);
        ctx.lineTo(s * 2, -s * 0.6);
        ctx.lineTo(s * 1.4, s * 0.1);
        ctx.lineTo(-s * 1.4, s);
        ctx.closePath();
        break;
      case "glyph":
        ctx.arc(0, 0, s, 0, TAU);
        ctx.moveTo(-s, 0);
        ctx.lineTo(s, 0);
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.stroke();
        ctx.restore();
        return;
      case "mist":
        ctx.arc(0, 0, s, 0, TAU);
        break;
      case "tentacle":
        ctx.ellipse(0, 0, s * 2, s * 0.5, 0, 0, TAU);
        break;
      case "code":
        ctx.rect(-s * 0.35, -s * 1.4, s * 0.7, s * 2.8);
        break;
      case "petal":
        ctx.ellipse(0, 0, s * 0.65, s * 1.5, 0, 0, TAU);
        break;
      case "orb":
        ctx.arc(0, 0, s, 0, TAU);
        break;
      default:
        ctx.arc(0, 0, s, 0, TAU);
    }
    ctx.fill();
    ctx.restore();
  }
  function drawProjectile(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    const a = Math.atan2(p.vy, p.vx);
    ctx.rotate(a);
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.color2;
    ctx.lineWidth = 3;
    const s = p.size;
    if (typeof SHOTFX !== "undefined" && SHOTFX[p.shot]) {
      try {
        SHOTFX[p.shot](p);
      } catch (e) {
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, 7);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, 7);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawFighter(f) {
    const pulse = 1 + Math.sin(f.bob * 2) * 0.025,
      low = f.hp / f.max < 0.3;
    ctx.save();
    ctx.translate(f.x, f.y + Math.sin(f.bob) * 4);
    ctx.scale(pulse, pulse);
    ctx.font = font(f.def, clamp(W / 14, 31, 68));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = f.fx.c;
    ctx.shadowBlur = f.energy >= 100 ? 32 : 15;
    ctx.fillStyle = f.flash > 0 ? "#fff" : f.fx.c;
    ctx.globalAlpha = f.dead
      ? 0.25
      : f.iframe > 0
        ? 0.55 + Math.sin(f.iframe * 80) * 0.35
        : 1;
    if (low && !f.dead) ctx.translate(rnd(-2, 2), rnd(-2, 2));
    ctx.fillText(f.def.name, 0, 0);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = f.fx.c;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(f.x, f.y + 42, 60, 9, 0, 0, TAU);
    ctx.stroke();
    if (f.isLocal) {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = f.fx.c;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y - 54);
      ctx.lineTo(f.x - 7, f.y - 43);
      ctx.lineTo(f.x + 7, f.y - 43);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  function drawRing(r) {
    const p = r.t / r.life,
      rad = r.r * p;
    ctx.save();
    ctx.globalAlpha = (1 - p) * 0.9;
    ctx.strokeStyle = r.color;
    ctx.lineWidth = r.w * (1 - p * 0.65);
    ctx.translate(r.x, r.y);
    ctx.beginPath();
    if (["grid", "error", "arcade"].includes(r.kind)) {
      ctx.rect(-rad, -rad, rad * 2, rad * 2);
    } else if (["slash", "moon", "blizzard"].includes(r.kind)) {
      ctx.arc(0, 0, rad, -0.65, 0.65);
    } else if (["quake", "world", "continent", "seismic"].includes(r.kind)) {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU,
          rr = rad * (i % 2 ? 1 : 0.76);
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
    } else ctx.arc(0, 0, rad, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  function drawBolt(b) {
    ctx.save();
    ctx.globalAlpha = b.life / b.max;
    ctx.strokeStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 13;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    for (let i = 1; i < b.jag; i++) {
      const t = i / b.jag;
      ctx.lineTo(
        b.x1 + (b.x2 - b.x1) * t + rnd(-16, 16),
        b.y1 + (b.y2 - b.y1) * t + rnd(-16, 16),
      );
    }
    ctx.lineTo(b.x2, b.y2);
    ctx.stroke();
    ctx.restore();
  }
  function drawDmgNums() {
    ctx.save();
    ctx.textAlign = "center";
    for (const n of dmgNums) {
      const a = clamp(n.life / n.max, 0, 1),
        pop = 1 + clamp((n.max - n.life) * 6, 0, 0.45);
      ctx.globalAlpha = Math.min(1, a * 1.6);
      ctx.font = `${Math.round((n.ult ? 30 : n.crit ? 24 : 17) * pop)}px "Black Ops One"`;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(5,6,16,.9)";
      ctx.fillStyle = n.ult ? "#ff5f6d" : n.crit ? "#ffd34d" : "#ffffff";
      ctx.strokeText(n.txt, n.x, n.y);
      ctx.fillText(n.txt, n.x, n.y);
    }
    ctx.restore();
  }
  function drawUltimateOverlay(c) {
    const f = c.f,
      s = f.fx.sig,
      t = c.time,
      p = clamp(t / 0.7, 0, 1);
    ctx.save();
    ctx.globalAlpha = clamp(1 - Math.abs(t - 0.78) * 0.9, 0, 0.92);
    ctx.fillStyle = "rgba(0,0,0,.62)";
    ctx.fillRect(0, 0, W, H);
    ctx.translate(W / 2, H / 2);
    ctx.strokeStyle = f.fx.c;
    ctx.fillStyle = f.fx.c;
    ctx.shadowColor = f.fx.c;
    ctx.shadowBlur = 25;
    ctx.lineWidth = 4;
    const mode = s % 10,
      rr = 40 + p * Math.max(W, H) * 0.55;
    ctx.rotate(t * (s % 2 ? 1 : -1) * (1.5 + (s % 4)));
    if (mode === 0) {
      for (let i = 0; i < 8; i++) {
        ctx.rotate(TAU / 8);
        ctx.fillRect(rr * 0.22, -5, rr * 0.75, 10);
      }
    } else if (mode === 1) {
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (rr * (i + 1)) / 5, 0, TAU);
        ctx.stroke();
      }
    } else if (mode === 2) {
      for (let i = 0; i < 12; i++) {
        ctx.rotate(TAU / 12);
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(rr, 0);
        ctx.stroke();
      }
    } else if (mode === 3) {
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-rr, i * 26);
        ctx.lineTo(rr, i * 26 + Math.sin(t * 20 + i) * 22);
        ctx.stroke();
      }
    } else if (mode === 4) {
      for (let i = 0; i < 6; i++) {
        ctx.rotate(TAU / 6);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(rr, 0);
        ctx.lineTo(rr * 0.65, 18);
        ctx.closePath();
        ctx.fill();
      }
    } else if (mode === 5) {
      for (let i = 0; i < 8; i++) {
        ctx.strokeRect(
          -rr + i * 14,
          -rr + i * 14,
          (rr - i * 14) * 2,
          (rr - i * 14) * 2,
        );
      }
    } else if (mode === 6) {
      for (let i = 0; i < 7; i++) {
        ctx.rotate(0.8);
        ctx.beginPath();
        ctx.ellipse(rr * 0.45, 0, rr * 0.55, 25 + i * 5, 0, 0, TAU);
        ctx.stroke();
      }
    } else if (mode === 7) {
      for (let i = 0; i < 18; i++) {
        ctx.rotate(TAU / 18);
        ctx.beginPath();
        ctx.moveTo(rr * 0.25, -8);
        ctx.lineTo(rr, 0);
        ctx.lineTo(rr * 0.25, 8);
        ctx.fill();
      }
    } else if (mode === 8) {
      for (let i = 0; i < 10; i++) {
        ctx.rotate(TAU / 10);
        ctx.beginPath();
        ctx.arc(rr * 0.55, 0, 18 + i * 2, 0, TAU);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, rr * 0.65, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, rr * 0.38, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = clamp(1 - Math.abs(t - 0.76) * 1.1, 0, 1);
    ctx.textAlign = "center";
    ctx.font = `${clamp(W / 16, 24, 54)}px "Black Ops One"`;
    ctx.fillStyle = f.fx.c2;
    ctx.shadowColor = f.fx.c;
    ctx.shadowBlur = 25;
    ctx.fillText(f.def.ult.toUpperCase(), W / 2, H * 0.18);
    ctx.restore();
  }
  function drawMapBg() {
    const m = MAPS[currentMap];
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, m.bg1);
    g.addColorStop(1, m.bg2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // Map-specific ambient details
    ctx.save();
    ctx.globalAlpha = 0.5;
    if (currentMap === 0) {
      ctx.strokeStyle = m.accent;
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    } else if (currentMap === 1) {
      for (let i = 0; i < 80; i++) {
        const x = (i * 197) % W,
          y = (i * 331) % H;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, 2, 2);
      }
    } else if (currentMap === 2) {
      ctx.fillStyle = m.accent;
      for (let i = 0; i < 12; i++) {
        const x = (i * 167) % W;
        ctx.beginPath();
        ctx.moveTo(x, H);
        ctx.lineTo(x + 15, H - 80 - (i % 3) * 30);
        ctx.lineTo(x + 30, H);
        ctx.fill();
      }
    } else if (currentMap === 3) {
      ctx.fillStyle = m.accent;
      for (let i = 0; i < 20; i++) {
        const x = (i * 211) % W,
          y = H - ((i * 137) % (H / 3));
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 7);
        ctx.fill();
      }
    } else if (currentMap === 4) {
      ctx.strokeStyle = m.accent;
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        let x = (i * 199) % W,
          y = 0;
        ctx.beginPath();
        ctx.moveTo(x, y);
        while (y < H / 2) {
          y += 30;
          x += i % 2 ? 20 : -20;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function draw() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawMapBg();
    let zoom = 1 / MAPS[currentMap].mult,
      focusX = W / 2,
      focusY = H / 2;
    const cviz = cinematic || netUltFxs[0];
    if (cviz) {
      const p = clamp(cviz.time / 0.65, 0, 1);
      zoom = 1 + p * 0.22;
      focusX = cviz.t.x;
      focusY = cviz.t.y;
    }
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(
      -focusX + (focusX - W / 2) / zoom,
      -focusY + (focusY - H / 2) / zoom,
    );
    if (shake > 0.4) ctx.translate(rnd(-shake, shake), rnd(-shake, shake));
    ctx.globalCompositeOperation = "lighter";
    rings.forEach(drawRing);
    for (const p of particles) {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.size * 2;
      drawShape(p, clamp(p.life / p.max, 0, 1));
    }
    bolts.forEach(drawBolt);
    projectiles.forEach(drawProjectile);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    fighters.forEach(drawFighter);
    drawDmgNums();
    ctx.restore();
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(0.72, flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (cinematic || netUltFxs.length)
      drawUltimateOverlay(cinematic || netUltFxs[0]);
  }
  function pause() {
    if (netMode && netActive) return;
    if (mode !== "fight" && mode !== "cinematic") return;
    paused = true;
    $("paused").classList.remove("hidden");
    sfx("ui");
  }
  function resume() {
    paused = false;
    $("paused").classList.add("hidden");
    audioInit();
    last = performance.now();
  }
  function quit() {
    netCleanup();
    paused = false;
    mode = "select";
    fighters = [];
    $("paused").classList.add("hidden");
    $("result").classList.add("hidden");
    $("upgrade").classList.add("hidden");
    $("versus").classList.add("hidden");
    $("arenaScreen").classList.add("hidden");
    $("selectScreen").classList.remove("hidden");
  }
  function skipRound() {
    if (netMode || mode !== "fight" || roundEnd > 0) return;
    const a = fighters[0],
      b = fighters[1],
      sa = a.hp / a.max + Math.random() * 0.45,
      sb = b.hp / b.max + Math.random() * 0.45;
    hit(
      sa >= sb ? a : b,
      sa >= sb ? b : a,
      (sa >= sb ? b : a).hp + 50,
      true,
      true,
    );
  }
  function rematch() {
    $("result").classList.add("hidden");
    startMatch();
  }
  function frame(ts) {
    requestAnimationFrame(frame);
    const raw = Math.min(0.045, (ts - last) / 1000 || 0);
    last = ts;
    if (!paused && (mode === "fight" || mode === "cinematic")) {
      let dt = raw;
      if (hitstop > 0) {
        hitstop -= raw;
        dt = 0;
      } else if (slowmo > 0) {
        slowmo -= raw;
        dt = raw * 0.28;
      }
      if (mode === "cinematic") updateCinematic(dt);
      else if (netMode && !isHost) updateNetGuest(dt);
      else updateFight(dt);
      if (netUltFxs.length && mode === "fight") updateNetUltFx(dt);
    }
    if (!paused) draw();
  }
  function bindHold(id, kind) {
    const b = $(id);
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      audioInit();
      action[kind] = performance.now();
      b.setPointerCapture && b.setPointerCapture(e.pointerId);
    });
  }
  const jp = $("joystickPad"),
    jk = $("joystickKnob");
  function joyMove(e) {
    const r = jp.getBoundingClientRect(),
      dx = e.clientX - (r.left + r.width / 2),
      dy = e.clientY - (r.top + r.height / 2),
      m = Math.min(r.width * 0.34, Math.hypot(dx, dy)),
      a = Math.atan2(dy, dx);
    joy.dx = (Math.cos(a) * m) / (r.width * 0.34);
    joy.dy = (Math.sin(a) * m) / (r.height * 0.34);
    jk.style.transform = `translate(${joy.dx * 34}px,${joy.dy * 34}px)`;
  }
  jp.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    audioInit();
    joy.active = true;
    joy.id = e.pointerId;
    jp.setPointerCapture(e.pointerId);
    joyMove(e);
  });
  jp.addEventListener("pointermove", (e) => {
    if (joy.active && e.pointerId === joy.id) joyMove(e);
  });
  function joyEnd(e) {
    if (e.pointerId !== joy.id) return;
    joy.active = false;
    joy.dx = joy.dy = 0;
    jk.style.transform = "translate(0,0)";
  }
  jp.addEventListener("pointerup", joyEnd);
  jp.addEventListener("pointercancel", joyEnd);
  $("randomBtn").onclick = randomRivals;
  $("fightBtn").onclick = startMatch;
  $("menuSound").onclick = toggleSound;
  $("soundBtn").onclick = toggleSound;
  $("pauseBtn").onclick = pause;
  $("pauseTop").onclick = pause;
  $("resumeBtn").onclick = resume;
  $("quitBtn").onclick = quit;
  $("skipBtn").onclick = skipRound;
  $("versus").addEventListener("pointerdown", (e) => {
    if (e.target.id !== "vsSkip") $("vsSkip").classList.remove("hidden");
  });
  $("vsSkip").onclick = (e) => {
    e.stopPropagation();
    sfx("ui");
    if (netMode && !isHost) return;
    vsGo();
  };
  $("rematchBtn").onclick = rematch;
  $("newFightBtn").onclick = quit;
  bindHold("attackControl", "attack");
  bindHold("dashControl", "dash");
  bindHold("ultControl", "ult");
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
  window.addEventListener("keydown", (e) => {
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (
      [
        "w",
        "a",
        "s",
        "d",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        " ",
        "shift",
        "e",
      ].includes(k)
    )
      e.preventDefault();
    keys.add(k);
    if (k === " ") {
      action.attack = performance.now();
    }
    if (k === "shift") action.dash = performance.now();
    if (k === "e") action.ult = performance.now();
    if (k === "escape") {
      if (paused) resume();
      else pause();
    }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
  /* ================= ONLINE MULTIPLAYER (PeerJS public cloud, host-authoritative) ================= */
  let netMode = false,
    isHost = false,
    netActive = false;
  let netName = "";
  let netRoomPeer = null,
    netRoomCode = "";
  let netRoom = null;
  let netRemoteIn = { x: 0, y: 0, a: 0, d: 0, u: 0 };
  let netLocalName = "",
    netRemoteName = "",
    netHostPick = null,
    netGuestPick = null,
    netOwnPick = null,
    netOppPick = null;
  let snapCurr = null,
    netSeq = 0;
  let netUltFxs = [];
  let netSnapTimer = null,
    netInputTimer = null;
  function netSan(s) {
    return (
      String(s || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 16) || "player"
    );
  }
  function netPid(name) {
    return "ffa-" + netSan(name);
  }
  function netMe() {
    return { name: netName };
  }
  function netSaveId() {
    try {
      localStorage.setItem("ffa-id", JSON.stringify({ name: netName }));
    } catch (e) {
      console.warn("[netSaveId]", e);
    }
  }
  function netLoadId() {
    try {
      const o = JSON.parse(localStorage.getItem("ffa-id") || "null");
      if (o && o.name) {
        let nm = String(o.name).slice(0, 16);
        if (!/\d/.test(nm) && o.code) nm = (nm + o.code).slice(0, 16);
        if (!/\d/.test(nm))
          nm = (
            nm.slice(0, 12) +
            (o.code || Math.floor(Math.random() * 9000 + 1000))
          ).slice(0, 16);
        netName = nm;
        netSaveId();
        return;
      }
    } catch (e) {
      console.warn("[netLoadId]", e);
    }
    netName = "Fighter" + Math.floor(Math.random() * 900 + 100);
    netSaveId();
  }
  function netValidateName() {
    const v = $("netNameInput").value.trim();
    const ok = /\d/.test(v);
    $("netNameInput").classList.toggle("bad", !ok);
    $("nameHint").classList.toggle("show", !ok);
    return ok;
  }
  function netIdLine() {
    $("netIdLine").innerHTML = "✓ <b>" + netName + "</b>";
    const ni = $("netNameInput");
    if (ni && document.activeElement !== ni) ni.value = netName;
    const rn = $("roomMyName");
    if (rn) rn.textContent = netName;
  }
  /* V4.0: Room-code multiplayer. No friends list — host makes a 4-digit room, guest dials it. */
  let netLogBuf = [];
  function netLog() {
    try {
      const m = "[FF] " + [].slice.call(arguments).join(" ");
      console.log(m);
      netLogBuf.push(new Date().toLocaleTimeString() + m);
      if (netLogBuf.length > 40) netLogBuf.shift();
      const lv = $("logView");
      if (lv && !lv.classList.contains("hidden"))
        lv.textContent = netLogBuf.join("\n");
    } catch (e) {
      console.warn("[netLog]", e);
    }
  }
  function netToggleLog() {
    const lv = $("logView");
    if (!lv) return;
    lv.classList.toggle("hidden");
    if (!lv.classList.contains("hidden"))
      lv.textContent = netLogBuf.join("\n") || "(no logs yet)";
  }
  function iceCfg() {
    return {
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun.relay.metered.ca:80" },
          {
            urls: "turn:us-central.relay.metered.ca:80",
            username: "6da69f246311efa4ffa37b8d",
            credential: "4l3OjkferhQxArjs",
          },
          {
            urls: "turn:us-central.relay.metered.ca:80?transport=tcp",
            username: "6da69f246311efa4ffa37b8d",
            credential: "4l3OjkferhQxArjs",
          },
          {
            urls: "turn:us-central.relay.metered.ca:443",
            username: "6da69f246311efa4ffa37b8d",
            credential: "4l3OjkferhQxArjs",
          },
          {
            urls: "turns:us-central.relay.metered.ca:443?transport=tcp",
            username: "6da69f246311efa4ffa37b8d",
            credential: "4l3OjkferhQxArjs",
          },
        ],
      },
    };
  }
  function netSend(msg) {
    if (netRoom && netRoom.conn && netRoom.conn.open) {
      try {
        netRoom.conn.send(msg);
        return true;
      } catch (e) {
        console.warn("[netSend]", e);
      }
    }
    return false;
  }
  function netRoomSend(msg) {
    return netSend(msg);
  }
  function roomKillPeer() {
    if (netRoomPeer) {
      try {
        netRoomPeer.destroy();
      } catch (e) {
        console.warn("[roomKillPeer]", e);
      }
      netRoomPeer = null;
    }
  }
  function roomMenu() {
    $("roomScreen").classList.add("hidden");
    if (!netRoom) $("friendsPanel").classList.remove("hidden");
    netIdLine();
  }
  function roomCreate() {
    if (netRoom) {
      netPopup("In a room", "Leave the current room first.", null, null, true);
      return;
    }
    if (!netValidateName()) {
      netPopup(
        "Name",
        "Your fighter name needs a number in it.",
        null,
        null,
        true,
      );
      return;
    }
    if (typeof Peer === "undefined") {
      netPopup("Offline", "Networking unavailable.", null, null, true);
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    netLog("roomCreate: code", code);
    roomKillPeer();
    netPopup(
      "Creating",
      "Making room " + code + "…",
      () => {
        roomKillPeer();
        roomMenu();
      },
      null,
      true,
    );
    netRoomPeer = new Peer("ffa-room-" + code, iceCfg());
    let opened = false;
    const openT = setTimeout(() => {
      if (!opened) {
        roomKillPeer();
        netPopup(
          "Room",
          "Lobby server not answering. Check your connection and try again.",
          () => roomMenu(),
          null,
          true,
        );
      }
    }, 10000);
    netRoomPeer.on("open", () => {
      opened = true;
      clearTimeout(openT);
      netLog("roomCreate: peer open, room ffa-room-" + code + " live");
      $("netPopup").classList.add("hidden");
      netRoomCode = code;
      isHost = true;
      netRoom = {
        roomId: code,
        conn: null,
        hostName: netName,
        guestName: null,
        hostPick: null,
        guestPick: null,
        hostReady: false,
        guestReady: false,
        hostBan: null,
        guestBan: null,
        pending: true,
      };
      $("friendsPanel").classList.add("hidden");
      netShowRoom(true);
      $("roomCodeBig").classList.remove("hidden");
      $("roomCodeVal").textContent = code;
      $("roomStatus").innerHTML =
        'Share the code — waiting for your rival<span class="waiting-dots"></span>';
    });
    netRoomPeer.on("connection", roomAttachGuest);
    netRoomPeer.on("error", (e) => {
      if (e && e.type === "unavailable-id") roomCreate();
      else
        netPopup(
          "Room",
          "Could not create the room. Try again.",
          () => roomMenu(),
          null,
          true,
        );
    });
  }
  function roomJoin(code) {
    code = String(code || "")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (code.length !== 4) {
      netPopup("Code", "Enter the 4-digit room code.", null, null, true);
      return;
    }
    if (!netValidateName()) {
      netPopup(
        "Name",
        "Your fighter name needs a number in it.",
        null,
        null,
        true,
      );
      return;
    }
    if (netRoom) {
      netPopup("In a room", "Leave the current room first.", null, null, true);
      return;
    }
    if (typeof Peer === "undefined") {
      netPopup("Offline", "Networking unavailable.", null, null, true);
      return;
    }
    roomKillPeer();
    let joined = false,
      opened = false;
    const fail = (t, tx) => {
      $("netPopup").classList.add("hidden");
      roomKillPeer();
      netRoom = null;
      netPopup(t, tx, () => roomMenu(), null, true);
    };
    netPopup(
      "Joining",
      "Dialing room " + code + "…",
      () => {
        fail("Cancelled", "Join cancelled.", () => roomMenu());
      },
      null,
      true,
    );
    netLog("roomJoin: dialing ffa-room-" + code);
    netRoomPeer = new Peer(iceCfg());
    const openT = setTimeout(() => {
      if (!opened) {
        netLog("roomJoin: peer open TIMEOUT");
        fail(
          "Room",
          "Lobby server not answering. Check your connection and try again.",
        );
      }
    }, 10000);
    netRoomPeer.on("open", () => {
      opened = true;
      clearTimeout(openT);
      netLog("roomJoin: peer open, dialing");
      const c = netRoomPeer.connect("ffa-room-" + code, { reliable: true });
      isHost = false;
      netRoom = {
        roomId: code,
        conn: c,
        hostName: null,
        guestName: netName,
        hostPick: null,
        guestPick: null,
        hostReady: false,
        guestReady: false,
        hostBan: null,
        guestBan: null,
        pending: true,
      };
      c.on("open", () => {
        joined = true;
        netLog("roomJoin: conn OPEN");
        $("netPopup").classList.add("hidden");
        $("friendsPanel").classList.add("hidden");
        netSend({ t: "room-hello", from: netMe(), pick: netOwnPick });
        netShowRoom(false);
      });
      try {
        const pc = c.peerConnection;
        if (pc) {
          netLog("roomJoin: ICE state", pc.iceConnectionState);
          pc.oniceconnectionstatechange = () =>
            netLog("roomJoin: ICE ->", pc.iceConnectionState);
        }
      } catch (e) {
        console.warn("[roomJoin ICE]", e);
      }
      c.on("data", (d) => netOnRoomMsg(d));
      c.on("close", () => {
        netLog("roomJoin: conn closed/error before open");
        if (!joined) fail("Room", "Room not found. Check the code.");
        else netOpponentGone();
      });
      c.on("error", () => {
        if (!joined) fail("Room", "Room not found. Check the code.");
      });
      setTimeout(() => {
        if (!joined && netRoom && !isHost)
          fail("Room", "No answer. Check the code.");
      }, 10000);
    });
    netRoomPeer.on("error", (e) => {
      if (!joined && e && e.type === "peer-unavailable")
        fail("Room", "Room not found. Check the code.");
    });
  }
  function roomAttachGuest(c) {
    if (!netRoom || netRoom.conn) {
      netLog("roomAttachGuest: rejected (busy)");
      try {
        c.close();
      } catch (e) {
        console.warn("[roomAttachGuest]", e);
      }
      return;
    }
    netLog("roomAttachGuest: guest conn from", c.peer);
    netRoom.conn = c;
    netRoom.pending = false;
    try {
      const pc = c.peerConnection;
      if (pc) {
        netLog("roomAttachGuest: ICE state", pc.iceConnectionState);
        pc.oniceconnectionstatechange = () =>
          netLog("roomAttachGuest: ICE ->", pc.iceConnectionState);
      }
    } catch (e) {
      console.warn("[roomAttachGuest ICE]", e);
    }
    c.on("open", () => netLog("roomAttachGuest: conn OPEN"));
    c.on("data", (d) => netOnRoomMsg(d));
    c.on("close", () => {
      netLog("roomAttachGuest: conn closed");
      netOpponentGone();
    });
    c.on("error", (e) => {
      netLog("roomAttachGuest: conn error", e && e.type);
    });
  }
  function roomReclaim() {
    if (!isHost || !netRoom || !netRoomCode) return;
    const code = netRoomCode;
    roomKillPeer();
    $("roomStatus").textContent = "Reclaiming room…";
    netRoomPeer = new Peer("ffa-room-" + code, iceCfg());
    netRoomPeer.on("open", () => {
      netRoomPeer.on("connection", roomAttachGuest);
      if (netRoom.conn) {
        netRoom.conn = null;
        netRoom.guestName = null;
        netRoom.guestPick = null;
        netRoom.guestReady = false;
      }
      $("roomStatus").innerHTML =
        'Share the code — waiting for your rival<span class="waiting-dots"></span>';
      netRenderRoom();
      netPopup(
        "Room live",
        "Room " + code + " is live again. Your rival can join now.",
        null,
        null,
        true,
      );
    });
    netRoomPeer.on("error", (e) => {
      if (e && e.type === "unavailable-id") {
        netRoom = null;
        roomCreate();
      } else
        $("roomStatus").textContent = "Reclaim failed — hit Create room again.";
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    if (
      isHost &&
      netRoom &&
      netRoomCode &&
      (!netRoomPeer || netRoomPeer.disconnected)
    )
      roomReclaim();
    else if (!isHost && netRoom && netRoom.conn && !netRoom.conn.open)
      netPopup(
        "Lost",
        "Connection lost. Rejoin room " + netRoom.roomId + ".",
        () => {
          netToSelect();
          roomMenu();
        },
        null,
        true,
      );
  });
  function roomCopyCode() {
    const t = netRoomCode || "";
    if (!t) return;
    const done = () => {
      const b = $("copyCodeBtn");
      if (b) {
        b.textContent = "Copied!";
        setTimeout(() => {
          b.textContent = "Copy";
        }, 1200);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard
        .writeText(t)
        .then(done)
        .catch(() => done());
    else done();
  }
  let npA = null,
    npD = null;
  function netPopup(title, text, onA, onD, info) {
    $("npTitle").textContent = title;
    $("npText").textContent = text;
    npA = onA || null;
    npD = onD || null;
    $("npAccept").textContent = info ? "OK" : "Accept";
    $("npDecline").style.display = info ? "none" : "";
    $("netPopup").classList.remove("hidden");
  }
  function roomStateMsg() {
    return {
      t: "room-state",
      host: {
        name: netRoom.hostName,
        pick: netRoom.hostPick,
        ready: netRoom.hostReady,
        ban: netRoom.hostBan,
      },
      guest: {
        name: netRoom.guestName,
        pick: netRoom.guestPick,
        ready: netRoom.guestReady,
        ban: netRoom.guestBan,
      },
    };
  }
  function netOnRoomMsg(d) {
    if (!d || typeof d !== "object" || !netRoom) return;
    switch (d.t) {
      case "room-hello":
        if (!isHost) break;
        netRoom.guestName = d.from.name;
        netRoom.guestPick = d.pick == null ? null : d.pick;
        netRoom.guestBan = d.ban || null;
        netRoom.pending = false;
        netRoomSend(roomStateMsg());
        netRenderRoom();
        sfx("ui");
        break;
      case "room-state":
        if (isHost) break;
        netRoom.hostName = d.host.name;
        netRoom.hostPick = d.host.pick;
        netRoom.hostReady = !!d.host.ready;
        netRoom.hostBan = d.host.ban || null;
        netRoom.guestPick = d.guest.pick;
        netRoom.guestReady = !!d.guest.ready;
        netRoom.guestBan = d.guest.ban || null;
        netRenderRoom();
        break;
      case "pick":
        if (!isHost || !netRoom) break;
        netRoom.guestPick = d.pick;
        netRenderRoom();
        netRoomSend(roomStateMsg());
        break;
      case "ready":
        if (!isHost || !netRoom) break;
        netRoom.guestReady = !!d.ready;
        netRenderRoom();
        netRoomSend(roomStateMsg());
        netMaybeStart();
        break;
      case "fight-start":
        netGuestFightStart(d);
        break;
      case "versus":
        netShowVersusGuest(d.round);
        break;
      case "begin":
        netBeginGuest();
        break;
      case "in":
        if (netMode && isHost) {
          netRemoteIn.x = +d.x || 0;
          netRemoteIn.y = +d.y || 0;
          netRemoteIn.a = d.a ? 1 : 0;
          netRemoteIn.d = d.d ? 1 : 0;
          netRemoteIn.u = d.u ? 1 : 0;
        }
        break;
      case "ult-fx": {
        if (!fighters.length || !netRoom) break;
        const li = isHost ? (d.by === "host" ? 0 : 1) : d.by === "host" ? 1 : 0;
        var eU = netUltFxs.find((u) => u.predicted && u.f === fighters[li]);
        if (eU) {
          eU.predicted = false;
          break;
        }
        netUltFxs.push({
          f: fighters[li],
          t: fighters[1 - li],
          time: 0,
          hit: false,
          predicted: false,
        });
        ultFxSpawn(fighters[li]);
        break;
      }
      case "snap":
        snapCurr = d;
        break;
      case "result":
        netGuestResult(d);
        break;
      case "back-room":
        netToRoom(false);
        break;
      case "leave":
        netRoom = null;
        netPopup(
          "Opponent left",
          "They left the room.",
          () => netToSelect(),
          null,
          true,
        );
        break;
    }
  }
  function netShowRoom(asHost) {
    isHost = asHost;
    $("selectScreen").classList.add("hidden");
    $("arenaScreen").classList.add("hidden");
    $("friendsPanel").classList.add("hidden");
    $("roomScreen").classList.remove("hidden");
    $("roomMeta").textContent = ""; // Redundant with ROOM CODE display below
    if (!asHost) $("roomCodeBig").classList.add("hidden");
    netRenderRoom();
  }
  function renderBanUI() {
    const btnsEl = $("banBtns");
    const statusEl = $("banStatus");
    if (!btnsEl || !netRoom) return;
    const elements = ["Fire", "Nature", "Light", "Cosmic", "Shadow", "Storm", "Ice"];
    const myBan = isHost ? netRoom.hostBan : netRoom.guestBan;
    const opBan = isHost ? netRoom.guestBan : netRoom.hostBan;
    btnsEl.innerHTML = "";
    elements.forEach((el) => {
      const b = document.createElement("button");
      b.className = "ban-btn";
      b.textContent = el;
      b.type = "button";
      if (el === myBan) {
        b.classList.add("banned");
        b.textContent = el + " (YOU BANNED)";
      } else if (el === opBan) {
        b.classList.add("banned");
        b.disabled = true;
        b.textContent = el + " (BANNED)";
      } else if (opBan && myBan) {
        b.disabled = true;
      }
      if (!myBan && el !== opBan) {
        b.onclick = () => netBan(el);
      } else {
        b.disabled = true;
      }
      // Element color
      const e = ELEMENTS[el];
      if (e && !b.classList.contains("banned")) {
        b.style.borderColor = e.color + "55";
      }
      btnsEl.appendChild(b);
    });
    // Status text
    if (!myBan && !opBan) statusEl.textContent = "Both players ban one element.";
    else if (myBan && !opBan) statusEl.textContent = "Waiting for rival to ban…";
    else if (!myBan && opBan) statusEl.textContent = "Rival banned " + opBan + ". Your turn!";
    else statusEl.textContent = "Bans locked: " + myBan + " & " + opBan;
  }
  function netRenderRoom() {
    if (!netRoom || $("roomScreen").classList.contains("hidden")) return;
    // Render ban buttons
    renderBanUI();
    const L = isHost ? netRoom.hostName : netRoom.guestName;
    const Rr = isHost ? netRoom.guestName : netRoom.hostName;
    $("roomNameL").textContent = L;
    $("roomNameR").textContent = Rr || "…";
    const myPick = isHost ? netRoom.hostPick : netRoom.guestPick;
    const opPick = isHost ? netRoom.guestPick : netRoom.hostPick;
    const myReady = isHost ? netRoom.hostReady : netRoom.guestReady;
    const opReady = isHost ? netRoom.guestReady : netRoom.hostReady;
    buildRoomRoster($("roomRosterL"), myPick, true);
    // Rival roster removed (blind pick) - just show status
    const pl = $("roomPickL"),
      pr = $("roomPickR");
    if (myPick != null) {
      const d = R[myPick],
        e = ELEMENTS[d.element];
      pl.querySelector(".rps-word").textContent = d.name;
      pl.querySelector(".rps-word").style.cssText =
        `font-family:"${d.font}";color:${e.color}`;
    } else {
      pl.querySelector(".rps-word").textContent = "?";
      pl.querySelector(".rps-word").style.cssText = "";
    }
    // BLIND PICK: hide opponent's fighter until VS screen
    if (opPick != null) {
      pr.querySelector(".rps-word").textContent = "LOCKED IN";
      pr.querySelector(".rps-word").style.cssText =
        "font-family:system-ui;color:#8a9bc0;letter-spacing:2px";
    } else {
      pr.querySelector(".rps-word").textContent = "?";
      pr.querySelector(".rps-word").style.cssText = "";
    }
    const myBan = isHost ? netRoom.hostBan : netRoom.guestBan;
    const rl = $("readyL");
    rl.querySelector(".ready-main").textContent = myReady ? "READY!" : "READY";
    rl.querySelector(".ready-sub").textContent = myReady ? "you're locked in" : myBan == null ? "ban an element first" : myPick == null ? "pick your fighter" : "lock in your fighter";
    rl.classList.toggle("on", !!myReady);
    rl.disabled = myPick == null || myBan == null;
    const rr = $("readyR");
    rr.textContent = opReady ? "RIVAL READY!" : opPick != null ? "RIVAL LOCKED IN" : "WAITING";
    rr.classList.toggle("on", !!opReady);
    const myBan2 = isHost ? netRoom.hostBan : netRoom.guestBan;
    const opBan2 = isHost ? netRoom.guestBan : netRoom.hostBan;
    let st = "Pick your fighter.";
    if (myBan2 == null) st = "Ban an element first!";
    else if (opBan2 == null) st = "Waiting for opponent to ban…";
    else if (myPick != null && opPick == null) st = "Waiting for opponent to pick…";
    else if (myPick != null && opPick != null && !(myReady && opReady))
      st = "Press READY when set.";
    else if (myReady && opReady)
      st = isHost ? "Both ready — starting!" : "Both ready!";
    $("roomStatus").textContent = st;
  }
  function buildRoomRoster(root, pickId, interactive) {
    root.innerHTML = "";
    const banned = [];
    if (netRoom) {
      if (netRoom.hostBan) banned.push(netRoom.hostBan);
      if (netRoom.guestBan) banned.push(netRoom.guestBan);
    }
    R.forEach((d, idx) => {
      const el = ELEMENTS[d.element],
        b = document.createElement("button");
      const isBanned = banned.includes(d.element);
      // BLIND PICK: don't highlight opponent's pick
      b.className =
        "room-card" +
        (pickId === d.id && interactive ? " mine" : "") +
        (interactive ? "" : " locked") +
        (isBanned ? " banned" : "");
      if (isBanned) b.disabled = true;
      b.style.animation = "cardIn .3s ease backwards";
      b.style.animationDelay = idx * 12 + "ms";
      b.type = "button";
      const w = document.createElement("span");
      w.className = "rw";
      w.style.fontFamily = "'" + d.font + "',system-ui";
      w.style.color = el.color;
      w.textContent = d.name;
      const m = document.createElement("span");
      m.className = "re";
      m.textContent = d.element + " · " + d.hp + "/" + d.atk + "/" + d.spd;
      b.appendChild(w);
      b.appendChild(m);
      if (interactive) b.onclick = () => netPick(d.id);
      root.appendChild(b);
    });
  }
  function netPick(id) {
    if (!netRoom) return;
    // Can't pick a banned element's fighter
    const d = R[id];
    const myBan = isHost ? netRoom.hostBan : netRoom.guestBan;
    const opBan = isHost ? netRoom.guestBan : netRoom.hostBan;
    if (d.element === myBan || d.element === opBan) {
      sfx("deny");
      return;
    }
    if (isHost) {
      netRoom.hostPick = id;
      netRoomSend(roomStateMsg());
    } else {
      netRoom.guestPick = id;
      netOwnPick = id;
      netRoomSend({ t: "pick", pick: id });
    }
    netRenderRoom();
    sfx("ui");
  }
  function netBan(element) {
    if (!netRoom) return;
    // Can't ban an element already banned by opponent
    const opBan = isHost ? netRoom.guestBan : netRoom.hostBan;
    if (element === opBan) {
      sfx("deny");
      return;
    }
    if (isHost) {
      netRoom.hostBan = element;
      netRoomSend(roomStateMsg());
    } else {
      netRoom.guestBan = element;
      netRoomSend({ t: "ban", element: element });
    }
    // Clear pick if it was from the banned element
    const myPick = isHost ? netRoom.hostPick : netRoom.guestPick;
    if (myPick != null && R[myPick].element === element) {
      if (isHost) netRoom.hostPick = null;
      else {
        netRoom.guestPick = null;
        netOwnPick = null;
      }
    }
    netRenderRoom();
    sfx("ui");
  }
  function netToggleReady() {
    if (!netRoom) return;
    if (isHost) {
      if (netRoom.hostPick == null || netRoom.hostBan == null) {
        sfx("deny");
        return;
      }
      netRoom.hostReady = !netRoom.hostReady;
      netRoomSend(roomStateMsg());
      netRenderRoom();
      netMaybeStart();
    } else {
      if (netRoom.guestPick == null || netRoom.guestBan == null) {
        sfx("deny");
        return;
      }
      netRoom.guestReady = !netRoom.guestReady;
      netRoomSend({ t: "ready", ready: netRoom.guestReady });
      netRenderRoom();
    }
  }
  function netMaybeStart() {
    if (
      isHost &&
      netRoom &&
      !netRoom.pending &&
      netRoom.hostPick != null &&
      netRoom.guestPick != null &&
      netRoom.hostReady &&
      netRoom.guestReady
    ) {
      netRoom.pending = "starting";
      setTimeout(() => {
        if (!netRoom) return;
        if (netRoom.hostReady && netRoom.guestReady) netStartFight();
        netRoom.pending = false;
      }, 600);
    }
  }
  function netStartFight() {
    netMode = true;
    isHost = true;
    netActive = true;
    netRemoteIn = { x: 0, y: 0, a: 0, d: 0, u: 0 };
    netHostPick = R[netRoom.hostPick];
    netGuestPick = R[netRoom.guestPick];
    netLocalName = netRoom.hostName;
    netRemoteName = netRoom.guestName;
    chosen = [netHostPick, netGuestPick];
    round = 1;
    wins = [0, 0];
    upgradeMods = [{}, {}];
    matchStats = {
      damage: [0, 0],
      hits: [0, 0],
      ults: [0, 0],
      crits: [0, 0],
      started: performance.now(),
    };
    $("roomScreen").classList.add("hidden");
    $("arenaScreen").classList.remove("hidden");
    showMapSelect((i) => {
      currentMap = i;
      resize();
      netRoomSend({
        t: "fight-start",
        hostPick: netRoom.hostPick,
        guestPick: netRoom.guestPick,
        hostName: netRoom.hostName,
        guestName: netRoom.guestName,
        round: 1,
        map: i,
      });
      showVersus();
    });
    if (netSnapTimer) clearInterval(netSnapTimer);
    netSnapTimer = setInterval(netSendSnap, 50);
  }
  function netGuestFightStart(d) {
    netMode = true;
    isHost = false;
    netActive = true;
    if (d.map != null) {
      currentMap = d.map;
      resize();
    }
    netOwnPick = R[d.guestPick];
    netOppPick = R[d.hostPick];
    netLocalName = d.guestName;
    netRemoteName = d.hostName;
    chosen = [netOwnPick, netOppPick];
    round = d.round || 1;
    wins = [0, 0];
    upgradeMods = [{}, {}];
    matchStats = {
      damage: [0, 0],
      hits: [0, 0],
      ults: [0, 0],
      crits: [0, 0],
      started: performance.now(),
    };
    $("roomScreen").classList.add("hidden");
    $("friendsPanel").classList.add("hidden");
    $("netPopup").classList.add("hidden");
    $("arenaScreen").classList.remove("hidden");
    netShowVersusGuest(round);
    if (netInputTimer) clearInterval(netInputTimer);
    netInputTimer = setInterval(netSendInput, 40);
  }
  function netShowVersusGuest(r) {
    round = r;
    showVersus(
      netOwnPick,
      netOppPick,
      "ONLINE BATTLE \u00b7 " + netLocalName + " VS " + netRemoteName,
      true,
    );
  }
  function netBeginGuest() {
    if (mode !== "versus") return;
    if (vsTimer) {
      clearTimeout(vsTimer);
      vsTimer = null;
    }
    $("versus").classList.add("hidden");
    resize();
    mode = "fight";
    paused = false;
    particles = [];
    projectiles = [];
    rings = [];
    bolts = [];
    logs = [];
    dmgNums = [];
    shake = 0;
    flash = 0;
    slowmo = 0;
    cinematic = null;
    netUltFxs = [];
    roundEnd = 0;
    snapCurr = null;
    fighters = [
      copyDef(netOwnPick, 0, { local: true }),
      copyDef(netOppPick, 1, { local: false }),
    ];
    snapCurr = null;
    setControlColors();
    updateHud();
    addLog("Online battle — you are " + netOwnPick.name);
    sfx("fight");
  }
  function applyRemoteInput(q, p, dt) {
    const r = netRemoteIn;
    moveFighter(q, r.x, r.y, dt);
    if (r.a) {
      basicAttack(q, p);
      r.a = 0;
    }
    if (r.d) {
      dashFighter(q, r.x, r.y);
      r.d = 0;
    }
    if (r.u) {
      if (q.energy >= 100) triggerUltimate(q, p);
      r.u = 0;
    }
  }
  function netSnapF(f) {
    return {
      x: Math.round(f.x * 10) / 10,
      y: Math.round(f.y * 10) / 10,
      hp: Math.round(f.hp * 10) / 10,
      max: f.max,
      energy: Math.round(f.energy),
      facing: f.facing,
      dead: f.dead ? 1 : 0,
      iframe: Math.round(f.iframe * 100) / 100,
      stun: Math.round(f.stun * 100) / 100,
    };
  }
  function netSendSnap() {
    if (!(netMode && isHost && netActive)) return;
    if (mode !== "fight" && mode !== "cinematic") return;
    if (!fighters.length) return;
    netRoomSend({
      t: "snap",
      seq: ++netSeq,
      round: round,
      wins: wins.slice(),
      h: netSnapF(fighters[0]),
      g: netSnapF(fighters[1]),
      proj: projectiles
        .slice(0, 24)
        .map((p) => ({
          x: Math.round(p.x),
          y: Math.round(p.y),
          vx: Math.round(p.vx),
          vy: Math.round(p.vy),
          color: p.color,
          color2: p.color2,
          size: p.size,
          shot: p.shot,
          shape: p.shape,
          motion: p.motion,
          age: Math.round((p.age || 0) * 100) / 100,
        })),
    });
  }
  function netSendInput() {
    if (!(netMode && !isHost && netActive && mode === "fight")) return;
    const v = playerVector();
    const wu = buf("ult") ? 1 : 0;
    if (
      wu &&
      fighters.length &&
      fighters[0].energy >= 100 &&
      !netUltFxs.some((u) => u.f === fighters[0])
    ) {
      netUltFxs.push({
        f: fighters[0],
        t: fighters[1],
        time: 0,
        hit: false,
        predicted: true,
      });
      ultFxSpawn(fighters[0]);
    }
    netRoomSend({
      t: "in",
      x: Math.round(v.x * 100) / 100,
      y: Math.round(v.y * 100) / 100,
      a: buf("attack") ? 1 : 0,
      d: buf("dash") ? 1 : 0,
      u: wu,
    });
    action.attack = 0;
    action.dash = 0;
    action.ult = 0;
  }
  function netApplySnap(f, s, k) {
    f.x += (s.x - f.x) * k;
    f.y += (s.y - f.y) * k;
    f.hp = s.hp;
    f.max = s.max;
    f.energy = s.energy;
    f.facing = s.facing;
    f.dead = !!s.dead;
    f.iframe = s.iframe || 0;
    f.stun = s.stun || 0;
  }
  function updateNetGuest(dt) {
    if (!snapCurr || fighters.length < 2) {
      updateFx(dt);
      return;
    }
    const s = snapCurr,
      f0 = fighters[0],
      f1 = fighters[1],
      k = 0.45;
    for (const f of fighters) {
      if (f._ph !== undefined && f.hp < f._ph - 0.5)
        dmgNums.push({
          x: f.x + rnd(-24, 24),
          y: f.y - 46,
          txt: Math.round(f._ph - f.hp),
          crit: false,
          ult: false,
          life: 0.85,
          max: 0.85,
          vy: -110,
        });
    }
    netApplySnap(f0, s.g, k);
    netApplySnap(f1, s.h, k);
    for (const f of fighters) f._ph = f.hp;
    projectiles = s.proj.map((o) => ({
      x: o.x,
      y: o.y,
      px: o.x,
      py: o.y,
      vx: o.vx,
      vy: o.vy,
      color: o.color,
      color2: o.color2,
      size: o.size,
      shot: o.shot,
      shape: o.shape,
      motion: o.motion,
      life: 1,
      age: o.age || 0,
      phase: 0,
      visual: true,
      source: f1,
      target: f0,
      dmg: 0,
      crit: false,
      homing: 0,
    }));
    for (const f of fighters) {
      f.flash = Math.max(0, f.flash - dt);
      f.bob += dt * 3;
      ambient(f, dt);
    }
    round = s.round;
    if (s.wins) wins = s.wins.slice();
    updateFx(dt);
    updateHud();
  }
  function afterRoundNet() {
    const champ = wins.findIndex((x) => x >= 2);
    if (champ >= 0) {
      if (netSnapTimer) {
        clearInterval(netSnapTimer);
        netSnapTimer = null;
      }
      netRoomSend({
        t: "result",
        winner: champ === 0 ? "host" : "guest",
        wins: wins.slice(),
        stats: {
          damage: matchStats.damage.slice(),
          hits: matchStats.hits.slice(),
          ults: matchStats.ults.slice(),
          crits: matchStats.crits.slice(),
        },
      });
      showResult(champ);
      return;
    }
    round++;
    netRoomSend({ t: "versus", round });
    showVersus();
  }
  function netGuestResult(d) {
    if (netInputTimer) {
      clearInterval(netInputTimer);
      netInputTimer = null;
    }
    wins = d.wins.slice();
    matchStats = {
      damage: d.stats.damage,
      hits: d.stats.hits,
      ults: d.stats.ults,
      crits: d.stats.crits,
      started: matchStats ? matchStats.started : performance.now(),
    };
    showResult(d.winner === "guest" ? 0 : 1);
  }
  function netResultUI() {
    $("rematchBtn").textContent = "Back to room";
    $("newFightBtn").style.display = "none";
    $("rematchBtn").onclick = () => netToRoom(true);
  }
  function netToRoom(send) {
    if (send) netRoomSend({ t: "back-room" });
    if (netSnapTimer) {
      clearInterval(netSnapTimer);
      netSnapTimer = null;
    }
    if (netInputTimer) {
      clearInterval(netInputTimer);
      netInputTimer = null;
    }
    netActive = false;
    mode = "room";
    netUltFxs = [];
    $("result").classList.add("hidden");
    $("arenaScreen").classList.add("hidden");
    $("versus").classList.add("hidden");
    $("roomScreen").classList.remove("hidden");
    if (netRoom) {
      netRoom.pending = false;
      netRoom.hostReady = false;
      netRoom.guestReady = false;
      if (isHost) netRoomSend(roomStateMsg());
      netRenderRoom();
    }
  }
  function netOpponentGone() {
    if (netSnapTimer) {
      clearInterval(netSnapTimer);
      netSnapTimer = null;
    }
    if (netInputTimer) {
      clearInterval(netInputTimer);
      netInputTimer = null;
    }
    netActive = false;
    netRoom = null;
    netUltFxs = [];
    netPopup(
      "Disconnected",
      "Opponent disconnected.",
      () => netToSelect(),
      null,
      true,
    );
  }
  function netLeaveRoom() {
    if (netRoom) netRoomSend({ t: "leave", from: netMe() });
    netToSelect();
  }
  function netToSelect() {
    netCleanup();
    [
      "roomScreen",
      "friendsPanel",
      "arenaScreen",
      "versus",
      "upgrade",
      "paused",
      "result",
      "netPopup",
    ].forEach((id) => $(id).classList.add("hidden"));
    $("selectScreen").classList.remove("hidden");
    mode = "select";
    fighters = [];
  }
  function netCleanup() {
    if (netSnapTimer) {
      clearInterval(netSnapTimer);
      netSnapTimer = null;
    }
    if (netInputTimer) {
      clearInterval(netInputTimer);
      netInputTimer = null;
    }
    roomKillPeer();
    netRoomCode = "";
    netMode = false;
    isHost = false;
    netActive = false;
    netRoom = null;
    snapCurr = null;
    netUltFxs = [];
    const cb = $("roomCodeBig");
    if (cb) cb.classList.add("hidden");
    netRemoteIn = { x: 0, y: 0, a: 0, d: 0, u: 0 };
    $("rematchBtn").textContent = "Rematch";
    $("rematchBtn").onclick = rematch;
    $("newFightBtn").style.display = "";
  }
  /* multiplayer UI wiring */
  $("friendsBtn").onclick = () => {
    audioInit();
    sfx("ui");
    roomMenu();
  };
  $("friendsClose").onclick = () => {
    $("friendsPanel").classList.add("hidden");
    sfx("ui");
  };
  $("createRoomBtn").onclick = () => {
    sfx("ui");
    roomCreate();
  };
  $("joinRoomBtn").onclick = () => {
    sfx("ui");
    roomJoin($("joinCode").value);
  };
  $("joinCode").addEventListener("keydown", (e) => {
    if (e.key === "Enter") roomJoin($("joinCode").value);
  });
  $("copyCodeBtn").onclick = () => {
    sfx("ui");
    roomCopyCode();
  };
  $("logBtn").onclick = () => {
    sfx("ui");
    netToggleLog();
  };
  $("readyL").onclick = netToggleReady;
  $("leaveRoomBtn").onclick = netLeaveRoom;
  $("npAccept").onclick = () => {
    $("netPopup").classList.add("hidden");
    sfx("ui");
    if (npA) {
      const f = npA;
      npA = null;
      f();
    }
  };
  $("npDecline").onclick = () => {
    $("netPopup").classList.add("hidden");
    sfx("ui");
    if (npD) {
      const f = npD;
      npD = null;
      f();
    }
  };
  $("netNameInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.target.blur();
  });
  $("netNameInput").addEventListener("input", netValidateName);
  $("netNameInput").addEventListener("change", () => {
    const v = $("netNameInput").value.trim().slice(0, 16);
    if (v && v !== netName) {
      if (!/\d/.test(v)) {
        netValidateName();
        sfx("ui");
        return;
      }
      netName = v;
      netSaveId();
      netIdLine();
      sfx("ui");
    } else netIdLine();
  });
  netLoadId();
  netIdLine();

  buildElemFilter();
  buildRoster();
  renderSelection();
  resize();
  requestAnimationFrame(frame);

/* VSFX - Cinematic VS screen particle system (Fire vs Storm) */
const VSFX = (function() {
  let canvas, ctx, W, H;
  let running = false;
  let rafId = null;
  let startTime = 0;
  let lastTime = 0;
  
  // FPS monitoring
  let fpsSamples = [];
  let particleScale = 1; // 1.0 = full, reduces if FPS drops
  
  // Particle pool
  const POOL_SIZE = 600;
  const pool = [];
  let poolIdx = 0;
  
  // Active particles
  const particles = [];
  
  // Lightning bolts (procedural)
  const bolts = [];
  
  // Plasma orbs
  const orbs = [];
  
  // Shockwaves
  const shockwaves = [];
  
  // Screen shake
  let shakeX = 0, shakeY = 0, shakeT = 0;
  
  // Flash
  let flashA = 0;
  let stormFlashA = 0;
  
  // Timers
  let fireballTimer = 0;
  let clashTimer = 0;
  let lightningTimer = 0;
  
  // Intro state
  let introT = 0;
  const INTRO_DUR = 1.5;
  
  // Text zones (no-clutter) - set via setTextZones()
  let textZones = [];
  
  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    
    // Pre-allocate pool
    for (let i = 0; i < POOL_SIZE; i++) {
      pool.push({
        x: 0, y: 0, vx: 0, vy: 0,
        life: 0, maxLife: 1,
        size: 1, color: '#fff',
        type: 'ember', layer: 0,
        alpha: 1, flicker: 0,
        trail: null
      });
    }
    
    // Init plasma orbs (storm)
    for (let i = 0; i < 4; i++) {
      orbs.push({
        x: Math.random(), y: 0.6 + Math.random() * 0.3,
        r: 12 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2,
        hue: 55 + Math.random() * 10 // yellow-ish
      });
    }
  }
  
  function resize() {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    W = canvas.width = r.width * (window.devicePixelRatio || 1);
    H = canvas.height = r.height * (window.devicePixelRatio || 1);
  }
  
  function setTextZones(zones) {
    // zones: [{x, y, w, h}] in canvas coords (0-1)
    textZones = zones;
  }
  
  function inTextZone(x, y) {
    // x,y in 0-1 coords
    for (const z of textZones) {
      if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) {
        return true;
      }
    }
    return false;
  }
  
  function spawn(type, x, y, opts) {
    opts = opts || {};
    // Get from pool (reuse)
    const p = pool[poolIdx];
    poolIdx = (poolIdx + 1) % POOL_SIZE;
    
    p.x = x; p.y = y;
    p.vx = opts.vx || 0; p.vy = opts.vy || 0;
    p.life = p.maxLife = opts.life || 1;
    p.size = opts.size || 2;
    p.color = opts.color || '#fff';
    p.type = type;
    p.layer = opts.layer || 0;
    p.alpha = opts.alpha || 1;
    p.flicker = opts.flicker || 0;
    
    particles.push(p);
    return p;
  }
  
  function updateFPS(dt) {
    fpsSamples.push(1 / dt);
    if (fpsSamples.length > 30) fpsSamples.shift();
    if (fpsSamples.length === 30) {
      const avg = fpsSamples.reduce((a, b) => a + b, 0) / 30;
      // Auto-scale: if below 50fps, reduce particles
      if (avg < 50 && particleScale > 0.4) {
        particleScale -= 0.1;
      } else if (avg > 58 && particleScale < 1) {
        particleScale += 0.05;
      }
    }
  }
  
  // === FIRE PARTICLES ===
  function spawnFireEmber(layer) {
    const target = Math.floor(280 * particleScale / 3); // ~93 per layer at full
    // Count current fire particles
    let count = 0;
    for (const p of particles) {
      if (p.type.startsWith('fire')) count++;
    }
    if (count >= target * 3) return;
    
    const x = Math.random(); // 0-1
    const y = 0.5 + Math.random() * 0.1; // Start near slash (middle)
    
    if (layer === 0) {
      // Back: tiny slow embers + smoke
      if (Math.random() < 0.7) {
        spawn('fire-back', x, y, {
          vx: (Math.random() - 0.5) * 0.02,
          vy: -0.05 - Math.random() * 0.05,
          life: 2 + Math.random() * 2,
          size: 1 + Math.random() * 2,
          color: Math.random() < 0.3 ? '#333' : '#ff6a00',
          alpha: 0.4,
          layer: 0
        });
      } else {
        // Smoke puff (dark, not additive - we'll draw it normally)
        spawn('smoke', x, y, {
          vx: (Math.random() - 0.5) * 0.01,
          vy: -0.03 - Math.random() * 0.02,
          life: 3 + Math.random() * 2,
          size: 20 + Math.random() * 30,
          color: '#1a1a1a',
          alpha: 0.3,
          layer: 0
        });
      }
    } else if (layer === 1) {
      // Mid: medium embers, flicker and shrink
      spawn('fire-mid', x, y, {
        vx: (Math.random() - 0.5) * 0.04,
        vy: -0.08 - Math.random() * 0.08,
        life: 1.5 + Math.random() * 1.5,
        size: 2 + Math.random() * 3,
        color: ['#ffaa00', '#ff8800', '#ff6600'][Math.floor(Math.random() * 3)],
        alpha: 0.8,
        flicker: 0.3,
        layer: 1
      });
    } else {
      // Front: large bright embers with trails
      spawn('fire-front', x, y, {
        vx: (Math.random() - 0.5) * 0.06,
        vy: -0.12 - Math.random() * 0.1,
        life: 1 + Math.random(),
        size: 3 + Math.random() * 4,
        color: ['#fff8d0', '#ffe080', '#ffaa00'][Math.floor(Math.random() * 3)],
        alpha: 1,
        flicker: 0.2,
        layer: 2
      });
    }
  }
  
  function spawnFireball() {
    // Fireball shoots off the slash, bursts into sparks
    const x = 0.3 + Math.random() * 0.4;
    const y = 0.5;
    const p = spawn('fireball', x, y, {
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.15,
      life: 0.8,
      size: 8,
      color: '#ffaa00',
      alpha: 1,
      layer: 2
    });
    p.burst = true;
  }
  
  // === STORM PARTICLES ===
  function spawnStormParticle(layer) {
    const target = Math.floor(280 * particleScale / 3);
    let count = 0;
    for (const p of particles) {
      if (p.type.startsWith('storm')) count++;
    }
    if (count >= target * 3) return;
    
    const x = Math.random();
    const y = 0.5 + Math.random() * 0.5; // Bottom half
    
    if (layer === 0) {
      // Back: slow drifting glow dust
      spawn('storm-back', x, y, {
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        life: 3 + Math.random() * 2,
        size: 1 + Math.random() * 2,
        color: '#aaccff',
        alpha: 0.3,
        layer: 0
      });
    } else if (layer === 1) {
      // Mid: fast zigzag sparks + rain streaks
      if (Math.random() < 0.6) {
        spawn('storm-spark', x, y, {
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          life: 0.3 + Math.random() * 0.3,
          size: 1 + Math.random() * 2,
          color: ['#ffffaa', '#aaffff', '#ffffff'][Math.floor(Math.random() * 3)],
          alpha: 0.9,
          layer: 1
        });
      } else {
        // Rain streak (diagonal)
        spawn('storm-rain', x, y, {
          vx: -0.05,
          vy: 0.3 + Math.random() * 0.2,
          life: 0.5,
          size: 1,
          color: '#88aaff',
          alpha: 0.4,
          layer: 1
        });
      }
    } else {
      // Front: bright sparks
      spawn('storm-front', x, y, {
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: 0.2 + Math.random() * 0.3,
        size: 2 + Math.random() * 2,
        color: '#ffffff',
        alpha: 1,
        layer: 2
      });
    }
  }
  
  function spawnLightning() {
    // Procedural branching lightning bolt
    const x = Math.random();
    const y = 0.55;
    const segments = [];
    let cx = x, cy = y;
    const targetX = x + (Math.random() - 0.5) * 0.3;
    const targetY = 0.95;
    
    // Main bolt
    const points = [{x: cx, y: cy}];
    const steps = 8 + Math.floor(Math.random() * 6);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      cx = x + (targetX - x) * t + (Math.random() - 0.5) * 0.08;
      cy = y + (targetY - y) * t;
      points.push({x: cx, y: cy});
      
      // Branch (30% chance)
      if (Math.random() < 0.3 && i < steps - 2) {
        const branch = [{x: cx, y: cy}];
        let bx = cx, by = cy;
        const bSteps = 3 + Math.floor(Math.random() * 3);
        const bDir = Math.random() < 0.5 ? -1 : 1;
        for (let j = 1; j <= bSteps; j++) {
          bx += bDir * (0.02 + Math.random() * 0.03);
          by += 0.03 + Math.random() * 0.04;
          branch.push({x: bx, y: by});
        }
        segments.push({points: branch, alpha: 0.6});
      }
    }
    segments.push({points: points, alpha: 1});
    
    bolts.push({
      segments: segments,
      life: 0.25,
      maxLife: 0.25,
      color: '#ffffff'
    });
    
    // Flash the storm half
    stormFlashA = 0.35;
  }
  
  // === SLASH & CLASH ===
  function spawnSlashSparks() {
    // Constant spray where fire and lightning meet (diagonal slash)
    for (let i = 0; i < 3; i++) {
      const t = Math.random();
      // Diagonal from top-right to bottom-left
      const x = 0.7 - t * 0.4 + (Math.random() - 0.5) * 0.05;
      const y = 0.2 + t * 0.6 + (Math.random() - 0.5) * 0.05;
      const isFire = Math.random() < 0.5;
      spawn('slash', x, y, {
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        life: 0.4 + Math.random() * 0.4,
        size: 1 + Math.random() * 2,
        color: isFire ? '#ff8800' : '#aaffff',
        alpha: 1,
        layer: 2
      });
    }
  }
  
  function doClash() {
    // Big clash: shockwave ring, screen shake, white flash
    shockwaves.push({
      x: 0.5, y: 0.5,
      r: 0, maxR: 0.6,
      life: 0.6, maxLife: 0.6,
      color: '#ffffff'
    });
    shakeT = 0.4;
    flashA = 0.5;
    
    // Burst of mixed sparks
    for (let i = 0; i < 30; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 0.2 + Math.random() * 0.3;
      spawn('slash', 0.5, 0.5, {
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.6 + Math.random() * 0.6,
        size: 2 + Math.random() * 3,
        color: Math.random() < 0.5 ? '#ffaa00' : '#aaffff',
        alpha: 1,
        layer: 2
      });
    }
  }
  
  // === UPDATE ===
  function update(dt) {
    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        // Fireball burst
        if (p.burst && p.type === 'fireball') {
          for (let j = 0; j < 15; j++) {
            const a = Math.random() * Math.PI * 2;
            spawn('fire-spark', p.x, p.y, {
              vx: Math.cos(a) * 0.15,
              vy: Math.sin(a) * 0.15 - 0.05,
              life: 0.5 + Math.random() * 0.5,
              size: 1 + Math.random() * 2,
              color: ['#ffaa00', '#ff6600', '#ffcc00'][Math.floor(Math.random() * 3)],
              alpha: 1,
              layer: 2
            });
          }
        }
        particles.splice(i, 1);
        continue;
      }
      
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      // Fire embers shrink as they rise
      if (p.type.startsWith('fire')) {
        const t = p.life / p.maxLife;
        p.size *= (0.99 + t * 0.01); // Shrink over time
      }
      
      // Flicker
      if (p.flicker > 0) {
        p.alpha = (p.alpha || 1) * (1 - p.flicker * Math.random());
      }
    }
    
    // Update bolts
    for (let i = bolts.length - 1; i >= 0; i--) {
      bolts[i].life -= dt;
      if (bolts[i].life <= 0) bolts.splice(i, 1);
    }
    
    // Update shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const s = shockwaves[i];
      s.life -= dt;
      s.r = (1 - s.life / s.maxLife) * s.maxR;
      if (s.life <= 0) shockwaves.splice(i, 1);
    }
    
    // Update shake
    if (shakeT > 0) {
      shakeT -= dt;
      const mag = shakeT * 20;
      shakeX = (Math.random() - 0.5) * mag;
      shakeY = (Math.random() - 0.5) * mag;
    } else {
      shakeX = shakeY = 0;
    }
    
    // Decay flashes
    flashA = Math.max(0, flashA - dt * 2);
    stormFlashA = Math.max(0, stormFlashA - dt * 3);
    
    // Update orbs (float)
    for (const o of orbs) {
      o.phase += dt * 2;
    }
    
    // Spawn timers
    fireballTimer -= dt;
    if (fireballTimer <= 0) {
      spawnFireball();
      fireballTimer = 0.8 + Math.random() * 0.4; // ~1s
    }
    
    clashTimer -= dt;
    if (clashTimer <= 0) {
      doClash();
      clashTimer = 2.5 + Math.random(); // ~3s
    }
    
    lightningTimer -= dt;
    if (lightningTimer <= 0) {
      spawnLightning();
      lightningTimer = 0.4 + Math.random() * 0.8;
    }
    
    // Continuous spawning
    for (let l = 0; l < 3; l++) {
      spawnFireEmber(l);
      spawnStormParticle(l);
    }
    spawnSlashSparks();
  }
  
  // === RENDER ===
  function render() {
    if (!ctx) return;
    
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    
    // Apply screen shake
    ctx.translate(shakeX * (W / 100), shakeY * (H / 100));
    
    // Additive blending for glow
    ctx.globalCompositeOperation = 'lighter';
    
    const dpr = window.devicePixelRatio || 1;
    
    // Draw particles (back to front by layer)
    const sorted = [...particles].sort((a, b) => a.layer - b.layer);
    for (const p of sorted) {
      const px = p.x * W;
      const py = p.y * H;
      const pr = p.size * dpr;
      
      // No-clutter zone: fade to 20% behind text
      let alpha = (p.life / p.maxLife) * (p.alpha || 1);
      if (inTextZone(p.x, p.y)) {
        alpha *= 0.2;
      }
      
      if (p.type === 'smoke') {
        // Smoke: normal blending, dark
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, pr * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
      } else {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow (larger, fainter circle)
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, pr * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    
    // Draw lightning bolts
    for (const b of bolts) {
      const alpha = b.life / b.maxLife;
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 3 * dpr;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#aaffff';
      ctx.shadowBlur = 15 * dpr;
      for (const seg of b.segments) {
        ctx.globalAlpha = alpha * seg.alpha;
        ctx.beginPath();
        seg.points.forEach((pt, idx) => {
          const px = pt.x * W;
          const py = pt.y * H;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
    
    // Draw plasma orbs with arcs
    for (let i = 0; i < orbs.length; i++) {
      const o = orbs[i];
      const ox = (o.x + Math.sin(o.phase) * 0.02) * W;
      const oy = o.y * H;
      const or_ = o.r * dpr;
      
      // Orb glow
      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, or_ * 2);
      grad.addColorStop(0, 'rgba(255,255,200,0.8)');
      grad.addColorStop(0.5, 'rgba(255,220,100,0.3)');
      grad.addColorStop(1, 'rgba(255,220,100,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ox, oy, or_ * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Arcs to next orb
      const next = orbs[(i + 1) % orbs.length];
      if (Math.random() < 0.3) { // Flicker
        const nx = (next.x + Math.sin(next.phase) * 0.02) * W;
        const ny = next.y * H;
        ctx.strokeStyle = '#ffffaa';
        ctx.lineWidth = 1.5 * dpr;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        const steps = 6;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const ax = ox + (nx - ox) * t + (Math.random() - 0.5) * 10 * dpr;
          const ay = oy + (ny - oy) * t + (Math.random() - 0.5) * 10 * dpr;
          if (s === 0) ctx.moveTo(ax, ay);
          else ctx.lineTo(ax, ay);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    // Draw slash (diagonal glowing line)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 * dpr;
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 20 * dpr;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(W * 0.7, H * 0.15);
    ctx.lineTo(W * 0.3, H * 0.85);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    // Draw shockwaves
    for (const s of shockwaves) {
      const alpha = s.life / s.maxLife;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 4 * dpr;
      ctx.globalAlpha = alpha * 0.8;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r * W, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Storm half flash
    if (stormFlashA > 0) {
      ctx.fillStyle = `rgba(255,255,255,${stormFlashA * 0.5})`;
      ctx.fillRect(0, H * 0.5, W, H * 0.5);
    }
    
    // Full flash
    if (flashA > 0) {
      ctx.fillStyle = `rgba(255,255,255,${flashA})`;
      ctx.fillRect(0, 0, W, H);
    }
    
    // Vignette (dark edges) - normal blending
    ctx.globalCompositeOperation = 'source-over';
    const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.3, W/2, H/2, Math.max(W,H)*0.7);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
    
    ctx.restore();
  }
  
  function loop(t) {
    if (!running) return;
    
    const dt = Math.min((t - lastTime) / 1000, 0.05); // Cap at 50ms
    lastTime = t;
    
    updateFPS(dt);
    update(dt);
    render();
    
    rafId = requestAnimationFrame(loop);
  }
  
  function start() {
    if (running) return;
    // Ensure canvas has dimensions (in case it was hidden on init)
    resize();
    if (W === 0 || H === 0) {
      // Retry next frame
      requestAnimationFrame(() => start());
      return;
    }
    running = true;
    startTime = performance.now();
    lastTime = startTime;
    introT = 0;
    // Initial clash for intro impact
    doClash();
    rafId = requestAnimationFrame(loop);
  }
  
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    particles.length = 0;
    bolts.length = 0;
    shockwaves.length = 0;
  }
  
  return {
    init: init,
    start: start,
    stop: stop,
    setTextZones: setTextZones,
    resize: resize
  };
})();

})();
