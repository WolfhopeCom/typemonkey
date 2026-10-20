/* ---------- TypeMonkey mascot (original character) ---------- */
/* ---------- TypeMonkey's wardrobe (bought in the shop) ---------- */
const FURS={
  orange:{name:"Classic orange",price:0,main:"#FF7A1A",dark:"#F26A0F",tuft:"#E05E08",face:"#FFD2A6"},
  gold:{name:"Golden",price:80,main:"#FFB703",dark:"#F49D00",tuft:"#E08A00",face:"#FFEFC2"},
  blue:{name:"Ocean blue",price:80,main:"#3D8BFF",dark:"#2C6FD6",tuft:"#2058B0",face:"#D8E8FF"},
  pink:{name:"Bubblegum",price:80,main:"#FF6FAE",dark:"#E8559A",tuft:"#C93E80",face:"#FFE3F0"},
  mint:{name:"Mint",price:100,main:"#2EC4A0",dark:"#1FA587",tuft:"#178A70",face:"#DCFFF5"},
  purple:{name:"Grape",price:100,main:"#9B6BFF",dark:"#7F4FE6",tuft:"#6538C4",face:"#EEE3FF"},
  cocoa:{name:"Cocoa",price:120,main:"#8A5A3C",dark:"#6E4429",tuft:"#583420",face:"#EBD3BF"},
  galaxy:{name:"Galaxy",price:250,main:"#2D2F6B",dark:"#22245A",tuft:"#7C5CFF",face:"#C9C3FF",stars:true},
  pumpkin:{name:"Pumpkin spice",price:90,season:"oct",main:"#E8731A",dark:"#B9520C",tuft:"#3F7D2C",face:"#FFE0B8"},
  snow:{name:"Snow monkey",price:90,season:"dec",main:"#F2F5F7",dark:"#CFD8DE",tuft:"#B6C3CC",face:"#FFE3E3"},
  rainbow:{name:"Rainbow",price:300,main:"url(#rb)",dark:"#7C5CFF",tuft:"#FF6FAE",face:"#FFF6D8",rainbow:true}
};
const HATS={
  none:{name:"No hat",price:0,svg:""},
  party:{name:"Party hat",price:40,svg:'<path d="M60 -12 L45 22 L75 22 Z" fill="#7C5CFF"/><path d="M52 6 L68 6 M49 14 L71 14" stroke="#FFD25C" stroke-width="3"/><circle cx="60" cy="-12" r="4.5" fill="#FF6FAE"/>'},
  cap:{name:"Coder cap",price:50,svg:'<path d="M28 26 Q30 -2 60 -2 Q90 -2 92 26 Z" fill="#1F9D63"/><path d="M60 26 L106 26 Q108 31 100 32 L60 32 Z" fill="#147A4B"/><circle cx="60" cy="-1" r="3" fill="#147A4B"/><text x="60" y="20" font-size="14" font-family="monospace" font-weight="bold" fill="#fff" text-anchor="middle">&lt;/&gt;</text>'},
  beanie:{name:"Cozy beanie",price:50,svg:'<path d="M26 28 Q28 -6 60 -6 Q92 -6 94 28 Z" fill="#E8554F"/><rect x="24" y="20" width="72" height="10" rx="5" fill="#C93E3A"/><circle cx="60" cy="-8" r="7" fill="#FFE3F0"/>'},
  crown:{name:"Royal crown",price:150,svg:'<path d="M36 22 L36 2 L46 12 L60 -6 L74 12 L84 2 L84 22 Z" fill="#FFC83D" stroke="#E0A400" stroke-width="2"/><circle cx="60" cy="10" r="3.5" fill="#E8554F"/><circle cx="46" cy="16" r="2.5" fill="#3D8BFF"/><circle cx="74" cy="16" r="2.5" fill="#3D8BFF"/>'},
  wizard:{name:"Wizard hat",price:120,svg:'<path d="M60 -14 L38 22 L82 22 Z" fill="#3B2D8C"/><path d="M26 24 Q60 14 94 24 Q60 30 26 24 Z" fill="#2A1F66"/><text x="54" y="8" font-size="9" fill="#FFD25C">★</text><text x="62" y="18" font-size="7" fill="#FFD25C">★</text>'},
  headphones:{name:"Headphones",price:90,svg:'<path d="M18 52 Q18 6 60 6 Q102 6 102 52" fill="none" stroke="#14201B" stroke-width="7"/><rect x="8" y="46" width="18" height="28" rx="8" fill="#FF7A1A" stroke="#14201B" stroke-width="3"/><rect x="94" y="46" width="18" height="28" rx="8" fill="#FF7A1A" stroke="#14201B" stroke-width="3"/>'},
  pirate:{name:"Pirate hat",price:80,svg:'<path d="M20 24 Q60 -16 100 24 Q60 12 20 24 Z" fill="#14201B"/><circle cx="60" cy="10" r="5.5" fill="#fff"/><path d="M56 16 L64 16" stroke="#fff" stroke-width="2"/><circle cx="58" cy="9" r="1.2" fill="#14201B"/><circle cx="62" cy="9" r="1.2" fill="#14201B"/>'},
  cowboy:{name:"Cowboy hat",price:80,svg:'<path d="M14 22 Q60 34 106 22 Q100 30 60 30 Q20 30 14 22 Z" fill="#8A5A3C"/><path d="M38 24 Q36 -2 50 0 Q60 6 70 0 Q84 -2 82 24 Z" fill="#A0693F"/><path d="M38 18 Q60 24 82 18 L82 23 Q60 29 38 23 Z" fill="#583420"/>'},
  grad:{name:"Graduation cap",price:110,svg:'<path d="M60 -6 L104 8 L60 22 L16 8 Z" fill="#14201B"/><path d="M38 14 L38 24 Q60 32 82 24 L82 14 L60 21 Z" fill="#22302A"/><path d="M98 10 L98 28" stroke="#FFC83D" stroke-width="2.5"/><circle cx="98" cy="30" r="3.5" fill="#FFC83D"/>'},
  witch:{name:"Witch hat",price:70,season:"oct",svg:'<path d="M66 -18 Q58 -6 52 0 L40 22 L80 22 Z" fill="#3B1F5C"/><path d="M18 24 Q60 12 102 24 Q60 32 18 24 Z" fill="#2A1544"/><rect x="42" y="16" width="36" height="5" fill="#E8731A"/>'},
  santa:{name:"Santa hat",price:70,season:"dec",svg:'<path d="M28 24 Q34 -8 74 -6 Q96 -2 100 22 Z" fill="#D7263D"/><rect x="24" y="18" width="72" height="11" rx="5.5" fill="#fff"/><circle cx="100" cy="24" r="7" fill="#fff"/>'},
  flower:{name:"Flower",price:40,svg:'<g transform="translate(84 18)"><circle r="6" cx="0" cy="-7" fill="#FF6FAE"/><circle r="6" cx="7" cy="0" fill="#FF6FAE"/><circle r="6" cx="0" cy="7" fill="#FF6FAE"/><circle r="6" cx="-7" cy="0" fill="#FF6FAE"/><circle r="5" fill="#FFD25C"/></g>'}
};
const EYES={
  round:{name:"Round glasses",price:0},
  none:{name:"No glasses",price:0},
  sun:{name:"Sunglasses",price:60},
  hearts:{name:"Heart glasses",price:70},
  stars:{name:"Star glasses",price:70},
  nerd:{name:"3D glasses",price:50},
  monocle:{name:"Fancy monocle",price:90},
  pixel:{name:"Pixel shades",price:100},
  mask:{name:"Spooky mask",price:60,season:"oct"}
};
const NECKS={
  none:{name:"Nothing",price:0,svg:""},
  bowtie:{name:"Bow tie",price:40,svg:'<path d="M60 98 L46 90 L46 106 Z M60 98 L74 90 L74 106 Z" fill="#E8554F"/><circle cx="60" cy="98" r="4" fill="#C93E3A"/>'},
  scarf:{name:"Striped scarf",price:60,svg:'<path d="M32 92 Q60 104 88 92 L88 102 Q60 114 32 102 Z" fill="#3D8BFF"/><path d="M40 96 L40 106 M52 99 L52 110 M64 99 L64 110 M76 96 L76 106" stroke="#fff" stroke-width="3"/><path d="M74 100 L80 118 L70 118 Z" fill="#3D8BFF"/>'},
  medal:{name:"Gold medal",price:100,svg:'<path d="M50 88 L56 104 M70 88 L64 104" stroke="#E8554F" stroke-width="4"/><circle cx="60" cy="108" r="9" fill="#FFC83D" stroke="#E0A400" stroke-width="2"/><text x="60" y="112" font-size="10" text-anchor="middle" fill="#8A5A00">★</text>'},
  cape:{name:"Hero cape",price:120,svg:'<path d="M30 90 Q60 104 90 90 L102 120 L18 120 Z" fill="#E8554F" opacity=".95"/><path d="M38 92 Q60 102 82 92" fill="none" stroke="#FFC83D" stroke-width="3"/><circle cx="60" cy="99" r="4" fill="#FFC83D"/>'},
  tie:{name:"Business tie",price:50,svg:'<path d="M56 92 L64 92 L62 98 L66 116 L60 122 L54 116 L58 98 Z" fill="#3D8BFF"/><path d="M56 92 L64 92 L62 98 L58 98 Z" fill="#2C6FD6"/>'},
  candy:{name:"Candy corn chain",price:40,season:"oct",svg:'<path d="M34 92 Q60 108 86 92" fill="none" stroke="#3F7D2C" stroke-width="2"/><path d="M52 98 L58 112 L64 98 Z" fill="#FFC83D"/><path d="M53.5 101 L62.5 101 L61 105 L55 105 Z" fill="#E8731A"/><path d="M52 98 L64 98 L63 100 L53 100 Z" fill="#fff"/>'},
  banana:{name:"Banana necklace",price:50,svg:'<path d="M36 92 Q60 108 84 92" fill="none" stroke="#8A5A3C" stroke-width="2"/><path d="M54 100 Q60 112 68 100 Q62 106 54 100 Z" fill="#FFC83D" stroke="#E0A400" stroke-width="1.5"/>'}
};
const PETS={
  none:{name:"No pet",price:0,svg:""},
  parrot:{name:"Polly the parrot",price:120,svg:'<ellipse cx="30" cy="40" rx="13" ry="16" fill="#2EC4A0"/><ellipse cx="30" cy="44" rx="7" ry="10" fill="#FFE08A"/><path d="M18 40 Q8 52 14 58 L22 48 Z" fill="#1FA587"/><circle cx="30" cy="20" r="11" fill="#E8554F"/><path d="M38 20 L47 24 L38 27 Z" fill="#FFC83D"/><circle cx="33" cy="17" r="2.6" fill="#14201B"/><circle cx="34" cy="16" r=".9" fill="#fff"/>'},
  kitten:{name:"Pixel the kitten",price:120,svg:'<path d="M12 22 L16 6 L26 16 Z M48 22 L44 6 L34 16 Z" fill="#9AA4AC"/><circle cx="30" cy="30" r="18" fill="#B6C0C8"/><ellipse cx="30" cy="54" rx="14" ry="6" fill="#B6C0C8"/><circle cx="23" cy="28" r="3" fill="#14201B"/><circle cx="37" cy="28" r="3" fill="#14201B"/><path d="M28 34 L32 34 L30 36.5 Z" fill="#FF8FB0"/><path d="M10 34 L20 35 M10 39 L20 37 M50 34 L40 35 M50 39 L40 37" stroke="#7D878F" stroke-width="1.3"/>'},
  puppy:{name:"Byte the puppy",price:140,svg:'<circle cx="30" cy="30" r="18" fill="#C98A4B"/><ellipse cx="13" cy="30" rx="6" ry="13" fill="#8A5A3C"/><ellipse cx="47" cy="30" rx="6" ry="13" fill="#8A5A3C"/><ellipse cx="30" cy="37" rx="9" ry="7" fill="#F2D2AE"/><circle cx="23" cy="26" r="3" fill="#14201B"/><circle cx="37" cy="26" r="3" fill="#14201B"/><ellipse cx="30" cy="34" rx="3.5" ry="2.5" fill="#14201B"/><path d="M30 37 L30 40" stroke="#14201B" stroke-width="1.5"/>'},
  robot:{name:"Beep the robot",price:180,svg:'<path d="M30 4 L30 12" stroke="#7D878F" stroke-width="2.5"/><circle cx="30" cy="4" r="3" fill="#E8554F"/><rect x="12" y="12" width="36" height="28" rx="7" fill="#AFC2CC"/><rect x="17" y="18" width="26" height="14" rx="4" fill="#14201B"/><circle cx="24" cy="25" r="3" fill="#3CC486"/><circle cx="36" cy="25" r="3" fill="#3CC486"/><rect x="18" y="42" width="24" height="14" rx="4" fill="#8FA4AF"/><rect x="26" y="46" width="8" height="3" fill="#FFC83D"/>'},
  dragon:{name:"Sparky the dragon",price:220,svg:'<path d="M10 26 Q2 12 14 14 L22 24 Z M50 26 Q58 12 46 14 L38 24 Z" fill="#7C5CFF"/><circle cx="30" cy="30" r="16" fill="#3CC486"/><path d="M22 16 L20 6 L27 14 Z M38 16 L40 6 L33 14 Z" fill="#FFC83D"/><ellipse cx="30" cy="38" rx="9" ry="6" fill="#B8F5D3"/><circle cx="24" cy="27" r="3" fill="#14201B"/><circle cx="36" cy="27" r="3" fill="#14201B"/><circle cx="27" cy="38" r="1.3" fill="#1F9D63"/><circle cx="33" cy="38" r="1.3" fill="#1F9D63"/><ellipse cx="30" cy="54" rx="12" ry="5" fill="#3CC486"/>'},
  panda:{name:"Bao the panda cub",price:160,svg:'<circle cx="15" cy="16" r="7" fill="#14201B"/><circle cx="45" cy="16" r="7" fill="#14201B"/><circle cx="30" cy="30" r="18" fill="#fff" stroke="#E3E3E3"/><ellipse cx="23" cy="28" rx="5" ry="6" fill="#14201B"/><ellipse cx="37" cy="28" rx="5" ry="6" fill="#14201B"/><circle cx="24" cy="28" r="1.8" fill="#fff"/><circle cx="36" cy="28" r="1.8" fill="#fff"/><ellipse cx="30" cy="37" rx="3" ry="2" fill="#14201B"/>'},
  ghost:{name:"Boo the ghost",price:100,season:"oct",svg:'<path d="M12 56 L12 26 Q12 8 30 8 Q48 8 48 26 L48 56 L42 50 L36 56 L30 50 L24 56 L18 50 Z" fill="#F5F7FF" stroke="#C9CEE0" stroke-width="1.5"/><ellipse cx="23" cy="26" rx="3.5" ry="5" fill="#14201B"/><ellipse cx="37" cy="26" rx="3.5" ry="5" fill="#14201B"/><ellipse cx="30" cy="38" rx="4" ry="3" fill="#14201B"/>'},
  bat:{name:"Flap the bat",price:100,season:"oct",svg:'<path d="M30 24 Q16 10 4 18 Q10 22 8 30 Q16 26 20 32 Q24 28 30 32 Q36 28 40 32 Q44 26 52 30 Q50 22 56 18 Q44 10 30 24 Z" fill="#5A3FD0"/><circle cx="30" cy="28" r="9" fill="#7C5CFF"/><path d="M24 20 L26 14 L28 20 Z M32 20 L34 14 L36 20 Z" fill="#7C5CFF"/><circle cx="27" cy="27" r="2" fill="#FFC83D"/><circle cx="33" cy="27" r="2" fill="#FFC83D"/>'},
  penguin:{name:"Pip the penguin",price:120,season:"dec",svg:'<ellipse cx="30" cy="34" rx="16" ry="20" fill="#14201B"/><ellipse cx="30" cy="38" rx="10" ry="14" fill="#fff"/><circle cx="25" cy="24" r="2.5" fill="#fff"/><circle cx="35" cy="24" r="2.5" fill="#fff"/><circle cx="25" cy="24" r="1.2" fill="#14201B"/><circle cx="35" cy="24" r="1.2" fill="#14201B"/><path d="M27 29 L33 29 L30 33 Z" fill="#FFC83D"/><path d="M22 56 L28 56 M32 56 L38 56" stroke="#FFC83D" stroke-width="3" stroke-linecap="round"/>'}
};
const DEFAULT_LOOK={fur:"orange",hat:"none",eyes:"round",neck:"none",pet:"none"};
const MONTHS={oct:9,dec:11};
const inSeason=it=>!it.season||new Date().getMonth()===MONTHS[it.season];
const seasonName=it=>({oct:"October",dec:"December"})[it.season];
function petSvg(look){look=look||myLook();const p=PETS[look.pet];return p&&p.svg?`<svg class="pet" viewBox="0 0 60 60" aria-hidden="true">${p.svg}</svg>`:""}
function withPet(mood,look){return `<span class="mwrap">${monkey(mood,look)}${petSvg(look)}</span>`}
const myLook=()=>{try{return S.look||DEFAULT_LOOK}catch(e){return DEFAULT_LOOK}};
function eyewear(kind,ey){
  const pair=(a,b)=>a+b;
  switch(kind){
    case "none":return "";
    case "sun":return '<rect x="34" y="45" width="26" height="17" rx="7" fill="#14201B"/><rect x="60" y="45" width="26" height="17" rx="7" fill="#14201B"/><path d="M57 50 L63 50" stroke="#14201B" stroke-width="3"/><path d="M38 49 L46 49" stroke="#ffffff66" stroke-width="2.5" stroke-linecap="round"/><path d="M64 49 L72 49" stroke="#ffffff66" stroke-width="2.5" stroke-linecap="round"/>';
    case "hearts":return '<path d="M47 66 L35 53 A6.5 6.5 0 0 1 47 46 A6.5 6.5 0 0 1 59 53 Z" fill="#FF6FAE" opacity=".9"/><path d="M73 66 L61 53 A6.5 6.5 0 0 1 73 46 A6.5 6.5 0 0 1 85 53 Z" fill="#FF6FAE" opacity=".9"/><path d="M58 52 L62 52" stroke="#C93E80" stroke-width="2.5"/>';
    case "stars":return '<path d="M47 42 L50.5 50 L59 50.5 L52.5 56 L54.5 64.5 L47 60 L39.5 64.5 L41.5 56 L35 50.5 L43.5 50 Z" fill="#FFC83D" stroke="#E0A400" stroke-width="1.5"/><path d="M73 42 L76.5 50 L85 50.5 L78.5 56 L80.5 64.5 L73 60 L65.5 64.5 L67.5 56 L61 50.5 L69.5 50 Z" fill="#FFC83D" stroke="#E0A400" stroke-width="1.5"/>';
    case "nerd":return '<rect x="34" y="45" width="25" height="17" rx="3" fill="#E8554F" opacity=".75" stroke="#fff" stroke-width="2.5"/><rect x="61" y="45" width="25" height="17" rx="3" fill="#3D8BFF" opacity=".75" stroke="#fff" stroke-width="2.5"/>';
    case "pixel":return '<path d="M32 47 H88 V52 H84 V58 H78 V62 H66 V58 H62 V52 H58 V58 H54 V62 H42 V58 H36 V52 H32 Z" fill="#14201B"/><rect x="40" y="51" width="4" height="4" fill="#fff"/><rect x="66" y="51" width="4" height="4" fill="#fff"/>';
    case "mask":return '<path d="M30 50 Q47 40 60 50 Q73 40 90 50 Q88 64 74 62 Q66 60 60 56 Q54 60 46 62 Q32 64 30 50 Z" fill="#3B1F5C"/><ellipse cx="46" cy="53" rx="6" ry="4" fill="#FFC83D"/><ellipse cx="74" cy="53" rx="6" ry="4" fill="#FFC83D"/><circle cx="46" cy="53" r="2" fill="#14201B"/><circle cx="74" cy="53" r="2" fill="#14201B"/>';
    case "monocle":return `<circle cx="73" cy="54" r="11" fill="#ffffff22" stroke="#C99A2E" stroke-width="2.8"/><path d="M83 60 Q88 78 80 92" fill="none" stroke="#C99A2E" stroke-width="1.6"/>`;
    default:return '<circle cx="47" cy="54" r="10.5" fill="none" stroke="#1B2B25" stroke-width="2.6"/><circle cx="73" cy="54" r="10.5" fill="none" stroke="#1B2B25" stroke-width="2.6"/><path d="M57.5 54 Q60 51.5 62.5 54" stroke="#1B2B25" stroke-width="2.6" fill="none"/>';
  }
}
function monkey(mood="happy",look){
  look=look||myLook();
  const F=FURS[look.fur]||FURS.orange;
  const mouth={
    happy:'<path d="M49 77 Q60 87 71 77" stroke="#3A1A05" stroke-width="3.2" fill="none" stroke-linecap="round"/>',
    cheer:'<path d="M48 75 Q60 92 72 75 Z" fill="#3A1A05"/><path d="M53 80 Q60 86 67 80" fill="#FF6B6B"/>',
    think:'<path d="M52 79 Q60 77 69 80" stroke="#3A1A05" stroke-width="3" fill="none" stroke-linecap="round"/>',
    oops:'<ellipse cx="60" cy="80" rx="5" ry="6" fill="#3A1A05"/>'
  }[mood]||'';
  const ey=mood==="think"?-2:0;
  const hideEyes=look.eyes==="sun"||look.eyes==="pixel"||look.eyes==="mask";
  return `<svg class="tm" viewBox="0 -16 120 136" aria-hidden="true">${F.rainbow?'<defs><linearGradient id="rb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6FAE"/><stop offset=".35" stop-color="#FFC83D"/><stop offset=".65" stop-color="#2EC4A0"/><stop offset="1" stop-color="#7C5CFF"/></linearGradient></defs>':""}
  <circle cx="20" cy="60" r="15" fill="${F.dark}"/><circle cx="20" cy="60" r="8.5" fill="${F.face}"/>
  <circle cx="100" cy="60" r="15" fill="${F.dark}"/><circle cx="100" cy="60" r="8.5" fill="${F.face}"/>
  <circle cx="60" cy="58" r="40" fill="${F.main}"/>
  ${F.stars?'<circle cx="34" cy="36" r="1.6" fill="#fff"/><circle cx="86" cy="40" r="1.2" fill="#fff"/><circle cx="78" cy="26" r="1.8" fill="#FFD25C"/><circle cx="42" cy="88" r="1.3" fill="#fff"/><circle cx="90" cy="70" r="1.5" fill="#FFD25C"/>':""}
  <path d="M52 20 Q58 8 64 19 Q70 10 72 22" fill="${F.tuft}"/>
  <circle cx="47" cy="54" r="15" fill="${F.face}"/><circle cx="73" cy="54" r="15" fill="${F.face}"/>
  <ellipse cx="60" cy="74" rx="25" ry="18" fill="${F.face}"/>
  ${hideEyes?"":`<circle cx="47" cy="${54+ey}" r="4.6" fill="#22130A"/><circle cx="73" cy="${54+ey}" r="4.6" fill="#22130A"/>
  <circle cx="48.6" cy="${52.4+ey}" r="1.5" fill="#fff"/><circle cx="74.6" cy="${52.4+ey}" r="1.5" fill="#fff"/>`}
  ${eyewear(look.eyes,ey)}
  <circle cx="56" cy="68" r="1.8" fill="#8A4A1E"/><circle cx="64" cy="68" r="1.8" fill="#8A4A1E"/>
  ${mouth}
  <circle cx="38" cy="72" r="4" fill="#FF9E7A" opacity=".55"/><circle cx="82" cy="72" r="4" fill="#FF9E7A" opacity=".55"/>
  ${(NECKS[look.neck]||NECKS.none).svg}
  ${(HATS[look.hat]||HATS.none).svg}
</svg>`;
}
(function favicon(){
  try{const l=document.createElement("link");l.rel="icon";l.type="image/svg+xml";
  l.href="data:image/svg+xml,"+encodeURIComponent(monkey("happy",DEFAULT_LOOK).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
  document.head.appendChild(l);}catch(e){}
})();
document.getElementById("brandMonkey").innerHTML=monkey();

/* ---------- Helpers ---------- */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function buddy(text,mood="happy"){return `<div class="buddy bounce">${withPet(mood)}<div class="bubble">${text}</div></div>`}
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(t._h);t._h=setTimeout(()=>t.hidden=true,2800)}
const Q=t=>`“${t}${/[?!.]$/.test(t)?"":"."}”`;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const WINS=["Nailed it!","Clean code. Love it.","Ook ook! That's right!","You're on fire!","Banana-level genius."];

/* ---------- State ---------- */
const KEY="typemonkey-v1";
const freshState=()=>({xp:0,bananas:0,streak:0,lastDay:null,done:[],progress:{},pro:false,look:{...DEFAULT_LOOK},owned:{fur:["orange"],hat:["none"],eyes:["round","none"],neck:["none"],pet:["none"]},review:{},settings:{theme:"system",text:"normal",calm:false,sound:true,music:true,remind:false,remindAt:18,cloud:true},stats:{},badges:{}});
/* Fill in anything missing (older saves, restored backups) so the rest of the app can rely on the shape */
function normState(raw){
  const S={...freshState(),...(raw&&typeof raw==="object"?raw:{})};
  if(!Array.isArray(S.done))S.done=[];if(!S.progress||typeof S.progress!=="object")S.progress={};
  for(const k of ["xp","bananas","streak"])S[k]=Math.max(0,Math.floor(+S[k]||0));
  if(S.inProgress){if(S.inProgress.id)S.progress[S.inProgress.id]={step:S.inProgress.step,earned:S.inProgress.earned,drafts:{}};delete S.inProgress}
  S.look={...DEFAULT_LOOK,...(S.look||{})};S.owned=S.owned||{};for(const k of ["fur","hat","eyes","neck","pet"])S.owned[k]=Array.isArray(S.owned[k])?S.owned[k]:[];
  if(!S.owned.pet.includes("none"))S.owned.pet.push("none");
  ["orange"].forEach(x=>S.owned.fur.includes(x)||S.owned.fur.push(x));["none"].forEach(x=>S.owned.hat.includes(x)||S.owned.hat.push(x));
  ["round","none"].forEach(x=>S.owned.eyes.includes(x)||S.owned.eyes.push(x));["none"].forEach(x=>S.owned.neck.includes(x)||S.owned.neck.push(x));S.review=S.review||{};
  S.settings={theme:"system",text:"normal",calm:false,sound:true,music:true,remind:false,remindAt:18,cloud:true,...(S.settings||{})};delete S.tester;
  S.stats=S.stats||{};S.badges=S.badges||{};
  return S;
}
let S=freshState();
try{const raw=localStorage.getItem(KEY);if(raw)S=JSON.parse(raw)}catch(e){}
S=normState(S);
function save(){S.savedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}if(window.__cloudQueue)window.__cloudQueue();renderStats();if(typeof checkAchievements==="function")setTimeout(checkAchievements,0)}
function applySettings(){
  const r=document.documentElement;const st=S.settings;
  if(st.theme==="system")r.removeAttribute("data-theme");else r.setAttribute("data-theme",st.theme);
  r.classList.toggle("bigtext",st.text==="large");r.classList.toggle("calm",!!st.calm);
}
applySettings();
setTimeout(()=>Remind.sync(),1500);
/* ---------- Sounds: tiny synthesized effects (Web Audio, no files). Soft, short, throttled, never throws.
   The AudioContext is only created/resumed inside a user gesture (iOS / Safari rule). ---------- */
const SFX=(()=>{
  // Each recipe schedules notes on (ctx, out, t). note(f,at,dur,opts): smooth attack + exponential release, so no clicks.
  const note=(ctx,out,f,at,dur,o={})=>{
    const osc=ctx.createOscillator(),g=ctx.createGain();const vol=o.vol||.12,a=o.attack||.008;
    osc.type=o.type||"sine";osc.frequency.setValueAtTime(f,at);if(o.to)osc.frequency.exponentialRampToValueAtTime(o.to,at+dur);
    g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(vol,at+a);g.gain.exponentialRampToValueAtTime(.0001,at+dur);
    osc.connect(g);g.connect(out);osc.start(at);osc.stop(at+dur+.03);
  };
  // filtered noise burst: claps, shakers, whooshes, thuds
  let NB=null;const nbuf=ctx=>{if(NB&&NB.sampleRate===ctx.sampleRate)return NB;const n=ctx.sampleRate;const b=ctx.createBuffer(1,n,n);const d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;NB=b;return b};
  const noise=(ctx,out,at,dur,o={})=>{const src=ctx.createBufferSource();src.buffer=nbuf(ctx);const f=ctx.createBiquadFilter();f.type=o.ftype||"bandpass";f.frequency.setValueAtTime(o.f||1500,at);if(o.fto)f.frequency.exponentialRampToValueAtTime(o.fto,at+dur);f.Q.value=o.q||1;
    const g=ctx.createGain();const vol=o.vol||.08;g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(vol,at+(o.attack||.004));g.gain.exponentialRampToValueAtTime(.0001,at+dur);
    src.connect(f);f.connect(g);g.connect(out);src.start(at,Math.random()*.5);src.stop(at+dur+.03)};
  const SCALE=[523,587,659,784,880,1047,1175,1319,1568,1760,2093];  // C major pentatonic, climbing
  const mar=(c,o,f,t,v=.07)=>{note(c,o,f,t,.35,{type:"sine",vol:v,attack:.003});note(c,o,f*4,t,.08,{type:"sine",vol:v*.25,attack:.002})};  // marimba-ish
  const R={
    m_clap:(c,o,t)=>{noise(c,o,t,.07,{f:1400,q:.8,vol:.16});noise(c,o,t+.025,.09,{f:1200,q:.8,vol:.14});noise(c,o,t+.05,.16,{f:1000,q:.7,vol:.12})},
    m_jump:(c,o,t)=>{note(c,o,260,t,.32,{type:"sine",vol:.12,to:780});note(c,o,520,t,.24,{type:"triangle",vol:.04,to:1560})},
    m_spin:(c,o,t)=>{noise(c,o,t,.42,{f:400,fto:3500,q:2,vol:.12,attack:.08});note(c,o,330,t,.4,{type:"sine",vol:.05,to:990,attack:.05})},
    m_wave:(c,o,t)=>[1319,1568,2093].forEach((f,i)=>note(c,o,f,t+i*.07,.4,{type:"sine",vol:.06})),
    m_wiggle:(c,o,t)=>[0,1,2,3,4,5].forEach(i=>note(c,o,i%2?494:392,t+i*.06,.07,{type:"triangle",vol:.08})),
    walk:(c,o,t,n=0)=>mar(c,o,SCALE[n%8],t,.06),
    nom:(c,o,t)=>{note(c,o,330,t,.08,{type:"triangle",vol:.11,to:250});note(c,o,392,t+.11,.12,{type:"triangle",vol:.11,to:300});note(c,o,1568,t+.2,.25,{type:"sine",vol:.05})},
    bonk:(c,o,t)=>{note(c,o,190,t,.22,{type:"sine",vol:.16,to:85});noise(c,o,t,.08,{f:300,q:.7,vol:.1})},
    plop:(c,o,t,n=0)=>{const f=SCALE[Math.max(0,Math.min(10,n))];note(c,o,f*1.5,t,.12,{type:"sine",vol:.11,to:f*.7});note(c,o,f,t+.05,.2,{type:"sine",vol:.04})},
    zap:(c,o,t)=>{note(c,o,300,t,.25,{type:"triangle",vol:.08,to:1400});note(c,o,450,t+.04,.25,{type:"sine",vol:.05,to:2100})},
    ding:(c,o,t,n=0)=>{const f=SCALE[n%9];note(c,o,f,t,.4,{type:"sine",vol:.09});note(c,o,f*2,t,.15,{type:"sine",vol:.03})},
    // your program's own result: a happy "you got it!" fanfare, or a friendly "nope" boop
    out_win:(c,o,t)=>{[659,784,1047].forEach((f,i)=>note(c,o,f,t+i*.09,.16,{type:"square",vol:.03}));note(c,o,1319,t+.27,.45,{type:"triangle",vol:.09});note(c,o,1568,t+.27,.45,{type:"sine",vol:.05});noise(c,o,t+.27,.35,{f:7000,ftype:"highpass",vol:.025})},
    out_lose:(c,o,t)=>{note(c,o,392,t,.14,{type:"triangle",vol:.08,to:370});note(c,o,311,t+.15,.3,{type:"triangle",vol:.08,to:262})},
    tada:(c,o,t)=>{[523,659,784].forEach((f,i)=>mar(c,o,f,t+i*.1,.08));[1047,1319,1568].forEach(f=>note(c,o,f,t+.32,.7,{type:"triangle",vol:.05}));noise(c,o,t+.32,.5,{f:6000,ftype:"highpass",vol:.03})},
    tap:(c,o,t)=>note(c,o,880,t,.05,{type:"triangle",vol:.035,attack:.004}),
    correct:(c,o,t)=>{note(c,o,784,t,.16,{type:"triangle",vol:.1});note(c,o,1175,t+.09,.3,{type:"sine",vol:.1})},
    wrong:(c,o,t)=>note(c,o,300,t,.28,{type:"sine",vol:.12,attack:.02,to:220}),
    complete:(c,o,t)=>{[523,659,784].forEach((f,i)=>note(c,o,f,t+i*.11,.18,{type:"triangle",vol:.09}));note(c,o,1047,t+.33,.55,{type:"triangle",vol:.1});note(c,o,784,t+.33,.55,{type:"sine",vol:.05})},
    badge:(c,o,t)=>[784,1047,1319,1568,1319].forEach((f,i)=>note(c,o,f,t+i*.07,.24,{type:"sine",vol:.07})),
    coins:(c,o,t)=>{note(c,o,988,t,.08,{type:"triangle",vol:.07});note(c,o,1319,t+.07,.25,{type:"triangle",vol:.07})},
    step:(c,o,t)=>note(c,o,500+Math.random()*120,t,.09,{type:"triangle",vol:.05}),
    success:(c,o,t)=>[523,659,784,1047].forEach((f,i)=>note(c,o,f,t+i*.08,i===3?.4:.14,{type:"triangle",vol:.09})),
    oops:(c,o,t)=>{note(c,o,440,t,.15,{type:"sine",vol:.09,attack:.015});note(c,o,349,t+.15,.26,{type:"sine",vol:.09,attack:.015})},
    hint:(c,o,t)=>{note(c,o,660,t,.12,{type:"sine",vol:.06});note(c,o,990,t+.08,.2,{type:"sine",vol:.05})}
  };
  const GAP={tap:60,step:90,coins:150,walk:90,ding:70,plop:70,zap:120,nom:120,bonk:150};const last={};let ctx=null,master=null,gestured=false,lastBig=0;
  const AC=typeof window!=="undefined"&&(window.AudioContext||window.webkitAudioContext);
  const on=()=>{try{return !(S&&S.settings&&S.settings.sound===false)}catch(e){return true}};
  function wake(){ // called from inside a real user gesture
    gestured=true;if(!AC||!on())return;
    try{if(!ctx){ctx=new AC();master=ctx.createGain();master.gain.value=.7;master.connect(ctx.destination)}
      // iPhone/iPad only switch sound on inside certain taps (touchend/click), and can pause it again after a call or
      // switching apps. So on every tap, until the audio is really running: resume it and play one silent sample.
      if(ctx.state!=="running"){
        try{const b=ctx.createBuffer(1,1,22050),src=ctx.createBufferSource();src.buffer=b;src.connect(ctx.destination);src.start(0)}catch(e){}
        ctx.resume().catch(()=>{});
      }
    }catch(e){ctx=null}
  }
  if(typeof document!=="undefined")["pointerdown","touchend","click","keydown"].forEach(ev=>document.addEventListener(ev,wake,{capture:true,passive:true}));
  // After a phone call or a long time in the background, iPhone audio can come back "running" but silent
  // (WebKit bug 243727). If we were away for a while, start a fresh sound engine on the next tap.
  let hiddenAt=0;
  if(typeof document!=="undefined")document.addEventListener("visibilitychange",()=>{
    if(document.hidden){hiddenAt=Date.now();return}
    if(ctx&&hiddenAt&&Date.now()-hiddenAt>20000){try{ctx.close()}catch(e){}ctx=null;master=null;return}
    if(ctx&&ctx.state!=="running")ctx.resume().catch(()=>{})});
  function play(name,arg){
    try{
      const r=R[name];if(!r||!on()||!gestured||!AC)return false;
      if(!ctx)wake();if(!ctx)return false;
      const now=performance.now();if(now-(last[name]||0)<(GAP[name]||250))return false;
      if(name==="tap"&&now-lastBig<150)return false;  // don't click over a chime
      last[name]=now;if(name!=="tap"&&name!=="step")lastBig=now;
      if(ctx.state!=="running")ctx.resume().catch(()=>{});
      // a lesson's right/wrong chime waits a moment if the program's own win/lose sound just played
      const after=(name==="correct"||name==="wrong")&&now-(last.out||0)<400?.5:0;if(name.startsWith("out_"))last.out=now;(play.log=play.log||[]).push(name);if(play.log.length>20)play.log.shift();
      r(ctx,master,ctx.currentTime+.01+after,arg);return true;
    }catch(e){return false}
  }
  /* ---- Music: tiny looping tunes for TypeMonkey Jr. (dance beat, calm jungle). Scheduled a little ahead, fades in and out. ---- */
  const SONGS={
    dance:{beat:.31,len:32,vol:.55,step:(c,o,t,i)=>{  // 8th notes; moves land on every other 8th (0.62s)
      const bar=Math.floor(i/8)%4,k=i%8,ROOT=[131,110,87,98][bar],CH=[[523,659,784],[440,523,659],[349,440,523],[392,494,587]][bar];
      if(k%2===0)note(c,o,60,t,.18,{type:"sine",vol:.22,to:40,attack:.002});                 // kick
      if(k===2||k===6)noise(c,o,t,.12,{f:1500,q:.8,vol:.07});                                  // clap
      if(k%2===1)noise(c,o,t,.04,{f:8000,ftype:"highpass",vol:.035});                          // hat
      note(c,o,k%2?ROOT*2:ROOT,t,.22,{type:"triangle",vol:.09,attack:.005});                    // bass
      const mel=[[0,null,1,2,null,1,0,null],[1,null,2,null,1,0,null,0],[2,1,null,0,null,1,null,null],[0,null,1,null,2,null,1,2]][bar][k];
      if(mel!==null)note(c,o,CH[mel]*(bar===3&&k>5?2:1),t,.2,{type:"square",vol:.022,attack:.005});
    }},
    jungle:{beat:.36,len:32,vol:.4,step:(c,o,t,i)=>{
      const bar=Math.floor(i/8)%4,k=i%8,ARP=[[523,659,784,1047],[440,523,659,880],[349,440,523,698],[392,494,587,784]][bar];
      if(k%2===0)mar(c,o,ARP[(k/2)%4],t,.05);
      if(k===3||k===7)mar(c,o,ARP[(k+1)%4]*2,t,.025);
      noise(c,o,t,.05,{f:7000,ftype:"highpass",vol:k%2?.012:.02});                              // shaker
      if(k===0)note(c,o,ARP[0]/4,t,1.2,{type:"sine",vol:.07,attack:.05});                       // soft bass hum
    }}};
  let song=null,mGain=null,timer=null,nextT=0,idx=0;
  const musicOn=()=>on()&&!(S&&S.settings&&S.settings.music===false);
  play.music=(name)=>{try{
    if(!SONGS[name]||!AC||!musicOn()||!gestured){play.stopMusic();return false}
    if(song===name&&timer)return true;play.stopMusic(true);
    if(!ctx)wake();if(!ctx)return false;if(ctx.state!=="running")ctx.resume().catch(()=>{});
    song=name;const S2=SONGS[name];mGain=ctx.createGain();mGain.gain.setValueAtTime(.0001,ctx.currentTime);mGain.gain.exponentialRampToValueAtTime(S2.vol,ctx.currentTime+1.2);mGain.connect(master);
    nextT=ctx.currentTime+.1;idx=0;const g=mGain;
    timer=setInterval(()=>{if(!ctx||g!==mGain)return;while(nextT<ctx.currentTime+.25){S2.step(ctx,g,nextT,idx);nextT+=S2.beat;idx=(idx+1)%S2.len}},60);return true}catch(e){return false}};
  play.stopMusic=(quick)=>{try{if(timer){clearInterval(timer);timer=null}song=null;if(mGain&&ctx){const g=mGain;mGain=null;const t=ctx.currentTime;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(Math.max(g.gain.value,.0001),t);g.gain.exponentialRampToValueAtTime(.0001,t+(quick?.15:.6));setTimeout(()=>{try{g.disconnect()}catch(e){}},quick?300:900)}}catch(e){}};
  play.musicBoost=(up)=>{try{if(mGain&&ctx&&song){const t=ctx.currentTime;mGain.gain.cancelScheduledValues(t);mGain.gain.setValueAtTime(Math.max(mGain.gain.value,.0001),t);mGain.gain.linearRampToValueAtTime(SONGS[song].vol*(up?1.3:1),t+.3)}}catch(e){}};
  play.song=()=>song;
  if(typeof document!=="undefined")document.addEventListener("visibilitychange",()=>{if(document.hidden)play.stopMusic(true)});
  play.names=Object.keys(R);
  play.state=()=>ctx?ctx.state:"none";
  /* Self-test: render every sound into a silent offline buffer; returns {name:"ok"|error} */
  play.test=async(detail)=>{const out={};const OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext;
    for(const n of Object.keys(R)){try{if(!OAC){out[n]="ok";continue}const oc=new OAC(1,44100,44100);R[n](oc,oc.destination,0);const buf=await oc.startRendering();
      const d=buf.getChannelData(0);let peak=0,end=0,jump=0;for(let i=0;i<d.length;i++){const v=Math.abs(d[i]);peak=Math.max(peak,v);if(v>1e-3)end=i;if(i)jump=Math.max(jump,Math.abs(d[i]-d[i-1]))}
      out[n]=peak>0&&peak<.5?"ok":"peak "+peak.toFixed(3);if(detail)out[n]={ok:out[n],peak:+peak.toFixed(3),ms:Math.round(end/44.1),jump:+jump.toFixed(3),tail:+Math.abs(d[d.length-1]).toFixed(5)}}catch(e){out[n]=String(e)}}
    return out};
  return play;
})();
window.tmSound=SFX;
const sfx=(n,a)=>SFX(n,a);
/* soft tap on every enabled button */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("button");if(b&&!b.disabled)sfx("tap")},true);
function renderStats(){$("#sStreak").textContent=S.streak;$("#sBan").textContent=S.bananas;$("#sXp").textContent=S.xp;$("#brandMonkey").innerHTML=monkey();renderSnd()}
function renderSnd(){const b=$("#sndBtn");if(!b)return;const on=S.settings.sound!==false;b.textContent=on?"🔊":"🔇";b.setAttribute("aria-pressed",on);b.setAttribute("aria-label",on?"Sounds on. Tap to turn off":"Sounds off. Tap to turn on")}
const dayStr=d=>d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
/* ---------- Daily reminders (phone app only, opt-in): local notifications, no server.
   The next 14 days are scheduled at the chosen hour; a day you already practiced is skipped. ---------- */
const Remind={
  plugin(){try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.LocalNotifications||null}catch(e){return null}},
  ok(){return !!Remind.plugin()},
  LINES:["Your daily banana is waiting 🍌 One quick lesson?","TypeMonkey saved you a seat. Ready to code? 🐒","5 minutes of code today? TypeMonkey believes in you!","A new puzzle is ready for you 🧩","Keep your brain buzzing: one lesson today 🚀"],
  async sync(){const P=Remind.plugin();if(!P)return;
    try{await P.cancel({notifications:Array.from({length:14},(_,i)=>({id:4100+i}))}).catch(()=>{});
      if(!S.settings.remind)return;
      const h=+S.settings.remindAt||18,now=new Date(),today=dayStr(now),y=dayStr(new Date(Date.now()-864e5)),list=[];
      const live=S.streak>=2&&(S.lastDay===today||S.lastDay===y);
      for(let d=0;d<14;d++){const at=new Date(now.getFullYear(),now.getMonth(),now.getDate()+d,h,0,0);
        if(at<=now||(d===0&&S.lastDay===today))continue;
        const body=d<=1&&live?`🔥 Keep your ${S.streak}-day streak going! One quick lesson?`:Remind.LINES[(at.getDate()+d)%Remind.LINES.length];
        list.push({id:4100+d,title:"TypeMonkey",body,schedule:{at}})}
      if(list.length)await P.schedule({notifications:list});
    }catch(e){}},
  /* Friendly "want a reminder?" card after a win. iOS shows its own permission box only once, so we ask with our
     own card first: right after the first finished lesson, and (after "Not now") once more 3+ lessons and 2+ days
     later. "Don't ask again" or a second "Not now" ends it; Settings always has the switch. */
  shouldAsk(){if(!Remind.ok()||S.settings.remind)return false;const a=S.remindAsk||{};if(a.never||(a.n||0)>=2)return false;
    if(!a.n)return S.done.length>=1;return S.done.length>=(a.done||0)+3&&Date.now()-(a.at||0)>=2*864e5},
  asked(never){const a=S.remindAsk||{};S.remindAsk={n:(a.n||0)+1,at:Date.now(),done:S.done.length,never:!!never||(a.n||0)+1>=2};save()},
  card(){const hrs=[7,8,12,15,16,17,18,19,20],now=+S.settings.remindAt||18;
    return `<div class="remindask" id="remindask"><div class="ra-top"><span class="ra-bell" aria-hidden="true">🔔</span><div><b>Want a daily reminder?</b><p>TypeMonkey can send one friendly nudge a day to keep your streak going. No nudge on days you already practiced.</p></div></div>
      <div class="ra-row"><label for="raAt">Remind me at</label><select id="raAt" class="remindat">${hrs.map(h=>`<option value="${h}" ${h===now?"selected":""}>${h===12?"12 pm":h>12?(h-12)+" pm":h+" am"}</option>`).join("")}</select></div>
      <div class="ra-btns"><button class="btn banana sm" id="raYes">🔔 Yes, remind me</button><button class="btn ghost sm" id="raLater">Not now</button><button class="linkbtn" id="raNever">Don't ask again</button></div></div>`},
  wireCard(){const c=$("#remindask");if(!c)return;const done=msg=>{c.classList.add("ra-done");c.innerHTML=`<p>${msg}</p>`};
    $("#raYes").onclick=async()=>{const sel=$("#raAt"),label=sel.selectedOptions[0].textContent;S.settings.remindAt=+sel.value;Remind.asked(true);const ok=await Remind.enable(true);
      done(ok?`🔔 All set! A reminder at ${label} each day. Change it any time in Settings ⚙️`:"No problem. You can turn reminders on any time in Settings ⚙️")};
    $("#raLater").onclick=()=>{Remind.asked(false);done("Okay! You can turn reminders on any time in Settings ⚙️")};
    $("#raNever").onclick=()=>{Remind.asked(true);done("Got it, we won't ask again. Reminders are in Settings ⚙️ if you change your mind.")}},
  async enable(on){const P=Remind.plugin();if(!P)return false;
    if(on){try{let r=await P.checkPermissions();if(r.display!=="granted")r=await P.requestPermissions();
      if(r.display!=="granted"){S.settings.remind=false;save();toast("Notifications are off for TypeMonkey. Turn them on in your phone's Settings app.");return false}}catch(e){return false}}
    S.settings.remind=on;save();await Remind.sync();if(on)toast("Reminder on. See you tomorrow! 🍌");return true}
};
function bumpStreak(){const t=dayStr(new Date());if(S.lastDay===t)return;const y=dayStr(new Date(Date.now()-864e5));S.streak=S.lastDay===y?S.streak+1:1;S.lastDay=t;setTimeout(()=>Remind.sync(),0)}

/* ---------- Code runner: in-page, loop-guarded, with a fallback if eval is blocked ---------- */
function guardLoops(code){
  const G="__tmG()";let res="",i=0;const re=/\b(for|while)\s*\(|\bdo\s*\{/g;
  while(i<code.length){
    re.lastIndex=i;const m=re.exec(code);
    if(!m){res+=code.slice(i);break}
    res+=code.slice(i,m.index);
    if(m[0].startsWith("do")){res+="do{"+G+";";i=m.index+m[0].length;continue}
    let j=m.index+m[0].length,depth=1,q=null;const start=j;
    for(;j<code.length&&depth;j++){const ch=code[j];
      if(q){if(ch==="\\")j++;else if(ch===q)q=null;continue}
      if(ch==='"'||ch==="'"||ch==="`")q=ch;else if(ch==="(")depth++;else if(ch===")")depth--;}
    if(depth){res+=code.slice(m.index);break}
    const inner=code.slice(start,j-1);let out;
    if(m[1]==="while")out=`while(${G}&&(${inner}))`;
    else{
      let parts=[],d=0,last=0,qq=null;
      for(let k=0;k<inner.length;k++){const ch=inner[k];
        if(qq){if(ch==="\\")k++;else if(ch===qq)qq=null;continue}
        if(ch==='"'||ch==="'"||ch==="`")qq=ch;else if("([{".includes(ch))d++;else if(")]}".includes(ch))d--;
        else if(ch===";"&&!d){parts.push(inner.slice(last,k));last=k+1}}
      parts.push(inner.slice(last));
      if(parts.length===3)out=`for(${parts[0]};${G}&&(${parts[1].trim()||"true"});${parts[2]})`;
      else{const b=code.slice(j).match(/^\s*\{/);out=`for(${inner})`+(b?b[0]+G+";":"");if(b)j+=b[0].length}
    }
    res+=out;i=j;
  }
  return res;
}
function makeConsole(out){
  const fmt=v=>typeof v==="string"?v:(()=>{try{const j=JSON.stringify(v);return j===undefined?String(v):j}catch(_){return String(v)}})();
  const lg=(...a)=>out.push(["log",a.map(fmt).join(" ")]);
  return {log:lg,info:lg,warn:lg,error:(...a)=>out.push(["err",a.map(fmt).join(" ")])};
}
let evalBlocked=false;
function inputFeeder(input){
  const lines=input==null||input===""?[]:String(input).replace(/\r/g,"").split("\n");if(lines.length&&lines[lines.length-1]==="")lines.pop();let i=0;
  return ()=>i<lines.length?lines[i++]:null;
}
function runCode(code,input,quiet){
  const out=[];const con=makeConsole(out);
  const nextIn=inputFeeder(input);
  window.__tmPrompt=(msg="")=>{const v=nextIn();if(!quiet)con.log(String(msg)+(v===null?"":" "+v));return v};
  const body="const prompt=window.__tmPrompt;let __tmN=0;const __tmG=()=>{if(++__tmN>100000)throw new Error('Your loop ran 100,000 times, so I stopped it. Check that it can end.');return true};\n"+guardLoops(code);
  if(!evalBlocked){
    let fn=null;
    try{fn=new Function("console",body)}catch(err){
      if(err instanceof SyntaxError){out.push(["err","SyntaxError: "+err.message]);return Promise.resolve(out)}
      evalBlocked=true;
    }
    if(fn){try{fn(con)}catch(err){out.push(["err",(err.name||"Error")+": "+err.message])}return Promise.resolve(out)}
  }
  return new Promise(res=>{
    window.__tmCon=con;
    const onErr=e=>{out.push(["err",String(e.message||e).replace(/^Uncaught /,"").replace(/Failed to execute '\w+' on '\w+': /,"")]);e.preventDefault&&e.preventDefault()};
    window.addEventListener("error",onErr);
    const s=document.createElement("script");
    s.textContent="(function(console){try{"+body+"\n}catch(err){console.error((err.name||'Error')+': '+err.message)}})(window.__tmCon);";
    document.body.appendChild(s);s.remove();window.removeEventListener("error",onErr);res(out);
  });
}
/* ---------- Python (Brython, bundled) ---------- */
let pyReady=false;
const PY_PRELUDE=`__tm_n = [0]
def __tm_guard():
    __tm_n[0] += 1
    if __tm_n[0] > 100000:
        raise RuntimeError("Your loop ran 100,000 times, so I stopped it. Check that it can end.")
__tm_round = round
def round(x, n=None):
    if n is None:
        return __tm_round(x)
    if isinstance(x, float) and n >= 0:
        return float(format(x, "." + str(n) + "f"))
    if n < 0:
        q = 10 ** (-n)
        if isinstance(x, int):
            d, r = divmod(x, q)
            if r * 2 > q or (r * 2 == q and d % 2 == 1):
                d += 1
            return d * q
        return float(__tm_round(x / q) * q)
    return __tm_round(x, n)
def input(prompt=""):
    __tm_v = __tm_in.pop(0) if __tm_in else None
    if __tm_v is None:
        raise EOFError("there's no more input. Type your answers in the ⌨️ Input box under the code, one per line.")
    if __tm_echo:
        print(str(prompt) + __tm_v)
    return __tm_v
`;
function splitOneLineLoop(line){
  // "while x: body" -> header and body, so the loop guard can go inside
  const m=line.match(/^(\s*)(while|for)\b/);if(!m)return null;
  let depth=0,q=null;
  for(let i=m[0].length;i<line.length;i++){const c=line[i];
    if(q){if(c==="\\")i++;else if(c===q)q=null;continue}
    if(c==='"'||c==="'"){q=c;continue}
    if("([{".includes(c))depth++;else if(")]}".includes(c))depth--;
    else if(c===":"&&depth===0){const rest=line.slice(i+1).trim();if(!rest||rest.startsWith("#"))return null;return [m[1],line.slice(0,i+1),rest]}
    else if(c==="#")return null;
  }
  return null;
}
function guardPy(code){
  const lines0=code.split("\n");const lines=[];
  for(const l of lines0){const sp=splitOneLineLoop(l);if(sp){lines.push(sp[1]);lines.push(sp[0]+"    "+sp[2])}else lines.push(l)}
  const out=[];
  for(let i=0;i<lines.length;i++){
    out.push(lines[i]);
    if(/^\s*(while|for)\b.*:\s*(#.*)?$/.test(lines[i])){
      let j=i+1;while(j<lines.length&&/^\s*(#.*)?$/.test(lines[j]))j++;
      if(j<lines.length){const ind=lines[j].match(/^\s*/)[0];if(ind.length>lines[i].match(/^\s*/)[0].length)out.push(ind+"__tm_guard()")}
    }
  }
  return out.join("\n");
}
/* The Python engine (Brython, ~1.3 MB) is stored as plain text and only compiled the first time Python is needed,
   so the app starts fast. warmPython() does it early (in idle time) when a Python lesson opens. */
/* In the single-file build the engine is inline text; in the app build it's a separate file (data-src). */
const pyOK=()=>!!(globalThis.__BRYTHON__&&globalThis.__BRYTHON__.runPythonSource);
let pyLoading=null;
function loadPython(){
  if(pyOK())return Promise.resolve(true);
  if(pyLoading)return pyLoading;
  const el=document.getElementById("tm-brython");if(!el)return Promise.resolve(false);
  if(el.textContent){try{const sc=document.createElement("script");sc.textContent=el.textContent;document.head.appendChild(sc);el.textContent=""}catch(e){}return Promise.resolve(pyOK())}
  if(!el.dataset.src)return Promise.resolve(false);
  pyLoading=new Promise(res=>{const sc=document.createElement("script");sc.src=el.dataset.src;sc.onload=()=>res(pyOK());sc.onerror=()=>{pyLoading=null;res(false)};document.head.appendChild(sc)});
  return pyLoading;
}
function warmPython(){const go=()=>{try{loadPython()}catch(e){}};if(window.requestIdleCallback)requestIdleCallback(go,{timeout:2500});else setTimeout(go,900)}
function runPython(code,input,quiet){
  if(!pyOK())return loadPython().then(ok=>ok?runPython(code,input,quiet):[["err","The Python engine didn't load. Try reopening the app."]]);
  const B=globalThis.__BRYTHON__;
  const inLines=input==null||input===""?[]:String(input).replace(/\r/g,"").split("\n");if(inLines.length&&inLines[inLines.length-1]==="")inLines.pop();
  if(!B||!B.runPythonSource)return Promise.resolve([["err","The Python engine didn't load. Try reopening the app."]]);
  if(!pyReady){try{if(typeof PYLIB!=="undefined"&&B.loadBrythonPackage)B.loadBrythonPackage(Object.fromEntries(Object.entries(PYLIB).map(([k,v])=>[k,[".py",v,[]]])))}catch(e){}
    try{brython({debug:0,ids:[],cache:false})}catch(e){}pyReady=true}
  let buf="";const ol=console.log,oe=console.error,ow=console.warn;
  console.log=(...a)=>{if(a.length===1&&typeof a[0]==="string")buf+=a[0]};console.error=()=>{};console.warn=()=>{};
  let err=null;
  try{B.runPythonSource("__tm_in = "+JSON.stringify(inLines)+"\n__tm_echo = "+(quiet?"False":"True")+"\n"+PY_PRELUDE+guardPy(code),{})}
  catch(e){
    let name="Error",msg="";
    try{name=B.class_name?B.class_name(e):(e.__class__&&e.__class__.__name__)||"Error"}catch(_){}
    try{msg=B.builtins.str.$factory(e)}catch(_){msg=e&&e.args?String(e.args[0]):String(e)}
    if(name==="SyntaxError"||name==="IndentationError")msg=msg.replace(/\s*\(.*line \d+\)$/,"");
    err=`${name}: ${msg}`.replace(/: $/,"");
    if(name==="ModuleNotFoundError"){const mod=(msg.match(/'([^']+)'/)||[])[1]||"that module";err=`ModuleNotFoundError: TypeMonkey's Python doesn't have '${mod}' yet. It has math, random, string, time, collections, itertools, functools, json and dataclasses.`}
    if(name==="RecursionError"||/Maximum call stack/.test(msg))err="RecursionError: a function kept calling itself. Check your stopping case.";
  }finally{console.log=ol;console.error=oe;console.warn=ow}
  const lines=buf.split("\n");if(lines[lines.length-1]==="")lines.pop();
  const res=lines.map(l=>["log",l]);if(err)res.push(["err",err]);
  return Promise.resolve(res);
}
/* ---------- run any language ---------- */
function linesOf(r){const lines=r.out.split("\n");if(lines[lines.length-1]==="")lines.pop();const o=lines.map(l=>["log",l]);if(r.error)o.push(["err",r.error]);return o}
const RUNNERS={
  js:(c,inp,q)=>runCode(c,inp,q),
  py:(c,inp,q)=>runPython(c,inp,q),
  cs:(c,inp,q)=>Promise.resolve(linesOf(TMC.run(c,"cs",inp,q))),
  cpp:(c,inp,q)=>Promise.resolve(linesOf(TMC.run(c,"cpp",inp,q))),
  java:(c,inp,q)=>Promise.resolve(linesOf(TMC.run(c,"java",inp,q))),
  swift:(c,inp,q)=>Promise.resolve(linesOf(TMSwift.run(c,inp,q))),
  sql:c=>{const r=TMSQL.run(c,ZOO_TABLES);if(!r.ok)return Promise.resolve([["err",r.error]]);const o=TMSQL.text(r).split("\n").map(l=>["log",l]);o.table=r;return Promise.resolve(o)}
};
const kindOf=c=>c.runnable===true?"js":c.runnable;
const TILE={"#":"🧱",".":"⬛","$":"🪙","@":"🐵","E":"🚪",">":"🪜","p":"🧪"," ":"⬛"};
const isMapLine=l=>l.length>=3&&/^[#.$@E>p ]+$/.test(l)&&/#/.test(l);
const WIN=/\b(you win|wins( after|!)|escaped|found the stairs|got it in|you escape)/i,LOSE=/\b(you lose|defeated|out of lives|still lost|game over)/i;
function arcadeConsole(el,out,hint){
  const logs=out.filter(o=>o[0]==="log").map(o=>o[1]);const err=out.find(o=>o[0]==="err");
  const hasMap=logs.some(isMapLine);
  let textMode=el.dataset.text==="1";
  const draw=()=>{
    const body=out.length?out.map(([k,v])=>k==="err"?`<div class="err">✖ ${esc(v)}</div>`:(!textMode&&isMapLine(v))?`<div class="tiles">${[...v].map(c=>TILE[c]).join("")}</div>`:`<div>› ${esc(v)}</div>`).join(""):`<span class="dim">(nothing printed${hint?". "+hint:""})</span>`;
    const last=logs.slice(-2).join(" ");
    const banner=err?"":WIN.test(last)?`<div class="arcade-win">🏆 YOU WIN!</div>`:LOSE.test(last)?`<div class="arcade-lose">💀 GAME OVER, TRY AGAIN?</div>`:"";
    el.innerHTML=`<div class="arcade-top"><span>🎮 GAME SCREEN</span>${hasMap?`<button type="button" class="tview">${textMode?"🧱 Show tiles":"ABC Show text"}</button>`:""}</div>${body}${banner}`;
    const b=el.querySelector(".tview");if(b)b.onclick=()=>{textMode=!textMode;el.dataset.text=textMode?"1":"";draw()};
  };
  draw();
}
/* Did the program say the player won or lost? ("You got it!" vs "Too low") Plays a matching sound. */
const OUT_WIN=/(you got it|you win|you won|correct!|you found|you escape|perfect!|winner|🎉)/i,OUT_LOSE=/(too low|too high|nope|wrong|try again|game over|you lose|you lost|defeated|not quite)/i;
function outSound(out){try{const logs=(out||[]).filter(o=>o[0]==="log").map(o=>String(o[1]));for(let i=logs.length-1;i>=0;i--){if(OUT_WIN.test(logs[i]))return sfx("out_win");if(OUT_LOSE.test(logs[i]))return sfx("out_lose")}}catch(e){}}
function paintConsole(el,out,hint){outSound(out);
  if(typeof cur!=="undefined"&&cur&&cur.c&&cur.c.id==="game"&&el.id!=="out-p"&&!out.table){el.classList.add("arcade");return arcadeConsole(el,out,hint)}
  if(out.table&&out.table.columns.length){
    const r=out.table;
    el.innerHTML=`<div class="restbl"><table><thead><tr>${r.columns.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${r.rows.length?r.rows.map(row=>`<tr>${row.map(v=>`<td class="${v===null?"null":""}">${esc(TMSQL.show(v))}</td>`).join("")}</tr>`).join(""):`<tr><td colspan="${r.columns.length}" class="null">(no rows)</td></tr>`}</tbody></table></div><div class="dim">${r.rows.length} row${r.rows.length===1?"":"s"}</div>`;
    return;
  }
  el.innerHTML=out.length?out.map(([k,v])=>`<div class="${k==="err"?"err":""}">${k==="err"?"✖ ":"› "}${esc(v)}</div>`).join(""):`<span class="dim">(nothing printed${hint?". "+hint:""})</span>`;
}
const PRINT_HINT={js:"Try console.log",py:"Try print()",cs:"Try Console.WriteLine",cpp:"Try std::cout <<",java:"Try System.out.println",swift:"Try print()",sql:"Try a SELECT"};

/* ---------- Grading code challenges ---------- */
const norm=l=>{l=String(l).trim();return /^[\[{]/.test(l)?l.replace(/\s+/g,""):l};
function checkOut(st,out){
  const err=out.find(o=>o[0]==="err");
  if(err)return [false,"Your code hit an error. The red line in the console says what went wrong, and usually which line.",String(err[1]).slice(0,240)];
  const logs=out.filter(o=>o[0]==="log").map(o=>o[1]);
  if(st.out){
    const ok=st.out.length===logs.length&&st.out.every((e,i)=>norm(e)===norm(logs[i]));
    if(!ok)return [false,"Close! The output doesn't match yet.",`Expected:\n${st.out.join("\n")}\n\nYou printed:\n${logs.join("\n")||"(nothing)"}`];
  }
  for(const [re,msg] of st.outRe||[])if(!logs.some(l=>re.test(l)))return [false,msg];
  return [true];
}
async function grade(st,code,kind="js"){code=fixSmart(code);
  const run=RUNNERS[kind];
  for(const [re,msg] of st.use||[])if(!re.test(code))return [false,msg];
  if(st.tests){
    for(const t of st.tests){
      const r=checkOut({out:t.out},await run(code,t.input,true));
      if(!r[0]){const typed=String(t.input||"").split("\n").filter(Boolean).join(", ");
        return [false,r[1]==="Close! The output doesn't match yet."?`Close! When the player types ${typed?typed:"nothing"}, the game doesn't print the right thing yet.`:r[1],r[2]]}
    }
    return [true,st.win||pick(WINS)];
  }
  const r=checkOut(st,await run(code,st.input,true));if(!r[0])return r;
  for(const [find,rep,lines] of st.variants||[]){
    if(!find.test(code))continue;
    const r2=checkOut({out:lines},await run(code.replace(find,rep),st.input,true));
    if(!r2[0])return [false,`Works for this example, but I changed the starting value (${rep}) and it broke. Make sure your code uses the variables instead of fixed answers.`,r2[2]];
  }
  return [true,st.win||pick(WINS)];
}

/* ---------- Web preview (HTML & CSS course): renders into an isolated shadow root ---------- */
const WEB_BASE='<style>:host{all:initial;display:block;background:#fff;color:#111;font:16px/1.45 system-ui,-apple-system,sans-serif;padding:12px;min-height:72px;overflow:auto}img{max-width:100%}</style>';
function renderWeb(host,code){
  const root=host.shadowRoot||host.attachShadow({mode:"open"});
  root.innerHTML=WEB_BASE+code.replace(/<script[\s\S]*?<\/script>/gi,"");
  if(!root.__guard){root.__guard=true;
    root.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("a[href]");if(a){e.preventDefault();toast("Links don't open in the preview, but in a real website this would go to "+a.getAttribute("href"))}});
    root.addEventListener("submit",e=>{e.preventDefault();toast("Form submitted! (In a real site, this would send the data.)")});}
  return root;
}
let webScratch=null;
function sameCss(root,prop,expected,actual){
  const probe=document.createElement("span");probe.style.setProperty(prop,expected);root.appendChild(probe);
  const want=getComputedStyle(probe).getPropertyValue(prop);probe.remove();
  return want===actual||String(expected).trim()===String(actual).trim();
}
function gradeWebNow(st,code){
  for(const [re,msg] of st.use||[])if(!re.test(code))return [false,msg];
  if(!webScratch){webScratch=document.createElement("div");webScratch.style.cssText="position:absolute;left:-9999px;top:0;width:360px";document.body.appendChild(webScratch)}
  const root=renderWeb(webScratch,code);
  for(const ck of st.checks||[]){
    const els=[...root.querySelectorAll(ck.sel)];
    if(!els.length)return [false,ck.msg];
    if(ck.count&&els.length<ck.count)return [false,ck.msg];
    const el=els[0];
    if(ck.text&&!els.some(e=>ck.text.test(e.textContent.trim())))return [false,ck.msg];
    if(ck.attr&&!(el.getAttribute(ck.attr[0])||"").match(ck.attr[1]))return [false,ck.msg];
    if(ck.style){const cs=getComputedStyle(el);for(const [p,v] of Object.entries(ck.style)){
      const actual=cs.getPropertyValue(p);
      const ok=v instanceof RegExp?v.test(actual):sameCss(root,p,v,actual);
      if(!ok)return [false,ck.msg]}}
  }
  return [true,st.win||pick(WINS)];
}

/* ---------- SQL tables ---------- */
function tableHTML(c,name){
  const t=c.tables[name];const numCol=t.cols.map((x,i)=>t.rows.every(r=>typeof r[i]==="number"||r[i]===null));
  return `<div class="tbl"><div class="label">${name}</div><div class="tscroll"><table><thead><tr>${t.cols.map((x,i)=>`<th class="${numCol[i]?"num":""}">${x}</th>`).join("")}</tr></thead><tbody>${
    t.rows.map(r=>`<tr>${r.map(v=>`<td class="${typeof v==="number"?"num":v===null?"null":""}">${v===null?"NULL":esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
}

/* ---------- Courses ---------- */
const COURSES=[
  {...COURSE_JS,tag:"console.log('hi')",runnable:true,lang:"script.js"},
  {...COURSE_GAME,tag:"dice, mazes & dungeons",runnable:true,lang:"game.js"},
  {...COURSE_PY,tag:"print('hi')",runnable:"py",lang:"main.py"},
  {...COURSE_WEB,tag:"<h1>hi</h1>",runnable:"web",lang:"index.html"},
  {...COURSE_SQL,tag:"SELECT 'hi';",runnable:"sql",lang:"query.sql",rushHint:"Each result row is on its own line, columns split by |."},
  {...COURSE_CS,tag:'Console.WriteLine("hi");',runnable:"cs",lang:"Program.cs"},
  {...COURSE_CPP,tag:'std::cout << "hi";',runnable:"cpp",lang:"main.cpp"},
  {...COURSE_JAVA,tag:'System.out.println("hi");',runnable:"java",lang:"Main.java"},
  {...COURSE_SWIFT,tag:'print("hi")',runnable:"swift",lang:"main.swift"},
  {...COURSE_JR,tag:"puzzles for ages 7–12",kids:true,lang:"TypeMonkey moves"},
  {...COURSE_PROJECTS,pickAny:true,tag:"build real programs",runnable:"py",lang:"main.py",langName:"Python"},
  {...COURSE_BUGLAB,tag:"fix broken code",runnable:"py",lang:"main.py",langName:"Python"}
];
const courseById=id=>COURSES.find(c=>c.id===id);
function flat(c){const L=[];(c.units||[]).forEach((u,ui)=>u.lessons.forEach((l,li)=>L.push({l,u,ui,li,idx:L.length})));return L}
function findLesson(id){for(const c of COURSES){const f=flat(c).find(x=>x.l.id===id);if(f)return {c,...f}}return null}
function status(c,item){
  const {l,u,idx}=item;
  if(!l.steps)return "soon";
  if(S.done.includes(l.id))return "done";
  if(!u.free&&!S.pro)return "pro";
  if(idx===0)return "open";
  const L=flat(c);
  /* Build Projects: pick any project in an open level. A level opens once 2 projects in the level before it
     are done (or all of them, if that level has fewer than 2). */
  if(c.pickAny){if(item.ui===0)return "open";const prevL=L.filter(x=>x.ui===item.ui-1&&x.l.steps);
    return prevL.filter(x=>S.done.includes(x.l.id)).length>=Math.min(2,prevL.length)?"open":"locked"}
  const prev=L[idx-1];
  return (!prev.l.steps||S.done.includes(prev.l.id))?"open":"locked";
}
function countLessons(c){const L=flat(c).filter(x=>x.l.steps);return [L.filter(x=>S.done.includes(x.l.id)).length,L.length,flat(c).length]}
function nextUp(c){const L=flat(c);return L.find(x=>S.progress[x.l.id])||L.find(x=>status(c,x)==="open")}

/* ---------- Home ---------- */
function home(){
  SFX.stopMusic();rerender=home;setMode(false);
  const lc=courseById(S.lastCourse);const js=lc&&lc.units&&nextUp(lc)?lc:COURSES[0];const nu=nextUp(js);const resume=nu&&S.progress[nu.l.id];
  const inC=js===COURSES[0]?"":` in ${js.name}`;
  const nextPro=!nu&&flat(js).find(x=>x.l.steps&&status(js,x)==="pro");
  const greet=resume?`Welcome back! You were in the middle of ${Q(nu.l.title)}`:
    nextPro?`You finished every free JavaScript lesson! Unlock the full course to keep going with ${Q(nextPro.l.title)}`:
    S.done.length?(nu?`Nice to see you! Next up${inC}: ${Q(nu.l.title)} Tap the big orange button to keep going.`:"You've finished JavaScript! Try Java, C# or C++ next, or build something in the Playground."):"Hey! I'm TypeMonkey, your coding buddy. Tap the big orange button to write your first line of code. I'll help you every step of the way!";
  $("#screen").innerHTML=`<div class="stack">
    <section class="hero"><h1>Learn to code, one banana at a time.</h1><p>Bite-size lessons, real code you run yourself, quizzes and mini-games. Built for all ages and experience levels.</p></section>
    ${buddy(greet,resume?"cheer":"happy")}
    ${nu?`<button class="continue" id="cont"><span class="cicon" aria-hidden="true">▶</span><span class="ctext"><small>${resume?"Pick up where you left off":S.done.length?"Continue":"Start here"} · ${esc(js.name)}</small><b>${esc(nu.l.title)}</b><span>${resume?`Step ${resume.step+1} of ${nu.l.steps.length-1} · saved`:`Unit ${nu.ui+1} · ${esc(nu.u.name)}`}</span></span><span class="cgo">${resume?"Resume":S.done.length?"Continue":"Start"}</span></button>`:nextPro?`<div class="row"><button class="btn banana" id="unl">See the full course</button></div>`:""}
    <button class="daily ${dailyDoneToday()?"done":""}" id="daily"><span class="dicon">🎯</span><span class="dtext"><b>${dailyDoneToday()?"Daily challenge done!":"Daily challenge · "+DAY_THEMES[new Date().getDay()][1]+" "+DAY_THEMES[new Date().getDay()][2]}</b><span>${dailyDoneToday()?`Come back tomorrow for a new one · 🔥 ${(S.daily||{}).streak||1}-day daily streak`:`3 fresh challenges, new every day · bonus bananas${(S.daily||{}).streak?` · keep your ${(S.daily||{}).streak}-day streak going`:""}`}</span></span><span class="pill ${dailyDoneToday()?"ok":"kid"}">${dailyDoneToday()?"✓":"+10 🍌"}</span></button>
    <div class="tools">
      <button class="tool" id="review"><b>🧠 Review${dueCount()?` <span class="due">${dueCount()}</span>`:""}</b><span>${dueCount()?"Questions you missed are ready to try again":reviewSize()?"All caught up! Missed questions come back here":"Questions you miss come back here later"}</span></button>
      <button class="tool" id="play"><b>›_ Playground</b><span>Write any code you want and run it</span></button>
      <button class="tool" id="projects"><b>🏗️ Build Projects</b><span>Make real games and apps in Python, one mission at a time</span></button>
      <button class="tool" id="buglab"><b>🐛 Bug Lab</b><span>This Python code is broken. Can you fix it?</span></button>
    </div>
    <div class="label">Courses</div>
    <div class="courses">${COURSES.filter(c=>!c.extra).map(c=>{
      if(c.soon)return `<button class="course locked" data-c="${c.id}"><span class="pill ${c.kids?"kid":""}">${c.kids?"Kids section":"Coming soon"}</span><h3>${c.name}</h3><span class="tag">${esc(c.tag)}</span></button>`;
      const [d,n,all]=countLessons(c);
      return `<button class="course ${c.id==="js"?"live":""} ${c.kids?"kids":""}" data-c="${c.id}"><span class="pill ${d===n&&n===all?"ok":c.kids&&!d?"kid":"go"}">${d===n&&n===all?"Complete":d?"In progress":c.id==="js"?"Start here":c.kids?"Kids section":"New"}</span>
        <h3>${c.name}</h3><span class="tag">${esc(c.tag)}</span><span class="meta">${c.units.length} units · ${n} lessons${all>n?" (more coming)":""}</span>
        <div class="mini"><span style="width:${n?d/n*100:0}%"></span></div></button>`}).join("")}</div>
    ${S.pro?`<div class="unlocked">✓ Full version unlocked. Thanks for supporting TypeMonkey!</div>`:`<div class="paywall"><div><h3>Unlock the full version</h3><p>All ${COURSES.reduce((n,c)=>n+countLessons(c)[1],0)} lessons in all ${COURSES.filter(c=>!c.extra).length} courses, every Build Project and Bug Lab level, and everything we add later. One-time purchase, no subscription.</p></div><button class="btn banana" id="homebuy">Unlock · ${STORE.price}</button></div>`}
    <div class="label">Rewards</div>
    <div class="tools">
      <button class="tool" id="shop"><b>🛍️ Shop</b><span>Spend bananas on outfits for TypeMonkey</span></button>
      <button class="tool" id="badges"><b>🏆 Badges <span class="due">${badgeList().filter(b=>S.badges[b.id]).length}/${badgeList().length}</span></b><span>Earn badges and bonus bananas</span></button>
    </div>
  </div>`;
  if($("#cont"))$("#cont").onclick=()=>startLesson(nu.l.id);
  if($("#unl"))$("#unl").onclick=()=>coursePage("js");
  if($("#homebuy"))$("#homebuy").onclick=()=>unlockFull(home);
  $("#play").onclick=()=>playground();$("#shop").onclick=()=>shop();$("#review").onclick=startReview;$("#badges").onclick=badgesPage;$("#daily").onclick=startDaily;$("#projects").onclick=()=>coursePage("projects");$("#buglab").onclick=()=>coursePage("buglab");
  $$(".course").forEach(b=>b.onclick=()=>{const c=courseById(b.dataset.c);
    if(c.soon)toast(c.kids?"TypeMonkey Jr. is on the roadmap!":c.name+" is coming soon.");else coursePage(c.id)});
  foot();window.scrollTo(0,0);
}
function foot(){
  $("#foot").innerHTML=`<span>TypeMonkey · your progress saves on this device</span>
   <div class="row"><button class="linkbtn" id="terms">Terms</button><button class="linkbtn" id="privacy">Privacy</button><button class="linkbtn" id="fbackup">Back up progress</button><button class="linkbtn" id="fset">Settings</button></div>`;
  $("#terms").onclick=()=>legalPage("terms");$("#privacy").onclick=()=>legalPage("privacy");$("#fset").onclick=settingsPage;$("#fbackup").onclick=backupPage;
}
/* ---------- The one-time "unlock everything" purchase ----------
   In the iPhone / Android app this goes through the App Store / Google Play (plugin @capgo/native-purchases,
   no outside server). On the web it stays a demo unlock. Always behind the grown-up check. */
const IAP_ID="typemonkey_full_unlock";
const STORE={price:"$4.99",native:false};
function nativeStore(){try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.NativePurchases||null}catch(e){return null}}
const ownsUnlock=list=>(list||[]).some(p=>p&&p.productIdentifier===IAP_ID&&(p.purchaseState==null||/^(purchased|1)$/i.test(String(p.purchaseState))));
async function storeCheck(){const np=nativeStore();if(!np)return false;
  try{const {purchases}=await np.getPurchases({productType:"inapp"});if(ownsUnlock(purchases)){if(!S.pro){S.pro=true;save();rerender&&rerender()}return true}}catch(e){}
  return false}
async function storeInit(){const np=nativeStore();if(!np)return;STORE.native=true;
  try{const {products}=await np.getProducts({productIdentifiers:[IAP_ID],productType:"inapp"});const pr=products&&products.find(x=>x.identifier===IAP_ID||x.productIdentifier===IAP_ID)||products&&products[0];
    if(pr&&pr.priceString){STORE.price=pr.priceString;if(!S.pro&&rerender)rerender()}}catch(e){}
  storeCheck()}
function unlockFull(after){grownUpGate(async()=>{
  const np=nativeStore();
  if(!np){S.pro=true;save();toast("Demo unlock: everything is open. In the app this is the App Store / Google Play purchase.");after&&after();return}
  toast("Opening the store…");
  try{const t=await np.purchaseProduct({productIdentifier:IAP_ID,productType:"inapp",quantity:1,autoAcknowledgePurchases:true});
    if(t&&(t.transactionId||t.productIdentifier===IAP_ID)||await storeCheck()){S.pro=true;save();sfx("complete");toast("Thank you! Everything is unlocked 🎉");after&&after()}}
  catch(e){const m=String(e&&(e.message||e.code)||e);
    if(await storeCheck()){toast("Everything is unlocked 🎉");after&&after();return}
    toast(/cancel/i.test(m)?"No problem. Nothing was charged.":"The purchase didn't go through. Please try again later.")}
})}
async function restoreFull(after){const np=nativeStore();
  if(!np){toast(S.pro?"Your purchase is already active.":"In the app this checks the App Store / Google Play for your purchase.");return}
  toast("Checking your purchases…");
  try{await np.restorePurchases()}catch(e){}
  const own=await storeCheck();toast(own||S.pro?"Purchase restored! Everything is unlocked 🎉":"No purchase found for this account.");if(own)after&&after()}
let rerender=home;
function setMode(){}

/* ---------- Course page ---------- */
/* Course map: lessons as a winding path of big circles (easy to tap on a phone) */
function pathHTML(c,L,ui,nuId){
  const OFF=[0,1,2,1,0,-1,-2,-1];
  return L.filter(x=>x.ui===ui).map((x,k)=>{const st=status(c,x);const res=S.progress[x.l.id]&&st!=="pro"&&st!=="soon";
    const cls=st==="done"&&!res?"done":(st==="open"||res||st==="done")?"open":st==="pro"?"pro":"locked";const isNext=x.l.id===nuId;
    const icon=cls==="done"?"✓":cls==="locked"||cls==="pro"?"🔒":x.l.project?"★":x.idx+1;
    const sub=res?`Step ${S.progress[x.l.id].step+1} of ${x.l.steps.length-1} · saved`:cls==="pro"?"Pro":x.l.sub;
    return `<div class="pnode ${cls} ${isNext?"next":""} ${x.l.project?"proj":""}" style="--off:${OFF[k%8]}">
      <button class="lesson pbtn" data-l="${x.l.id}" aria-label="${esc(x.l.title)}${cls==="done"?" (done)":cls==="locked"?" (locked)":""}" ${cls==="open"||cls==="done"||res?"":"disabled"}>${isNext?`<span class="pstart">${res?"RESUME":"START"}</span>`:""}<span class="pic">${icon}</span></button>
      <div class="plabel"><b>${x.l.title}</b><span>${sub}</span>${res?`<button class="linkbtn" data-restart="${x.l.id}">Start over</button>`:""}</div></div>`}).join("");
}
/* Course map: a little TypeMonkey sits beside your next lesson. Right after you finish a lesson he hops along
   the path from that lesson to the next one. */
let mapWalk=null;   // {cid, from} set by finish()
function placeWalker(cid,nuId){
  const W=mapWalk&&mapWalk.cid===cid?mapWalk:null;mapWalk=null;
  const node=nuId&&document.querySelector(`.pnode .pbtn[data-l="${nuId}"]`);if(!node)return;
  const pn=node.closest(".pnode"),el=document.createElement("div");el.className="pwalker";el.setAttribute("aria-hidden","true");el.innerHTML=monkey("happy");pn.appendChild(el);
  const from=W&&document.querySelector(`.pnode .pbtn[data-l="${W.from}"]`);
  if(!from||from===node||calmMotion())return;
  node.scrollIntoView({block:"center"});
  const a=from.getBoundingClientRect(),b=el.getBoundingClientRect();
  const dx=a.left+a.width/2-(b.left+b.width/2),dy=a.top+a.height/2-(b.top+b.height/2);
  const hops=Math.max(2,Math.min(5,Math.round(Math.hypot(dx,dy)/45))),kf=[];
  for(let i=0;i<=hops*2;i++){const t=i/(hops*2),lift=i%2?-26:0;kf.push({transform:`translate(${dx*(1-t)}px,${dy*(1-t)+lift}px) scale(${i%2?1.06:1},${i%2?1.06:.94})`,offset:t})}
  el.classList.add("walking");
  const an=el.animate(kf,{duration:hops*320,delay:350,easing:"linear",fill:"backwards"});
  for(let i=0;i<hops;i++)setTimeout(()=>sfx("step"),350+i*320);
  an.onfinish=()=>{el.classList.remove("walking");el.classList.add("arrived");sfx("ding")};
}
function coursePage(cid){
  SFX.stopMusic();
  rerender=()=>coursePage(cid);
  const c=courseById(cid);setMode(c.kids);const L=flat(c);const [d,n]=countLessons(c);
  const nu=nextUp(c);const nuId=nu&&status(c,nu)!=="pro"?nu.l.id:null;
  $("#screen").innerHTML=`<div class="stack">
    <div class="row"><button class="btn ghost sm" id="back">← ${c.extra?"Home":"Courses"}</button></div>
    <section class="hero"><div class="label">${c.extra?"Practice":"Course"}</div><h1>${c.name}${c.langName?` <span class="langtag big">🐍 ${c.langName}</span>`:""}</h1><p>${c.blurb||""}</p></section>
    <div class="row"><div class="progress"><span style="width:${n?d/n*100:0}%"></span></div><b style="font-variant-numeric:tabular-nums">${d}/${n}</b></div>
    ${nuId?`<button class="btn" id="ccont">▶ ${S.progress[nuId]?"Resume":c.pickAny&&!d?"Start":d?"Continue":"Start"}: ${esc(nu.l.title)}</button>`:""}
    ${c.pickAny?`<p class="pickhint">👉 Pick any project you like in an open level. Finish any 2 projects in a level to open the next one. Not sure where to start? Try the one marked <b>⭐ Recommended next</b>.</p>`:""}
    ${c.units.map((u,ui)=>`<div class="unit"><div class="unit-head"><h3>${c.kids?WORLDS[ui%WORLDS.length].emoji+" ":""}Unit ${ui+1} · ${u.name}</h3><span class="label">${u.free?"Free":S.pro?"Unlocked":"Pro"}</span></div>${c.pickAny&&ui>0&&(S.pro||u.free)&&L.filter(x=>x.ui===ui).every(x=>status(c,x)==="locked")?(()=>{const pv=L.filter(x=>x.ui===ui-1&&x.l.steps),need=Math.min(2,pv.length)-pv.filter(x=>S.done.includes(x.l.id)).length;return `<p class="pickhint">🔒 Finish ${need} more ${c.units[ui-1].name} project${need===1?"":"s"} to open this level.</p>`})():""}<div class="${c.pickAny?"lessons":"path"}">${
      c.pickAny?L.filter(x=>x.ui===ui).map(x=>{const st=status(c,x);const res=S.progress[x.l.id]&&st!=="pro"&&st!=="soon";
        const cls=st==="done"&&!res?"done":(st==="open"||res||st==="done")?"open":"";
        const isNext=x.l.id===nuId;
        return `<button class="lesson ${cls} ${x.l.project?"proj":""} ${isNext?"next":""}" data-l="${x.l.id}" ${st==="open"||st==="done"||res?"":"disabled"}>
          <span class="dot">${st==="done"&&!res?"✓":x.l.project?"★":x.idx+1}</span>
          <span class="t">${isNext?`<span class="nexttag">${c.pickAny?"⭐ Recommended next":"👉 Next up"}</span>`:""}<b>${x.l.title}</b><span>${res?`Step ${S.progress[x.l.id].step+1} of ${x.l.steps.length-1} · saved`:x.l.sub}</span></span>
          <span class="pill ${st==="open"||res?"go":st==="done"?"ok":""}">${res?"Resume":{done:"Replay",open:"Play",pro:"Pro",locked:"🔒",soon:"Soon"}[st]}</span></button>
          ${res?`<button class="linkbtn" data-restart="${x.l.id}">Start “${x.l.title}” over</button>`:""}`}).join(""):pathHTML(c,L,ui,nuId)}</div></div>`).join("")}
    ${S.pro?"":`<div class="paywall"><div><h3>Unlock all of TypeMonkey</h3><p>Every unit in every language, plus future courses and bonus games. One-time purchase.</p></div><button class="btn banana" id="buy">Unlock · ${STORE.price}</button></div>`}
  </div>`;
  $("#back").onclick=home;
  if($("#ccont"))$("#ccont").onclick=()=>startLesson(nuId);
  if($("#buy"))$("#buy").onclick=()=>unlockFull(()=>coursePage(cid));
  $$(".lesson:not([disabled])").forEach(b=>b.onclick=()=>startLesson(b.dataset.l));
  $$("[data-restart]").forEach(b=>b.onclick=()=>{delete S.progress[b.dataset.restart];save();startLesson(b.dataset.restart)});
  foot();window.scrollTo(0,0);
  if(!c.pickAny)placeWalker(cid,nuId);
}

/* ---------- Lesson runner ---------- */
let cur=null;
function startLesson(id){
  {const f0=findLesson(id);if(f0){S.stats.started=S.stats.started||[];if(!S.stats.started.includes(f0.c.id)){S.stats.started.push(f0.c.id)}}}
  const f=findLesson(id);const p=S.progress[id];if(f.c.units&&!f.c.extra)S.lastCourse=f.c.id;
  cur={c:f.c,l:f.l,item:f,step:0,earned:{xp:0,ban:0,right:0,total:0}};
  if(p&&p.step>0&&p.step<f.l.steps.length-1){cur.step=p.step;cur.earned={...cur.earned,...p.earned}}
  rerender=renderStep;renderStep();
}
function saveSpot(){
  const p=S.progress[cur.l.id]||{drafts:{}};
  S.progress[cur.l.id]={...p,step:cur.step,earned:{...cur.earned}};save();
}
function draft(k,v){const p=S.progress[cur.l.id];if(!p)return;p.drafts=p.drafts||{};if(v===undefined)return p.drafts[k];p.drafts[k]=v;save()}
let SCREEN_ID=0;  // bumps on every new lesson screen, so animations from an old screen stop drawing
function shell(inner){
  SCREEN_ID++;if(wallObs){wallObs.disconnect();wallObs=null}
  setMode(cur&&cur.c&&cur.c.kids);
  const pct=Math.round(cur.step/(cur.l.steps.length-1)*100);
  $("#screen").innerHTML=`<div class="stack">
    <div class="lessonbar"><button class="x" id="quit" aria-label="Leave lesson">×</button><div class="progress"><span style="width:${pct}%"></span></div></div>
    ${inner}${cur.c.tables?`<details class="drawer"><summary>📋 Show the zoo tables</summary>${Object.keys(cur.c.tables).map(t=>tableHTML(cur.c,t)).join("")}</details>`:""}</div>`;
  $("#quit").onclick=()=>cur.review||cur.daily?home():coursePage(cur.c.id);
  dockActions();watchWallWords();
  $("#foot").innerHTML="";window.scrollTo(0,0);
}
/* Phone-first lesson layout: the main buttons live in one bar pinned to the bottom (where your thumb is).
   Feedback slides up inside that bar, and in tap mode the tile tray sits there too, like a keyboard. */
function dockActions(){
  const scr=$("#screen");scr.classList.remove("tapmode");
  const act=[...scr.querySelectorAll(".stack > .row")].find(r=>r.querySelector("#go,#check,#run"));if(!act)return;
  const bar=document.createElement("div");bar.className="actionbar";act.replaceWith(bar);
  const tray=scr.querySelector("#ttray");if(tray)bar.appendChild(tray);
  const fb=scr.querySelector(".card #fb");if(fb)bar.appendChild(fb);
  act.classList.add("actrow");bar.appendChild(act);
}
function next(){if(cur&&cur.daily){const st=cur.l.steps[cur.step];if(st&&st.type!=="quiz"&&st.type!=="done"){cur.earned.total++;cur.earned.right++}}cur.step++;renderStep()}
const inputBox=(id,val)=>`<details class="stdin" ${val?"open":""}><summary>⌨️ Input <span>(what the player types)</span></summary><textarea id="in-${id}" rows="2" spellcheck="false" autocapitalize="off" autocorrect="off" placeholder="Type what the user would type, one answer per line" aria-label="Program input">${esc(val||"")}</textarea></details>`;
function editorBlock(id,code,runnable,file,input){
  const wantsIn=runnable&&runnable!=="web"&&runnable!=="sql"&&(input||/\b(input|ReadLine|Scanner|readLine|prompt|cin)\b/.test(code));
  return `<div class="editor"><div class="head"><span>${file}</span>${runnable?`<button class="run" id="run-${id}">${runnable==="web"?"▶ Show page":"▶ Run"}</button>`:""}</div>
    ${runnable?`<textarea id="code-${id}" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" aria-label="Code editor" rows="${Math.min(14,Math.max(5,code.split("\n").length+1))}">${esc(code)}</textarea>
    ${symBar(id)}${wantsIn?inputBox(id,input):""}
    ${runnable==="web"?`<div class="webview" id="out-${id}" aria-label="Page preview"></div>`:(cur&&cur.c&&cur.c.id==="game"?`<div class="console arcade" id="out-${id}"><div class="arcade-top"><span>🎮 GAME SCREEN</span></div><span class="dim">Press ▶ Run to play</span></div>`:`<div class="console" id="out-${id}"><span class="dim">Console output appears here</span></div>`)}`:`<pre>${esc(code)}</pre>`}</div>`;
}
/* Phones love "smart" punctuation: curly quotes and … break code, so turn them back into plain ' " and ... */
const fixSmart=t=>String(t).replace(/[\u2018\u2019\u201A\u2032]/g,"'").replace(/[\u201C\u201D\u201E\u2033]/g,'"').replace(/\u2026/g,"...").replace(/\u00A0/g," ");
/* Stop phone keyboards' smart quotes / … before they land (and clean up anything that slips through) */
function wireSmart(ta){
  ta.addEventListener("beforeinput",e=>{const d=e.data;if(d&&fixSmart(d)!==d&&typeof ta.setRangeText==="function"){e.preventDefault();ta.setRangeText(fixSmart(d),ta.selectionStart,ta.selectionEnd,"end");ta.dispatchEvent(new Event("input",{bubbles:true}))}});
  const clean=()=>{const v=ta.value,n=fixSmart(v);if(n!==v){const p=ta.selectionStart+(n.length-v.length);ta.value=n;try{ta.selectionStart=ta.selectionEnd=Math.max(0,p)}catch(e){}}};
  ta.addEventListener("input",clean);ta.addEventListener("compositionend",()=>setTimeout(clean,0));ta.addEventListener("blur",clean);ta._clean=clean;
}
function wireEditor(id,after,kind){
  const ta=$("#code-"+id);if(!ta)return;
  wireSmart(ta);
  ta.addEventListener("keydown",e=>{if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart;ta.value=ta.value.slice(0,s)+"  "+ta.value.slice(ta.selectionEnd);ta.selectionStart=ta.selectionEnd=s+2}});
  const out=$("#out-"+id),web=out.classList.contains("webview");
  if(web)renderWeb(out,ta.value);
  $("#run-"+id).onclick=async()=>{if(ta._clean)ta._clean();if(web){renderWeb(out,ta.value);after&&after(ta.value);return}
    const k=kind||(cur?kindOf(cur.c):"js");ranLang(k);const inEl=$("#in-"+id);const res=await RUNNERS[k](ta.value,inEl?inEl.value:undefined);paintConsole(out,res,PRINT_HINT[k]);after&&after(ta.value,res)};
}
const award=(xp,ban=0)=>{cur.earned.xp+=xp;cur.earned.ban+=ban};

function renderStep(){
  const s=cur.l.steps[cur.step];const R=cur.c.runnable;
  if((s._course||cur.c).runnable==="py"&&!(globalThis.__BRYTHON__||{}).runPythonSource)warmPython();
  if(s._course)cur.c=s._course;
  if(s.type!=="done"&&!cur.review&&!cur.daily)saveSpot();
  jrMusic(s);
  const T={talk,code:codeStep,bug:codeStep,quiz,fill,order,maze,dance,sort:sorter,box:boxGame,predict,build:builder,game:gameIntro,done:finish}[s.type];T(s,R);
}
/* For TypeMonkey Jr.: read the card out loud for kids who are still learning to read */
const canSpeak=false; // read-aloud turned off (owner preference); the code paths below stay inert
function readAloudBtn(){return cur&&cur.c&&cur.c.kids&&canSpeak?`<button class="btn ghost sm readaloud" id="say" type="button">🔊 Read to me</button>`:""}
function wireReadAloud(){const b=$("#say");if(!b)return;b.onclick=()=>{try{speechSynthesis.cancel();const card=document.querySelector(".card");const t=[...card.querySelectorAll("h2,p")].map(x=>x.textContent).join(". ");const bub=document.querySelector("#bud .bubble,.bubble");const u=new SpeechSynthesisUtterance(t+(bub?". "+bub.textContent:""));u.rate=.92;u.pitch=1.15;speechSynthesis.speak(u)}catch(e){toast("Reading out loud isn't available on this device")}}}
function bananaBurst(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const box=document.createElement("div");box.className="burst";box.setAttribute("aria-hidden","true");
  for(let i=0;i<18;i++){const sp=document.createElement("span");sp.textContent=i%3?"🍌":"⭐";sp.style.setProperty("--x",(Math.random()*2-1)*160+"px");sp.style.setProperty("--y",-(80+Math.random()*180)+"px");sp.style.setProperty("--r",(Math.random()*720-360)+"deg");sp.style.animationDelay=(Math.random()*.15)+"s";box.appendChild(sp)}
  document.body.appendChild(box);setTimeout(()=>box.remove(),1600)}
const todo=(txt,extra="")=>`<p class="todo"><span>👉 ${txt}</span>${extra}</p>`;
function talk(s,R){
  shell(`<div class="card">${s.demo&&R?todo("Read this, press ▶ Run to try the code, then tap Continue."):cur.step===0?todo("Read this, then tap Continue."):""}<h2>${s.title}</h2>${s.body}${(s.show||[]).map(t=>tableHTML(cur.c,t)).join("")}${s.demo?editorBlock("d",s.demo,R,cur.c.lang,s.input):""}</div>
    ${buddy(s.say||"",s.mood||"happy")}<div class="row">${s.demo&&R?`<button class="btn banana" id="trund">${R==="web"?"▶ Show the example":"▶ Run the example"}</button>`:""}<button class="btn" id="go">Continue</button>${readAloudBtn()}</div>`);
  if(s.demo&&R)wireEditor("d");$("#go").onclick=next;wireReadAloud();
  if($("#trund"))$("#trund").onclick=()=>{const b=$("#run-d");if(b)b.click();setTimeout(()=>{try{$("#out-d").scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}},400)};
}
/* ---------- TypeMonkey's help: a plan, then the answer one line at a time ---------- */
function newLines(s){const have=new Set((s.start||"").split("\n").map(l=>l.trim()).filter(Boolean));return (s.hint||"").split("\n").filter(l=>l.trim()&&!have.has(l.trim()))}
function helpPlan(s){return {tips:s.use||[],lines:newLines(s)}}
/* Warm-ups: before a long challenge, show TypeMonkey's version with a few pieces missing, so you see the shape first */
const WARM_WORDS={js:["for","while","if","else","return","const","let","function","push","length","console","log","Math","class","new","this","of"],
  py:["for","while","if","elif","else","return","def","print","append","range","len","in","class","self","import"],
  java:["for","while","if","else","return","static","new","System","println","add","get","size","length","class","this","int","String","throw","try","catch"],
  cs:["for","foreach","while","if","else","return","static","new","Console","WriteLine","Add","Count","Length","class","int","string","throw","try","catch"],
  cpp:["for","while","if","else","return","int","std","cout","push_back","size","class","struct","void","double"],
  swift:["for","while","if","else","guard","return","func","let","var","print","append","count","in","struct","class","init","self","throw","try","switch","case"],
  sql:["SELECT","FROM","WHERE","ORDER","BY","GROUP","JOIN","ON","COUNT","SUM","AS","INSERT","INTO","VALUES","UPDATE","SET","LEFT","DESC"]};
function makeWarmup(s,kind){
  if(/\[\d\]/.test(s.hint||""))return null;
  const lines=newLines(s);if(lines.length<6)return null;
  const pool=WARM_WORDS[kind]||WARM_WORDS.js;const useSrc=(s.use||[]).map(u=>u[0].source).join(" ");
  const code=s.hint.split("\n");const newSet=new Set(lines);const picked=[];
  for(let li=0;li<code.length&&picked.length<3;li++){
    const line=code[li];if(!newSet.has(line))continue;
    const re=/[A-Za-z_][A-Za-z0-9_]*/g;let m;
    while((m=re.exec(line))){
      const w=m[0];const before=line.slice(0,m.index);
      if((before.split('"').length-1)%2||(before.split("'").length-1)%2||(before.split("`").length-1)%2)continue;
      if(before.includes("//")||before.includes("#")&&kind==="py")break;
      if(picked.some(p=>p.w===w))continue;
      if(!(pool.includes(w)||(w.length>2&&useSrc.includes(w))))continue;
      picked.push({li,at:m.index,w});break;
    }
  }
  if(picked.length<2)return null;
  picked.forEach((p,i)=>{const l=code[p.li];code[p.li]=l.slice(0,p.at)+"["+i+"]"+l.slice(p.at+p.w.length)});
  const blanks=picked.map(p=>p.w);
  const extra=pool.filter(w=>!blanks.includes(w)&&!s.hint.includes(w)).slice(0,2);
  return {type:"fill",auto:true,title:"Warm-up: "+s.title,body:`<p>This one's a bigger challenge, so first TypeMonkey will show you a way to do it. Fill in the missing pieces, then you'll write it yourself.</p>`,
    code:code.join("\n"),blanks,tokens:[...blanks,...extra],why:"Now you've seen how it fits together. Next, try writing it yourself (you can always tap 💡 Help)."};
}
function addWarmups(){
  for(const c of COURSES){if(!c.units||c.kids||c.runnable==="web")continue;const kind=kindOf(c);
    for(const u of c.units)for(const l of u.lessons){if(!l.steps||l.__warm)continue;l.__warm=true;let added=0;
      for(let i=0;i<l.steps.length&&added<2;i++){const s=l.steps[i];if(s.type!=="code"||s.final)continue;const w=makeWarmup(s,kind);if(w){l.steps.splice(i,0,w);i++;added++}}}}
}
/* ---------- Tap mode: build code from tiles instead of typing (great on phones) ----------
   Short answers become word tiles ( print  (  "Hi"  ) ), longer ones become line tiles to put in order.
   The tiles fill the real editor behind the scenes, so running, grading and hints work the same. */
const isTouch=()=>{try{return matchMedia("(pointer: coarse)").matches}catch(e){return false}};
function tokenizeLine(line){
  const lead=line.match(/^\s*/)[0],rest=line.slice(lead.length);
  const re=/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[^`]*`|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|==|!=|<=|>=|=>|\+=|-=|\*\*|&&|\|\||<<|>>|::|->|[^\s\w])\s*/g;
  const out=[];let m;while((m=re.exec(rest)))out.push(m[0]);
  if(out.join("")!==rest||!out.length)return null;out[0]=lead+out[0];return out;
}
function tilePlan(s){
  if(s.type!=="code"||s.final||!s.hint)return null;
  const lines=t=>String(t||"").replace(/\r/g,"").split("\n");
  const isNote=l=>!l.trim()||/^\s*(#(\s|$)|\/\/|--(\s|$)|<!--)/.test(l);
  const hint=lines(s.hint).filter(l=>!isNote(l)),start=lines(s.start).filter(l=>!isNote(l));
  let pre=0;while(pre<start.length&&pre<hint.length&&start[pre]===hint[pre])pre++;
  if(pre<start.length)pre=0;                       // the starter isn't a clean beginning of the answer: give nothing
  const given=hint.slice(0,pre),todo=hint.slice(pre);
  if(!todo.length)return null;
  if(todo.length===1){const t=tokenizeLine(todo[0]);if(!t||t.length<2||t.length>12)return null;return {mode:"tokens",given,pieces:t}}
  if(todo.length>12)return null;                   // up to 12 lines as line tiles (each keeps its indent, so it is only about order)
  return {mode:"lines",given,pieces:todo};
}
const tileCode=(p,placed)=>[...p.given,...(p.mode==="tokens"?(placed.length?[placed.map(i=>p.pieces[i]).join("")]:[]):placed.map(i=>p.pieces[i]))].join("\n");
const codeInputMode=()=>(S.settings.codeInput||"tap");
function wireTiles(s,p,onMode){
  const ta=$("#code-c"),card=$("#screen");let placed=[];
  const order=(()=>{let o=shuffle(p.pieces.map((_,i)=>i));if(o.length>1&&o.every((v,i)=>v===i))o.reverse();return o})();
  const show=t=>esc(t.replace(/\s+$/,""));
  const indent=t=>(t.match(/^\s*/)[0].length);
  const sync=()=>{ta.value=tileCode(p,placed)};
  const draw=()=>{
    $("#tbuild").innerHTML=(p.given.map(l=>`<div class="tline given" style="--in:${indent(l)}">${show(l)}</div>`).join(""))+
      (p.mode==="tokens"?`<div class="tline tokens">${placed.map((i,k)=>`<button class="tile on" data-k="${k}">${show(p.pieces[i].trim())}</button>`).join("")||'<span class="empty">Tap tiles below to build the line</span>'}</div>`:
        (placed.map((i,k)=>`<button class="tline tile on" data-k="${k}" style="--in:${indent(p.pieces[i])}">${show(p.pieces[i].trimStart())}</button>`).join("")||'<span class="empty">Tap the lines below in the right order</span>'));
    $("#ttray").innerHTML=order.filter(i=>!placed.includes(i)).map(i=>`<button class="tile ${p.mode==="lines"?"tl":""}" data-i="${i}">${show(p.mode==="lines"?p.pieces[i].trim():p.pieces[i].trim())}</button>`).join("")||'<span class="empty">All tiles placed! Press ▶ Run.</span>';
    $$("#tbuild .tile").forEach(b=>b.onclick=()=>{placed.splice(+b.dataset.k,1);sync();draw()});
    $$("#ttray .tile").forEach(b=>b.onclick=()=>{placed.push(+b.dataset.i);sync();draw();try{$("#tbuild").scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}if(placed.length===p.pieces.length){const r=$("#run-c");r&&r.classList.add("ready")}});
  };
  const setMode=m=>{S.settings.codeInput=m;save();card.classList.toggle("tapmode",m==="tap");
    $$("#tmode button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===m));
    if(m==="tap"){placed=[];sync();draw()}else{if(!placed.length)ta.value=draft("c"+cur.step)||s.start}
    onMode&&onMode(m)};
  $$("#tmode button").forEach(b=>b.onclick=()=>setMode(b.dataset.m));
  setMode(codeInputMode());
  return {fill(){placed=p.pieces.map((_,i)=>i);sync();draw()},mode:()=>card.classList.contains("tapmode")?"tap":"type"};
}
const tileBlock=()=>`<div class="tiles"><div class="tmode" id="tmode" role="group" aria-label="How to write the code"><button data-m="tap" aria-pressed="false">🧩 Tap tiles</button><button data-m="type" aria-pressed="false">⌨️ Type it</button></div>
  <div class="tbuild code" id="tbuild"></div><div class="ttray" id="ttray"></div></div>`;
/* A row of code symbols above the keyboard, so typing on a phone is easier */
const SYMS=["(",")",'"',"'",":","=","+","-","*","/","<",">","[","]","{","}",",",".",";","#","_","⇥"];
function symBar(id){return isTouch()?`<div class="symbar" id="sym-${id}" aria-label="Code symbols">${SYMS.map(c=>`<button type="button" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>`:""}
function wireSymBar(id){const bar=$("#sym-"+id),ta=$("#code-"+id);if(!bar||!ta)return;
  bar.addEventListener("pointerdown",e=>e.preventDefault());   // keep the keyboard open
  $$("#sym-"+id+" button").forEach(b=>b.onclick=()=>{const c=b.dataset.c==="⇥"?"    ":b.dataset.c;const a=ta.selectionStart,z=ta.selectionEnd;
    ta.setRangeText(c,a,z,"end");ta.focus();ta.dispatchEvent(new Event("input",{bubbles:true}))})}

function codeStep(s){
  let tries=0,solved=false;const k="c"+cur.step;
  const H=helpPlan(s);let level=0;const isBug=s.type==="bug";
  const LN=cur.c.langName?`<span class="langtag">🐍 ${cur.c.langName}</span>`:"";
  const label=isBug?"🐛 Bug Lab · fix the code":s.final?"🏁 Final build":s.mission?"🏗️ "+esc(s.mission):cur.l.project?"Project step":"Code challenge";
  const firstIn=s.input||(s.tests&&s.tests[0].input)||"";
  const TP=isBug?null:tilePlan(s),tapNow=TP&&codeInputMode()==="tap";
  const doTap=`Tap the ${TP&&TP.mode==="lines"?"lines":"tiles"} in order, then press ${cur.c.runnable==="web"?"▶ Show page":"▶ Run"}.`;
  const doIt=isBug?"Press ▶ Run to see the bug, fix the code, then run it again.":tapNow?doTap:cur.c.runnable==="web"?"Type your code, then tap ▶ Show page.":"Type your code, then press ▶ Run.";
  shell(`<div class="card"><div class="label">${label} · +30 XP ${LN}</div>${todo(doIt,`<button class="hint2" id="hint2" type="button">💡 Stuck? Get help</button>`)}<h2>${s.title}</h2>${s.body}${s.tests&&s.tests.length>1?`<p class="testnote">TypeMonkey will test it ${s.tests.length} ways, typing different answers each time.</p>`:""}${TP?tileBlock():""}${editorBlock("c",draft(k)||s.start,cur.c.runnable||true,cur.c.lang,firstIn)}<div id="fb"></div><div id="peek"></div></div>
    <div id="bud">${buddy(isBug?"This code is broken! Press ▶ Run to see what happens, then fix it. Tap 💡 Hint if you get stuck.":cur.c.runnable==="web"?"Type your code, then tap ▶ Show page. I'll check what you built. Stuck? Tap 💡 Help and I'll give you one clue at a time.":(tapNow?"Tap the pieces in the right order, then hit ▶ Run. Stuck? Tap 💡 Help and I'll give you one clue at a time.":"Write your code, then hit ▶ Run. Stuck? Tap 💡 Help and I'll give you one clue at a time."),"think")}</div>
    <div class="row">${TP?`<button class="btn banana" id="trun" hidden>${cur.c.runnable==="web"?"▶ Show page":"▶ Run"}</button>`:""}<button class="btn" id="go" disabled>Continue</button><button class="btn ghost helpbtn" id="hint">${isBug?"💡 Hint 1":"💡 Help"}</button><button class="linkbtn" id="answer" hidden>${isBug?"Show the fixed code":"Show the whole answer"}</button></div>`);
  const showBugHelp=()=>{
    const hs=s.hints||[];
    if(level<hs.length){level++;
      $("#peek").innerHTML=`<div class="peek">${hs.slice(0,level).map((h,i)=>`<p>💡 <b>Hint ${i+1}:</b> ${h}</p>`).join("")}</div>`;
      $("#hint").textContent=level<hs.length?`💡 Hint ${level+1}`:"🔎 Show explanation";
      $("#bud").innerHTML=buddy(level<hs.length?"Look where the hint points, then try again.":"Still stuck? The explanation tells you exactly what's wrong.","think");return}
    level++;
    $("#peek").innerHTML+=`<div class="peek explain"><b>🔎 What's wrong</b><p>${s.explain||""}</p></div>`;
    $("#hint").hidden=true;$("#answer").hidden=false;
    $("#bud").innerHTML=buddy("Now you know the bug. Fix it in the code and press ▶ Run!","happy");
  };
  const showHelp=()=>{if(isBug)return showBugHelp();
    const code=$("#code-c").value;
    if(level===0&&H.tips.length){level=1;
      $("#peek").innerHTML=`<div class="peek"><b>TypeMonkey's plan</b><ul>${H.tips.map(([re,m])=>`<li class="${re.test(code)?"ok":""}">${re.test(code)?"✓ ":""}${esc(m)}</li>`).join("")}</ul></div>`;
      $("#bud").innerHTML=buddy("Here's the plan. Ticks show the parts you've already got. Tap 💡 again if you want to see how it starts.","think");$("#answer").hidden=false;return}
    if(level===0)level=1;
    const shown=Math.min(H.lines.length,level);level++;
    if(H.lines.length){
      $("#peek").innerHTML=`<div class="peek"><b>Here's how it starts${shown<H.lines.length?` (${shown} of ${H.lines.length} new lines)`:""}</b><pre>${esc(H.lines.slice(0,shown).join("\n"))}</pre></div>`;
      $("#bud").innerHTML=buddy(shown<H.lines.length?"Try writing the next part yourself. Tap 💡 for one more line.":"That's every new line! Put them in the right spot and press ▶ Run.","happy");
    }
    $("#answer").hidden=false;
    if(shown>=H.lines.length)$("#hint").hidden=true;
  };
  wireEditor("c",async(code)=>{
    tries++;const [ok,msg,detail]=cur.c.runnable==="web"?gradeWebNow(s,code):await grade(s,code,kindOf(cur.c));sfx(ok?"correct":"wrong");
    $("#fb").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"✓ ":""}${esc(msg)}${detail?`<pre>${esc(detail)}</pre>`:""}</div>`;
    $("#bud").innerHTML=buddy(ok?(isBug?(level===0?"Bug squashed with no hints! You're a real debugger. 🐛🔨":"Bug squashed! 🐛🔨 Every programmer fixes bugs like this."):level>1?"You did it! Using hints is how everyone learns. 🍌 +5":s.final?"You built the whole thing yourself! 🏆":"Look at you go! 🍌 +5"):tries>=2&&level===0?(isBug?"Tricky bug! Tap 💡 Hint 1 for a clue.":"This one's tricky! Tap 💡 Help and I'll show you the plan."):tries>=2?"Getting closer! Tap 💡 for the next clue.":"Not quite yet. Read the message above, tweak it, and run it again.",ok?"cheer":"oops");
    if(ok&&isBug)bump("bugsFixed");
    if(!ok&&tries===2&&level===0)$("#hint").classList.add("nudge");
    if(ok&&!solved){solved=true;$("#go").disabled=false;$("#go").hidden=false;if($("#trun"))$("#trun").hidden=true;award(30,5);bump("challenges");if(tries===1)bump("firstTry")}
  });
  $("#code-c").addEventListener("input",()=>{if(!T||T.mode()==="type")draft(k,$("#code-c").value)});
  /* ↺ Reset: puts the original code back in one tap (handy in Bug Lab when the code has changed too much to remember).
     For a few seconds after, the same button is ↶ Undo in case it was a slip. */
  {const head=$("#code-c").closest(".editor").querySelector(".head"),rb=document.createElement("button");
    rb.className="resetc";rb.id="resetc";rb.type="button";head.insertBefore(rb,head.querySelector(".run"));
    const orig=s.start||"";let undo=null,timer=null;
    const look=()=>{rb.textContent=undo!==null?"↶ Undo":"↺ Reset";rb.title=undo!==null?"Undo reset":"Reset to the starting code";rb.setAttribute("aria-label",rb.title);rb.classList.toggle("undo",undo!==null)};
    const sync=()=>{if(undo===null)rb.hidden=$("#code-c").value===orig||!!(T&&T.mode()==="tap");look()};
    const put=v=>{const ta=$("#code-c");ta.value=v;ta.dispatchEvent(new Event("input",{bubbles:true}));draft(k,v)};
    rb.onclick=()=>{clearTimeout(timer);
      if(undo!==null){const v=undo;undo=null;put(v);sync();return}
      undo=$("#code-c").value;put(orig);rb.hidden=false;look();
      timer=setTimeout(()=>{undo=null;sync()},5000)};
    $("#code-c").addEventListener("input",()=>{if(undo!==null&&$("#code-c").value!==orig){undo=null;clearTimeout(timer)}sync()});sync();}
  const doType=cur.c.runnable==="web"?"Type your code, then tap ▶ Show page.":"Type your code, then press ▶ Run.";
  const syncRun=m=>{const tr=$("#trun");if(tr){tr.hidden=!(m==="tap"&&!solved);$("#go").hidden=m==="tap"&&!solved}};
  const T=TP?wireTiles(s,TP,m=>{const t=document.querySelector(".card .todo span");if(t)t.textContent="👉 "+(m==="tap"?doTap:doType);syncRun(m)}):null;
  if($("#trun"))$("#trun").onclick=()=>{$("#run-c").click();setTimeout(()=>{try{$("#out-c").scrollIntoView({block:"nearest",behavior:"smooth"})}catch(e){}},400)};
  wireSymBar("c");
  $("#hint").onclick=()=>{$("#hint").classList.remove("nudge");sfx("hint");showHelp()};
  $("#hint2").onclick=()=>{if(!$("#hint").hidden)$("#hint").click();else{$("#answer").hidden=false;$("#answer").scrollIntoView({block:"center",behavior:"smooth"});$("#peek").scrollIntoView({block:"nearest"})}};
  $("#answer").onclick=()=>{if(T&&T.mode()==="tap"){T.fill();$("#peek").innerHTML="";$("#bud").innerHTML=buddy("Here are the tiles in order. Read them line by line so it makes sense, then press ▶ Run.","happy");return}$("#code-c").value=s.hint;draft(k,s.hint);$("#peek").innerHTML="";$("#bud").innerHTML=buddy("Here's one way to write it. Read it line by line so it makes sense, then press ▶ Run.","happy")};
  $("#go").onclick=next;
}
function quiz(s){
  const order=shuffle(s.opts.map((o,i)=>i));
  shell(`<div class="card"><div class="label">${s._from?`${cur.daily?`Daily challenge · ${cur.step+1} of ${cur.l.steps.length-1}`:"Review"} · ${s._fresh?"":"from "}${esc(s._from)}`:"Quick quiz · +10 XP"}</div>${todo(s.code?"Read the code, then pick one answer.":"Pick one answer.")}<h2 style="font-size:1.35rem">${s.q}</h2>${s.code?`<div class="editor"><pre>${esc(s.code)}</pre></div>`:""}
    <div class="opts">${order.map(i=>`<button class="opt ${s.mono?"mono":""}" data-i="${i}">${esc(s.opts[i])}</button>`).join("")}</div><div id="fb"></div></div>
    <div id="bud">${buddy("Take your best guess!","think")}</div><div class="row"><button class="btn" id="go" hidden>Continue</button></div>`);
  $$(".opt").forEach(b=>b.onclick=()=>{
    const ok=+b.dataset.i===s.a;sfx(ok?"correct":"wrong");answered(ok);
    $$(".opt").forEach(x=>{x.disabled=true;if(+x.dataset.i===s.a)x.classList.add("right")});
    if(!ok)b.classList.add("wrong");else{award(10);cur.earned.right++}
    cur.earned.total++;
    $("#fb").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"Correct! ":"Not this time. "}${esc(s.why)}</div>`;
    $("#bud").innerHTML=buddy(ok?"Big brain moment! 🧠":"No worries, now you know!",ok?"cheer":"oops");
    $("#go").hidden=false;
  });
  $("#go").onclick=next;
}
function fill(s){
  const n=s.blanks.length;let slots=Array(n).fill(null),tries=0,doneF=false;
  const toks=shuffle(s.tokens.map((t,i)=>i));
  shell(`<div class="card"><div class="label">Fill in the blanks · +15 XP</div>${todo("Tap the words to fill the gaps, then press Check.")}<h2>${s.title}</h2>${s.body||""}
    <div class="editor"><div class="head"><span>${cur.c.lang}</span></div><pre id="fcode"></pre></div>
    <div class="tokens" id="toks">${toks.map(i=>`<button class="token" data-t="${i}">${esc(s.tokens[i])}</button>`).join("")}</div><div id="fb"></div></div>
    <div id="bud">${buddy("Tap a piece to drop it in the next blank. Tap a blank to take it back.","think")}</div>
    <div class="row"><button class="btn" id="check" disabled>Check</button><button class="btn" id="go" hidden>Continue</button></div>`);
  const draw=(marks)=>{
    $("#fcode").innerHTML=esc(s.code).replace(/\[(\d)\]/g,(m,d)=>{const t=slots[d];const mk=marks?marks[d]:"";
      return `<button class="slot ${t!==null?"filled":""} ${mk}" data-s="${d}">${t!==null?esc(s.tokens[t]):"&nbsp;"}</button>`});
    $$(".slot").forEach(b=>b.onclick=()=>{if(doneF)return;const d=+b.dataset.s;if(slots[d]!==null){slots[d]=null;sync()}});
  };
  const sync=()=>{draw();$$(".token").forEach(b=>b.disabled=doneF||slots.includes(+b.dataset.t));$("#check").disabled=slots.includes(null)||doneF};
  $$(".token").forEach(b=>b.onclick=()=>{const e=slots.indexOf(null);if(e<0)return;slots[e]=+b.dataset.t;sync()});
  $("#check").onclick=()=>{
    tries++;const marks=slots.map((t,i)=>s.tokens[t]===s.blanks[i]?"right":"wrong");const ok=!marks.includes("wrong");sfx(ok?"correct":"wrong");
    draw(marks);
    if(ok||tries>=2){doneF=true;$("#check").hidden=true;$("#go").hidden=false;$$(".token").forEach(b=>b.disabled=true);answered(ok&&tries===1)}
    if(ok){award(tries===1?15:8);$("#fb").innerHTML=`<div class="feedback good">✓ ${esc(s.why)}</div>`;$("#bud").innerHTML=buddy(pick(WINS),"cheer")}
    else if(tries>=2){$("#fb").innerHTML=`<div class="feedback bad">The answer is: ${s.blanks.map(esc).join(" , ")}. ${esc(s.why)}</div>`;$("#bud").innerHTML=buddy("Tricky one! Now you've seen it, it'll stick.","oops")}
    else{$("#fb").innerHTML=`<div class="feedback bad">The red blanks aren't right yet. Tap them to swap.</div>`;$("#bud").innerHTML=buddy("So close! One more try.","oops")}
  };
  sync();$("#go").onclick=next;
}
/* ---------- TypeMonkey Jr. mini-games ---------- */
/* Every Jr. puzzle shows one big goal line ("🍌 Get the monkey to the banana!") with a 🔊 button that reads it
   out loud for kids who can't read yet. 🗣️ On makes every puzzle (and TypeMonkey's tips) read itself. */
const jsnd=(n,a)=>{try{window.tmSound&&window.tmSound(n,a)}catch(e){}};
/* Jr. background music: a dance beat on dance steps, a calm jungle tune on the other puzzles */
const JR_SONG={dance:"dance",predictDance:"dance",maze:"jungle",box:"jungle",sort:"jungle",predict:"jungle",build:"jungle"};
function jrMusic(s){try{const want=cur&&cur.c&&cur.c.kids&&s&&(s.type==="predict"&&s.dance?"dance":JR_SONG[s.type]);if(want)SFX.music(want);else SFX.stopMusic()}catch(e){}}
const jrVoice=()=>canSpeak&&!!S.jrVoice;
function jrSpeak(t){if(!canSpeak)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t).replace(/<[^>]*>/g," ").replace(/\p{Extended_Pictographic}|️|‍/gu,"").replace(/\s+/g," ").trim());u.rate=.9;u.pitch=1.15;speechSynthesis.speak(u)}catch(e){}}
function jrAim(s){
  if(s.aim)return s.aim;
  if(s.type==="maze"){const n=mazeInfo(s.grid).goals.length;return s.start||s.startFn&&s.solution&&JSON.stringify(s.startFn)!==JSON.stringify(s.solution.fn)?`🐛 Fix the bug! Get ${n>1?`all ${n} bananas`:"to the banana"}.`:s.func?"⭐ Use My move to get the banana!":n>1?`🍌 Get all ${n} bananas!`:"🍌 Get the monkey to the banana!"}
  if(s.type==="dance")return s.start?"🐛 Fix the dance!":s.loop?"🔁 Copy the dance with a loop!":"💃 Copy the dance!";
  if(s.type==="box")return `📦 Make ${s.name||"bananas"} = ${s.goal}${s.max?` in ${s.max} taps`:""}!`;
  if(s.type==="sort")return "🧺 Follow the rule! Tap where each thing goes.";
  if(s.type==="order")return "🔢 Put the steps in order!";
  if(s.type==="predict")return s.dance?"🤔 Which move comes next? Tap it!":"🤔 Where will the monkey stop? Tap the square!";
  if(s.type==="build")return "🛠️ Make your own puzzle, then solve it!";
  return "";
}
function jrGoal(s){const on=jrVoice();return `<div class="jgoal"><span class="jg-t" id="jgt">${jrAim(s)}</span>${canSpeak?`<span class="jg-btns"><button class="jg-btn" id="jgsay" type="button" aria-label="Read it to me">🔊</button><button class="jg-btn jg-auto" id="jgauto" type="button" aria-pressed="${on}" aria-label="Read every puzzle out loud">🗣️ ${on?"On":"Off"}</button></span>`:""}</div>`}
function wireGoal(){const b=$("#jgsay");if(!b)return;
  const read=()=>{const bub=document.querySelector("#bud .bubble"),fb=document.querySelector("#fb .feedback");jrSpeak($("#jgt").textContent+(fb?". "+fb.textContent:"")+(bub?". "+bub.textContent:""))};
  b.onclick=read;
  const a=$("#jgauto");a.onclick=()=>{S.jrVoice=!S.jrVoice;save();a.setAttribute("aria-pressed",jrVoice());a.textContent="🗣️ "+(jrVoice()?"On":"Off");if(jrVoice())read();else try{speechSynthesis.cancel()}catch(e){}};
  if(jrVoice())setTimeout(()=>{if(b.isConnected)read()},350)}
/* TypeMonkey's speech bubble; with 🗣️ On it's also read out loud (plus any feedback line) */
function jrBud(text,mood,also){$("#bud").innerHTML=buddy(text,mood);if(jrVoice())jrSpeak((also?also+". ":"")+text)}
const jrClone=x=>JSON.parse(JSON.stringify(x));
/* Dance party: copy a dance by building a program of moves. With loop:true the kid builds the
   pattern once and sets how many times it repeats (a loop). */
const DMOVES={clap:{icon:"👏",label:"Clap",c:"#FFB347"},jump:{icon:"⬆️",label:"Jump",c:"#6EC6FF"},spin:{icon:"🌀",label:"Spin",c:"#B79CFF"},wave:{icon:"👋",label:"Wave",c:"#7EDC9A"},wiggle:{icon:"🎵",label:"Wiggle",c:"#FF8FC0"}};
const dchip=(m,attrs="",tag="span")=>`<${tag} class="dchip" style="--mc:${DMOVES[m].c}" ${attrs} title="${DMOVES[m].label}">${DMOVES[m].icon}</${tag}>`;
const danceCode=(prog,times,loop)=>loop?`repeat ${times} times:\n`+prog.map(m=>"    "+m+"()").join("\n"):prog.map(m=>m+"()").join("\n");
function dance(s){
  let prog=[...(s.start||[])],times=s.startTimes||1,tries=0,won=false,everWon=false,busy=false,mark=-1,glow=null;const loop=!!s.loop;
  shell(`<div class="card"><div class="label">🎶 Dance party${loop?" · use a loop":""} · +15 XP</div><h2>${s.title}</h2>${jrGoal(s)}${s.body||""}
    <div class="stage" id="stage"><span class="spot l"></span><span class="spot r"></span><span class="ball">🪩</span>
      <div class="floor">${Array.from({length:16},(_,k)=>`<i style="--c:${["#FF8FC0","#FFD25C","#6EC6FF","#7EDC9A"][k%4]}"></i>`).join("")}</div>
      <div class="shadow" id="dsh"></div><div class="dancer" id="dz">${monkey("happy")}</div><div class="dlab" id="dlab" aria-live="polite"></div><div class="beat" id="beat"></div></div>
    <div class="label">The dance to copy <button class="btn ghost sm" id="watch">👀 Watch it</button></div>
    <div class="dtarget" id="tg">${s.target.map((m,i)=>dchip(m,`data-i="${i}"`)).join("")}</div>
    <div class="label">Your dance program</div>
    ${loop?`<div class="dloop"><span>🔁 Repeat</span><button class="btn ghost sm" id="tm" aria-label="Fewer times">−</button><b id="tv">${times}</b><button class="btn ghost sm" id="tp" aria-label="More times">+</button><span>times:</span></div>`:""}
    <div class="dprog ${loop?"inloop":""}" id="dp"></div>
    <div class="palette">${s.moves.map(m=>`<button class="blk dm" style="--mc:${DMOVES[m].c}" data-m="${m}"><span>${DMOVES[m].icon}</span>${DMOVES[m].label}</button>`).join("")}</div><div id="fb"></div></div>
    <div id="bud">${buddy(s.say||(loop?"Find the part that repeats! Build it once, then set the repeat number.":"Watch the dance, then tap the moves in the same order."),"think")}</div>
    <div class="row kidrow"><button class="btn banana" id="run">▶ Dance!</button><button class="btn ghost" id="undo">Undo</button><button class="btn ghost" id="hint" hidden>💡 Show me a hint</button><button class="btn ghost" id="ans" hidden>Show me the answer</button><button class="btn" id="go" hidden>Continue</button></div>`);
  const draw=()=>{$("#dp").innerHTML=prog.length?prog.map((m,i)=>dchip(m,`data-i="${i}" aria-label="Remove ${DMOVES[m].label}"`,"button")).join(""):'<span class="empty">Tap moves below to add them here</span>';
    $$("#tg .dchip").forEach(c=>c.classList.remove("good","bad"));
    $$("#dp .dchip").forEach((c,i)=>{c.classList.toggle("oops",i===mark);c.classList.toggle("glow",!!glow&&glow.chip===i);c.onclick=()=>{if(busy||won)return;prog.splice(+c.dataset.i,1);edit()}});
    $$(".dm").forEach(b=>b.classList.toggle("glow",!!glow&&glow.pal===b.dataset.m));
    if(loop){$("#tv").textContent=times;$("#tm").classList.toggle("glow",!!glow&&glow.times<times);$("#tp").classList.toggle("glow",!!glow&&glow.times>times)}
    $("#run").classList.toggle("ready",!!prog.length&&!won&&!busy)};
  const edit=()=>{mark=-1;glow=null;draw()};
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const perform=async(list,mark)=>{busy=true;SFX.musicBoost(true);const dz=$("#dz"),st=$("#stage"),lab=$("#dlab"),sh=$("#dsh");
    $$("#tg .dchip").forEach(c=>c.classList.remove("good","bad"));st.classList.add("live");$("#run").classList.remove("ready");
    $("#beat").innerHTML=list.map(()=>"<i></i>").join("");
    for(let i=0;i<list.length;i++){const m=list[i];if(!dz.isConnected)return;dz.className="dancer";void dz.offsetWidth;dz.classList.add("d-"+m);jsnd("m_"+m);
      lab.textContent=DMOVES[m].icon+" "+DMOVES[m].label+"!";lab.classList.add("on");sh.style.transform=m==="jump"?"scale(.6)":"";setTimeout(()=>{if(sh)sh.style.transform=""},300);
      $$("#beat i").forEach((b,k)=>b.classList.toggle("on",k<=i));
      const n=document.createElement("span");n.className="note";n.textContent=["🎵","🎶","✨","🍌"][i%4];n.style.left=(20+Math.random()*60)+"%";st.appendChild(n);setTimeout(()=>n.remove(),1100);
      $$("#tg .dchip").forEach(c=>{const k=+c.dataset.i;c.classList.toggle("now",k===i&&(mark||k<s.target.length));if(!mark&&k===i)c.classList.add(m===s.target[k]?"good":"bad")});
      await sleep(620)}
    dz.className="dancer";lab.classList.remove("on");st.classList.remove("live");$$("#tg .dchip").forEach(c=>c.classList.remove("now"));SFX.musicBoost(false);busy=false};
  $$(".dm").forEach(b=>b.onclick=()=>{if(busy||won)return;if(prog.length>=12)return;prog.push(b.dataset.m);edit()});
  if(loop){$("#tm").onclick=()=>{if(!won&&times>1){times--;edit()}};$("#tp").onclick=()=>{if(!won&&times<6){times++;edit()}}}
  $("#undo").onclick=()=>{if(busy||won)return;prog.pop();edit()};
  $("#watch").onclick=()=>{if(!busy)perform(s.target,true)};
  /* Hint: point at the next right move (not the whole answer) */
  $("#hint").onclick=()=>{if(busy||won)return;jsnd("hint");const want=loop?s.solution.pattern:s.target,wt=s.solution.times||1;mark=-1;
    const k=want.findIndex((m,i)=>prog[i]!==m),mv=m=>DMOVES[m].icon+" "+DMOVES[m].label;let msg;
    if(k>=0&&k<prog.length){glow={chip:k};msg=`The glowing move should be ${mv(want[k])}. Tap Undo until it's gone, then add ${mv(want[k])}.`}
    else if(k>=0){glow={pal:want[k]};msg=(k?"Good so far! Next, add ":"Start with ")+mv(want[k])+(loop&&k===0?". That's the first move of the part that repeats.":".")}
    else if(prog.length>want.length){glow={chip:want.length};msg="One move too many! Tap the glowing one to take it out."}
    else if(loop&&times!==wt){glow={times:wt};msg=`Your pattern is right! Now make it repeat ${wt} times.`}
    else{glow=null;msg="That looks right! Press ▶ Dance!"}
    draw();jrBud("💡 "+msg,"happy");if(tries>=4)$("#ans").hidden=false};
  $("#ans").onclick=()=>{if(busy||won)return;prog=[...s.solution.pattern];times=s.solution.times||1;mark=-1;glow=null;draw();jrBud("Here's one way! Press ▶ Dance to try it.","happy")};
  $("#run").onclick=async()=>{if(busy||won||!prog.length)return;
    const flatP=loop?Array.from({length:times},()=>prog).flat():prog;mark=-1;glow=null;draw();
    await perform(flatP,false);if(!$("#dz"))return;
    const ok=flatP.length===s.target.length&&flatP.every((m,i)=>m===s.target[i]);
    if(ok){const first=!everWon;won=everWon=true;if(first){award(15,3);bump("dances")}jsnd("tada");$("#dz").innerHTML=monkey("cheer");
      const more=loop&&prog.length>s.solution.pattern.length;
      $("#fb").innerHTML=`<div class="feedback good">🎉 ${esc(s.win||"Perfect dance!")}<div class="kcode"><small>🧑‍💻 Your dance, written as code:</small><pre>${esc(danceCode(prog,times,loop))}</pre></div>
        ${more?`<div class="nudge">🌟 You did it! Can you do it with fewer moves? Put just the part that repeats inside the 🔁 loop. <button class="btn ghost sm" id="fewer">Try with fewer</button></div>`:""}</div>`;
      jrBud(pick(KID_WINS),"cheer");bananaBurst();["run","undo","hint","ans"].forEach(i=>$("#"+i).hidden=true);$("#go").hidden=false;draw();
      if(more)$("#fewer").onclick=()=>{won=false;$("#fb").innerHTML="";["run","undo"].forEach(i=>$("#"+i).hidden=false);jrBud(`Can you build it with only ${s.solution.pattern.length} moves and a bigger repeat number?`,"think");draw()};
      return}
    tries++;jsnd("oops");const wrongAt=flatP.findIndex((m,i)=>m!==s.target[i]);
    const rightPat=loop&&prog.length&&s.target.length%prog.length===0&&s.target.every((m,i)=>m===prog[i%prog.length]);
    if(!rightPat&&wrongAt>=0&&wrongAt<s.target.length)mark=loop?wrongAt%prog.length:wrongAt;else if(!rightPat&&flatP.length>s.target.length&&!loop)mark=s.target.length;
    const msg=rightPat?`Nice pattern! The dance is ${s.target.length} moves long and yours is ${flatP.length}. Change the repeat number!`:
      wrongAt>=0&&wrongAt<s.target.length?`Oops! Move ${wrongAt+1} should be ${DMOVES[s.target[wrongAt]].icon} ${DMOVES[s.target[wrongAt]].label}. Look at the wiggly move in your program.`:flatP.length<s.target.length?"Good so far! The dance keeps going. Add more moves.":"Great moves! But there are too many. Take some away.";
    draw();$("#fb").innerHTML=`<div class="feedback oops">${msg}</div>`;
    jrBud(tries>=4?"Want to see it? Tap “Show me the answer”.":tries>=2?"Need help? Tap “💡 Show me a hint”.":"Every coder fixes their program. Try again!","oops",msg);
    if(tries>=2)$("#hint").hidden=false;if(tries>=4)$("#ans").hidden=false};
  draw();$("#go").onclick=next;wireGoal();
}
/* Sorting machine: things come down a belt one at a time; the kid follows an IF / ELSE rule
   by tapping the right bin. */
/* New order every time, so kids read each thing instead of just tapping left, right, left, right.
   Never a strict back-and-forth pattern, and never more than 3 of the same bin in a row. */
function sortOrder(items){
  const alt=o=>o.every((x,k)=>!k||x.bin!==o[k-1].bin),run=o=>o.some((x,k)=>k>=3&&o.slice(k-3,k+1).every(y=>y.bin===x.bin));
  let best=items;for(let t=0;t<60;t++){const o=shuffle(items);if(!(o.length>=4&&alt(o))&&!run(o)){best=o;break}}return best}
function sorter(s){
  s={...s,items:sortOrder(s.items)};
  let i=0,miss=0,missHere=0,counts=s.bins.map(()=>0);
  shell(`<div class="card"><div class="label">🏭 Sorting machine · +15 XP</div><h2>${s.title}</h2>${jrGoal(s)}${s.body||""}
    <div class="rule">${s.rule}</div>
    <div class="belt"><div class="item" id="item"></div><div class="left" id="left"></div></div>
    <div class="bins">${s.bins.map((b,k)=>`<button class="bin" data-k="${k}"><span class="bi">${b.icon}</span><b>${b.name}</b><span class="bc" id="bc${k}">0</span></button>`).join("")}</div><div id="fb"></div></div>
    <div id="bud">${buddy(s.say||"Look at each thing. Follow the rule and tap the right place!","think")}</div>
    <div class="row"><button class="btn" id="go" hidden>Continue</button></div>`);
  const show=()=>{const it=s.items[i];const el=$("#item");el.className="item";void el.offsetWidth;el.classList.add("in");el.innerHTML=`<span>${it.icon}</span>${it.name?`<small>${esc(it.name)}</small>`:""}`;$("#left").textContent=`${s.items.length-i} to go`};
  $$(".bin").forEach(b=>b.onclick=()=>{if(i>=s.items.length)return;const k=+b.dataset.k,it=s.items[i];
    if(k===it.bin){counts[k]++;$("#bc"+k).textContent=counts[k];b.classList.remove("ok");void b.offsetWidth;b.classList.add("ok");i++;missHere=0;$$(".bin").forEach(x=>x.classList.remove("glow"));
      $("#fb").innerHTML="";
      if(i>=s.items.length){award(miss?10:15,3);bump("sorted");jsnd("tada");$("#item").innerHTML="✨";$("#left").textContent="All sorted!";
        $("#fb").innerHTML=`<div class="feedback good">🎉 ${esc(s.win||"Everything is sorted!")}${s.code?`<div class="kcode"><small>🧑‍💻 The rule, written as code:</small><pre>${esc(s.code)}</pre></div>`:""}</div>`;
        jrBud(pick(KID_WINS),"cheer");bananaBurst();$("#go").hidden=false;return}
      jsnd("ding",i);$("#bud").innerHTML=buddy(pick(["Yes!","Good one!","That's right!","Sorted!","You're fast!"]),"happy");show()}
    else{miss++;missHere++;jsnd("oops");const el=$("#item");el.classList.remove("shake");void el.offsetWidth;el.classList.add("shake");
      const why=it.why||"Not that one. Read the rule again!";
      $("#fb").innerHTML=`<div class="feedback oops">${esc(why)}</div>`;
      if(missHere>=2){$$(".bin").forEach(x=>x.classList.toggle("glow",+x.dataset.k===it.bin));jrBud("💡 Here's a hint: try the glowing one!","happy",why)}
      else jrBud("Check the rule, then try again.","oops",why)}});
  show();$("#go").onclick=next;wireGoal();
}

/* Banana boxes: a variable is a box with a name. The kid taps operations to change what's
   inside until it matches the goal. Each tap becomes a line of code. */
const BOXOPS={"+1":v=>v+1,"+2":v=>v+2,"+3":v=>v+3,"+5":v=>v+5,"-1":v=>v-1,"x2":v=>v*2};
/* Fewest taps from start to goal (breadth-first search). Used so "in N taps" is never looser than it needs to be. */
function boxShortest(start,goal,ops,limit=10){let level=[[start,[]]];const seen=new Set([start]);
  for(let d=0;d<=limit;d++){const nx=[];for(const [v,seq] of level){if(v===goal)return seq;for(const o of ops){const w=BOXOPS[o](v);if(!seen.has(w)&&w>=-20&&w<=500){seen.add(w);nx.push([w,[...seq,o]])}}}level=nx}return null}
const opLabel=o=>o==="x2"?"× 2":o.replace("+","+ ").replace("-","− ");
const opCode=(name,o)=>`${name} = ${name} ${o==="x2"?"* 2":o[0]+" "+o.slice(1)}`;
function boxGame(s){
  const name=s.name||"bananas";let val=s.startVal||0,ops=[],won=false,tries=0,hints=0;
  shell(`<div class="card"><div class="label">📦 Banana boxes · variables · +15 XP</div><h2>${s.title}</h2>${jrGoal(s)}${s.body||""}
    <div class="boxrow"><div class="vbox" id="vb"><div class="vlid">${esc(name)}</div><div class="vin" id="vin"></div><div class="vnum" id="vn"></div></div>
      <div class="vgoal"><span>Goal</span><b>${s.goal}</b><small>${s.max?`in ${s.max} taps or fewer`:"bananas"}</small></div></div>
    <div class="label">Your program</div><pre class="vcode" id="vc"></pre>
    <div class="palette">${s.ops.map(o=>`<button class="blk vop" data-o="${o}"><span>${opLabel(o)}</span></button>`).join("")}</div><div id="fb"></div></div>
    <div id="bud">${buddy(s.say||`Make the box hold exactly ${s.goal}!`,"think")}</div>
    <div class="row"><button class="btn ghost" id="undo">Undo</button><button class="btn ghost" id="clr">Start over</button><button class="btn ghost" id="hint" hidden>💡 Show me a hint</button><button class="btn ghost" id="ans" hidden>Show me the answer</button><button class="btn" id="go" hidden>Continue</button></div>`);
  const calc=()=>ops.reduce((v,o)=>BOXOPS[o](v),s.startVal||0);
  const oops=(msg,tip)=>{$("#fb").innerHTML=`<div class="feedback oops">${msg}</div>`;tries++;jsnd("oops");jrBud(tries>=2?"Need help? Tap “💡 Show me a hint”.":tip||"Every coder tries again. You can do it!","oops",msg)};
  const draw=(bump)=>{val=calc();$("#vn").textContent=val;$$(".vop,#clr").forEach(b=>b.classList.remove("glow"));
    $("#vin").innerHTML=val>0&&val<=24?"🍌".repeat(val):val>24?"🍌×"+val:"";
    if(bump){const b=$("#vb");b.classList.remove("hop");void b.offsetWidth;b.classList.add("hop");jsnd(ops[ops.length-1]==="x2"?"zap":"plop",Math.max(0,Math.min(10,val)))}
    $("#vc").innerHTML=[`${esc(name)} = ${s.startVal||0}`,...ops.map(o=>esc(opCode(name,o)))].map((l,k)=>`<span class="${k===ops.length&&ops.length?"new":""}">${l}</span>`).join("\n");
    if(won)return;
    if(val===s.goal&&(!s.max||ops.length<=s.max)){won=true;award(tries?10:15,3);bump2();jsnd("tada");
      const more=!s.max&&s.solution&&ops.length>s.solution.length;
      $("#fb").innerHTML=`<div class="feedback good">🎉 ${esc(name)} is ${s.goal}! ${esc(s.win||"You changed a variable like a real coder.")}${more?`<div class="nudge">🌟 You did it! Can you do it with fewer taps? A bigger button could help.</div>`:""}</div>`;
      jrBud(pick(KID_WINS),"cheer");bananaBurst();["undo","clr","hint","ans"].forEach(i=>$("#"+i).hidden=true);$$(".vop").forEach(b=>b.disabled=true);$("#go").hidden=false;return}
    if(val===s.goal)oops(`You got ${s.goal}! But you used ${ops.length} taps. Can you do it in ${s.max}? Try a bigger jump!`);
    else if(val>s.goal&&!s.ops.includes("-1"))oops(`Whoa, lots of bananas! ${val} is more than ${s.goal}. Tap Undo.`,"Undo takes back the last line.");
    else if(s.max&&ops.length>=s.max)oops("Out of taps! Tap Start over and try different buttons.");
    else $("#fb").innerHTML="";
    if(tries>=2&&s.solution)$("#hint").hidden=false;if(tries>=4&&s.solution)$("#ans").hidden=false};
  const bump2=()=>bump("boxes");
  $$(".vop").forEach(b=>b.onclick=()=>{if(won)return;if(s.max&&ops.length>=s.max)return;ops.push(b.dataset.o);draw(true)});
  $("#undo").onclick=()=>{if(won)return;ops.pop();draw()};
  $("#clr").onclick=()=>{if(won)return;ops=[];draw()};
  /* Hint: glow the next good button (or Start over), not the whole answer */
  $("#hint").onclick=()=>{if(won)return;jsnd("hint");hints++;const ok=ops.every((o,k)=>o===s.solution[k])&&ops.length<s.solution.length;
    draw();if(ok){const o=s.solution[ops.length];$$(".vop").forEach(b=>b.classList.toggle("glow",b.dataset.o===o));jrBud(`💡 ${ops.length?"Good so far! Next, tap":"Start with"} ${opLabel(o)}.`,"happy")}
    else{$("#clr").classList.add("glow");jrBud(`💡 Tap Start over. Then start with ${opLabel(s.solution[0])}.`,"happy")}
    if(hints>=2)$("#ans").hidden=false};
  $("#ans").onclick=()=>{if(won)return;ops=[];draw();jrBud("Try these, in order: "+s.solution.map(opLabel).join(", then "),"happy")};
  draw();$("#go").onclick=next;wireGoal();
}

function order(s){
  let pool=shuffle(s.lines.map((l,i)=>i));let tries=0;
  if(pool.every((v,i)=>v===i))pool.reverse();
  let picked=[],doneO=false;
  shell(`<div class="card"><div class="label">Put it in order · +15 XP</div>${todo("Tap the lines in the right order, then press Check.")}<h2>${s.title}</h2>${cur.c.kids?jrGoal(s):""}${s.body||""}
    <div class="lines" id="ans"></div><div class="label">Tap the lines in order</div><div class="lines pick" id="pool"></div><div id="fb"></div></div>
    <div id="bud">${buddy("Tap lines to add them. Tap a placed line to send it back.","think")}</div>
    <div class="row"><button class="btn" id="check" disabled>Check</button><button class="btn" id="go" hidden>Continue</button></div>`);
  const draw=(marks)=>{
    $("#ans").innerHTML=picked.length?picked.map((i,k)=>`<button class="ln ${marks?marks[k]:""}" data-k="${k}">${esc(s.lines[i])}</button>`).join(""):'<span class="empty">Your program builds here</span>';
    $("#pool").innerHTML=pool.filter(i=>!picked.includes(i)).map(i=>`<button class="ln" data-i="${i}">${esc(s.lines[i])}</button>`).join("");
    $$("#ans .ln").forEach(b=>b.onclick=()=>{if(doneO)return;picked.splice(+b.dataset.k,1);draw()});
    $$("#pool .ln").forEach(b=>b.onclick=()=>{picked.push(+b.dataset.i);draw()});
    $("#check").disabled=picked.length!==s.lines.length||doneO;
  };
  $("#check").onclick=()=>{
    tries++;
    const marks=picked.map((i,k)=>s.lines[i]===s.lines[k]?"right":"wrong");const ok=!marks.includes("wrong");sfx(ok?"correct":"wrong");
    if(ok||tries>=2){doneO=true;$("#check").hidden=true;$("#go").hidden=false;answered(ok&&tries===1)}
    if(ok){draw(marks);award(tries===1?15:8);$("#fb").innerHTML=`<div class="feedback good">✓ ${esc(s.why)}</div>`;$("#bud").innerHTML=buddy(pick(WINS),"cheer")}
    else if(tries>=2){picked=s.lines.map((l,i)=>i);draw(picked.map(()=>"right"));$("#fb").innerHTML=`<div class="feedback bad">Here's the right order. ${esc(s.why)}</div>`;$("#bud").innerHTML=buddy("Order is everything in code. You'll get the next one!","oops")}
    else{draw(marks);$("#fb").innerHTML=`<div class="feedback bad">The red lines are in the wrong spot. Tap them to take them back out.</div>`;$("#bud").innerHTML=buddy("Almost! Rearrange the red ones.","oops")}
  };
  draw();$("#go").onclick=next;if(cur.c.kids)wireGoal();
}

/* ---------- TypeMonkey Jr.: maze puzzles ---------- */
const DIRS={N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]},LEFT={N:"W",W:"S",S:"E",E:"N"},RIGHT={N:"E",E:"S",S:"W",W:"N"},ROT={E:0,S:90,W:180,N:270};
const BLOCKS={fwd:{icon:"👣",label:"Forward"},left:{icon:"↰",label:"Turn left"},right:{icon:"↱",label:"Turn right"},rep:{icon:"🔁",label:"Repeat"},
  until:{icon:"🔁🍌",label:"Repeat until 🍌"},call:{icon:"⭐",label:"My move"},ifR:{get icon(){return JR_WALL.w+"↱"},get label(){return JR_WALL.n+" ahead? Turn right"}},ifL:{get icon(){return JR_WALL.w+"↰"},get label(){return JR_WALL.n+" ahead? Turn left"}}};
/* The "… ahead?" blocks name the wall of the current world (🌴 Tree, 🌵 Cactus, 🌊 Wave …). Set when a maze is drawn. */
let JR_WALL={w:"🌴",n:"Tree"};const setWall=Wd=>{JR_WALL={w:Wd.wall,n:Wd.wallName||"Tree"}};
const isBox=b=>typeof b==="object";
/* In Jr. lessons the maze walls change with the world (🌴 trees, 🌵 cacti, 🌊 waves …). So the words and pictures
   on screen match what kids see, "tree" and 🌴/🌳 in Jr. text are swapped for the current world's wall as they appear. */
const wallWords=Wd=>{const one=Wd.wallName.toLowerCase(),many=Wd.wallPlural,cap=w=>w[0].toUpperCase()+w.slice(1);
  return t=>t.replace(/\b(T|t)rees\b/g,(m,c)=>c==="T"?cap(many):many).replace(/\b(T|t)ree\b/g,(m,c)=>c==="T"?cap(one):one).replace(/🌴|🌳/g,Wd.wall)};
let wallObs=null;
function watchWallWords(){
  if(wallObs)wallObs.disconnect();
  if(!(cur&&cur.c&&cur.c.kids))return;const Wd=worldFor();if(Wd.wall==="🌴")return;const fix=wallWords(Wd);
  const walk=n=>{if(n.nodeType===3){const t=fix(n.nodeValue);if(t!==n.nodeValue)n.nodeValue=t;return}
    if(n.nodeType!==1||n.closest&&n.closest("pre,code,.kcode"))return;
    for(const a of ["aria-label","title"])if(n.hasAttribute&&n.hasAttribute(a))n.setAttribute(a,fix(n.getAttribute(a)));n.childNodes.forEach(walk)};
  const root=$("#screen");walk(root);
  wallObs=new MutationObserver(ms=>{wallObs.disconnect();if(!$("#quit")||!(cur&&cur.c&&cur.c.kids))return;ms.forEach(m=>{if(m.type==="characterData")walk(m.target);else m.addedNodes.forEach(walk)});wallObs.observe(root,{childList:true,subtree:true,characterData:true})});
  wallObs.observe(root,{childList:true,subtree:true,characterData:true});
}
function mazeInfo(g){let start;const goals=[];g.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==="S")start=[x,y];if(ch==="B")goals.push([x,y])}));return {start,goal:goals[0],goals,w:g[0].length,h:g.length}}
const blockCount=prog=>prog.reduce((n,b)=>n+(isBox(b)?1+b.body.length:1),0);
/* runs a program; path entries are [x, y, dir, bump?, eatenKey?]
   The program must end exactly when the last banana is eaten: any move or turn after that is "extra".
   (Repeat until 🍌 stops by itself the moment the last banana is eaten.) */
function simulate(grid,dir,prog,fn){
  const m=mazeInfo(grid);let [x,y]=m.start,d=dir;const path=[[x,y,d]];const left=new Set(m.goals.map(g=>g.join(",")));let steps=0,won=false;
  let at=null;  // which block is running: {i} top level, {i,j} inside a repeat, plus f when inside ⭐ My move
  const treeAhead=()=>{const [dx,dy]=DIRS[d];const ch=(grid[y+dy]||"")[x+dx];return ch===undefined||ch==="#"};
  const one=t=>{
    if(++steps>500)return "loop";
    if(t==="ifR"||t==="ifL"){if(!treeAhead())return null}
    if(won){  // TypeMonkey already has every banana, so this block is one too many
      if(t==="fwd"&&!treeAhead()){const [dx,dy]=DIRS[d];x+=dx;y+=dy;path.push([x,y,d])}
      else if(t==="fwd")path.push([x,y,d,"bump"]);
      else{d=(t==="left"||t==="ifL")?LEFT[d]:RIGHT[d];path.push([x,y,d])}
      return "extra";
    }
    if(t==="left"||t==="ifL")d=LEFT[d];
    else if(t==="right"||t==="ifR")d=RIGHT[d];
    else{
      if(treeAhead()){path.push([x,y,d,"bump"]);return "wall"}
      const [dx,dy]=DIRS[d];x+=dx;y+=dy;const k=x+","+y;
      if(left.has(k)){left.delete(k);path.push([x,y,d,null,k]);if(!left.size){won=true;return "won"}return null}
    }
    path.push(t==="ifR"||t==="ifL"?[x,y,d,null,null,t]:[x,y,d]);return null;
  };
  const runList=(list,inUntil,ctx,callAt)=>{
    for(let idx=0;idx<list.length;idx++){const b=list[idx];
      at=ctx==="fn"?{...callAt,f:idx}:ctx==null?{i:idx}:{i:ctx,j:idx};
      let r=null;
      if(isBox(b)){
        if(b.until){
          if(won){r="extra";path.push([x,y,d,"bump"])}
          else{if(!b.body.length)return "loop";let guard=0;
            while(!won){if(++guard>80)return "loop";r=runList(b.body,true,idx);if(r==="won"){r=null;break}if(r)return r}}
        }else for(let k=0;k<b.rep;k++){r=runList(b.body,inUntil,idx);if(r==="won"){if(inUntil)return "won";r=null;continue}if(r)return r}
      }else if(b==="call"){
        if(won){r="extra";path.push([x,y,d,"bump"])}
        else{if(++steps>500)return "loop";r=runList(fn||[],inUntil,"fn",at);if(r==="won"){if(inUntil)return "won";r=null}}
      }else{r=one(b);if(r==="won"){if(inUntil)return "won";r=null}}
      if(r)return r;
    }
    return null;
  };
  const r=runList(prog,false,null);
  const failAt=r==="wall"||r==="extra"?at:r==="loop"&&at?{i:at.i}:null;
  return {path,result:r||(won?"win":"short"),failAt,left:left.size};
}
/* TypeMonkey Jr.: every unit is a new world, and mazes give up to 3 stars */
const WORLDS=[
  {name:"Jungle",wallName:"Tree",wallPlural:"trees",emoji:"🌴",wall:"🌴",path:"#F3DFA8",line:"#E5CC88",tree:"#5FAE5A"},
  {name:"Beach",wallName:"Wave",wallPlural:"waves",emoji:"🏝️",wall:"🌊",path:"#FFE9B8",line:"#F2D592",tree:"#4FB6E8"},
  {name:"Snowy peaks",wallName:"Snowman",wallPlural:"snowmen",emoji:"❄️",wall:"☃️",path:"#EEF6FF",line:"#D3E3F5",tree:"#9CC3E6"},
  {name:"Desert",wallName:"Cactus",wallPlural:"cacti",emoji:"🏜️",wall:"🌵",path:"#F7D9A6",line:"#E9C17F",tree:"#D99A55"},
  {name:"Outer space",wallName:"Planet",wallPlural:"planets",emoji:"🚀",wall:"🪐",path:"#3B3970",line:"#4D4A8C",tree:"#1D1B45"},
  {name:"Candy land",wallName:"Lollipop",wallPlural:"lollipops",emoji:"🍭",wall:"🍭",path:"#FFE0F0",line:"#F7C3DE",tree:"#F48FC0"}];
const worldFor=()=>WORLDS[((cur&&cur.daily)?dayNum(new Date()):((cur&&cur.item&&cur.item.ui)||0))%WORLDS.length];   // the daily challenge visits a new world each day
const KID_WINS=["Ooh ooh! Banana time!","You're a coding superstar!","Monkey dance time! 💃","Wow, that program was perfect!","High five! ✋","Yum yum, thank you!","You did it! I'm so proud!"];
/* Shows a kid's block program as simple code, so they see what "real code" looks like. */
const KCODE={fwd:"forward()",left:"turn_left()",right:"turn_right()",ifR:"if tree_ahead(): turn_right()",ifL:"if tree_ahead(): turn_left()",call:"my_move()"};
function kidCode(prog,fn){const out=[];const walk=(L,ind)=>L.forEach(b=>{if(typeof b==="string")out.push(ind+KCODE[b]);else{out.push(ind+(b.until?"repeat until banana:":`repeat ${b.rep} times:`));walk(b.body,ind+"    ")}});
  if(fn&&fn.length){out.push("def my_move():");walk(fn,"    ");out.push("")}walk(prog,"");return out.join("\n")}
/* A block's name for TypeMonkey's tips: "👣 Forward", "🔁 Repeat 3 times with 👣 inside" */
const bname=b=>isBox(b)?(b.until?"🔁 Repeat until 🍌":`🔁 Repeat ${b.rep} times`)+" with "+b.body.map(t=>BLOCKS[t].icon).join(" ")+" inside":BLOCKS[b].icon+" "+BLOCKS[b].label;
/* Helping hand: compare the kid's program with the answer and point at the NEXT block only.
   Returns {msg, glow}; glow is {pal} (a palette button), {i}/{i,j} (a block in the program), {f} (in ⭐ My move),
   {rep:i} (a repeat count) or {go:true}. */
function mazeHint(prog,fn,s,open){
  const solM=s.func?s.solution.main:s.solution;
  if(s.func){const want=s.solution.fn;
    for(let f=0;f<want.length;f++){
      if(fn[f]===undefined)return {msg:`${f?"Next":"First"}, open the ⭐ My move tab and add ${bname(want[f])}.`,glow:{pal:want[f],lane:"fn"}};
      if(fn[f]!==want[f])return {msg:`Look in ⭐ My move. The glowing block should be ${bname(want[f])}. Tap it away, then add the right one.`,glow:{f,lane:"fn"}}}
    if(fn.length>want.length)return {msg:"⭐ My move has one block too many. Tap the glowing one to take it away.",glow:{f:want.length,lane:"fn"}}}
  for(let i=0;i<solM.length;i++){const want=solM[i],have=prog[i];
    if(have===undefined){const pal=isBox(want)?(want.until?"until":"rep"):want;
      if(open!==null&&open!==undefined&&open<i)return {msg:`Tap “done” on your 🔁 first. Then add ${bname(want)}.`,glow:{done:open}};
      return {msg:(i?"Great start! Next, add ":"Start with ")+bname(want)+".",glow:{pal,lane:"main"}}}
    if(JSON.stringify(have)===JSON.stringify(want))continue;
    if(isBox(have)&&isBox(want)&&!!have.until===!!want.until){
      for(let j=0;j<want.body.length;j++){
        if(have.body[j]===undefined)return open===i?{msg:`Inside the 🔁, add ${bname(want.body[j])}.`,glow:{pal:want.body[j],lane:"main"}}:{msg:`The glowing 🔁 needs ${bname(want.body[j])} inside. Tap Undo until it's gone, then build it again.`,glow:{i}};
        if(have.body[j]!==want.body[j])return {msg:`Inside the 🔁, the glowing block should be ${bname(want.body[j])}. Tap it away, then add the right one.`,glow:{i,j}}}
      if(have.body.length>want.body.length)return {msg:"The 🔁 has an extra block inside. Tap the glowing one to take it away.",glow:{i,j:want.body.length}};
      if(!want.until&&have.rep!==want.rep)return {msg:`So close! Tap the glowing 🔁 ×${have.rep} until it says ×${want.rep}.`,glow:{rep:i}};
      continue}
    return {msg:`The glowing block should be ${bname(want)}. Tap Undo until it's gone, then add ${bname(want)}.`,glow:{i}};
  }
  if(prog.length>solM.length)return {msg:"One block too many! Tap Undo to take the last one away.",glow:{i:solM.length}};
  return {msg:"Your program looks just right. Press ▶ Go!",glow:{go:true}};
}
/* ---------- Motion pack helpers ---------- */
const calmMotion=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
/* Confetti on one canvas with one animation loop (smoother on older phones than dozens of moving elements). */
function confetti(n=70){if(calmMotion())return;
  const cv=document.createElement("canvas");cv.className="confetti";cv.setAttribute("aria-hidden","true");
  const dpr=Math.min(2,window.devicePixelRatio||1),W=innerWidth,H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+"px";cv.style.height=H+"px";
  const g=cv.getContext("2d");if(!g)return;g.scale(dpr,dpr);
  const C=["#FA7A20","#FFC845","#22986A","#7C5CFF","#FF6FAE","#4FB6E8"];
  const P=[...Array(n)].map((_,i)=>({x:Math.random()*W,y:-20-Math.random()*H*.25,vx:(Math.random()-.5)*2.2,vy:2+Math.random()*3,
    r:Math.random()*6.3,vr:(Math.random()-.5)*.3,w:7+Math.random()*4,h:10+Math.random()*6,c:C[i%C.length],round:Math.random()<.3,wob:Math.random()*6.3,d:Math.random()*25}));
  document.body.appendChild(cv);let t=0;
  const step=()=>{if(!cv.isConnected)return;t++;g.clearRect(0,0,W,H);let alive=0;
    for(const p of P){if(t<p.d){alive++;continue}p.vy=Math.min(p.vy+.06,6.5);p.wob+=.08;p.x+=p.vx+Math.sin(p.wob)*.6;p.y+=p.vy;p.r+=p.vr;
      if(p.y>H+30)continue;alive++;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;
      if(p.round){g.beginPath();g.arc(0,0,p.w*.6,0,6.283);g.fill()}else{g.scale(1,Math.abs(Math.cos(p.wob))*.8+.2);g.fillRect(-p.w/2,-p.h/2,p.w,p.h)}g.restore()}
    if(alive&&t<330)requestAnimationFrame(step);else cv.remove()};
  requestAnimationFrame(step);setTimeout(()=>cv.remove(),6000)}
function countUp(el,to,ms=900){if(!el)return;if(calmMotion()||!to){el.textContent=el.dataset.pre+to;return}const t0=performance.now();
  const f=t=>{const k=Math.min(1,(t-t0)/ms),v=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=el.dataset.pre+v;if(k<1&&el.isConnected)requestAnimationFrame(f)};requestAnimationFrame(f)}
/* Jr. maze effects: a hop each step, a dust puff, a wobble + 💫 on a bonk, a floating +1 🍌 when a banana is eaten */
function mazeFx(m,kind,x,y,text){const mz=$("#mz");if(!mz||calmMotion())return;const e=document.createElement("div");e.className="mfx "+kind;
  e.style.left=`calc((${x} + .5) * 100% / ${m.w})`;e.style.top=`calc((${y} + ${kind==="puff"?.8:.3}) * 100% / ${m.h})`;if(text)e.textContent=text;mz.appendChild(e);setTimeout(()=>e.remove(),1000)}
/* "Smart block" thinking: when a 🌵 ahead? block makes TypeMonkey turn, a thought bubble shows why */
function mazeThink(m,x,y,why){const mz=$("#mz");if(!mz)return;const e=document.createElement("div");e.className="mthink";
  e.textContent=`${JR_WALL.w} ahead! ${why==="ifL"?"↰":"↱"}`;e.style.top=`calc(${y} * 100% / ${m.h})`;if(!y)e.classList.add("low");mz.appendChild(e);
  const W=mz.clientWidth,w=e.offsetWidth,cx=(x+.5)*W/m.w;e.style.left=Math.max(4,Math.min(W-w-4,cx-w/2))+"px";   // centred on TypeMonkey, kept inside the maze
  e.style.setProperty("--tail",(cx-Math.max(4,Math.min(W-w-4,cx-w/2)))+"px");
  setTimeout(()=>e.remove(),calmMotion()?700:1100)}
function mkAnim(cls){const k=$("#mk");if(!k||calmMotion())return;k.classList.remove("hop","bonk","win");void k.offsetWidth;k.classList.add(cls)}
/* Ghost preview: a see-through monkey shows where the program so far ends and which way he faces,
   so kids can see what "Turn right" does before pressing Go. */
const ghostPlace=(m,end)=>{const g=$("#mkg");if(!g)return;if(!end){g.hidden=true;return}const [x,y,d]=end;g.hidden=false;
  g.style.left=`calc(${x} * 100% / ${m.w})`;g.style.top=`calc(${y} * 100% / ${m.h})`;g.querySelector(".arr").style.transform=`rotate(${ROT[d]}deg)`};
const mkPlace=(m,x,y,d,bump)=>{const k=$("#mk");if(!k)return;{const px=+k.dataset.x,py=+k.dataset.y;if(k.dataset.x!==undefined){if(bump){mkAnim("bonk");mazeFx(m,"up",x,y,"💫")}else if(px!==x||py!==y){mkAnim("hop");mazeFx(m,"puff",px,py)}}k.dataset.x=x;k.dataset.y=y}k.style.left=`calc(${x} * 100% / ${m.w})`;k.style.top=`calc(${y} * 100% / ${m.h})`;k.style.transform=bump?"translateX(4px)":"none";$("#arr").style.transform=`rotate(${ROT[d]}deg)`};
function maze(s){
  const m=mazeInfo(s.grid);let prog=jrClone(s.start||[]);let open=null,running=false,fails=0,won=false,everWon=false,mark=null,glow=null,walk=null,walkK=0;
  let fn=jrClone(s.startFn||[]),lane=s.func&&!(s.startFn||[]).length?"fn":"main";const FN_OK=["fwd","left","right","ifR","ifL"];
  const total=()=>blockCount(prog)+(s.func?fn.length:0);
  const solM=s.solution?(s.func?s.solution.main:s.solution):null,solF=s.func&&s.solution?s.solution.fn:[];
  const best=solM?blockCount(solM)+solF.length:0;const loopy=s.blocks.some(b=>b==="rep"||b==="until"||b==="call");
  const Wd=worldFor();setWall(Wd);
  const cell=ch=>ch==="#"?Wd.wall:ch==="B"?"🍌":"";const nB=m.goals.length;
  shell(`<div class="card"><div class="label">${Wd.emoji} ${Wd.name} maze${nB>1?` · collect all ${nB} bananas`:""}${s.max?` · use ${s.max} blocks or fewer`:""}${s.sandbox?"":" · +15 XP"}</div><h2>${s.title}</h2>${jrGoal(s)}${s.body||""}
    <div class="maze" style="--w:${m.w};--h:${m.h};--path:${Wd.path};--pathline:${Wd.line};--tree:${Wd.tree}" id="mz">${s.grid.map((row,y)=>[...row].map((ch,x)=>`<div class="mc ${ch==="#"?"tree":"path"}" data-xy="${x},${y}">${cell(ch)}</div>`).join("")).join("")}<div class="mk ghost" id="mkg" hidden aria-hidden="true"><div class="mface">${monkey("happy")}</div><span class="arr"></span></div><div class="mk" id="mk"><div class="mface" id="mface">${monkey("happy")}</div><span class="arr" id="arr">➜</span></div></div>
    ${s.func?`<div class="lanes" role="tablist"><button class="lane" data-lane="main" aria-pressed="true">Main program</button><button class="lane" data-lane="fn" aria-pressed="false">⭐ My move</button></div>
    <div class="label">⭐ My move <span style="text-transform:none;letter-spacing:0;font-weight:600">(build it once, use it with the ⭐ block)</span></div><div class="prog fprog" id="fprog"></div>`:""}
    <div class="label">${s.func?"Main program":"Your program"}</div><div class="prog" id="prog"></div><p class="progtip" id="progtip" aria-live="polite"></p>
    <div class="palette">${s.blocks.map(b=>`<button class="blk b-${b}" data-b="${b}"><span>${BLOCKS[b].icon}</span>${BLOCKS[b].label}</button>`).join("")}</div>
    <div id="fb"></div></div>
    <div id="bud">${buddy(s.say||"Tap the blocks to build a program, then press Go!","think")}</div>
    <div class="row kidrow"><button class="btn banana" id="run">▶ Go!</button><button class="btn ghost" id="undo">Undo</button><button class="btn ghost" id="clr">Clear</button><button class="btn ghost" id="hint" hidden>💡 Show me a hint</button><button class="btn ghost" id="walk" hidden>👣 Show me step by step</button>${s.sandbox?`<button class="btn ghost" id="edit">✏️ Change my puzzle</button>`:""}<button class="btn" id="go" hidden>Continue</button></div>`);
  const place=(x,y,d,bump)=>mkPlace(m,x,y,d,bump);
  const reset=()=>{{const _k=$("#mk");if(_k)delete _k.dataset.x}place(m.start[0],m.start[1],s.dir);m.goals.forEach(([gx,gy])=>{const c=document.querySelector(`.mc[data-xy="${gx},${gy}"]`);if(c)c.textContent="🍌"})};
  const hit=(o,i,j,f)=>!!o&&o.i===i&&o.j===j&&o.f===f;
  const updGhost=()=>{if(running||won||(!prog.length&&!fn.length)){ghostPlace(m,null);return}
    const r=simulate(s.grid,s.dir,prog,s.func?fn:[]);const e=r.path[r.path.length-1];
    ghostPlace(m,e&&!(e[0]===m.start[0]&&e[1]===m.start[1]&&e[2]===s.dir)?e:null)};
  const draw=()=>{queueMicrotask(updGhost);
    const fl=(o,i,j)=>hit(o,i,j,undefined);
    if(s.func){
      $("#fprog").innerHTML=fn.length?fn.map((b,i)=>`<button class="chip ${mark&&mark.f===i?"oops":""} ${glow&&glow.f===i?"glow":""}" data-f="${i}" aria-label="Remove ${BLOCKS[b].label}">${BLOCKS[b].icon}</button>`).join(""):'<span class="empty">Tap ⭐ My move above, then add blocks here</span>';
      $$("#fprog .chip").forEach(c=>c.onclick=()=>{if(running||won)return;fn.splice(+c.dataset.f,1);edit()});
      $$(".lane").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.lane===lane);b.classList.toggle("glow",!!glow&&!!glow.lane&&glow.lane===b.dataset.lane&&lane!==glow.lane)});
      $("#fprog").classList.toggle("active",lane==="fn");$("#prog").classList.toggle("active",lane==="main");
    }
    const chip=(b,i,j)=>`<button class="chip ${mark&&(fl(mark,i,j)||mark.f!==undefined&&mark.i===i&&mark.j===j)?"oops":""} ${fl(glow,i,j)?"glow":""}" data-i="${i}" ${j!==undefined?`data-j="${j}"`:""} aria-label="Remove ${BLOCKS[b].label}">${BLOCKS[b].icon}</button>`;
    $("#prog").innerHTML=prog.length?prog.map((b,i)=>typeof b==="object"?
      `<span class="repblk ${b.until?"until":""} ${open===i?"open":""} ${fl(mark,i,undefined)?"oops":""} ${fl(glow,i,undefined)?"glow":""}">${b.until?`<span class="repn">🔁 until 🍌</span>`:`<button class="repn ${glow&&glow.rep===i?"glow":""}" data-r="${i}" aria-label="Change repeat count">🔁 ×${b.rep}</button>`}${b.body.map((t,j)=>chip(t,i,j)).join("")}${open===i?`<button class="repclose ${glow&&glow.done===i?"glow":""}" data-c="${i}">done</button>`:`<button class="repadd" data-a="${i}" aria-label="Add blocks inside this repeat">＋</button>`}</span>`:chip(b,i)).join(""):'<span class="empty">Tap blocks below to add them here</span>';
    $$("#prog .chip").forEach(c=>c.onclick=()=>{if(running||won)return;const i=+c.dataset.i;if(c.dataset.j!==undefined)prog[i].body.splice(+c.dataset.j,1);else{prog.splice(i,1);if(open!==null&&i<open)open--}edit()});
    $$("#prog button.repn").forEach(c=>c.onclick=()=>{if(running||won)return;const b=prog[+c.dataset.r];b.rep=b.rep>=5?2:b.rep+1;edit()});
    $$("#prog .repclose").forEach(c=>c.onclick=()=>{open=null;edit()});
    $$("#prog .repadd").forEach(c=>c.onclick=()=>{if(running||won)return;open=+c.dataset.a;edit()});
    {const tip=$("#progtip");if(tip)tip.innerHTML=open!==null?"👉 Tap blocks to put them <b>inside</b> 🔁. Tap <b>done</b> when you're finished.":(prog.some(b=>typeof b==="object")?"Tip: tap <b>＋</b> on a 🔁 box to add more blocks inside it.":"")}
    $$(".palette .blk").forEach(b=>b.classList.toggle("glow",!!glow&&glow.pal===b.dataset.b&&(!glow.lane||glow.lane===lane)));
    $("#run").classList.toggle("glow",!!glow&&!!glow.go);$("#run").classList.toggle("ready",!!prog.length&&!running&&!won&&!(glow&&glow.go));
  };
  const edit=()=>{mark=null;glow=null;draw()};
  $$(".palette .blk").forEach(b=>b.onclick=()=>{
    if(running||won)return;const t=b.dataset.b;
    if(s.func&&lane==="fn"){if(!FN_OK.includes(t))return toast(t==="call"?"My move can't use itself! Switch to Main program to use ⭐.":"Only simple moves go inside My move.");fn.push(t);return edit()}
    if(t==="rep"||t==="until"){if(open!==null)return toast("Finish the repeat you're building first (tap done).");prog.push(t==="rep"?{rep:2,body:[]}:{until:true,body:[]});open=prog.length-1}
    else if(open!==null)prog[open].body.push(t);else prog.push(t);
    edit();
  });
  $$(".lane").forEach(b=>b.onclick=()=>{lane=b.dataset.lane;open=null;draw()});
  $("#undo").onclick=()=>{if(running||won)return;if(s.func&&lane==="fn"){fn.pop();return edit()}if(open!==null&&prog[open].body.length)prog[open].body.pop();else{prog.pop();open=null}edit()};
  $("#clr").onclick=()=>{if(running||won)return;if(s.func&&lane==="fn")fn=[];else{prog=[];open=null}edit();reset()};
  /* 💡 hint: glow the next right block. 👣 step by step: build the answer one block per tap. */
  $("#hint").onclick=()=>{if(running||won)return;jsnd("hint");const h=mazeHint(prog,fn,s,open);mark=null;glow=h.glow;draw();jrBud("💡 "+h.msg,"happy")};
  $("#walk").onclick=()=>{if(running||won)return;jsnd("hint");
    if(!walk){walk=[];solF.forEach((b,k)=>walk.push({fn:solF.slice(0,k+1),main:[],at:{f:k},say:`In ⭐ My move, add ${bname(b)}.`}));
      solM.forEach((b,k)=>walk.push({fn:solF,main:solM.slice(0,k+1),at:isBox(b)?{i:k}:{i:k},say:`${s.func?"In the Main program, add":"Add"} ${bname(b)}.`}));walkK=0}
    const st=walk[walkK++];prog=jrClone(st.main);fn=jrClone(st.fn);open=null;if(s.func)lane=st.at.f!==undefined?"fn":"main";mark=null;glow=st.at;draw();reset();
    const last=walkK>=walk.length;jrBud(`Step ${walkK} of ${walk.length}: ${st.say}${last?" That's the whole program! Now press ▶ Go.":""}`,"happy");
    $("#walk").textContent=last?"👣 Start again":"👣 Next step";if(last)walk=null};
  if(s.sandbox)$("#edit").onclick=()=>{if(!running)s.sandbox()};
  const msgFor=(result,left)=>{const W=Wd.wall;
    if(result==="win")return `You got there! But this puzzle wants ${s.max} blocks or fewer, and you used ${total()}.${loopy?" A Repeat 🔁 can make it shorter!":""}`;
    if(result==="wall")return `Oops! The monkey bumped into a ${W}. Look at the wiggly block. Does it need a turn ↰ ↱ before it?`;
    if(result==="loop")return "The monkey went around and around! The wiggly loop never got him to every banana. Look at the blocks inside it.";
    if(result==="extra")return `Yum, ${nB>1?"every banana":"the banana"}! But then the monkey kept going. The wiggly block is extra. Take it away!`;
    return `So close! ${left>1?`${left} bananas are`:"A banana is"} still waiting. Add more blocks at the end.`};
  $("#run").onclick=()=>{
    if(running||won||!prog.length)return;running=true;open=null;mark=null;glow=null;$("#fb").innerHTML="";draw();reset();
    const {path,result,failAt,left}=simulate(s.grid,s.dir,prog,fn);let k=1;
    const sid=SCREEN_ID;const tick=()=>{if(SCREEN_ID!==sid)return;
      if(!$("#mk"))return;
      if(k<path.length){const [x,y,d,bump,ate,why]=path[k];place(x,y,d,bump);if(why)mazeThink(m,x,y,why);jsnd(bump?"bonk":ate?"nom":"walk",k);if(ate){mazeFx(m,"up",x,y,"+1 🍌");const c=document.querySelector(`.mc[data-xy="${ate}"]`);if(c)setTimeout(()=>{c.textContent="✨"},250)}k++;return setTimeout(tick,path.length>40?220:380)}
      running=false;
      const tooMany=s.max&&total()>s.max;
      if(result==="win"&&!tooMany){const first=!everWon;won=everWon=true;if(first&&!s.sandbox){award(15,3);bump("mazes");if(s.start)bump("bugsFixed")}jsnd("tada");$("#mface").innerHTML=monkey("cheer");mkAnim("win");
        const more=best&&total()>best;
        $("#fb").innerHTML=`<div class="feedback good">🍌 ${nB>1?"All bananas collected!":"Banana reached!"} ${esc(s.win||pick(WINS))}<div class="kcode"><small>🧑‍💻 Your blocks, written as code:</small><pre>${esc(kidCode(prog,s.func?fn:null))}</pre></div>
          ${more?`<div class="nudge">🌟 You did it! Can you do it with fewer blocks?${loopy?" A loop 🔁 could help.":""} <button class="btn ghost sm" id="fewer">Try with ${best} blocks</button></div>`:""}</div>`;
        jrBud(pick(KID_WINS),"cheer");if(cur.c.kids)bananaBurst();["run","undo","clr","hint","walk"].forEach(i=>$("#"+i).hidden=true);$("#go").hidden=false;draw();
        if(more)$("#fewer").onclick=()=>{won=false;$("#fb").innerHTML="";["run","undo","clr"].forEach(i=>$("#"+i).hidden=false);reset();jrBud(`Can you do it with only ${best} blocks? Change your program, then press Go. (You can also just tap Continue.)`,"think");draw()};
        return}
      fails++;jsnd("oops");$("#mface").innerHTML=monkey("oops");setTimeout(()=>{const f=$("#mface");if(f)f.innerHTML=monkey("happy")},900);
      mark=result==="win"?null:failAt;if(mark&&mark.f!==undefined&&s.func)lane="fn";draw();
      const msg=msgFor(result,left);
      $("#fb").innerHTML=`<div class="feedback oops">${msg}</div>`;
      jrBud(fails>=4&&s.solution?"Want me to show you? Tap “👣 Show me step by step”.":fails>=2&&s.solution?"Need a little help? Tap “💡 Show me a hint”.":"Bugs are normal! Every coder fixes their programs.","oops",msg);
      if(fails>=2&&s.solution)$("#hint").hidden=false;if(fails>=4&&s.solution)$("#walk").hidden=false;
    };
    setTimeout(tick,200);
  };
  draw();reset();$("#go").onclick=next;wireGoal();
}
/* Predict first: read a short program, then guess where the monkey stops (or which dance move comes next).
   Only then does it run. */
const roChips=p=>p.map(b=>isBox(b)?`<span class="repblk ${b.until?"until":""}"><span class="repn">${b.until?"🔁 until 🍌":"🔁 ×"+b.rep}</span>${b.body.map(t=>`<span class="chip">${BLOCKS[t].icon}</span>`).join("")}</span>`:`<span class="chip">${BLOCKS[b].icon}</span>`).join("");
function predictEnd(s){const r=simulate(s.grid,s.dir,s.prog,[]);const e=r.path[r.path.length-1];return {x:e[0],y:e[1],r}}
function predict(s){
  if(s.dance)return predictDance(s);
  const m=mazeInfo(s.grid),Wd=worldFor(),E=(setWall(Wd),predictEnd(s)),path=E.r.path;let guess=null,busy=false,tries=0,done=false;
  const cell=ch=>ch==="#"?Wd.wall:ch==="B"?"🍌":"";
  shell(`<div class="card"><div class="label">🤔 Predict · +10 XP</div><h2>${s.title}</h2>${jrGoal(s)}${s.body||""}
    <div class="label">The program</div><div class="prog ro">${roChips(s.prog)}</div>
    <div class="maze" style="--w:${m.w};--h:${m.h};--path:${Wd.path};--pathline:${Wd.line};--tree:${Wd.tree}" id="mz">${s.grid.map((row,y)=>[...row].map((ch,x)=>ch==="#"?`<div class="mc tree">${cell(ch)}</div>`:`<button class="mc path pick" data-xy="${x},${y}" aria-label="Square ${x+1} across, ${y+1} down">${cell(ch)}</button>`).join("")).join("")}<div class="mk" id="mk"><div class="mface" id="mface">${monkey("think")}</div><span class="arr" id="arr">➜</span></div></div>
    <div class="kcode"><small>🧑‍💻 The program, written as code:</small><pre>${esc(kidCode(s.prog))}</pre></div><div id="fb"></div></div>
    <div id="bud">${buddy(s.say||"Tap the square where I'll stop. Then press ▶ Let's see!","think")}</div>
    <div class="row"><button class="btn banana" id="run" disabled>▶ Let's see!</button><button class="btn ghost" id="again" hidden>Guess again</button><button class="btn" id="go" hidden>Continue</button></div>`);
  const reset=()=>{{const _k=$("#mk");if(_k)delete _k.dataset.x}mkPlace(m,m.start[0],m.start[1],s.dir);m.goals.forEach(([gx,gy])=>{const c=document.querySelector(`.mc[data-xy="${gx},${gy}"]`);if(c)c.textContent="🍌"});$$(".mc").forEach(c=>c.classList.remove("stop"))};
  $$(".mc.pick").forEach(c=>c.onclick=()=>{if(busy||done)return;$$(".mc.guess").forEach(g=>g.classList.remove("guess"));c.classList.add("guess");guess=c.dataset.xy.split(",").map(Number);$("#run").disabled=false;$("#run").classList.add("ready");jsnd("step")});
  $("#run").onclick=()=>{if(busy||done||!guess)return;busy=true;$("#run").classList.remove("ready");reset();let k=1;
    const sid=SCREEN_ID;const tick=()=>{if(SCREEN_ID!==sid)return;if(!$("#mk"))return;if(k<path.length){const [x,y,d,bump,ate,why]=path[k];mkPlace(m,x,y,d,bump);if(why)mazeThink(m,x,y,why);jsnd(ate?"nom":"walk",k);if(ate){mazeFx(m,"up",x,y,"+1 🍌");const c=document.querySelector(`.mc[data-xy="${ate}"]`);if(c)setTimeout(()=>{c.textContent="✨"},250)}k++;return setTimeout(tick,420)}
      busy=false;tries++;const ok=guess[0]===E.x&&guess[1]===E.y;const stop=document.querySelector(`.mc[data-xy="${E.x},${E.y}"]`);if(stop)stop.classList.add("stop");
      const steps=path.slice(1).filter((p,i)=>p[0]!==path[i][0]||p[1]!==path[i][1]).length,turns=path.slice(1).filter((p,i)=>p[2]!==path[i][2]).length;
      const how=`I walked ${steps} step${steps===1?"":"s"}${turns?` and turned ${turns} time${turns===1?"":"s"}`:""}.`;
      if(ok){done=true;if(tries===1)award(10,1);jsnd("tada");$("#mface").innerHTML=monkey("cheer");mkAnim("win");$("#fb").innerHTML=`<div class="feedback good">🎉 You guessed it! ${how} You can read code like a pro!</div>`;jrBud(pick(KID_WINS),"cheer");bananaBurst();$("#run").hidden=true;$("#again").hidden=true;$("#go").hidden=false}
      else{jsnd("oops");$("#mface").innerHTML=monkey("happy");const msg=`Nice try! I stopped on the green square. ${how} Follow the blocks one by one with your finger.`;$("#fb").innerHTML=`<div class="feedback oops">${msg}</div>`;
        jrBud(tries>=2?"Now you know! Tap Continue when you're ready.":"Want to try again? Tap “Guess again”.","happy",msg);$("#run").hidden=true;$("#again").hidden=tries>=2;$("#go").hidden=false;if(tries>=2)done=true}};
    setTimeout(tick,200)};
  $("#again").onclick=()=>{if(busy)return;reset();guess=null;$$(".mc.guess").forEach(g=>g.classList.remove("guess"));$("#fb").innerHTML="";$("#again").hidden=true;$("#run").hidden=false;$("#run").disabled=true;jrBud("Read the blocks again, then tap a square.","think")};
  reset();$("#go").onclick=next;wireGoal();
}
function predictDance(s){
  const seq=Array.from({length:s.dance.times||1},()=>s.dance.pattern).flat(),ans=seq[s.ask];let done=false,busy=false;
  shell(`<div class="card"><div class="label">🤔 Predict · +10 XP</div><h2>${s.title}</h2>${jrGoal(s)}${s.body||""}
    <div class="stage" id="stage"><span class="spot l"></span><span class="spot r"></span><span class="ball">🪩</span>
      <div class="floor">${Array.from({length:16},(_,k)=>`<i style="--c:${["#FF8FC0","#FFD25C","#6EC6FF","#7EDC9A"][k%4]}"></i>`).join("")}</div>
      <div class="shadow" id="dsh"></div><div class="dancer" id="dz">${monkey("think")}</div><div class="dlab" id="dlab" aria-live="polite"></div></div>
    <div class="label">The dance program</div><div class="dloop"><span>🔁 Repeat ${s.dance.times||1} times:</span></div><div class="dprog inloop">${s.dance.pattern.map(m=>dchip(m)).join("")}</div>
    <div class="kcode"><small>🧑‍💻 As code:</small><pre>${esc(danceCode(s.dance.pattern,s.dance.times||1,true))}</pre></div>
    <div class="label">The dance so far</div><div class="dtarget" id="tg">${seq.slice(0,s.ask).map(m=>dchip(m)).join("")}<span class="qchip" id="q">?</span></div>
    <div class="label">What comes next? Tap it!</div>
    <div class="palette">${s.moves.map(m=>`<button class="blk dm" style="--mc:${DMOVES[m].c}" data-m="${m}"><span>${DMOVES[m].icon}</span>${DMOVES[m].label}</button>`).join("")}</div><div id="fb"></div></div>
    <div id="bud">${buddy(s.say||"Look at the program. Which move is next?","think")}</div>
    <div class="row"><button class="btn" id="go" hidden>Continue</button></div>`);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  $$(".dm").forEach(b=>b.onclick=async()=>{if(done||busy)return;busy=true;const pickM=b.dataset.m,ok=pickM===ans;$$(".dm").forEach(x=>x.disabled=true);
    const dz=$("#dz"),lab=$("#dlab"),st=$("#stage");st.classList.add("live");
    for(const mv of seq.slice(0,s.ask+1)){if(!dz.isConnected)return;dz.className="dancer";void dz.offsetWidth;dz.classList.add("d-"+mv);jsnd("m_"+mv);lab.textContent=DMOVES[mv].icon+" "+DMOVES[mv].label+"!";lab.classList.add("on");await sleep(620)}
    if(!dz.isConnected)return;dz.className="dancer";lab.classList.remove("on");st.classList.remove("live");done=true;busy=false;
    $("#q").outerHTML=dchip(ans,'id="q"');const q=$("#q");q.classList.add(ok?"good":"glow");
    if(ok){award(10,1);jsnd("tada");dz.innerHTML=monkey("cheer");$("#fb").innerHTML=`<div class="feedback good">🎉 Yes! ${DMOVES[ans].icon} ${DMOVES[ans].label} comes next. You read the loop like a real coder!</div>`;jrBud(pick(KID_WINS),"cheer");bananaBurst()}
    else{jsnd("oops");dz.innerHTML=monkey("happy");const msg=`Nice try! The next move is ${DMOVES[ans].icon} ${DMOVES[ans].label}. The loop does ${s.dance.pattern.map(m=>DMOVES[m].icon).join(" ")} again and again.`;
      $("#fb").innerHTML=`<div class="feedback oops">${msg}</div>`;jrBud("Loops repeat the same moves in the same order. Now you know!","happy",msg)}
    $("#go").hidden=false});
  $("#go").onclick=next;wireGoal();
}
/* Free play: a tiny level maker. The solver finds a path (nearest banana first) and turns it into blocks, so the
   kid's own puzzle still gets hints and the "fewer blocks" nudge. Returns null if a banana can't be reached. */
function jrSolve(grid,dir){
  const m=mazeInfo(grid),H=grid.length,W=grid[0].length;if(!m.start||!m.goals.length)return null;
  let [x,y]=m.start,d=dir;const left=new Set(m.goals.map(g=>g.join(","))),out=[];
  const free=(a,b)=>b>=0&&b<H&&a>=0&&a<W&&grid[b][a]!=="#";
  while(left.size){
    const prev=new Map([[x+","+y,null]]),q=[[x,y]];let found=null;
    while(q.length){const [cx,cy]=q.shift();if(left.has(cx+","+cy)){found=[cx,cy];break}
      for(const [dx,dy] of Object.values(DIRS)){const nx=cx+dx,ny=cy+dy,key=nx+","+ny;if(free(nx,ny)&&!prev.has(key)){prev.set(key,[cx,cy]);q.push([nx,ny])}}}
    if(!found)return null;
    const cells=[];for(let c=found;c&&!(c[0]===x&&c[1]===y);c=prev.get(c.join(",")))cells.unshift(c);
    for(const [nx,ny] of cells){const want=Object.keys(DIRS).find(k=>DIRS[k][0]===nx-x&&DIRS[k][1]===ny-y);
      if(want!==d){if(RIGHT[d]===want)out.push("right");else if(LEFT[d]===want)out.push("left");else out.push("right","right");d=want}
      out.push("fwd");x=nx;y=ny;left.delete(x+","+y)}
  }
  const prog=[];for(let i=0;i<out.length;){if(out[i]!=="fwd"){prog.push(out[i++]);continue}let n=0;while(out[i+n]==="fwd")n++;i+=n;
    while(n>=3){const k=Math.min(n,5);prog.push({rep:k,body:["fwd"]});n-=k}while(n-->0)prog.push("fwd")}
  return prog;
}
const BUILD_W=5,BUILD_H=5,BUILD_START=["S.#..","..#..",".....","##.#.","....B"];
function builder(s){
  const saved=S.jrBuild&&Array.isArray(S.jrBuild.grid)&&S.jrBuild.grid.length===BUILD_H&&S.jrBuild.grid.every(r=>typeof r==="string"&&r.length===BUILD_W&&/^[S.#B]+$/.test(r))&&S.jrBuild.grid.join("").split("S").length===2;
  let g=(saved?S.jrBuild.grid:BUILD_START).map(r=>[...r]),dir=saved&&DIRS[S.jrBuild.dir]?S.jrBuild.dir:"E",tool="tree";
  const TOOLS=[["monkey","🐵","Monkey"],["banana","🍌","Banana"],["tree","🌴","Tree"],["erase","🧽","Erase"]];
  shell(`<div class="card"><div class="label">🛠️ Puzzle maker · free play</div><h2>${s.title}</h2>${jrGoal(s)}
    <p>1. Pick a thing. 2. Tap a square. 3. Press <b>▶ Play it!</b></p>
    <div class="btools" role="group" aria-label="What to put down">${TOOLS.map(([k,i,l])=>`<button class="tool-b" data-t="${k}" aria-pressed="${k===tool}"><span>${i}</span>${l}</button>`).join("")}</div>
    <div class="bgrid" id="bg" style="--w:${BUILD_W};--h:${BUILD_H}"></div>
    <div class="row"><button class="btn ghost sm" id="turn">↻ Turn the monkey</button><button class="btn ghost sm" id="wipe">🧹 Empty grid</button></div><div id="fb"></div></div>
    <div id="bud">${buddy(s.say||"Pick a thing, then tap a square to put it there.","think")}</div>
    <div class="row"><button class="btn banana" id="play">▶ Play it!</button><button class="btn ghost" id="skip">I'm done</button></div>`);
  const count=ch=>g.flat().filter(c=>c===ch).length;
  const draw=()=>{$("#bg").innerHTML=g.map((row,y)=>row.map((ch,x)=>`<button class="bcell ${ch==="#"?"tree":""}" data-x="${x}" data-y="${y}" aria-label="${{S:"Monkey",B:"Banana","#":"Tree",".":"Empty"}[ch]} square">${ch==="S"?`<span class="bmk">${monkey("happy")}</span><span class="arr" style="transform:rotate(${ROT[dir]}deg)">➜</span>`:ch==="B"?"🍌":ch==="#"?"🌴":""}</button>`).join("")).join("");
    $$(".bcell").forEach(c=>c.onclick=()=>put(+c.dataset.x,+c.dataset.y));$$(".tool-b").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===tool))};
  const say=(t,mood)=>jrBud(t,mood||"think");
  const put=(x,y)=>{const ch=g[y][x];$("#fb").innerHTML="";
    if(tool==="monkey"){if(ch==="S"){dir=RIGHT[dir]}else{g.forEach(r=>r.forEach((c,i)=>{if(c==="S")r[i]="."}));g[y][x]="S"}}
    else if(ch==="S"){return say(tool==="erase"?"I have to stay on the grid! Use the 🐵 Monkey tool to move me.":"That's my spot! Pick another square.","oops")}
    else if(tool==="banana"){if(ch!=="B"&&count("B")>=5)return say("5 bananas is the most. Yum!","oops");g[y][x]=ch==="B"?".":"B"}
    else if(tool==="tree")g[y][x]=ch==="#"?".":"#";
    else g[y][x]=".";
    jsnd("step");draw()};
  $$(".tool-b").forEach(b=>b.onclick=()=>{tool=b.dataset.t;draw();say({monkey:"Tap a square to move me there. Tap me again to turn me.",banana:"Tap squares to add bananas (up to 5).",tree:"Tap squares to add or remove trees.",erase:"Tap things to take them away."}[tool])});
  $("#turn").onclick=()=>{dir=RIGHT[dir];draw()};
  $("#wipe").onclick=()=>{g=g.map(r=>r.map(c=>c==="S"?"S":"."));draw();say("All clear! Now add bananas and trees.")};
  $("#skip").onclick=next;
  $("#play").onclick=()=>{const grid=g.map(r=>r.join(""));
    if(!count("B")){$("#fb").innerHTML=`<div class="feedback oops">Add at least one 🍌 banana first!</div>`;return say("I need a banana to walk to!","oops")}
    const sol=jrSolve(grid,dir);
    if(!sol){$("#fb").innerHTML=`<div class="feedback oops">Uh oh, trees are blocking a banana! Take away a 🌴 so I can get there.</div>`;return say("I can't reach every banana. Make a path for me!","oops")}
    S.jrBuild={grid,dir};save();jsnd("tada");
    maze({type:"maze",title:"Your own puzzle!",aim:"🍌 Now solve your own puzzle!",grid,dir,blocks:["fwd","left","right","rep"],solution:sol,sandbox:()=>builder(s),say:"You made it, now solve it! Build a program and press Go."})};
  draw();wireGoal();
}

/* ---------- Mini-game: Output Rush ---------- */
function gameIntro(){
  if(!cur.l.pool||!cur.l.pool.length)return next();
  shell(`<div class="card"><div class="label">Mini-game</div><h2>Output Rush</h2><p>45 seconds on the clock. Read each snippet and tap what it prints. Every right answer earns 2 bananas.</p></div>
    ${buddy("Speed round! Don't overthink it.","cheer")}<div class="row"><button class="btn banana" id="go">Start the clock</button><button class="btn ghost" id="skip">Skip</button></div>`);
  $("#go").onclick=()=>rush(cur.l.pool.map((p,j)=>[p[0],p[1],cur.c.lang,cur.c.rushHint,{lid:cur.l.id,j}]),45,(score)=>{award(score*3,score*2);next()},()=>coursePage(cur.c.id));
  $("#skip").onclick=next;
}
function rush(poolIn,secs,onEnd,onQuit){
  const pool=shuffle(poolIn);let i=0,score=0,left=secs,ended=false;
  const timer=setInterval(()=>{left--;const t=$("#tleft");if(t){t.textContent=left;$("#tbar").style.width=(left/secs*100)+"%"}if(left<=0)end()},1000);
  function end(){if(ended)return;ended=true;clearInterval(timer);sfx("complete");
    bump("rushes");if(score===pool.length&&pool.length>=5)bump("rushPerfect");S.stats.rushBest=Math.max(S.stats.rushBest||0,score);
    $("#screen").innerHTML=`<div class="stack"><div class="card" style="align-items:center;text-align:center"><div class="label">Time!</div><div class="big">${score}/${pool.length}</div><p>+${score*2} bananas · +${score*3} XP</p></div>
      ${buddy(score>=Math.ceil(pool.length*.8)?"Unreal speed. Are you secretly a monkey?":score>=pool.length/2?"Solid run! Practice makes it automatic.":"Good warm-up. These get easy fast.",score>=pool.length/2?"cheer":"happy")}
      <div class="row"><button class="btn" id="fin">Continue</button></div></div>`;
    $("#fin").onclick=()=>onEnd(score);}
  function round(){
    if(i>=pool.length)return end();
    const [code,opts,file="script.js",hint]=pool[i];const ord=shuffle(opts.map((o,k)=>k));
    $("#screen").innerHTML=`<div class="stack"><div class="game-hud"><button class="x" id="quitg" aria-label="Quit game">×</button><span>⏱ <span id="tleft">${left}</span>s</span><div class="timer"><span id="tbar" style="width:${left/secs*100}%"></span></div><span>🍌 ${score*2}</span></div>
      <div class="card"><div class="label">What prints? · ${i+1} of ${pool.length}</div><div class="editor"><div class="head"><span>${file}</span></div><pre>${esc(code)}</pre></div>
      ${hint||((code.match(/console\.log|print\(|println|WriteLine|cout|printf|Console\.Write/g)||[]).length>1||/\b(for|while|foreach|repeat)\b/.test(code))?`<p style="color:var(--muted);font-size:.85rem">${hint||"If it prints more than one line, the lines are shown with spaces between them."}</p>`:""}
      <div class="opts">${ord.map(k=>`<button class="opt mono" data-k="${k}">${esc(opts[k])}</button>`).join("")}</div></div></div>`;
    $("#quitg").onclick=()=>{clearInterval(timer);ended=true;onQuit()};
    $$(".opt").forEach(b=>b.onclick=()=>{
      const ok=+b.dataset.k===0;sfx(ok?"correct":"wrong");b.classList.add(ok?"right":"wrong");if(ok)score++;
      const meta=pool[i][4];if(!ok&&meta)missed(meta.lid+"#p"+meta.j,{kind:"pool",lid:meta.lid,j:meta.j});
      $$(".opt").forEach(x=>{x.disabled=true;if(+x.dataset.k===0)x.classList.add("right")});
      setTimeout(()=>{i++;if(!ended)round()},ok?350:900);
    });
  }
  round();
}
function practice(){
  rerender=home;
  let pool=[];
  const add=(c,l)=>pool.push(...l.pool.map((p,j)=>[p[0],p[1],c.lang,c.rushHint,{lid:l.id,j}]));
  for(const c of COURSES)for(const x of flat(c))if(S.done.includes(x.l.id)&&x.l.pool)add(c,x.l);
  if(!pool.length)add(COURSES[0],COURSES[0].units[0].lessons[0]);
  pool=shuffle(pool).slice(0,12);
  $("#foot").innerHTML="";
  rush(pool,60,(score)=>{S.xp+=score*3;S.bananas+=score*2;if(score)bumpStreak();save();home()},home);
}

/* ---------- Finish ---------- */
function finish(){
  if(cur.review)return reviewDone();
  if(cur.daily)return dailyDone();
  const id=cur.l.id;const first=!S.done.includes(id);mapWalk={cid:cur.c.id,from:id};
  const bonus=first?20:0;cur.earned.xp+=bonus;
  S.xp+=cur.earned.xp;S.bananas+=cur.earned.ban;bumpStreak();if(first)S.done.push(id);delete S.progress[id];
  bump("lessons");if(cur.earned.total>=2&&cur.earned.right===cur.earned.total)bump("perfectQuiz");
  const hr=new Date().getHours();if(hr>=22||hr<4)bump("night");if(hr>=4&&hr<8)bump("early");
  save();
  const L=flat(cur.c);const nx=L[cur.item.idx+1];const nst=nx&&status(cur.c,nx);
  const [d,n,all]=countLessons(cur.c);const courseDone=first&&d===n&&n===all;const askRemind=Remind.shouldAsk();
  shell(`<div class="card" style="text-align:center;align-items:center"><div class="fin-stage" aria-hidden="true"><div class="rays"></div>${monkey("cheer")}</div><div class="label">${cur.l.project?"Project complete":"Lesson complete"}</div><h2>${esc(cur.l.title)} ✓</h2>
    <div class="reward"><div><b id="cuXp" data-pre="+">+${cur.earned.xp}</b><span>XP</span></div><div><b id="cuBan" data-pre="+">+${cur.earned.ban}</b><span>Bananas</span></div><div><b>${S.streak}</b><span>Day streak</span></div></div>
    ${cur.earned.total?`<p>Quiz: ${cur.earned.right} of ${cur.earned.total} right${first?" · first-time bonus +20 XP":""}</p>`:first?"<p>First-time bonus +20 XP</p>":""}
    ${cur.missed?`<p>🧠 ${cur.missed} question${cur.missed===1?"":"s"} saved to Review so you can try again later.</p>`:""}</div>
    ${courseDone?`<div class="cert"><div class="label">Course complete</div><h3>You finished ${cur.c.name}!</h3><p>${d} lessons, every project built. TypeMonkey is officially impressed.</p></div>`:""}
    ${buddy(courseDone?"WE DID IT! Time to build something of your own in the Playground.":nx?`Next up: ${Q(nx.l.title)} Come back tomorrow to keep your streak alive!`:"That's everything in this course for now. More is on the way!","cheer")}
    ${askRemind?Remind.card():""}
    <div class="row">${nx&&(nst==="open"||nst==="done")?`<button class="btn" id="nxt">Next lesson</button>`:""}${nx&&nst==="pro"?`<button class="btn banana" id="nxt">Unlock the next unit</button>`:""}<button class="btn ghost" id="back">Back to course</button></div>`);
  $("#back").onclick=()=>coursePage(cur.c.id);Remind.wireCard();
  sfx("complete");if(cur.earned.ban)setTimeout(()=>sfx("coins"),750);
  if($("#nxt"))$("#nxt").onclick=()=>nst==="pro"?coursePage(cur.c.id):startLesson(nx.l.id);
  countUp($("#cuXp"),cur.earned.xp);setTimeout(()=>countUp($("#cuBan"),cur.earned.ban,700),250);
  setTimeout(()=>confetti(courseDone?140:70),250);
  if(cur.c.kids){
    setTimeout(bananaBurst,150);
  }
}

/* ---------- Achievements ---------- */
function bump(k,n=1){S.stats[k]=(S.stats[k]||0)+n}
function ranLang(k){S.stats.langs=S.stats.langs||[];if(!S.stats.langs.includes(k)){S.stats.langs.push(k);save()}}
const st=k=>S.stats[k]||0;
function ownedCount(){return Object.entries(S.owned||{}).reduce((n,[slot,ids])=>n+ids.filter(id=>{const t={fur:FURS,hat:HATS,eyes:EYES,neck:NECKS,pet:typeof PETS!=="undefined"?PETS:{}}[slot];return t&&t[id]&&t[id].price>0}).length,0)}
function courseDone(id){const c=courseById(id);if(!c||!c.units)return false;const [d,n,all]=countLessons(c);return n>0&&d===n&&n===all}
function badgeList(){
  const B=[
    ["first_lesson","🎉","First steps","Finish your first lesson",()=>st("lessons")>=1,10],
    ["first_code","⌨️","Hello, world","Solve your first code challenge",()=>st("challenges")>=1,10],
    ["sharp","🎯","Sharpshooter","Solve 10 code challenges on the first try",()=>st("firstTry")>=10,40],
    ["challenger","💪","Challenge accepted","Solve 50 code challenges",()=>st("challenges")>=50,100],
    ["lessons10","📚","Bookworm","Finish 10 lessons",()=>S.done.length>=10,30],
    ["lessons50","🦉","Wise owl","Finish 50 lessons",()=>S.done.length>=50,100],
    ["lessons100","🏛️","Professor Monkey","Finish 100 lessons",()=>S.done.length>=100,250],
    ["streak3","🔥","On fire","Keep a 3-day streak",()=>S.streak>=3,20],
    ["streak7","🌋","Unstoppable","Keep a 7-day streak",()=>S.streak>=7,50],
    ["streak30","☄️","Legend","Keep a 30-day streak",()=>S.streak>=30,300],
    ["quiz_perfect","💯","Perfect score","Get every quiz right in a lesson",()=>st("perfectQuiz")>=1,15],
    ["rush_perfect","⚡","Lightning brain","Get every answer right in an Output Rush",()=>st("rushPerfect")>=1,25],
    ["polyglot","🌍","Polyglot","Run code in 4 different languages",()=>(S.stats.langs||[]).length>=4,40],
    ["explorer","🧭","Explorer","Start a lesson in 5 different courses",()=>(S.stats.started||[]).length>=5,30],
    ["tinkerer","🔧","Tinkerer","Run 20 programs in the Playground",()=>st("playRuns")>=20,25],
    ["memory","🧠","Elephant memory","Remember 10 questions in Review",()=>st("remembered")>=10,30],
    ["learned","🎓","It stuck!","Fully learn 5 review questions",()=>st("learned")>=5,40],
    ["maze10","🗺️","Pathfinder","Solve 10 mazes",()=>st("mazes")>=10,25],
    ["dance5","💃","Dance star","Copy 5 dances in TypeMonkey Jr.",()=>st("dances")>=5,25],
    ["sort3","🏭","Sorting pro","Finish 3 sorting machines",()=>st("sorted")>=3,25],
    ["box3","📦","Box master","Fill 3 banana boxes",()=>st("boxes")>=3,25],
    ["bug5","🐛","Bug squasher","Fix 5 buggy programs",()=>st("bugsFixed")>=5,30],
    ["shopper","🛍️","Fashion monkey","Buy your first item in the shop",()=>st("purchases")>=1,10],
    ["collector","👑","Collector","Own 10 shop items",()=>ownedCount()>=10,75],
    ["rich","🍌","Banana hoard","Have 500 bananas at once",()=>S.bananas>=500,50],
    ["night","🌙","Night owl","Finish a lesson after 10 pm",()=>st("night")>=1,10],
    ["early","🌅","Early bird","Finish a lesson before 8 am",()=>st("early")>=1,10],
    ["daily1","📅","Daily habit","Complete a daily challenge",()=>st("dailies")>=1,10],
    ["daily7","🗓️","Every single day","Complete daily challenges 7 days in a row",()=>((S.daily||{}).streak||0)>=7,60],
  ];
  for(const c of COURSES)if(c.units)B.push(["course_"+c.id,c.kids?"🏆":"🏅",c.kids?"Maze Master":`${c.name} graduate`,`Finish every lesson in ${c.name}`,()=>courseDone(c.id),150]);
  B.push(["all_courses","🌟","TypeMonkey legend","Finish every course",()=>COURSES.filter(c=>c.units).every(c=>courseDone(c.id)),1000]);
  return B.map(([id,icon,name,desc,test,reward])=>({id,icon,name,desc,test,reward}));
}
let badgeQueue=[],checking=false;
function checkAchievements(){
  if(checking||typeof COURSES==="undefined")return;checking=true;
  try{for(const b of badgeList()){if(S.badges[b.id])continue;let ok=false;try{ok=b.test()}catch(e){}if(ok){S.badges[b.id]=Date.now();S.bananas+=b.reward;badgeQueue.push(b)}}
    if(badgeQueue.length){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}renderStats();showBadge()}}
  finally{checking=false}
}
function showBadge(){
  if($(".celebrate")||!badgeQueue.length)return;
  const b=badgeQueue.shift();
  const g=document.createElement("div");g.className="celebrate";g.setAttribute("role","dialog");g.setAttribute("aria-label","Badge earned");
  g.innerHTML=`<div class="card"><div class="confetti" aria-hidden="true">${"🎉🍌⭐✨🎊".repeat(3).split("").filter(x=>x.trim()).map((c,i)=>`<span style="--i:${i}">${c}</span>`).join("")}</div>
    <div class="label">Badge unlocked!</div><div class="badge-big">${b.icon}</div><h2>${b.name}</h2><p>${b.desc}</p><div class="pill kid" style="align-self:center">+${b.reward} bananas</div>
    <button class="btn" id="cel-ok">Awesome!</button></div>`;
  document.body.appendChild(g);sfx("badge");
  g.querySelector("#cel-ok").onclick=()=>{g.remove();showBadge()};
}
function badgesPage(){SFX.stopMusic();
  const back=rerender===badgesPage?home:rerender;rerender=badgesPage;setMode(false);
  const list=badgeList();const got=list.filter(b=>S.badges[b.id]).length;
  $("#screen").innerHTML=`<div class="stack"><div class="row"><button class="btn ghost sm" id="back">← Back</button></div>
    <section class="hero"><div class="label">Badges</div><h1>${got} of ${list.length} earned</h1><p>Every badge comes with bonus bananas. Some are easy, some are legendary.</p></section>
    <div class="progress"><span style="width:${got/list.length*100}%"></span></div>
    <div class="badgegrid">${list.map(b=>{const on=S.badges[b.id];return `<div class="badge ${on?"on":""}"><div class="bicon">${on?b.icon:"🔒"}</div><b>${b.name}</b><span>${b.desc}</span><span class="pill ${on?"ok":"kid"}">${on?new Date(on).toLocaleDateString():`+${b.reward} 🍌`}</span></div>`}).join("")}</div></div>`;
  $("#back").onclick=()=>back();foot();window.scrollTo(0,0);
}

/* ---------- Smarter review: missed questions come back on a spaced schedule ---------- */
const DAY=864e5,GAPS=[0,DAY,3*DAY,7*DAY];   // after each right answer: back in 1, 3, then 7 days; one more right = learned
function missed(key,item){
  const r=S.review[key];S.review[key]={...item,box:0,due:Date.now(),misses:(r?r.misses:0)+1};save();
  if(cur&&!cur.review)cur.missed=(cur.missed||0)+1;
}
function answered(ok){
  if(!cur)return;const st=cur.l.steps[cur.step];
  if(cur.review){
    const r=S.review[st._rv];cur.earned.reviewed=(cur.earned.reviewed||0)+1;
    if(r){if(ok){cur.earned.remembered=(cur.earned.remembered||0)+1;r.box++;if(r.box>=GAPS.length){delete S.review[st._rv];cur.earned.learned=(cur.earned.learned||0)+1}else r.due=Date.now()+GAPS[r.box]}
      else{r.box=0;r.due=Date.now()+10*60e3;r.misses++}save()}
    return;
  }
  if(!ok&&st._src)missed(st._src.key,st._src.item);
  else if(!ok&&cur.l.id&&!cur.practice)missed(cur.l.id+"#"+cur.step,{kind:"step",lid:cur.l.id,i:cur.step});
}
const reviewSize=()=>Object.keys(S.review||{}).length;
const dueCount=()=>Object.values(S.review||{}).filter(r=>r.due<=Date.now()).length;
function reviewStep(key,r){
  const f=findLesson(r.lid);if(!f||!f.l.steps)return null;
  if(r.kind==="pool"){const p=(f.l.pool||[])[r.j];if(!p)return null;
    return {type:"quiz",q:"What does this print?",code:p[0],opts:[...p[1]],a:0,mono:true,why:`It prints ${p[1][0].includes("\n")?"those lines":p[1][0]}.`,_rv:key,_course:f.c,_from:f.l.title}}
  const st=f.l.steps[r.i];if(!st||!["quiz","fill","order"].includes(st.type))return null;
  return {...st,_rv:key,_course:f.c,_from:f.l.title};
}
function startReview(){SFX.stopMusic();
  const due=Object.entries(S.review||{}).filter(([,r])=>r.due<=Date.now()).sort((a,b)=>a[1].due-b[1].due);
  const steps=[];for(const [k,r] of due){const st=reviewStep(k,r);if(st)steps.push(st);else delete S.review[k];if(steps.length>=10)break}
  if(!steps.length){
    const next=Object.values(S.review||{}).sort((a,b)=>a.due-b.due)[0];
    rerender=home;
    $("#screen").innerHTML=`<div class="stack"><div class="row"><button class="btn ghost sm" id="back">← Home</button></div>
      <section class="hero"><div class="label">Review</div><h1>${reviewSize()?"All caught up!":"Nothing to review yet"}</h1>
      <p>${reviewSize()?`You have ${reviewSize()} question${reviewSize()===1?"":"s"} in review. The next one comes back ${whenText(next.due)}.`:"When you miss a quiz, a fill-in, an ordering puzzle or an Output Rush question, it lands here. Then it comes back after a day, three days and a week until it sticks."}</p></section>
      ${buddy(reviewSize()?"Your brain remembers things better when you practice them with gaps in between. Science!":"Go play some lessons. I'll keep track of anything tricky.","happy")}
      <div class="row"><button class="btn" id="go2">${reviewSize()?"Back home":"Find a lesson"}</button></div></div>`;
    $("#back").onclick=home;$("#go2").onclick=()=>reviewSize()?home():coursePage(nextUp(COURSES[0])?"js":"js");
    foot();save();return;
  }
  save();
  cur={c:steps[0]._course,l:{id:null,title:"Review",steps:[...steps,{type:"done"}]},item:null,step:0,earned:{xp:0,ban:0,right:0,total:0},review:true};
  rerender=renderStep;renderStep();
}
function whenText(t){const d=t-Date.now();if(d<=0)return "now";if(d<36e5)return "in "+Math.max(1,Math.round(d/6e4))+" minutes";if(d<DAY*1.5)return "tomorrow";return "in "+Math.round(d/DAY)+" days"}
function reviewDone(){
  const n=cur.earned.reviewed||0,ok=cur.earned.remembered||0,learned=cur.earned.learned||0;
  S.xp+=ok*5;S.bananas+=ok*2;if(n)bumpStreak();S.stats.remembered=(S.stats.remembered||0)+ok;S.stats.learned=(S.stats.learned||0)+learned;save();
  shell(`<div class="card" style="text-align:center;align-items:center"><div class="label">Review complete</div><h2>${ok}/${n} remembered</h2>
    <div class="reward"><div><b>+${ok*5}</b><span>XP</span></div><div><b>+${ok*2}</b><span>Bananas</span></div><div><b>${learned}</b><span>Learned for good</span></div></div>
    <p>${n-ok?`${n-ok} question${n-ok===1?"":"s"} will come back soon for another try.`:"Every one right! They'll come back in a few days to make sure they stick."}</p></div>
    ${buddy(ok===n?"Your memory is getting stronger every day!":"Mistakes are how brains grow. See you next review!",ok===n?"cheer":"happy")}
    <div class="row"><button class="btn" id="back">Back home</button></div>`);
  $("#back").onclick=home;sfx("complete");
}

/* ---------- Daily challenge: 3 questions, the same for everyone on a given day ---------- */
function seeded(seed){let h=2166136261>>>0;for(const ch of seed){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}
  return ()=>{h^=h<<13;h>>>=0;h^=h>>>17;h^=h<<5;h>>>=0;return h/4294967296}}
const dailyDoneToday=()=>(S.daily||{}).last===dayStr(new Date());
/* ---------- Daily challenge: brand-new every day, sized to where you are ----------
   Coders (JavaScript / Build a Game / Python): two freshly generated "what does this print?" puzzles and one
   small code task, with numbers that change daily. Difficulty follows how many lessons you've finished.
   Other languages: the hardest "what prints" rounds and a real code challenge from your latest lessons.
   TypeMonkey Jr. only: a newly built maze, dance and banana box each day. */
const DPICK=(r,a)=>a[Math.floor(r()*a.length)];
const DINT=(r,lo,hi)=>lo+Math.floor(r()*(hi-lo+1));
const doneIn=c=>flat(c).filter(x=>S.done.includes(x.l.id)).length;
const dailyLevel=c=>{const n=doneIn(c);return n<4?1:n<10?2:3};
const DQ=[
 [1,r=>{const a=DINT(r,3,9),b=DINT(r,2,6),c=DINT(r,1,9);return {js:`let x = ${a};\nx = x * ${b};\nx = x - ${c};\nconsole.log(x);`,py:`x = ${a}\nx = x * ${b}\nx = x - ${c}\nprint(x)`,ans:a*b-c,wrong:[a*(b-c),a*b+c,a+b-c]}}],
 [1,r=>{const nm=DPICK(r,["Mo","Kiki","Zip","Bo"]),a=DINT(r,2,9),b=DINT(r,2,9);return {js:`let name = "${nm}";\nlet n = ${a};\nconsole.log(name + " has " + (n + ${b}) + " bananas");`,py:`name = "${nm}"\nn = ${a}\nprint(name + " has " + str(n + ${b}) + " bananas")`,ans:`${nm} has ${a+b} bananas`,wrong:[`${nm} has ${a}${b} bananas`,`name has ${a+b} bananas`,`${nm} has ${a} bananas`]}}],
 [1,r=>{const A=DINT(r,2,8),B=A+DINT(r,1,5);return {js:`let a = ${A};\nlet b = ${B};\na = b;\nb = a + 1;\nconsole.log(a, b);`,py:`a = ${A}\nb = ${B}\na = b\nb = a + 1\nprint(a, b)`,ans:`${B} ${B+1}`,wrong:[`${A} ${B+1}`,`${B} ${A+1}`,`${A} ${B}`]}}],
 [2,r=>{const s=DPICK(r,[95,90,89,72,70,69,55]),g=x=>x>=90?"A":x>=70?"B":"C";return {js:`let score = ${s};\nif (score >= 90) {\n  console.log("A");\n} else if (score >= 70) {\n  console.log("B");\n} else {\n  console.log("C");\n}`,py:`score = ${s}\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C")`,ans:g(s),wrong:["A","B","C","Nothing"].filter(x=>x!==g(s))}}],
 [2,r=>{const n=DINT(r,4,9),sum=n*(n+1)/2;return {js:`let total = 0;\nfor (let i = 1; i <= ${n}; i++) {\n  total += i;\n}\nconsole.log(total);`,py:`total = 0\nfor i in range(1, ${n+1}):\n    total += i\nprint(total)`,ans:sum,wrong:[sum-n,sum+n+1,n]}}],
 [2,r=>{const n=DINT(r,7,15),k=DINT(r,2,4),cnt=Math.ceil(n/k);return {js:`let count = 0;\nfor (let i = 0; i < ${n}; i += ${k}) {\n  count += 1;\n}\nconsole.log(count);`,py:`count = 0\nfor i in range(0, ${n}, ${k}):\n    count += 1\nprint(count)`,ans:cnt,wrong:[cnt+1,cnt-1,n]}}],
 [2,r=>{const N=DPICK(r,[10,20,30,50,100]);let x=1,st=0;while(x<N){x*=2;st++}return {js:`let x = 1;\nlet steps = 0;\nwhile (x < ${N}) {\n  x = x * 2;\n  steps += 1;\n}\nconsole.log(steps, x);`,py:`x = 1\nsteps = 0\nwhile x < ${N}:\n    x = x * 2\n    steps += 1\nprint(steps, x)`,ans:`${st} ${x}`,wrong:[`${st-1} ${x/2}`,`${st+1} ${x*2}`,`${st} ${N}`]}}],
 [3,r=>{const a=[0,0,0,0,0].map(()=>DINT(r,1,9));return {js:`let nums = [${a.join(", ")}];\nconsole.log(nums[1] + nums[nums.length - 1]);`,py:`nums = [${a.join(", ")}]\nprint(nums[1] + nums[-1])`,ans:a[1]+a[4],wrong:[a[0]+a[4],a[1]+a[3],a[0]+a[3],a[1]+a[4]+1]}}],
 [3,r=>{const n=DINT(r,2,6),f=x=>x*2+1;return {js:`function f(x) {\n  return x * 2 + 1;\n}\nconsole.log(f(f(${n})));`,py:`def f(x):\n    return x * 2 + 1\n\nprint(f(f(${n})))`,ans:f(f(n)),wrong:[f(n),f(n)*2,n*4+1]}}],
 [3,r=>{const w=DPICK(r,["banana","monkey","jungle","coconut","parrot"]);return {js:`let w = "${w}";\nconsole.log(w.length, w.toUpperCase()[0]);`,py:`w = "${w}"\nprint(len(w), w.upper()[0])`,ans:`${w.length} ${w[0].toUpperCase()}`,wrong:[`${w.length-1} ${w[0].toUpperCase()}`,`${w.length} ${w[0]}`,`${w.length+1} ${w[0].toUpperCase()}`]}}],
 [3,r=>{const a=[0,0,0,0,0,0].map(()=>DINT(r,1,20)),ev=a.filter(x=>x%2===0).length;return {js:`let nums = [${a.join(", ")}];\nlet count = 0;\nfor (let n of nums) {\n  if (n % 2 === 0) {\n    count += 1;\n  }\n}\nconsole.log(count);`,py:`nums = [${a.join(", ")}]\ncount = 0\nfor n in nums:\n    if n % 2 == 0:\n        count += 1\nprint(count)`,ans:ev,wrong:[6-ev,ev+1,ev+2]}}],
];
const DCODE=[
 [1,r=>{const n=DINT(r,3,12);return {title:"Double bananas",task:`Make a variable ${C("bananas")} set to ${n}, then print double that number.`,out:[String(n*2)],use:[[/bananas/,"Make a variable called bananas."]],js:`let bananas = ${n};\nconsole.log(bananas * 2);`,py:`bananas = ${n}\nprint(bananas * 2)`}}],
 [1,r=>{const nm=DPICK(r,["Mo","Kiki","Zip"]),f=DPICK(r,["mango","banana","kiwi"]);return {title:"Snack time",task:`Make ${C("name")} set to ${C('"'+nm+'"')} and ${C("snack")} set to ${C('"'+f+'"')}, then print ${C(nm+" loves "+f+"!")} using both variables.`,out:[`${nm} loves ${f}!`],use:[[/name/,"Use the name variable."],[/snack/,"Use the snack variable."]],js:`let name = "${nm}";\nlet snack = "${f}";\nconsole.log(name + " loves " + snack + "!");`,py:`name = "${nm}"\nsnack = "${f}"\nprint(name + " loves " + snack + "!")`}}],
 [2,r=>{const a=DINT(r,2,5),b=a+DINT(r,3,5);return {title:"Count up",task:`Use a loop to print the numbers from ${a} to ${b}, one per line.`,out:Array.from({length:b-a+1},(_,i)=>String(a+i)),use:[[/for|while/,"Use a loop."]],js:`for (let i = ${a}; i <= ${b}; i++) {\n  console.log(i);\n}`,py:`for i in range(${a}, ${b+1}):\n    print(i)`}}],
 [2,r=>{const n=DINT(r,5,12);return {title:"Banana total",task:`Use a loop to add up every number from 1 to ${n}, then print the total.`,out:[String(n*(n+1)/2)],use:[[/for|while/,"Add them up in a loop."]],js:`let total = 0;\nfor (let i = 1; i <= ${n}; i++) {\n  total += i;\n}\nconsole.log(total);`,py:`total = 0\nfor i in range(1, ${n+1}):\n    total += i\nprint(total)`}}],
 [3,r=>{const n=DINT(r,3,15);return {title:"Triple it",task:`Write a function ${C("triple")} that returns its number times 3, then print ${C("triple("+n+")")}.`,out:[String(3*n)],use:[[/function\s+triple|def\s+triple|triple\s*=/,"Make a function called triple."],[/return/,"Send the answer back with return."]],js:`function triple(x) {\n  return x * 3;\n}\nconsole.log(triple(${n}));`,py:`def triple(x):\n    return x * 3\n\nprint(triple(${n}))`}}],
 [3,r=>{const a=[0,0,0,0,0,0].map(()=>DINT(r,1,40));return {title:"Find the biggest",task:`Use a loop to find the biggest number in ${C("nums")} and print it.`,out:[String(Math.max(...a))],use:[[/for|while/,"Check each number in a loop."]],start:{js:`let nums = [${a.join(", ")}];\n`,py:`nums = [${a.join(", ")}]\n`},js:`let nums = [${a.join(", ")}];\nlet best = nums[0];\nfor (let n of nums) {\n  if (n > best) best = n;\n}\nconsole.log(best);`,py:`nums = [${a.join(", ")}]\nbest = nums[0]\nfor n in nums:\n    if n > best:\n        best = n\nprint(best)`}}],
];
/* --- more daily puzzles: [level, generator, topic]. Every one is written in JavaScript and Python and prints the same. --- */
DQ.push(
 [1,r=>{const A=DINT(r,2,9),B=DINT(r,10,20);return {js:`let a = ${A};\nlet b = ${B};\nlet c = a;\na = b;\nb = c;\nconsole.log(a, b);`,py:`a = ${A}\nb = ${B}\nc = a\na = b\nb = c\nprint(a, b)`,ans:`${B} ${A}`,wrong:[`${A} ${B}`,`${B} ${B}`,`${A} ${A}`]}},"vars"],
 [1,r=>{const A=DINT(r,2,9),B=DINT(r,1,6);return {js:`let x = ${A};\nx += ${B};\nx *= 2;\nconsole.log(x);`,py:`x = ${A}\nx += ${B}\nx *= 2\nprint(x)`,ans:(A+B)*2,wrong:[A+B*2,A*2+B,(A+B)]}},"vars"],
 [1,r=>{const p=DPICK(r,["ba","mo","zu","ki","po"]),e=DPICK(r,["!","?","..."]);return {js:`let part = "${p}";\nconsole.log(part + part + "${e}");`,py:`part = "${p}"\nprint(part + part + "${e}")`,ans:`${p}${p}${e}`,wrong:[`${p}${e}`,`${p} ${p}${e}`,`part + part + ${e}`]}},"text"],
 [1,r=>{const n=DINT(r,1,10);return {js:`let bananas = ${n};\nif (bananas > 5) {\n  console.log("Party!");\n} else {\n  console.log("Snack time");\n}`,py:`bananas = ${n}\nif bananas > 5:\n    print("Party!")\nelse:\n    print("Snack time")`,ans:n>5?"Party!":"Snack time",wrong:[n>5?"Snack time":"Party!","bananas","Nothing"]}},"ifs"],
 [1,r=>{const n=DINT(r,2,4),w=DPICK(r,["ook","hop","beep"]);return {js:`for (let i = 0; i < ${n}; i++) {\n  console.log("${w}");\n}`,py:`for i in range(${n}):\n    print("${w}")`,ans:Array(n).fill(w).join("\n"),wrong:[Array(n+1).fill(w).join("\n"),Array(n-1).fill(w).join("\n"),w+" x "+n]}},"loops"],
 [1,r=>{const f=["kiwi","mango","fig","plum"].sort(()=>r()-.5).slice(0,3),i=DINT(r,0,2);return {js:`let fruits = ["${f.join('", "')}"];\nconsole.log(fruits[${i}]);`,py:`fruits = ["${f.join('", "')}"]\nprint(fruits[${i}])`,ans:f[i],wrong:[f[(i+1)%3],f[(i+2)%3],"fruits"]}},"lists"],
 [1,r=>{const nm=DPICK(r,["Mo","Kiki","Zip","Bo","Lulu"]);return {js:`function hi(name) {\n  console.log("Hi " + name);\n}\nhi("${nm}");`,py:`def hi(name):\n    print("Hi " + name)\n\nhi("${nm}")`,ans:`Hi ${nm}`,wrong:["Hi name",`${nm}`,"Hi"]}},"funcs"],
 [2,r=>{const t=DPICK(r,[35,31,22,18,12,5]);const a=t>30?"Hot":t>15?"Warm":"Cold";return {js:`let temp = ${t};\nif (temp > 30) {\n  console.log("Hot");\n} else if (temp > 15) {\n  console.log("Warm");\n} else {\n  console.log("Cold");\n}`,py:`temp = ${t}\nif temp > 30:\n    print("Hot")\nelif temp > 15:\n    print("Warm")\nelse:\n    print("Cold")`,ans:a,wrong:["Hot","Warm","Cold"].filter(x=>x!==a)}},"ifs"],
 [2,r=>{const A=DINT(r,1,8),B=DINT(r,1,8),ok=A>3&&B>3;return {js:`let a = ${A};\nlet b = ${B};\nif (a > 3 && b > 3) {\n  console.log("both");\n} else {\n  console.log("not both");\n}`,py:`a = ${A}\nb = ${B}\nif a > 3 and b > 3:\n    print("both")\nelse:\n    print("not both")`,ans:ok?"both":"not both",wrong:[ok?"not both":"both","a","b"]}},"ifs"],
 [2,r=>{const w=DPICK(r,["monkey","banana","jungle","parrot","coconut","vine"]);return {js:`let word = "${w}";\nconsole.log(word.length);`,py:`word = "${w}"\nprint(len(word))`,ans:w.length,wrong:[w.length-1,w.length+1,w.length*2]}},"text"],
 [2,r=>{const w=DPICK(r,["mango","kiwi","lemon","grape"]);return {js:`let fruit = "${w}";\nconsole.log(fruit.toUpperCase() + "!");`,py:`fruit = "${w}"\nprint(fruit.upper() + "!")`,ans:w.toUpperCase()+"!",wrong:[w+"!",w[0].toUpperCase()+w.slice(1)+"!",w.toUpperCase()]}},"text"],
 [2,r=>{const n=DINT(r,2,4),a=Array.from({length:n},()=>DINT(r,1,9)),x=DINT(r,1,9);return {js:`let nums = [${a.join(", ")}];\nnums.push(${x});\nconsole.log(nums.length);`,py:`nums = [${a.join(", ")}]\nnums.append(${x})\nprint(len(nums))`,ans:n+1,wrong:[n,x,n+2]}},"lists"],
 [2,r=>{const a=Array.from({length:4},()=>DINT(r,1,9)),s=a.reduce((p,q)=>p+q,0);return {js:`let nums = [${a.join(", ")}];\nlet total = 0;\nfor (let n of nums) {\n  total += n;\n}\nconsole.log(total);`,py:`nums = [${a.join(", ")}]\ntotal = 0\nfor n in nums:\n    total += n\nprint(total)`,ans:s,wrong:[s-a[3],s+1,a[3]]}},"lists"],
 [2,r=>{const A=DINT(r,2,9),B=DINT(r,2,9);return {js:`function add(a, b) {\n  return a + b;\n}\nconsole.log(add(${A}, ${B}) * 2);`,py:`def add(a, b):\n    return a + b\n\nprint(add(${A}, ${B}) * 2)`,ans:(A+B)*2,wrong:[A+B*2,A+B,A*B*2]}},"funcs"],
 [2,r=>{const n=DINT(r,3,5);return {js:`for (let i = ${n}; i > 0; i--) {\n  console.log(i);\n}\nconsole.log("Go!");`,py:`for i in range(${n}, 0, -1):\n    print(i)\nprint("Go!")`,ans:[...Array.from({length:n},(_,i)=>String(n-i)),"Go!"].join("\n"),wrong:[[...Array.from({length:n},(_,i)=>String(n-i-1)),"Go!"].join("\n"),[...Array.from({length:n},(_,i)=>String(i+1)),"Go!"].join("\n"),[...Array.from({length:n-1},(_,i)=>String(n-i)),"Go!"].join("\n")]}},"loops"],
 [2,r=>{const A=DINT(r,10,30),B=DINT(r,3,7);return {js:`let bananas = ${A};\nlet friends = ${B};\nconsole.log(bananas % friends);`,py:`bananas = ${A}\nfriends = ${B}\nprint(bananas % friends)`,ans:A%B,wrong:[Math.floor(A/B),A-B,(A%B)+1]}},"vars"],
 [3,r=>{const w=DPICK(r,["stressed","monkey","drawer","banana","lemon"]);return {js:`let w = "${w}";\nconsole.log(w.split("").reverse().join(""));`,py:`w = "${w}"\nprint(w[::-1])`,ans:[...w].reverse().join(""),wrong:[w,w.slice(1),[...w].reverse().join("").toUpperCase()]}},"text"],
 [3,r=>{const w=DPICK(r,["banana","papaya","cabana","alpaca","pasta"]),n=[...w].filter(c=>c==="a").length;return {js:`let w = "${w}";\nlet count = 0;\nfor (let ch of w) {\n  if (ch === "a") {\n    count += 1;\n  }\n}\nconsole.log(count);`,py:`w = "${w}"\ncount = 0\nfor ch in w:\n    if ch == "a":\n        count += 1\nprint(count)`,ans:n,wrong:[n-1,n+1,w.length]}},"text"],
 [3,r=>{const n=DINT(r,3,5),f=k=>k<=1?1:k*f(k-1);return {js:`function f(n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * f(n - 1);\n}\nconsole.log(f(${n}));`,py:`def f(n):\n    if n <= 1:\n        return 1\n    return n * f(n - 1)\n\nprint(f(${n}))`,ans:f(n),wrong:[f(n-1),n*n,f(n)+1]}},"funcs"],
 [3,r=>{const A=DINT(r,2,4),B=DINT(r,2,5);return {js:`let count = 0;\nfor (let i = 0; i < ${A}; i++) {\n  for (let j = 0; j < ${B}; j++) {\n    count += 1;\n  }\n}\nconsole.log(count);`,py:`count = 0\nfor i in range(${A}):\n    for j in range(${B}):\n        count += 1\nprint(count)`,ans:A*B,wrong:[A+B,A*B+1,B]}},"loops"],
 [3,r=>{const n=DPICK(r,[3,5,9,10,15,30,7,8]),a=n%15===0?"FizzBuzz":n%3===0?"Fizz":n%5===0?"Buzz":String(n);return {js:`let n = ${n};\nif (n % 15 === 0) {\n  console.log("FizzBuzz");\n} else if (n % 3 === 0) {\n  console.log("Fizz");\n} else if (n % 5 === 0) {\n  console.log("Buzz");\n} else {\n  console.log(n);\n}`,py:`n = ${n}\nif n % 15 == 0:\n    print("FizzBuzz")\nelif n % 3 == 0:\n    print("Fizz")\nelif n % 5 == 0:\n    print("Buzz")\nelse:\n    print(n)`,ans:a,wrong:["Fizz","Buzz","FizzBuzz",String(n)].filter(x=>x!==a)}},"ifs"],
 [3,r=>{const w=DPICK(r,["monkey","bananas","coconut","jungle"]);return {js:`let w = "${w}";\nconsole.log(w.slice(1, 4));`,py:`w = "${w}"\nprint(w[1:4])`,ans:w.slice(1,4),wrong:[w.slice(0,3),w.slice(1,5),w.slice(0,4)]}},"text"],
 [3,r=>{const nm=DPICK(r,["Mo","Kiki","Zip"]);return {js:`function greet(name = "friend") {\n  return "Hi " + name;\n}\nconsole.log(greet());\nconsole.log(greet("${nm}"));`,py:`def greet(name="friend"):\n    return "Hi " + name\n\nprint(greet())\nprint(greet("${nm}"))`,ans:`Hi friend\nHi ${nm}`,wrong:[`Hi ${nm}\nHi ${nm}`,`Hi\nHi ${nm}`,`Hi friend\nHi friend`]}},"funcs"],
 [3,r=>{const f=["kiwi","mango","fig","plum","pear"].sort(()=>r()-.5).slice(0,4),k=DINT(r,0,3);return {js:`let fruits = ["${f.join('", "')}"];\nconsole.log(fruits.indexOf("${f[k]}"));`,py:`fruits = ["${f.join('", "')}"]\nprint(fruits.index("${f[k]}"))`,ans:k,wrong:[k+1,(k+2)%4,4].filter(x=>x!==k)}},"lists"]
);
DCODE.push(
 [1,r=>{const w=DPICK(r,["jungle","banana","coconut"]);return {title:"Shout it",task:`Make a variable ${C("word")} set to ${C('"'+w+'"')}, then print it in CAPITAL letters.`,out:[w.toUpperCase()],use:[[/word/,"Make a variable called word."],[/upper|toUpperCase/,"Turn it into capitals."]],js:`let word = "${w}";\nconsole.log(word.toUpperCase());`,py:`word = "${w}"\nprint(word.upper())`}},"text"],
 [1,r=>{const A=DINT(r,8,15),B=DINT(r,2,6);return {title:"Bananas left",task:`You have ${C("have = "+A)} bananas and eat ${C("eaten = "+B)}. Make both variables, then print how many are left.`,out:[String(A-B)],use:[[/have/,"Make a variable called have."],[/eaten/,"Make a variable called eaten."]],js:`let have = ${A};\nlet eaten = ${B};\nconsole.log(have - eaten);`,py:`have = ${A}\neaten = ${B}\nprint(have - eaten)`}},"vars"],
 [1,r=>{const h=DINT(r,6,10);return {title:"Snack check",task:`Make ${C("hunger")} set to ${h}. If ${C("hunger")} is more than 5, print ${C("Snack time!")}`,out:["Snack time!"],use:[[/hunger/,"Make a variable called hunger."],[/if/,"Check it with if."]],js:`let hunger = ${h};\nif (hunger > 5) {\n  console.log("Snack time!");\n}`,py:`hunger = ${h}\nif hunger > 5:\n    print("Snack time!")`}},"ifs"],
 [2,r=>{const n=DINT(r,3,6);return {title:"Countdown",task:`Use a loop to count down from ${n} to 1, one number per line.`,out:Array.from({length:n},(_,i)=>String(n-i)),use:[[/for|while/,"Use a loop."]],js:`for (let i = ${n}; i >= 1; i--) {\n  console.log(i);\n}`,py:`for i in range(${n}, 0, -1):\n    print(i)`}},"loops"],
 [2,r=>{const n=DPICK(r,[8,10,12]);return {title:"Even steps",task:`Use a loop to print the even numbers from 2 to ${n}, one per line.`,out:Array.from({length:n/2},(_,i)=>String(2*i+2)),use:[[/for|while/,"Use a loop."]],js:`for (let i = 2; i <= ${n}; i += 2) {\n  console.log(i);\n}`,py:`for i in range(2, ${n} + 1, 2):\n    print(i)`}},"loops"],
 [2,r=>{const n=DINT(r,3,20),cut=10;return {title:"Big or small",task:`Make ${C("n")} set to ${n}. If ${C("n")} is more than ${cut}, print ${C("big")}. Otherwise print ${C("small")}.`,out:[n>cut?"big":"small"],use:[[/if/,"Use if."],[/else/,"Use else for the other case."]],js:`let n = ${n};\nif (n > ${cut}) {\n  console.log("big");\n} else {\n  console.log("small");\n}`,py:`n = ${n}\nif n > ${cut}:\n    print("big")\nelse:\n    print("small")`}},"ifs"],
 [2,r=>{const it=["rope","map","torch","snack","hat"].sort(()=>r()-.5).slice(0,3);return {title:"Backpack list",task:`Make a list ${C("pack")} with ${it.map(x=>C('"'+x+'"')).join(", ")}, then use a loop to print each item on its own line.`,out:it,use:[[/pack/,"Make a list called pack."],[/for|while/,"Print them with a loop."]],js:`let pack = ["${it.join('", "')}"];\nfor (let item of pack) {\n  console.log(item);\n}`,py:`pack = ["${it.join('", "')}"]\nfor item in pack:\n    print(item)`}},"lists"],
 [2,r=>{const w=DPICK(r,["mango","ninja","pizza"]);return {title:"Name tag",task:`Write a function ${C("tag")} that takes a name and returns ${C('"Hi, I am " + name')}. Print ${C("tag(\""+w+"\")")}.`,out:[`Hi, I am ${w}`],use:[[/function\s+tag|def\s+tag|tag\s*=/,"Make a function called tag."],[/return/,"Return the text."]],js:`function tag(name) {\n  return "Hi, I am " + name;\n}\nconsole.log(tag("${w}"));`,py:`def tag(name):\n    return "Hi, I am " + name\n\nprint(tag("${w}"))`}},"funcs"],
 [3,r=>{const w=DPICK(r,["banana","papaya","alpaca","cabana"]);return {title:"Count the a's",task:`Use a loop to count how many times ${C("a")} appears in ${C('"'+w+'"')}, then print the count.`,out:[String([...w].filter(c=>c==="a").length)],use:[[/for|while/,"Check each letter in a loop."]],js:`let w = "${w}";\nlet count = 0;\nfor (let ch of w) {\n  if (ch === "a") {\n    count += 1;\n  }\n}\nconsole.log(count);`,py:`w = "${w}"\ncount = 0\nfor ch in w:\n    if ch == "a":\n        count += 1\nprint(count)`}},"text"],
 [3,r=>{const avg=DINT(r,4,9),a=[avg-2,avg+3,avg,avg-1];return {title:"Average score",task:`${C("scores")} is ${C("["+a.join(", ")+"]")}. Add them up with a loop, then print the total divided by how many there are.`,out:[String(avg)],use:[[/for|while/,"Add them up in a loop."]],start:{js:`let scores = [${a.join(", ")}];\n`,py:`scores = [${a.join(", ")}]\n`},js:`let scores = [${a.join(", ")}];\nlet total = 0;\nfor (let s of scores) {\n  total += s;\n}\nconsole.log(total / scores.length);`,py:`scores = [${a.join(", ")}]\ntotal = 0\nfor s in scores:\n    total += s\nprint(total // len(scores))`}},"lists"],
 [3,r=>{const A=DINT(r,2,9),B=A+DINT(r,1,4)*2-1;return {title:"Even or odd",task:`Write a function ${C("parity")} that returns ${C('"even"')} or ${C('"odd"')}. Print ${C("parity("+A+")")} and then ${C("parity("+B+")")}.`,out:[A%2?"odd":"even",B%2?"odd":"even"],use:[[/function\s+parity|def\s+parity|parity\s*=/,"Make a function called parity."],[/%/,"Use % 2 to check."]],js:`function parity(n) {\n  if (n % 2 === 0) {\n    return "even";\n  }\n  return "odd";\n}\nconsole.log(parity(${A}));\nconsole.log(parity(${B}));`,py:`def parity(n):\n    if n % 2 == 0:\n        return "even"\n    return "odd"\n\nprint(parity(${A}))\nprint(parity(${B}))`}},"funcs"],
 [3,r=>{const n=DINT(r,3,5);return {title:"Square dance",task:`Write a function ${C("square")} that returns a number times itself. Use a loop to print the squares of 1 to ${n}.`,out:Array.from({length:n},(_,i)=>String((i+1)*(i+1))),use:[[/function\s+square|def\s+square|square\s*=/,"Make a function called square."],[/for|while/,"Use a loop."]],js:`function square(x) {\n  return x * x;\n}\nfor (let i = 1; i <= ${n}; i++) {\n  console.log(square(i));\n}`,py:`def square(x):\n    return x * x\n\nfor i in range(1, ${n} + 1):\n    print(square(i))`}},"funcs"]
);

DCODE.push(
 [1,r=>{const nm=DPICK(r,["Mo","Kiki","Zip","Lulu"]),a=DINT(r,6,12);return {title:"Name and age",task:`Make ${C("name")} set to ${C('"'+nm+'"')} and ${C("age")} set to ${a}, then print ${C(nm+" is "+a)} using both variables.`,out:[`${nm} is ${a}`],use:[[/name/,"Make a variable called name."],[/age/,"Make a variable called age."]],js:`let name = "${nm}";\nlet age = ${a};\nconsole.log(name + " is " + age);`,py:`name = "${nm}"\nage = ${a}\nprint(name + " is " + str(age))`}},"vars"],
 [1,r=>{const pr=DINT(r,2,6),q=DINT(r,2,5);return {title:"Price tag",task:`A banana costs ${C("price = "+pr)} coins and you buy ${C("count = "+q)}. Make both variables and print the total cost.`,out:[String(pr*q)],use:[[/price/,"Make a variable called price."],[/count/,"Make a variable called count."]],js:`let price = ${pr};\nlet count = ${q};\nconsole.log(price * count);`,py:`price = ${pr}\ncount = ${q}\nprint(price * count)`}},"vars"],
 [1,r=>{const n=DINT(r,2,4);return {title:"Hip hip hooray",task:`Use a loop to print ${C("Hooray!")} ${n} times.`,out:Array(n).fill("Hooray!"),use:[[/for|while/,"Use a loop."]],js:`for (let i = 0; i < ${n}; i++) {\n  console.log("Hooray!");\n}`,py:`for i in range(${n}):\n    print("Hooray!")`}},"loops"],
 [1,r=>{const f=["kiwi","mango","fig","plum"].sort(()=>r()-.5).slice(0,3);return {title:"First in line",task:`Make a list ${C("fruits")} with ${f.map(x=>C('"'+x+'"')).join(", ")}, then print the first one.`,out:[f[0]],use:[[/fruits/,"Make a list called fruits."],[/\[0\]/,"The first item is at position 0."]],js:`let fruits = ["${f.join('", "')}"];\nconsole.log(fruits[0]);`,py:`fruits = ["${f.join('", "')}"]\nprint(fruits[0])`}},"lists"],
 [1,r=>{const n=DINT(r,2,3);return {title:"Wave hello",task:`Write a function ${C("wave")} that prints ${C("Hello from TypeMonkey!")}, then call it ${n} times.`,out:Array(n).fill("Hello from TypeMonkey!"),use:[[/function\s+wave|def\s+wave|wave\s*=/,"Make a function called wave."]],js:`function wave() {\n  console.log("Hello from TypeMonkey!");\n}\n${Array(n).fill("wave();").join("\n")}`,py:`def wave():\n    print("Hello from TypeMonkey!")\n\n${Array(n).fill("wave()").join("\n")}`}},"funcs"],
 [2,r=>{const n=DINT(r,2,9);return {title:"Times table",task:`Use a loop to print ${n} × 1 up to ${n} × 5, one answer per line.`,out:[1,2,3,4,5].map(k=>String(n*k)),use:[[/for|while/,"Use a loop."]],js:`for (let i = 1; i <= 5; i++) {\n  console.log(${n} * i);\n}`,py:`for i in range(1, 5 + 1):\n    print(${n} * i)`}},"loops"],
 [2,r=>{const [a,b]=[["kiwi","banana"],["mango","fig"],["coconut","plum"],["pear","pineapple"]][DINT(r,0,3)];const lg=b.length>a.length?b:a;return {title:"Longer word",task:`Make ${C("a = \""+a+"\"")} and ${C("b = \""+b+"\"")}. Use if to print whichever word is longer.`,out:[lg],use:[[/if/,"Compare them with if."],[/length|len\(/,"Compare their lengths."]],js:`let a = "${a}";\nlet b = "${b}";\nif (a.length > b.length) {\n  console.log(a);\n} else {\n  console.log(b);\n}`,py:`a = "${a}"\nb = "${b}"\nif len(a) > len(b):\n    print(a)\nelse:\n    print(b)`}},"text"],
 [2,r=>{const a=[DINT(r,1,9),DINT(r,1,9),DINT(r,1,9)];return {title:"Shopping total",task:`${C("prices")} is ${C("["+a.join(", ")+"]")}. Add them up with a loop and print the total.`,out:[String(a[0]+a[1]+a[2])],use:[[/for|while/,"Add them up in a loop."]],start:{js:`let prices = [${a.join(", ")}];\n`,py:`prices = [${a.join(", ")}]\n`},js:`let prices = [${a.join(", ")}];\nlet total = 0;\nfor (let p of prices) {\n  total += p;\n}\nconsole.log(total);`,py:`prices = [${a.join(", ")}]\ntotal = 0\nfor p in prices:\n    total += p\nprint(total)`}},"lists"],
 [2,r=>{const sc=DPICK(r,[35,48,50,62,80,95]);return {title:"Pass or try again",task:`Make ${C("score")} set to ${sc}. If it is 50 or more, print ${C("pass")}. Otherwise print ${C("try again")}.`,out:[sc>=50?"pass":"try again"],use:[[/if/,"Use if."],[/else/,"Use else for the other case."]],js:`let score = ${sc};\nif (score >= 50) {\n  console.log("pass");\n} else {\n  console.log("try again");\n}`,py:`score = ${sc}\nif score >= 50:\n    print("pass")\nelse:\n    print("try again")`}},"ifs"]
);

/* Topics of the first templates (newer ones carry it as a third item) */
["vars","text","vars","ifs","loops","loops","loops","lists","funcs","text","lists"].forEach((t,i)=>{if(DQ[i])DQ[i][2]=DQ[i][2]||t});
["vars","text","loops","loops","funcs","lists"].forEach((t,i)=>{if(DCODE[i])DCODE[i][2]=DCODE[i][2]||t});
/* A theme for every day of the week, and a different mix of puzzle kinds each day */
const DAY_THEMES=[["mix","🎲","Mystery mix Sunday"],["vars","🧪","Variable Monday"],["loops","🔁","Loop Tuesday"],["ifs","🔀","Decision Wednesday"],["text","🔤","Text Thursday"],["lists","📦","List Friday"],["funcs","🧩","Function Saturday"]];
const DAY_FORMATS=[["predict","order","code"],["predict","bug","code"],["predict","predict","code"],["order","predict","bug"],["predict","code","order"],["bug","predict","code"],["predict","order","bug"]];
const dayNum=d=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);
const dailySeen=()=>{const m=new Map();((S.daily||{}).seen||[]).forEach((k,i)=>{k=String(k).replace(/[ob]$/,"");if(!m.has(k))m.set(k,i)});return m};
/* pick n templates: today's topic first, your level first, nothing you had in the last week */
function pickDaily(r,bank,L,topic,n,avoid,tag){
  const all=bank.map((t,i)=>({t,key:tag+i})).filter(x=>x.t[0]<=L);
  const score=x=>(x.t[0]===L?2:0)+(topic==="mix"||x.t[2]===topic?3:0)+(avoid.has(x.key)?-30+avoid.get(x.key):0)+r();
  const out=[];const pool=[...all];
  while(out.length<n&&pool.length){pool.sort((a,b)=>score(b)-score(a));const x=pool.shift();out.push(x);avoid.set(x.key,-100)}
  return out;
}
/* Bug hunt: put one small, common mistake into a working answer */
function addBug(code,lang,out){
  const B=lang==="py"?[[/(range\(\d+), (\d+) \+ 1/,"$1, $2"],[/<=/,"<"],[/(\n(?:for|if|def|while)[^\n]*):\n/,"$1\n"]]:[[/<= /,"< "],[/>= 1;/,"> 1;"]];
  for(const [re,to] of B){const c=code.replace(re,to);if(c!==code)return c}
  // otherwise a typo in the print that makes the expected answer (so it is on the path that really runs)
  const P=lang==="py"?"print(":"console.log(",T=lang==="py"?"prnt(":"console.lgo(";const lines=code.split("\n");
  let k=lines.findIndex(l=>l.includes(P)&&out&&l.includes(`"${out[0]}"`));if(k<0)k=lines.findIndex(l=>l.includes(P));
  if(k<0)return null;lines[k]=lines[k].replace(P,T);return lines.join("\n")}
function dailyCoder(r,c,day=new Date()){
  const lang=c.id==="py"?"py":"js",L=dailyLevel(c),tag={1:"warm-up",2:"challenge",3:"brain-buster"}[L];
  const dn=dayNum(day),[topic,emo,themeName]=DAY_THEMES[day.getDay()],formats=DAY_FORMATS[dn%7],avoid=dailySeen();
  const nQ=formats.filter(f=>f==="predict").length,nC=formats.filter(f=>f!=="predict").length;
  const qs=pickDaily(r,DQ,L,topic,nQ,avoid,"q"),cs=pickDaily(r,DCODE,L,topic,nC,avoid,"c");const cm=lang==="py"?"#":"//";
  const from=`${emo} ${themeName} · ${tag}`;
  const steps=formats.map(f=>{
    if(f==="predict"){const x=qs.shift();const q=x.t[1](r);
      return {type:"quiz",q:"What does this print?",code:q[lang],opts:dailyOpts(q.ans,q.wrong),a:0,mono:true,why:`It prints ${q.ans}. Follow it line by line, keeping track of each variable.`,_course:c,_from:from,_key:x.key}}
    const x=cs.shift();const t=x.t[1](r);const outText=t.out.join(" · ");
    {const had=new Set((S.daily||{}).seen||[]),k=g=>x.key+(g==="order"?"o":g==="bug"?"b":"");   // seen this one lately? use a format you haven't had it in
      if(had.has(k(f))){const alt=["bug","order","code"].find(g=>!had.has(k(g)));if(alt)f=alt}}
    if(f==="order"){let lines=t[lang].split("\n").filter(l=>l.trim());
      {const set=/^(let |const )?\w+ = [^;]*;?$/;let k=0;while(k<lines.length&&set.test(lines[k]))k++;   // setup lines could go in any order: keep them together on one line
        if(k>1)lines=[lines.slice(0,k).map(l=>lang==="js"&&!l.endsWith(";")?l+";":l).join(lang==="js"?" ":"; "),...lines.slice(k)]}
      if(lines.length>=3&&lines.length<=8&&new Set(lines).size===lines.length)
        return {type:"order",title:"🧩 Daily order: "+t.title,body:`<p>${t.task}</p><p>Put the lines in the right order.</p>`,lines,why:`In this order it prints ${outText}.`,_out:t.out,_course:c,_from:from,_key:x.key+"o"}}
    if(f==="bug"){const bad=addBug(t[lang],lang,t.out);
      if(bad)return {type:"code",title:"🐛 Daily bug hunt: "+t.title,body:`<p>${t.task}</p><p><b>This code has one small bug.</b> Run it, find the bug and fix it so it prints ${C(outText)}.</p>`,start:bad,hint:t[lang],out:t.out,use:t.use,_course:c,_from:from,_key:x.key+"b"}}
    return {type:"code",title:"🎯 Daily code: "+t.title,body:`<p>${t.task}</p>`,start:(t.start?t.start[lang]:"")+`${cm} Your code here\n`,hint:t[lang],out:t.out,use:t.use,_course:c,_from:from,_key:x.key};
  });
  return steps;
}
function dailyOpts(ans,wrong){const A=String(ans),seen=new Set([A]),o=[A];for(const w of wrong){const s=String(w);if(!seen.has(s)&&o.length<4){seen.add(s);o.push(s)}}let k=2;while(o.length<3){const s=String((+A||0)+k++);if(!seen.has(s)){seen.add(s);o.push(s)}}return o}
function pickLeveled(r,bank,L,n){const pool=bank.filter(([l])=>l===L),lower=bank.filter(([l])=>l<L);const out=[];const src=[...pool];
  while(out.length<n&&(src.length||lower.length)){const from=src.length&&(out.length===0||!lower.length||r()<.7)?src:lower;out.push(from.splice(Math.floor(r()*from.length),1)[0][1])}return out}
function dailyFromLessons(r,c){  // other languages: puzzles from everything you've learned (newest first), never one from the last week
  const done=flat(c).filter(x=>x.l.steps&&S.done.includes(x.l.id));const L=done.length?done:flat(c).filter(x=>x.l.steps).slice(0,1);
  const seen=dailySeen(),recent=L.slice(-10),pools=[];recent.forEach((x,ri)=>(x.l.pool||[]).forEach((p,j)=>pools.push({l:x.l,j,w:ri+1})));
  const fresh=a=>{const f=a.filter(x=>!seen.has(x.key));return f.length?f:a};
  pools.forEach(p=>p.key=p.l.id+"#p"+p.j);
  const pickW=a=>{const tot=a.reduce((q,x)=>q+x.w,0);let k=r()*tot;for(const x of a){k-=x.w;if(k<=0)return x}return a[a.length-1]};
  const out=[];let pp=fresh(pools);for(let k=0;k<2&&pp.length;k++){const pk=pickW(pp);pp=pp.filter(x=>x!==pk);const p=pk.l.pool[pk.j];
    out.push({type:"quiz",q:"What does this print?",code:p[0],opts:[...p[1]],a:0,mono:true,why:`It prints ${p[1][0].includes("\n")?"those lines":p[1][0]}.`,_course:c,_from:pk.l.title,_key:pk.key,_src:{key:pk.key,item:{kind:"pool",lid:pk.l.id,j:pk.j}}})}
  const codes=[];L.slice(-12).forEach((x,ri)=>x.l.steps.forEach((s,si)=>{if(s.type==="code"&&!s.final&&!s.tests)codes.push({s,l:x.l,key:x.l.id+"#c"+si,w:ri+1})}));
  if(codes.length){const pk=pickW(fresh(codes));out.push({...pk.s,title:"🎯 Daily code: "+pk.s.title,_course:c,_from:pk.l.title,_key:pk.key})}
  return out;
}
/* --- fresh TypeMonkey Jr. puzzles --- */
function genMaze(r,lvl){
  const W=lvl===1?5:6,H=lvl===1?3:5,len=lvl===1?DINT(r,3,5):lvl===2?DINT(r,5,7):DINT(r,7,10),tmax=lvl===1?1:lvl===2?3:6;
  const D=[[1,0],[0,1],[-1,0],[0,-1]],DN=["E","S","W","N"];
  for(let tries=0;tries<400;tries++){
    let x=DINT(r,0,W-1),y=DINT(r,0,H-1),d=DINT(r,0,3),turns=0,ok=true;const path=[[x,y]],seen=new Set([x+","+y]);
    const free=(nx,ny,px,py)=>nx>=0&&ny>=0&&nx<W&&ny<H&&!seen.has(nx+","+ny)&&D.every(([dx,dy])=>{const k=(nx+dx)+","+(ny+dy);return !seen.has(k)||(nx+dx===px&&ny+dy===py)});
    while(path.length<=len){
      const opts=[d,(d+1)%4,(d+3)%4].filter(nd=>free(x+D[nd][0],y+D[nd][1],x,y));
      if(!opts.length){ok=false;break}
      let nd;if(opts.includes(d)&&(turns>=tmax||r()<.6||path.length===1))nd=d;else{const t=opts.filter(o=>o!==d);if(!t.length||turns>=tmax){if(!opts.includes(d)){ok=false;break}nd=d}else{nd=DPICK(r,t);turns++}}
      if(path.length===1)d=nd;  // first move sets the starting direction
      d=nd;x+=D[d][0];y+=D[d][1];path.push([x,y]);seen.add(x+","+y);
    }
    if(!ok||(lvl>1&&turns<1))continue;
    const g=Array.from({length:H},()=>Array(W).fill("#"));path.forEach(([px,py])=>g[py][px]=".");g[path[0][1]][path[0][0]]="S";const e=path[path.length-1];g[e[1]][e[0]]="B";
    const first=D.findIndex(([dx,dy])=>path[0][0]+dx===path[1][0]&&path[0][1]+dy===path[1][1]);let f=first;const sol=[];
    for(let i=1;i<path.length;i++){const nd=D.findIndex(([dx,dy])=>path[i-1][0]+dx===path[i][0]&&path[i-1][1]+dy===path[i][1]);if(nd!==f){sol.push(nd===(f+1)%4?"right":"left");f=nd}sol.push("fwd")}
    return {type:"maze",title:"🎯 Today's maze",grid:g.map(row=>row.join("")),dir:DN[first],blocks:lvl===1?["fwd","left","right"]:["fwd","left","right","rep"],solution:sol,say:"A brand-new maze, made just for today!"};
  }
  return {type:"maze",title:"🎯 Today's maze",grid:["S...B"],dir:"E",blocks:["fwd"],solution:["fwd","fwd","fwd","fwd"]};
}
function genDance(r,lvl){
  const all=["clap","jump","spin","wave","wiggle"];const moves=[...all].sort(()=>r()-.5).slice(0,lvl===1?3:lvl===2?4:5);
  if(lvl===1){const t=[0,0,0].map(()=>DPICK(r,moves));return {type:"dance",title:"🎯 Today's dance",moves,target:t,solution:{pattern:t},say:"A new dance just for today. Watch it first!"}}
  const n=lvl===2?2:3,p=[];while(p.length<n){const m=DPICK(r,moves);if(p[p.length-1]!==m)p.push(m)}const times=lvl===2?3:DINT(r,2,3);
  return {type:"dance",title:"🎯 Today's dance",loop:true,moves,target:Array.from({length:times},()=>p).flat(),solution:{pattern:p,times},say:"Find the part that repeats!"};
}
function genBox(r,lvl){
  const ops=lvl===1?["+1","+2"]:lvl===2?["+1","+2","+5"]:["+1","+5","x2"],start=lvl===3?1:0,n=lvl===1?3:lvl===2?3:DINT(r,3,4);
  let seq=[],v=start;while(seq.length<n){const o=DPICK(r,ops);if(o==="x2"&&v===0)continue;seq.push(o);v=BOXOPS[o](v)}
  seq=boxShortest(start,v,ops)||seq;const m=seq.length;   // the tap limit is always the true fewest taps
  return {type:"box",title:"🎯 Today's banana box",body:`<p>Make the box hold exactly <b>${v}</b>${lvl>1?` in <b>${m}</b> taps or fewer`:""}.</p>`,name:"bananas",startVal:start,goal:v,ops,max:lvl>1?m:undefined,solution:seq};
}
const JR_SORTS=[
 {title:"Fruit or animal?",rule:"Fruit ➜ 🧺 Basket<br>Animal ➜ 🏠 Zoo",bins:[{icon:"🧺",name:"Basket"},{icon:"🏠",name:"Zoo"}],a:[["🍎","apple"],["🍌","banana"],["🍇","grapes"],["🍓","strawberry"],["🍉","melon"]],b:[["🐘","elephant"],["🦒","giraffe"],["🐸","frog"],["🐧","penguin"],["🦁","lion"]]},
 {title:"Hot or cold?",rule:"Hot ➜ 🔥 Hot<br>Cold ➜ ❄️ Cold",bins:[{icon:"🔥",name:"Hot"},{icon:"❄️",name:"Cold"}],a:[["☀️","sun"],["🌶️","chili"],["🍕","hot pizza"],["🌋","volcano"],["☕","cocoa"]],b:[["🧊","ice"],["⛄","snowman"],["🍦","ice cream"],["🐧","penguin"],["❄️","snowflake"]]},
 {title:"Land or water?",rule:"Lives in water ➜ 🌊 Water<br>Lives on land ➜ 🌳 Land",bins:[{icon:"🌊",name:"Water"},{icon:"🌳",name:"Land"}],a:[["🐟","fish"],["🐙","octopus"],["🐬","dolphin"],["🦈","shark"],["🐳","whale"]],b:[["🐒","monkey"],["🐄","cow"],["🐇","rabbit"],["🐴","horse"],["🐿️","squirrel"]]},
 {title:"Day or night?",rule:"Day ➜ ☀️ Day<br>Night ➜ 🌙 Night",bins:[{icon:"☀️",name:"Day"},{icon:"🌙",name:"Night"}],a:[["🌅","sunrise"],["🌈","rainbow"],["🏖️","beach day"],["🌻","sunflower"]],b:[["⭐","stars"],["🦉","owl"],["🌙","moon"],["😴","bedtime"]]},
 {title:"Even or odd?",lvl:2,rule:"Even (2, 4, 6…) ➜ 🟦 Even<br>Odd (1, 3, 5…) ➜ 🟧 Odd",bins:[{icon:"🟦",name:"Even"},{icon:"🟧",name:"Odd"}],a:[["2",""],["4",""],["6",""],["8",""],["10",""]],b:[["1",""],["3",""],["5",""],["7",""],["9",""]]},
 {title:"Bigger than 5?",lvl:2,rule:"More than 5 ➜ ⬆️ Big<br>5 or less ➜ ⬇️ Small",bins:[{icon:"⬆️",name:"Big"},{icon:"⬇️",name:"Small"}],a:[["6",""],["8",""],["9",""],["12",""],["7",""]],b:[["1",""],["3",""],["5",""],["2",""],["4",""]]}];
function genSort(r,lvl){const pool=JR_SORTS.filter(x=>(x.lvl||1)<=lvl),T=DPICK(r,pool),n=lvl===1?2:3;
  const pick=(arr,k)=>[...arr].sort(()=>r()-.5).slice(0,k);
  const items=[...pick(T.a,n).map(([icon,name])=>({icon,name,bin:0})),...pick(T.b,n).map(([icon,name])=>({icon,name,bin:1}))];
  return {type:"sort",title:"🎯 Today's sort: "+T.title,body:`<p>Follow the rule. Tap where each thing goes!</p>`,rule:T.rule,bins:T.bins,items,say:"A new sorting game, just for today!"}}
function genPredict(r,lvl){const m=genMaze(r,lvl===1?1:2);const prog=m.solution.slice(0,lvl===1?3:5);
  return {type:"predict",title:"🎯 Where will I stop?",body:`<p>Read my program. Then tap the square where I will stop.</p>`,grid:m.grid,dir:m.dir,prog,say:"Follow the blocks one by one with your finger!"}}
function dailyJr(r,c,day=new Date()){const n=doneIn(c),lvl=n<4?1:n<10?2:3;
  const MIX=[["maze","sort","dance"],["predict","box","maze"],["maze","dance","box"],["sort","maze","predict"],["dance","predict","box"],["maze","box","sort"],["predict","dance","maze"]];
  const G={maze:genMaze,dance:genDance,box:genBox,sort:genSort,predict:genPredict};
  return MIX[dayNum(day)%7].map(k=>({...G[k](r,lvl),_course:c,_key:"jr-"+k}))}
function dailySteps(){
  const rnd=seeded("typemonkey-"+dayStr(new Date()));
  const started=(S.stats.started||[]).filter(id=>{const c=courseById(id);return c&&c.units&&!c.kids&&!c.extra});
  const jrOnly=!started.length&&(S.stats.started||[]).includes("jr");
  if(jrOnly)return dailyJr(rnd,courseById("jr"));
  const last=courseById(S.lastCourse);const c=last&&started.includes(last.id)?last:courseById(started.length?started[started.length-1]:"js");
  return ["js","game","py"].includes(c.id)?dailyCoder(rnd,c):dailyFromLessons(rnd,c);
}
function startDaily(){SFX.stopMusic();
  if(dailyDoneToday()){toast("You already did today's challenge. A new one unlocks tomorrow!");return}
  const steps=dailySteps();if(!steps.length)return toast("Play a lesson first, then the daily challenge unlocks!");
  cur={c:steps[0]._course,l:{id:null,title:"Daily challenge",steps:[...steps,{type:"done"}]},item:null,step:0,earned:{xp:0,ban:0,right:0,total:0},daily:true};
  rerender=renderStep;renderStep();
}
function dailyDone(){
  const ok=cur.earned.right,n=cur.earned.total;
  const t=dayStr(new Date()),y=dayStr(new Date(Date.now()-864e5));const d=S.daily||{};
  const streak=d.last===y?(d.streak||0)+1:1;const seen=[...cur.l.steps.map(x=>x._key).filter(Boolean),...(d.seen||[])].slice(0,24);S.daily={last:t,streak,best:Math.max(d.best||0,streak),seen};
  const ban=10+ok*3+(streak>=3?5:0),xp=ok*10;S.bananas+=ban;S.xp+=xp;bumpStreak();bump("dailies");save();
  shell(`<div class="card" style="text-align:center;align-items:center"><div class="label">Daily challenge complete</div><h2>${ok}/${n} right</h2>
    <div class="reward"><div><b>+${xp}</b><span>XP</span></div><div><b>+${ban}</b><span>Bananas</span></div><div><b>${streak}</b><span>Daily streak</span></div></div>
    <p>${streak>=3?"Streak bonus +5 bananas! ":""}A new challenge unlocks tomorrow.</p></div>
    ${buddy(ok===n?"Perfect daily! See you tomorrow!":"Nice work! Anything you missed is waiting in Review.",ok===n?"cheer":"happy")}
    <div class="row"><button class="btn" id="back">Back home</button></div>`);
  $("#back").onclick=home;sfx("complete");
}

/* ---------- TypeMonkey shop ---------- */
const SHOP=[["fur","Fur",FURS],["hat","Hats",HATS],["eyes","Glasses",EYES],["neck","Neckwear",NECKS],["pet","Pets",PETS]];
/* Level rewards (src/features/40-monkey.js, TMLevel.GIFTS) are earned only by levelling up, never sold. Returns that level, or 0. */
function levelOnly(slot,id){try{const G=window.TMLevel&&TMLevel.GIFTS;if(!G)return 0;for(const L in G)if(G[L][0]===slot&&G[L][1]===id)return +L}catch(e){}return 0}
function shop(tab="hat",preview){SFX.stopMusic();
  rerender=()=>shop(tab);setMode(false);
  const look=preview||S.look;const [slot,label,items]=SHOP.find(x=>x[0]===tab);
  $("#screen").innerHTML=`<div class="stack">
    <div class="row"><button class="btn ghost sm" id="back">← Home</button></div>
    <section class="hero"><div class="label">Shop</div><h1>Dress up TypeMonkey</h1><p>Earn bananas in lessons, games and reviews, then spend them here. Items marked ⭐ Rare can't be bought: they're level rewards.</p></section>
    <div class="shopstage"><div class="stage-monkey">${withPet("cheer",look)}</div><div class="stage-info"><div class="label">Your bananas</div><div class="big">🍌 ${S.bananas}</div>${preview?(levelOnly(slot,preview[slot])?`<p>Previewing a ⭐ rare level reward.</p>`:`<p>Previewing. Tap Buy to keep it!</p>`):`<p>Tap an item to try it on.</p>`}</div></div>
    <div class="langs" role="tablist">${SHOP.map(([k,l])=>`<button class="lang" data-tab="${k}" aria-pressed="${k===tab}">${l}</button>`).join("")}</div>
    <div class="shopgrid">${Object.entries(items).map(([id,it])=>{
      const owned=S.owned[slot].includes(id),on=S.look[slot]===id,tryLook={...S.look,[slot]:id},away=!owned&&!inSeason(it),lv=levelOnly(slot,id);
      return `<button class="shopitem ${on?"on":""} ${away?"away":""} ${lv?"lvonly":""} ${lv&&!owned?"lvlocked":""}" data-id="${id}" ${away?"disabled":""}>${it.season?`<span class="season">${it.season==="oct"?"🎃":"❄️"} Seasonal</span>`:lv?`<span class="season lvtag">⭐ Rare</span>`:""}<div class="mini-monkey">${withPet("happy",tryLook)}</div><b>${it.name}</b>
        <span class="pill ${on?"ok":owned?"":lv?"lvpill":"kid"}">${on?(slot==="pet"?"With you":"Wearing"):owned?"Owned":away?`Back in ${seasonName(it)}`:lv?`⭐ Level ${lv}`:`🍌 ${it.price}`}</span></button>`}).join("")}</div>
    <div id="buybar"></div>
  </div>`;
  $("#back").onclick=home;
  $$("[data-tab]").forEach(b=>b.onclick=()=>shop(b.dataset.tab));
  $$(".shopitem").forEach(b=>b.onclick=()=>{
    const id=b.dataset.id,it=items[id];
    if(S.owned[slot].includes(id)){S.look[slot]=id;save();toast(`TypeMonkey is wearing: ${it.name}`);shop(tab);return}
    shop(tab,{...S.look,[slot]:id});
    const lv=levelOnly(slot,id);
    if(lv){const now=window.TMLevel?TMLevel.info(S.xp).lvl:1;
      $("#buybar").innerHTML=`<div class="paywall lvgate"><div><h3>⭐ ${it.name}</h3><p>A rare level reward. You can't buy it with bananas: reach <b>Level ${lv}</b> and it's yours for free.${now<lv?` You're Level ${now}, keep going!`:""}</p></div>
        <button class="btn ghost" id="nobuy">OK</button></div>`;
      $("#buybar").scrollIntoView({block:"nearest"});$("#nobuy").onclick=()=>shop(tab);return}
    $("#buybar").innerHTML=`<div class="paywall"><div><h3>${it.name}</h3><p>${S.bananas>=it.price?`Costs ${it.price} bananas. You have ${S.bananas}.`:`You need ${it.price-S.bananas} more bananas. Finish lessons and games to earn them!`}</p></div>
      <button class="btn banana" id="buy" ${S.bananas>=it.price?"":"disabled"}>Buy · 🍌 ${it.price}</button><button class="btn ghost" id="nobuy">Cancel</button></div>`;
    $("#buybar").scrollIntoView({block:"nearest"});
    $("#nobuy").onclick=()=>shop(tab);
    $("#buy").onclick=()=>{if(S.bananas<it.price)return;S.bananas-=it.price;S.owned[slot].push(id);sfx("coins");S.look[slot]=id;bump("purchases");save();toast(`You bought ${it.name}! 🎉`);shop(tab)};
  });
  foot();window.scrollTo(0,0);
}

/* ---------- Settings ---------- */
const APP_VERSION="1.1";
function settingsPage(){SFX.stopMusic();
  const back=rerender===settingsPage?home:rerender;rerender=settingsPage;setMode(false);
  const st=S.settings;
  const seg=(id,val,opts)=>`<div class="seg" role="radiogroup" id="${id}">${opts.map(([v,l])=>`<button role="radio" aria-checked="${val===v}" data-v="${v}">${l}</button>`).join("")}</div>`;
  $("#screen").innerHTML=`<div class="stack setpage">
    <div class="sethead"><button class="btn ghost sm" id="back">← Back</button><h1>Settings</h1></div>
    <div class="card setlist">
      <div class="setrow"><b>Theme</b>${seg("theme",st.theme,[["system","Auto"],["light","Light"],["dark","Dark"]])}</div>
      <div class="setrow"><b>Text size</b>${seg("text",st.text,[["normal","Normal"],["large","Large"]])}</div>
      <div class="setrow"><b>Sounds</b>${seg("sound",st.sound===false?"off":"on",[["on","On"],["off","Off"]])}</div>
      <div class="setrow"><b>Music <small>in Jr.</small></b>${seg("music",st.music===false?"off":"on",[["on","On"],["off","Off"]])}</div>
      <div class="setrow"><b>Calm mode <small>less motion</small></b>${seg("calm",st.calm?"on":"off",[["off","Off"],["on","On"]])}</div>
      ${Cloud.plugin()?`<div class="setrow"><b>iCloud sync <small>${st.cloud===false?"progress stays on this device":"progress follows you to your other Apple devices"}</small></b>${seg("cloud",st.cloud===false?"off":"on",[["on","On"],["off","Off"]])}</div>`:""}
      ${Remind.ok()?`<div class="setrow"><b>Daily reminder <small>${st.remind?"skipped on days you practice":"a nudge to keep your streak"}</small></b><div class="setbtns">${seg("remind",st.remind?"on":"off",[["off","Off"],["on","On"]])}${st.remind?`<select id="remindAt" class="remindat" aria-label="Reminder time">${[7,8,12,15,16,17,18,19,20].map(h=>`<option value="${h}" ${+st.remindAt===h?"selected":""}>${h===12?"12 pm":h>12?(h-12)+" pm":h+" am"}</option>`).join("")}</select>`:""}</div></div>`:""}
    </div>
    <div class="card setlist">
      <div class="setrow"><b>${S.pro?"✓ Full version unlocked":`Full version <small>one-time ${STORE.price}</small>`}</b><div class="setbtns">${S.pro?"":`<button class="btn banana sm" id="sbuy">Unlock</button>`}<button class="btn ghost sm" id="restore">Restore</button></div></div>
      <div class="setrow"><b>Progress <small>${S.done.length} lessons · ${S.xp} XP · ${S.bananas} 🍌</small></b><div class="setbtns"><button class="btn sm" id="sbackup">Back up</button><button class="btn ghost sm" id="reset">Reset…</button></div></div>
      <div id="confirm"></div>
    </div>
    <div class="setfoot"><button class="linkbtn" id="sterms">Terms</button><button class="linkbtn" id="sprivacy">Privacy</button><span>Version ${APP_VERSION}</span>
      <span class="credits">No personal data collected. Python by Brython (BSD). Fonts: Baloo 2, Nunito, JetBrains Mono (OFL).</span></div>
  </div>`;
  $("#back").onclick=()=>back();
  const bindSeg=(id,fn)=>$$(`#${id} button`).forEach(b=>b.onclick=()=>{fn(b.dataset.v);save();applySettings();settingsPage()});
  bindSeg("theme",v=>st.theme=v);bindSeg("text",v=>st.text=v);bindSeg("calm",v=>st.calm=v==="on");bindSeg("sound",v=>{st.sound=v==="on";if(st.sound)setTimeout(()=>sfx("correct"),40);else SFX.stopMusic(true)});bindSeg("music",v=>{st.music=v==="on";if(!st.music)SFX.stopMusic(true)});
  bindSeg("cloud",v=>{st.cloud=v==="on";if(st.cloud)setTimeout(async()=>{await Cloud.pull();Cloud.queue(300)},50)});
  $$("#remind button").forEach(b=>b.onclick=async()=>{await Remind.enable(b.dataset.v==="on");settingsPage()});
  if($("#remindAt"))$("#remindAt").onchange=e=>{st.remindAt=+e.target.value;save();Remind.sync();toast("Reminder set for "+e.target.selectedOptions[0].textContent+".")};
  if($("#sbuy"))$("#sbuy").onclick=()=>unlockFull(settingsPage);
  $("#restore").onclick=()=>restoreFull(settingsPage);
  $("#sbackup").onclick=backupPage;
  $("#sterms").onclick=()=>legalPage("terms");$("#sprivacy").onclick=()=>legalPage("privacy");
  $("#reset").onclick=()=>{$("#confirm").innerHTML=`<div class="feedback bad"><b>Erase everything?</b> This can't be undone.<div class="row" style="margin-top:8px"><button class="btn sm" id="yes">Erase everything</button><button class="btn ghost sm" id="no">Keep my progress</button></div></div>`;
    $("#yes").onclick=()=>{const keep=S.settings;S=freshState();S.resetAt=Date.now();S.settings=keep;save();applySettings();toast("Progress erased.");home()};
    $("#no").onclick=()=>$("#confirm").innerHTML=""};
  $("#foot").innerHTML="";window.scrollTo(0,0);
}

/* ---------- Backup / restore: progress as a copyable code (TM1-<z|r><base64url>.<crc32>) ---------- */
const BK={
  crc(str){let c,crc=-1;for(let i=0;i<str.length;i++){c=(crc^str.charCodeAt(i))&255;for(let k=0;k<8;k++)c=c&1?(c>>>1)^0xEDB88320:c>>>1;crc=(crc>>>8)^c}return ((crc^-1)>>>0).toString(36).padStart(7,"0")},
  b64(bytes){let s="";for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode.apply(null,bytes.subarray(i,i+8192));return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},
  unb64(s){const b=atob(s.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((s.length+3)%4));const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u},
  async pipe(bytes,Stream){const st=new Blob([bytes]).stream().pipeThrough(new Stream("deflate-raw"));return new Uint8Array(await new Response(st).arrayBuffer())},
  async make(state){
    const json=new TextEncoder().encode(JSON.stringify(state));let flag="r",data=json;
    try{if(typeof CompressionStream!=="undefined"){const z=await BK.pipe(json,CompressionStream);if(z.length<json.length){flag="z";data=z}}}catch(e){flag="r";data=json}
    const body=flag+BK.b64(data);return "TM1-"+body+"."+BK.crc(body);
  },
  /* -> {state} or {error:"friendly message"} */
  async read(text){
    const t=String(text||"").replace(/\s+/g,"");
    if(!t)return {error:"Paste your backup code in the box first."};
    const m=t.match(/TM1-([zr])([A-Za-z0-9_-]+)\.([0-9a-z]{7})/i);
    if(!m)return {error:/TM\d-/i.test(t)&&!/TM1-/i.test(t)?"This code is from a different version of TypeMonkey. Try updating the app.":/TM1-/i.test(t)?"This code looks cut short. Make sure you copy the whole thing, from TM1- right to the end.":"That doesn't look like a TypeMonkey backup code. Backup codes start with TM1-."};
    const body=m[1]+m[2];
    if(BK.crc(body)!==m[3].toLowerCase())return {error:"Hmm, this code has a typo or a missing piece. Try copying the whole code again, from TM1- right to the end."};
    let bytes;try{bytes=BK.unb64(m[2])}catch(e){return {error:"This code got scrambled somewhere. Try copying it again."}}
    if(m[1]==="z"){
      if(typeof DecompressionStream==="undefined")return {error:"This browser is too old to open this backup. Try a newer browser."};
      try{bytes=await BK.pipe(bytes,DecompressionStream)}catch(e){return {error:"This code got scrambled somewhere. Try copying it again."}}
    }
    let st;try{st=JSON.parse(new TextDecoder().decode(bytes))}catch(e){return {error:"This code got scrambled somewhere. Try copying it again."}}
    if(!st||typeof st!=="object"||Array.isArray(st)||!Array.isArray(st.done))return {error:"This code doesn't have any TypeMonkey progress in it."};
    return {state:st};
  },
  summary(st){const n=st.done.length,b=Math.max(0,Math.floor(+st.bananas||0)),x=Math.max(0,Math.floor(+st.xp||0)),bd=Object.keys(st.badges||{}).length;
    return `This backup has <b>${n} lesson${n===1?"":"s"} done</b>, <b>${b} banana${b===1?"":"s"}</b> and <b>${x} XP</b>${bd?`, plus ${bd} badge${bd===1?"":"s"}`:""}${st.pro?". The full version is unlocked in it":""}.`},
  fileName(){const d=new Date();return `typemonkey-backup-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}.txt`}
};
/* ---------- iCloud progress sync (iPhone/iPad app only; uses the typemonkey-icloud plugin) ----------
   Progress travels as the same compressed code as a backup, in Apple's iCloud key-value store, so it follows the
   player to their other Apple devices with no account or server of ours. Two saves are merged so nothing is lost:
   lessons done, badges and items owned are combined; XP takes the higher number; bananas, outfit and the like come
   from whichever device saved last; settings always stay as they are on this device. */
function mergeState(a,b){
  const t=x=>+x.savedAt||0,[old,neu]=t(a)>t(b)?[b,a]:[a,b],M={...old,...neu};
  if(+neu.resetAt&&t(old)<=+neu.resetAt)return normState({...neu,settings:a.settings});   // a newer "Erase everything" or restored backup wins outright
  M.settings=a.settings;                                           // a = this device
  M.done=[...new Set([...(a.done||[]),...(b.done||[])])];
  M.xp=Math.max(+a.xp||0,+b.xp||0);
  M.pro=!!(a.pro||b.pro);
  M.badges={...(old.badges||{}),...(neu.badges||{})};for(const k in M.badges){const x=(a.badges||{})[k],y=(b.badges||{})[k];if(x&&y)M.badges[k]=Math.min(x,y)}
  M.owned={};for(const k of new Set([...Object.keys(a.owned||{}),...Object.keys(b.owned||{})]))M.owned[k]=[...new Set([...((a.owned||{})[k]||[]),...((b.owned||{})[k]||[])])];
  M.review={...(old.review||{}),...(neu.review||{})};
  M.progress={...(old.progress||{}),...(neu.progress||{})};for(const id of M.done)delete M.progress[id];
  M.stats={...(old.stats||{})};for(const [k,v] of Object.entries(neu.stats||{})){const o=M.stats[k];
    M.stats[k]=typeof v==="number"&&typeof o==="number"?Math.max(v,o):Array.isArray(v)&&Array.isArray(o)?[...new Set([...o,...v])]:v}
  const la=a.lastDay||"",lb=b.lastDay||"";const sk=la>lb?a:lb>la?b:((+a.streak||0)>=(+b.streak||0)?a:b);M.lastDay=sk.lastDay;M.streak=sk.streak;
  return normState(M);
}
const Cloud={
  KEY:"tm.progress",lastSent:null,timer:null,busy:false,
  plugin(){try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.TMCloud||null}catch(e){return null}},
  on(){return !!Cloud.plugin()&&S.settings.cloud!==false},
  forCloud(){const c={...S};delete c.settings;return c},
  /* Fetch iCloud's copy and merge it in. Returns true if anything on this device changed. */
  async pull(quiet){
    if(!Cloud.on()||Cloud.busy)return false;Cloud.busy=true;
    try{const r=await Cloud.plugin().get({key:Cloud.KEY});if(!r||!r.value)return false;if(r.value===Cloud.lastSent)return false;
      const got=await BK.read(r.value);if(!got.state)return false;
      const strip=x=>{const c={...x};delete c.settings;delete c.savedAt;return JSON.stringify(c)};
      const M=mergeState(S,normState({...got.state,settings:S.settings}));if(strip(M)===strip(S))return false;
      S=M;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}renderStats();
      if(!quiet)toast("☁️ Progress synced from your other device.");
      if(!$("#quit")&&typeof rerender==="function")rerender();
      Cloud.queue(400);return true;
    }catch(e){return false}finally{Cloud.busy=false}},
  async push(){if(!Cloud.on())return;try{const code=await BK.make(Cloud.forCloud());if(code===Cloud.lastSent)return;await Cloud.plugin().set({key:Cloud.KEY,value:code});Cloud.lastSent=code}catch(e){}},
  queue(ms=3000){if(!Cloud.on())return;clearTimeout(Cloud.timer);Cloud.timer=setTimeout(Cloud.push,ms)},
  start(){const P=Cloud.plugin();if(!P)return;
    window.__cloudQueue=()=>Cloud.queue();
    try{P.addListener("changed",()=>Cloud.pull())}catch(e){}
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")Cloud.pull();else{clearTimeout(Cloud.timer);Cloud.push()}});
    setTimeout(async()=>{await Cloud.pull();Cloud.queue(500)},800)}
};
Cloud.start();
async function copyText(text,ta){
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true}}catch(e){}
  try{if(ta){ta.focus();ta.select();ta.setSelectionRange(0,text.length)}if(document.execCommand&&document.execCommand("copy"))return true}catch(e){}
  return false;
}
function backupPage(){SFX.stopMusic();
  const back=rerender===backupPage?home:rerender;rerender=backupPage;setMode(false);
  const ls=n=>`${n} lesson${n===1?"":"s"}`,bs=n=>`${n} banana${n===1?"":"s"}`;
  $("#screen").innerHTML=`<div class="stack">
    <div class="row"><button class="btn ghost sm" id="back">← Back</button></div>
    <section class="hero"><div class="label">Your progress</div><h1>Back up my progress</h1><p>Your lessons, bananas and outfits are saved on this device only. A backup code keeps them safe, and lets you move them to another phone, tablet or computer.</p></section>
    <div class="card bkcard">
      <h3>1. Save your backup code</h3>
      <p class="muted">You have ${ls(S.done.length)} done and ${bs(S.bananas)}. Copy this code and keep it somewhere safe, like a note or a message to yourself.</p>
      <textarea id="bkcode" class="bkcode" readonly rows="4" aria-label="Your backup code" spellcheck="false">Making your code…</textarea>
      <div class="row"><button class="btn" id="bkcopy" disabled>📋 Copy code</button><button class="btn ghost" id="bkdl" disabled>⬇️ Download backup file</button></div>
      <div id="bkcopied" aria-live="polite"></div>
    </div>
    <div class="card bkcard">
      <h3>2. Restore from a code</h3>
      <p class="muted">On your other device, paste the code here. TypeMonkey shows you what's inside before anything changes.</p>
      <textarea id="bkin" class="bkcode" rows="4" aria-label="Paste a backup code" placeholder="Paste a code that starts with TM1-" spellcheck="false" autocapitalize="off" autocorrect="off"></textarea>
      <div class="row"><button class="btn" id="bkcheck">Check code</button><button class="btn ghost" id="bkload">📂 Load backup file</button><input type="file" id="bkfile" accept=".txt,text/plain" hidden></div>
      <div id="bkresult" aria-live="polite"></div>
    </div>
    ${buddy("Tip: make a fresh backup code every few lessons, so it's always up to date!","happy")}
  </div>`;
  $("#back").onclick=()=>back();
  let code="";
  BK.make(S).then(c=>{code=c;const ta=$("#bkcode");if(!ta)return;ta.value=c;$("#bkcopy").disabled=false;$("#bkdl").disabled=false})
    .catch(()=>{const ta=$("#bkcode");if(ta)ta.value="Sorry, TypeMonkey couldn't make a backup code on this device."});
  $("#bkcode").onfocus=e=>e.target.select();
  $("#bkcopy").onclick=async()=>{const ok=await copyText(code,$("#bkcode"));
    $("#bkcopied").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"✓ Copied! Now paste it somewhere safe.":"Your device didn't let TypeMonkey copy it. The code is selected, so copy it yourself (long-press, then Copy)."}</div>`;
    if(!ok){const ta=$("#bkcode");ta.focus();ta.select()}};
  $("#bkdl").onclick=()=>{try{const blob=new Blob([`TypeMonkey backup, made ${new Date().toLocaleString()}\nTo restore: open TypeMonkey, go to Settings > Back up my progress, then tap Load backup file (or paste the code below).\n\n${code}\n`],{type:"text/plain"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=BK.fileName();document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);toast("Backup file saved!")}catch(e){toast("Your device couldn't save a file. Use Copy code instead.")}};
  const check=async(text)=>{const r=await BK.read(text);const box=$("#bkresult");if(!box)return;
    if(r.error){box.innerHTML=`<div class="feedback bad">${esc(r.error)}</div>`;return}
    box.innerHTML=`<div class="feedback good">✓ ${BK.summary(r.state)}<p style="margin:6px 0 0"><b>Replace the progress on this device with it?</b> What's here now (${ls(S.done.length)}, ${bs(S.bananas)}) will be replaced.</p>
      <div class="row" style="margin-top:10px"><button class="btn sm" id="bkyes">Yes, restore it</button><button class="btn ghost sm" id="bkno">Cancel</button></div></div>`;
    $("#bkno").onclick=()=>box.innerHTML="";
    $("#bkyes").onclick=()=>{S=normState(r.state);S.resetAt=Date.now();save();applySettings();toast(`Welcome back! ${ls(S.done.length)} and ${bs(S.bananas)} restored.`);home()}};
  $("#bkcheck").onclick=()=>check($("#bkin").value);
  $("#bkload").onclick=()=>$("#bkfile").click();
  $("#bkfile").onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;
    if(f.size>5e6){$("#bkresult").innerHTML=`<div class="feedback bad">That file is too big to be a TypeMonkey backup.</div>`;return}
    const rd=new FileReader();rd.onload=()=>{const txt=String(rd.result||"");const m=txt.match(/TM1-\S+/i);$("#bkin").value=m?m[0]:txt.slice(0,2000);check(m?m[0]:txt)};
    rd.onerror=()=>{$("#bkresult").innerHTML=`<div class="feedback bad">TypeMonkey couldn't open that file. Try again, or paste the code instead.</div>`};rd.readAsText(f);e.target.value=""};
  $("#foot").innerHTML="";window.scrollTo(0,0);
}

/* ---------- Legal screens ---------- */
function legalPage(kind){
  const back=rerender;const L=LEGAL[kind];
  $("#screen").innerHTML=`<div class="stack"><div class="row"><button class="btn ghost sm" id="back">← Back</button></div>
    <section class="hero"><div class="label">TypeMonkey</div><h1>${L.title}</h1><p>Last updated ${LEGAL_INFO.updated}</p></section>
    <div class="card legal">${L.sections.map(([h,b])=>`<h3>${h}</h3>${b}`).join("")}</div></div>`;
  $("#back").onclick=()=>back();$("#foot").innerHTML="";window.scrollTo(0,0);
}
/* ---------- Grown-up check (required by app stores for purchases in apps for kids) ---------- */
function grownUpGate(onPass){
  const a=6+Math.floor(Math.random()*4),b=6+Math.floor(Math.random()*4),ans=a*b;
  const opts=shuffle([ans,ans+a,ans-b]);
  const g=document.createElement("div");g.className="gate";g.setAttribute("role","dialog");g.setAttribute("aria-label","Grown-up check");
  g.innerHTML=`<div class="card"><div class="label">Grown-ups only</div><h2>Ask a parent or guardian</h2><p>To continue, answer: what is <b>${a} × ${b}</b>?</p>
    <div class="opts">${opts.map(o=>`<button class="opt" data-v="${o}">${o}</button>`).join("")}</div><button class="btn ghost sm" id="gx">Cancel</button></div>`;
  document.body.appendChild(g);
  const close=()=>g.remove();
  g.querySelector("#gx").onclick=close;
  g.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{close();if(+b.dataset.v===ans)onPass();else toast("That's not quite right. Ask a grown-up for help!")});
}

/* ---------- Playground ---------- */
const PLAY={
  js:{name:"JavaScript",file:"script.js",run:"js",start:`// Try anything! Press ▶ Run.\nconst name = "TypeMonkey";\nfor (let i = 1; i <= 3; i++) {\n  console.log(\`\${name} says ook #\${i}\`);\n}\n`},
  web:{name:"HTML & CSS",file:"index.html",web:true,start:`<style>\n  h1 { color: #FF7A1A; }\n  .card { background: #FFF4E5; padding: 12px; border-radius: 12px; }\n</style>\n\n<h1>TypeMonkey's page</h1>\n<div class="card">\n  <p>Change anything, then tap <b>Show page</b>!</p>\n</div>\n`},
  py:{name:"Python",file:"main.py",run:"py",start:`name = "TypeMonkey"\nfor i in range(1, 4):\n    print(f"{name} says ook #{i}")\n`},
  sql:{name:"SQL",file:"query.sql",run:"sql",start:`-- The TypeMonkey Zoo database has 3 tables: animals, keepers, snacks\nSELECT a.name, k.name AS keeper\nFROM animals a\nLEFT JOIN keepers k ON a.keeper_id = k.id\nORDER BY a.name;\n`},
  cs:{name:"C#",file:"Program.cs",run:"cs",start:`using System;\n\nclass Program {\n  static void Main() {\n    for (int i = 1; i <= 3; i++) {\n      Console.WriteLine($"TypeMonkey says ook #{i}");\n    }\n  }\n}\n`},
  java:{name:"Java",file:"Main.java",run:"java",start:`public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 3; i++) {\n      System.out.println("TypeMonkey says ook #" + i);\n    }\n  }\n}\n`},
  swift:{name:"Swift",file:"main.swift",run:"swift",start:`let name = "TypeMonkey"\nfor i in 1...3 {\n    print("\\(name) says ook #\\(i)")\n}\n`},
  cpp:{name:"C++",file:"main.cpp",run:"cpp",start:`#include <iostream>\n\nint main() {\n  for (int i = 1; i <= 3; i++) {\n    std::cout << "TypeMonkey says ook #" << i << "\\n";\n  }\n  return 0;\n}\n`}
};
function playground(lang="js"){SFX.stopMusic();
  rerender=()=>playground(lang);setMode(false);
  const P=PLAY[lang];
  let saved;try{saved=(S.play||{})[lang]}catch(e){}
  $("#screen").innerHTML=`<div class="stack">
    <div class="row"><button class="btn ghost sm" id="back">← Home</button></div>
    <section class="hero"><div class="label">Playground</div><h1>Code anything.</h1><p>No lesson, no rules. Write code, run it, break it, fix it. Your code is saved as you type.</p></section>
    <div class="langs">${Object.entries(PLAY).map(([k,v])=>`<button class="lang" data-k="${k}" aria-pressed="${k===lang}">${v.name}</button>`).join("")}</div>
    ${P.run||P.web?"":`<div class="note">${P.name} needs its compiler, which ships inside the full TypeMonkey app. In this preview only JavaScript runs, so you can write ${P.name} here but not run it yet.</div>`}
    <div class="editor"><div class="head"><span>${P.file}</span><button class="linkbtn" id="clear" style="color:var(--code-dim)">Reset</button><button class="run" id="run-p" ${P.run||P.web?"":"disabled"}>${P.web?"▶ Show page":"▶ Run"}</button></div>
      <textarea id="code-p" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" aria-label="Playground editor" rows="14">${esc(saved||P.start)}</textarea>
      ${P.run&&P.run!=="sql"?inputBox("p",(S.playIn||{})[lang]||""):""}
      ${P.web?`<div class="webview" id="out-p"></div>`:`<div class="console" id="out-p"><span class="dim">${P.run?"Output appears here":"Running "+P.name+" is coming in the full app"}</span></div>`}</div>
    ${buddy(P.web?"Build any web page you like. The preview updates every time you tap Show page.":P.run==="sql"?"Ask the zoo database anything! Tap 📋 below to see its tables.":"Print anything you're curious about. That's how pros explore code too.","happy")}
    ${P.run==="sql"?`<details class="drawer"><summary>📋 Show the zoo tables</summary>${Object.keys(ZOO_TABLES).map(t=>tableHTML({tables:ZOO_TABLES},t)).join("")}</details>`:""}
  </div>`;
  $("#back").onclick=home;
  $$(".lang").forEach(b=>b.onclick=()=>playground(b.dataset.k));
  const ta=$("#code-p");wireSmart(ta);
  ta.addEventListener("input",()=>{S.play=S.play||{};S.play[lang]=ta.value;save()});
  ta.addEventListener("keydown",e=>{if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart;ta.value=ta.value.slice(0,s)+"  "+ta.value.slice(ta.selectionEnd);ta.selectionStart=ta.selectionEnd=s+2}});
  $("#clear").onclick=()=>{ta.value=P.start;S.play=S.play||{};delete S.play[lang];save()};
  if($("#in-p"))$("#in-p").addEventListener("input",()=>{S.playIn=S.playIn||{};S.playIn[lang]=$("#in-p").value;save()});
  if(P.run)$("#run-p").onclick=async()=>{ta._clean();ranLang(P.run);bump("playRuns");paintConsole($("#out-p"),await RUNNERS[P.run](ta.value,$("#in-p")?$("#in-p").value:undefined),PRINT_HINT[P.run])};
  if(P.web){renderWeb($("#out-p"),ta.value);$("#run-p").onclick=()=>renderWeb($("#out-p"),ta.value)}
  foot();window.scrollTo(0,0);
}

/* ---------- v1.1 feature modules (src/features/*.js, inlined by build.py). They may wrap or replace functions above. ---------- */
/* --- 00-readme.js --- */
/* v1.1 feature modules live here. Each file is inlined into the app script after the core code. */

/* --- 10-onboarding.js --- */
/* ---------- 10-onboarding: first-run welcome, daily XP goal ring and streak week strip ----------
   Hooks (all wraps, no edits to app.html):
     save()          -> credits any XP gained since the last save to today's S.xpDays entry (and spots the daily goal being reached)
     renderStats()   -> same bookkeeping, so a Cloud sync that swaps S never counts as "XP earned today"
     home()          -> brand-new users get the onboarding instead; everyone else gets a "Today" card (ring + week)
     finish()        -> adds a "Daily goal reached!" line to the lesson-complete card on the lesson that crosses the goal
     settingsPage()  -> adds a compact "Daily goal" 10/20/30/50 row
   Onboarding is hello + 2 questions, then Home (the daily goal is set from the Today card or Settings).
   State: S.onboarded, S.profile={why,level,firstCourse}, S.settings.goal, S.xpDays={"Y-M-D":xp}, S.goalHit, S.goalCheered */

const GOALS=[[10,"Casual","about 5 min a day","🌱"],[20,"Regular","about 10 min a day","🍌"],[30,"Serious","about 15 min a day","💪"],[50,"Intense","about 20 min a day","🚀"]];
const goalXp=()=>{const g=+(S.settings&&S.settings.goal);return GOALS.some(x=>x[0]===g)?g:20};
const todayKey=()=>dayStr(new Date());
const xpToday=()=>((S.xpDays||{})[todayKey()]||0);
const ONB_CALM=()=>calmMotion()||!!(S.settings&&S.settings.calm);

/* ---- XP per day ---- */
const XPD={s:S,xp:S.xp,crossed:false};
function keyDate(k){const [y,m,d]=String(k).split("-").map(Number);return new Date(y,(m||1)-1,d||1)}
function trackXp(){
  if(S!==XPD.s){XPD.s=S;XPD.xp=S.xp;return}           // a whole new state (reset, restore, cloud merge): not "earned today"
  const gain=(+S.xp||0)-(+XPD.xp||0);XPD.xp=S.xp;if(gain<=0)return;
  const t=todayKey(),D=S.xpDays=S.xpDays&&typeof S.xpDays==="object"?S.xpDays:{};
  const before=D[t]||0;D[t]=before+gain;
  const old=Date.now()-60*864e5;for(const k of Object.keys(D))if(keyDate(k).getTime()<old)delete D[k];
  const g=goalXp();if(before<g&&D[t]>=g&&S.goalHit!==t){S.goalHit=t;XPD.crossed=true}
}
{const _save=save;save=function(){try{trackXp()}catch(e){}return _save.apply(this,arguments)}}
{const _rs=renderStats;renderStats=function(){try{trackXp()}catch(e){}return _rs.apply(this,arguments)}}

/* ---- Streak week (Mon..Sun) ---- */
function practicedDays(){
  const set=new Set(Object.entries(S.xpDays||{}).filter(([,v])=>v>0).map(([k])=>k));
  if(S.lastDay&&S.streak>0){const L=keyDate(S.lastDay);for(let i=0;i<Math.min(S.streak,14);i++)set.add(dayStr(new Date(L.getFullYear(),L.getMonth(),L.getDate()-i)))}
  return set;
}
function liveStreak(){const t=todayKey(),y=dayStr(new Date(Date.now()-864e5));return S.lastDay===t||S.lastDay===y?S.streak:0}
function weekInfo(){
  const now=new Date(),dow=(now.getDay()+6)%7,P=practicedDays(),N=["M","T","W","T","F","S","S"],F=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  return N.map((n,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-dow+i),k=dayStr(d);
    return {n,full:F[i],key:k,on:P.has(k),today:i===dow,future:i>dow}});
}

/* ---- Today card on Home ---- */
const RING_C=2*Math.PI*27;
let ringShown={day:null,frac:0};
function todayCard(){
  const g=goalXp(),x=xpToday(),frac=Math.min(1,x/g),done=x>=g,sk=liveStreak(),W=weekInfo();
  const start=ringShown.day===todayKey()?ringShown.frac:0;
  const head=sk?`🔥 ${sk}-day streak`:W.some(d=>d.on&&!d.future)?"Start a new streak!":"Start your streak!";
  const sub=done?"Goal reached! 🎉":x?`${g-x} XP to go today`:"Do a lesson to fill the ring";
  return `<button class="today ${done?"done":""}" id="todayCard" aria-label="Today: ${x} of ${g} XP. ${sk?sk+" day streak. ":""}Tap to change your daily goal.">
    <span class="tring" aria-hidden="true"><svg viewBox="0 0 64 64"><circle class="trk" cx="32" cy="32" r="27"/><circle class="bar" cx="32" cy="32" r="27" stroke-dasharray="${RING_C.toFixed(2)}" stroke-dashoffset="${(RING_C*(1-start)).toFixed(2)}" data-to="${(RING_C*(1-frac)).toFixed(2)}"/></svg>
      <span class="rin">${done?`<b class="ok">✓</b>`:`<b>${x}</b><small>of ${g}</small>`}</span></span>
    <span class="tbody"><span class="thead"><b>${head}</b><span>${sub}</span></span>
      <span class="week">${W.map(d=>`<span class="wd ${d.on?"on":""} ${d.today?"now":""} ${d.future?"fut":""}" title="${d.full}${d.on?": practiced":""}"><i>${d.on?"🔥":""}</i><small>${d.n}</small></span>`).join("")}</span></span>
  </button>`;
}
function wireToday(){
  const card=$("#todayCard");if(!card)return;
  const bar=card.querySelector(".bar"),to=bar.dataset.to;
  const fin=()=>{bar.setAttribute("stroke-dashoffset",to)};
  if(ONB_CALM())fin();else requestAnimationFrame(()=>requestAnimationFrame(fin));
  ringShown={day:todayKey(),frac:Math.min(1,xpToday()/goalXp())};
  card.onclick=goalSheet;
  const t=todayKey();
  if(S.goalHit===t&&S.goalCheered!==t&&xpToday()>=goalXp()){S.goalCheered=t;save();
    setTimeout(()=>{if(!card.isConnected)return;card.classList.add("cheer");sfx("tada");toast("🎯 Daily goal reached! Great job!");if(!ONB_CALM())confetti(90)},ONB_CALM()?100:900)}
}
function goalSheet(){
  const g=goalXp();const box=document.createElement("div");box.className="gate onb-sheet";box.setAttribute("role","dialog");box.setAttribute("aria-label","Daily goal");
  box.innerHTML=`<div class="card"><div class="sheethead"><h2>Daily goal</h2><button class="x" id="gsx" aria-label="Close">×</button></div>
    <p class="muted">How much XP do you want each day? One lesson is about 30–60 XP.</p>
    <div class="onb-opts">${GOALS.map(([v,n,m,e])=>`<button class="onb-opt ${v===g?"sel":""}" data-g="${v}" aria-pressed="${v===g}"><span class="oe">${e}</span><span class="ot"><b>${n}</b><span>${v} XP · ${m}</span></span></button>`).join("")}</div></div>`;
  document.body.appendChild(box);
  const close=()=>box.remove();
  box.onclick=e=>{if(e.target===box)close()};box.querySelector("#gsx").onclick=close;
  box.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{S.settings.goal=+b.dataset.g;save();close();toast(`Daily goal: ${b.dataset.g} XP a day 🎯`);if(rerender===home)home()});
}

/* ---- Onboarding ---- */
const needsOnboarding=()=>!S.onboarded&&!(S.done||[]).length&&!S.xp&&!Object.keys(S.progress||{}).length;
const ONB={step:0,why:null,level:null,course:null,goal:null};
const WHY=[["fun","🎉","Just for fun","Make cool stuff"],["school","🎒","For school","Classes and homework"],["job","💼","For a job or career","Get job-ready skills"],["kid","🧒","For my kid / I'm a kid","Ages 7 to 12"]];
const LEVEL=[["new","🌱","I'm brand new","Never written code"],["little","🌿","I know a little","I've tried it before"],["code","🌳","I already code","I know another language"]];
function onbCourses(){return COURSES.filter(c=>c.units&&!c.extra&&!c.soon)}
function onbRec(){
  const has=id=>onbCourses().some(c=>c.id===id);
  const r=ONB.why==="kid"?"jr":(ONB.why==="school"||ONB.level==="little")?"py":"js";
  return has(r)?r:onbCourses()[0].id;
}
const REC_WHY={jr:"TypeMonkey Jr. has puzzles made just for kids. No typing needed!",py:"Python reads almost like English. It's a great first language!",js:"JavaScript runs every website. You'll see your code work right away!"};
function onbShell(inner,{mood="happy",say="",anim="",cta="Continue",ctaOff=false,back=true,id=""}){
  const N=2,pct=Math.round(ONB.step/N*100);
  $("#foot").innerHTML="";
  $("#screen").innerHTML=`<div class="onb" data-step="${ONB.step}" id="onb">
    <div class="onb-top">${back&&ONB.step?`<button class="x onb-back" id="onbBack" aria-label="Back">←</button>`:`<span class="onb-gap"></span>`}
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
      <button class="onb-skip" id="onbSkip">Skip</button></div>
    ${say?`<div class="onb-talk"><span class="onb-m ${anim}">${monkey(mood)}</span><div class="bubble">${say}</div></div>`:""}
    <div class="onb-body">${inner}</div>
    <div class="onb-foot"><button class="btn onb-cta" id="onbGo" ${ctaOff?"disabled":""}>${cta}</button></div>
  </div>`;
  $("#onbSkip").onclick=onbSkip;
  if($("#onbBack"))$("#onbBack").onclick=()=>{ONB.step--;onbRender()};
  window.scrollTo(0,0);
}
function onbPick(sel,key,after){
  $$(sel+" [data-v]").forEach(b=>b.onclick=()=>{ONB[key]=b.dataset.v;$$(sel+" [data-v]").forEach(x=>{const on=x===b;x.classList.toggle("sel",on);x.setAttribute("aria-pressed",on)});
    $("#onbGo").disabled=false;if(after)after(b.dataset.v)});
}
const optCards=(list,key)=>list.map(([v,e,t,s],i)=>`<button class="onb-opt ${ONB[key]===v?"sel":""}" data-v="${v}" aria-pressed="${ONB[key]===v}" style="--i:${i}"><span class="oe">${e}</span><span class="ot"><b>${t}</b><span>${esc(s)}</span></span></button>`).join("");
function onbRender(){
  const s=ONB.step;
  if(s===0){
    onbShell(`<div class="onb-hello"><div class="onb-big onb-wave">${withPet("cheer")}</div>
      <h1>Hi! I'm TypeMonkey!</h1><p>I'll teach you to code with tiny lessons, games and bananas. It's easy, and it's fun!</p></div>`,{cta:"Let's go!",back:false});
    $("#onbGo").onclick=()=>{ONB.step=1;onbRender()};
  }else if(s===1){
    onbShell(`<h1 class="onb-q">What brings you here?</h1><div class="onb-opts" id="oWhy">${optCards(WHY,"why")}</div>`,{say:"First, a quick question!",anim:"onb-hop",ctaOff:!ONB.why});
    onbPick("#oWhy","why",v=>{const t=$(".onb-talk .bubble");if(t)t.textContent={fun:"Fun is the best reason! 🎉",school:"Great! I can help with school.",job:"Awesome! Let's build real skills.",kid:"Yay! I love coding with kids! 🍌"}[v]});
    $("#onbGo").onclick=()=>{ONB.course=null;ONB.step=2;onbRender()};
  }else if(s===2){
    onbShell(`<h1 class="onb-q">How much coding do you know?</h1><div class="onb-opts" id="oLvl">${optCards(LEVEL,"level")}</div>`,{say:"Any answer is great. We start easy!",mood:"think",anim:"onb-tilt",ctaOff:!ONB.level,cta:"Done!"});
    onbPick("#oLvl","level");
    $("#onbGo").onclick=onbFinish;
  }
}
/* Two questions, then straight to Home: the recommended course becomes the big "Continue" card there. */
function onbFinish(){
  ONB.course=onbRec();onbSave(true);home();
  try{sfx("complete");if(!ONB_CALM())confetti(60)}catch(e){}
}
function onbSave(done){
  S.profile={...(S.profile||{}),why:ONB.why,level:ONB.level,firstCourse:ONB.course};
  if(ONB.goal)S.settings.goal=+ONB.goal;
  const c=courseById(ONB.course);if(c&&c.units&&!c.extra)S.lastCourse=c.id;
  if(done)S.onboarded=true;save();
}
function onbStart(c){
  onbSave(true);
  const nu=nextUp(c);
  if(nu&&nu.l.steps&&status(c,nu)!=="pro")startLesson(nu.l.id);else coursePage(c.id);
}
function onbSkip(){S.onboarded=true;if(ONB.why||ONB.level){ONB.course=onbRec();onbSave(true)}else save();home()}
function onboarding(){ONB.step=0;rerender=onboarding;try{SFX.stopMusic()}catch(e){}onbRender()}

/* ---- Home wrap: onboarding first, then the Today card ---- */
{const _home=home;home=function(){
  if(needsOnboarding())return onboarding();
  if(!S.onboarded&&((S.done||[]).length||S.xp))S.onboarded=true;   // long-time users: never ask
  const r=_home.apply(this,arguments);
  try{const st=$("#screen>.stack");if(st&&!$("#todayCard")){
    const html=todayCard(),anchor=$("#daily")||(st.querySelector(".continue")||{}).nextElementSibling||st.querySelector(".buddy");
    if(anchor)anchor.insertAdjacentHTML("beforebegin",html);else st.insertAdjacentHTML("afterbegin",html);wireToday()}}catch(e){console.warn(e)}
  return r}}

/* ---- Lesson finish: say so when this lesson reached the daily goal ---- */
{const _finish=finish;finish=function(){XPD.crossed=false;const r=_finish.apply(this,arguments);
  try{if(XPD.crossed){XPD.crossed=false;const card=$("#screen .card");const rw=card&&card.querySelector(".reward");
    if(rw)rw.insertAdjacentHTML("afterend",`<div class="goalhit" role="status"><span>🎯</span><b>Daily goal reached!</b><small>${xpToday()} / ${goalXp()} XP today</small></div>`)}}catch(e){}
  return r}}

/* ---- Settings: daily goal row ---- */
{const _sp=settingsPage;settingsPage=function(){const r=_sp.apply(this,arguments);
  try{const list=$("#screen .setlist");if(list&&!$("#goalSeg")){const g=goalXp();
    list.insertAdjacentHTML("afterbegin",`<div class="setrow"><b>Daily goal <small>XP a day</small></b><div class="seg" role="radiogroup" id="goalSeg" aria-label="Daily goal in XP">${GOALS.map(([v,n])=>`<button role="radio" aria-checked="${v===g}" data-v="${v}" aria-label="${n}: ${v} XP a day">${v}</button>`).join("")}</div></div>`);
    $$("#goalSeg button").forEach(b=>b.onclick=()=>{S.settings.goal=+b.dataset.v;save();settingsPage()})}}catch(e){console.warn(e)}
  return r}}

/* --- 20-delight.js --- */
/* ===== 20-delight: in-lesson combos, haptics, streak milestones, answer micro-animations =====
   Hooks (no edits to src/app.html):
   - every answer: a MutationObserver on #screen sees each new `.feedback` inside `#fb` (good = right, bad/oops = miss).
     The FIRST feedback of a step decides it, so "solved first try / without a miss" is what counts.
   - shell()        wrapped: adds the small 🔥 combo chip to the lesson bar
   - renderStep()   wrapped: starts the combo record (cur.earned.cmb, so it survives leaving and resuming a lesson)
   - finish()       wrapped: perfect-lesson bonus + combo summary on the finish card, haptics
   - bumpStreak()   wrapped: streak milestones (3, 7, 14, 30, 50, 100 days) -> full-screen celebration once per streak run
   - showBadge()    wrapped: heavy haptic when a badge pops
   - settingsPage() wrapped: compact "Vibration" On/Off row under Sounds
   Public: haptic(kind) / window.haptic(kind) with kind "tap" | "success" | "warning" | "heavy" (never throws). */

/* ---------- Haptics: Capacitor Haptics in the app, navigator.vibrate on the web (Android), else nothing ---------- */
const HAPTIC_PAT={tap:8,success:[14,60,22],warning:[24],heavy:[30,40,60]};
let hapticLast=0;
function hapticPlugin(){try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.Haptics||null}catch(e){return null}}
function hapticsAvailable(){try{return !!hapticPlugin()||typeof navigator.vibrate==="function"}catch(e){return false}}
function haptic(kind="tap"){
  try{
    if(S&&S.settings&&S.settings.haptics===false)return false;
    if(kind==="tap"){const now=Date.now();if(now-hapticLast<40)return false;hapticLast=now}
    const H=hapticPlugin();
    if(H){let p;
      if(kind==="success")p=H.notification({type:"SUCCESS"});
      else if(kind==="warning")p=H.notification({type:"WARNING"});
      else p=H.impact({style:kind==="heavy"?"HEAVY":kind==="medium"?"MEDIUM":"LIGHT"});
      if(p&&typeof p.catch==="function")p.catch(()=>{});return true}
    if(typeof navigator.vibrate==="function")return !!navigator.vibrate(HAPTIC_PAT[kind]||HAPTIC_PAT.tap);
  }catch(e){}
  return false;
}
window.haptic=haptic;
/* light tap when a tile, token, line or Jr. block is placed */
document.addEventListener("click",e=>{try{const t=e.target.closest&&e.target.closest("#ttray .tile,#tbuild .tile,.token,.slot.filled,.lines .ln,.palette .blk,.bin,.repadd,.dchip,.chip");if(t&&!t.disabled&&$(".lessonbar"))haptic("tap")}catch(_){}},true);

/* ---------- Combo: "🔥 3 in a row!" inside a lesson ---------- */
const COMBO_TYPES=new Set(["quiz","fill","order","code","bug","maze","dance","sort","box","predict"]);
const COMBO_AT=n=>n===3||n===5||(n>=10&&n%5===0);
const calmNow=()=>{try{return document.documentElement.classList.contains("calm")||matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
function comboRec(){if(!cur||!cur.earned)return null;if(!cur.earned.cmb)cur.earned.cmb={n:0,b:0,m:0,d:[],u:cur.step>0?1:0};return cur.earned.cmb}
window.tmCombo=()=>cur&&cur.earned&&cur.earned.cmb||null;   // for tests and other modules

function comboLine(n){const kid=cur&&cur.c&&cur.c.kids;
  if(n>=10)return kid?"Super coder!":"Unstoppable!";if(n>=5)return kid?"Wow wow wow!":"Amazing!";return kid?"Keep going!":"Nice streak!"}
function comboSound(n){const seq=n>=10?[2,3,4,5,6,7,8]:n>=5?[3,4,5,6,7]:[3,4,5];
  const t0=cur&&cur.c&&cur.c.kids?620:380;   // after the right-answer chime (Jr. plays a longer tada)
  seq.forEach((k,i)=>setTimeout(()=>sfx("ding",k),t0+i*85));}
function comboBanner(n){
  let el=$("#tmCombo");
  if(!el){el=document.createElement("div");el.id="tmCombo";el.className="tm-combo";el.setAttribute("role","status");el.setAttribute("aria-live","polite");document.body.appendChild(el)}
  const lvl=n>=10?3:n>=5?2:1;
  el.className="tm-combo lvl"+lvl;el.innerHTML=`<span class="tc-fire" aria-hidden="true">🔥</span><span class="tc-txt"><b>${n} in a row!</b><small>${comboLine(n)}</small></span>${lvl>1?'<i class="tc-sp s1" aria-hidden="true">✨</i><i class="tc-sp s2" aria-hidden="true">✨</i>':""}`;
  void el.offsetWidth;el.classList.add("show");clearTimeout(el._h);el._h=setTimeout(()=>el.classList.remove("show"),calmNow()?2200:1900);
}
function comboChip(){
  const bar=$(".lessonbar");if(!bar)return;const c=comboRec();let chip=$("#tmChip");
  if(!chip){chip=document.createElement("span");chip.id="tmChip";chip.className="tm-chip";chip.setAttribute("aria-label","Answers in a row");bar.appendChild(chip)}
  const n=c?c.n:0;chip.hidden=n<2;chip.innerHTML=`🔥<b>${n}</b>`;
  const pr=bar.querySelector(".progress");if(pr)pr.classList.toggle("hot",n>=3);
}
function bumpChip(){const chip=$("#tmChip");if(!chip||calmNow())return;chip.classList.remove("bump");void chip.offsetWidth;chip.classList.add("bump")}

/* small motion on the answer itself: a pop on what you got right, a gentle shake on a miss (fills gaps in the motion pack) */
function answerFx(ok){
  if(calmNow())return;
  const sel=ok?".opt.right,.slot.right,#ans .ln.right":".opt.wrong,.slot.wrong,#ans .ln.wrong";
  $$(sel).forEach((el,i)=>{el.classList.remove("tm-pop","tm-shake");void el.offsetWidth;el.style.setProperty("--k",i);el.classList.add(ok?"tm-pop":"tm-shake")});
  const con=$("#out-c");if(con&&cur&&cur.l.steps[cur.step]&&/^(code|bug)$/.test(cur.l.steps[cur.step].type)){con.classList.remove("tm-shine","tm-shake");void con.offsetWidth;con.classList.add(ok?"tm-shine":"tm-shake")}
}

function judge(ok){
  if(!cur||!cur.l||!$(".lessonbar"))return;
  const s=cur.l.steps[cur.step];if(!s||!COMBO_TYPES.has(s.type)||s.sandbox)return;
  const c=comboRec();if(!c)return;
  answerFx(ok);haptic(ok?"success":"warning");
  if(c.d.includes(cur.step))return;              // this step already counted (2nd try, "try with fewer", …)
  if(s.type==="bug"&&!ok)return;                 // Bug Lab asks you to run the broken code first: not a miss
  c.d.push(cur.step);
  if(ok){
    const peek=$("#peek");if(peek&&peek.textContent.trim())return;   // solved with help: fine, but no combo point
    c.n++;c.b=Math.max(c.b,c.n);comboChip();bumpChip();
    if(COMBO_AT(c.n)){comboBanner(c.n);comboSound(c.n);setTimeout(()=>haptic(c.n>=10?"heavy":"success"),cur.c.kids?620:380)}
  }else{c.m++;c.n=0;comboChip();const b=$("#tmCombo");if(b)b.classList.remove("show")}   // quietly back to zero, no message
}
new MutationObserver(muts=>{
  for(const m of muts)for(const n of m.addedNodes){
    if(n.nodeType!==1||!n.classList.contains("feedback")||!n.parentElement||n.parentElement.id!=="fb")continue;
    try{judge(n.classList.contains("good"))}catch(e){}
  }
}).observe($("#screen"),{childList:true,subtree:true});

{const _shell=shell;shell=function(inner){const r=_shell.apply(this,arguments);try{const s=cur&&cur.l&&cur.l.steps[cur.step];if(s&&s.type!=="done")comboChip()}catch(e){}return r}}
{const _rs=renderStep;renderStep=function(){try{comboRec()}catch(e){}return _rs.apply(this,arguments)}}

/* ---------- Lesson complete: perfect lesson + best combo on the existing finish card ---------- */
{const _fin=finish;finish=function(){
  let info=null;
  try{const c=cur&&cur.earned&&cur.earned.cmb;
    if(c){const judged=c.d.length,perfect=!c.u&&judged>=2&&c.m===0;info={perfect,best:c.b,bonus:0,kind:cur.review?"review":cur.daily?"challenge":cur.l.project?"project":"lesson"};
      if(perfect&&!cur.review&&!cur.daily){cur.earned.ban+=5;info.bonus=5}}}catch(e){}
  const r=_fin.apply(this,arguments);
  try{
    if(info&&(info.perfect||info.best>=2)){
      const box=document.createElement("div");box.className="tm-fin";
      box.innerHTML=(info.perfect?`<div class="tm-perfect"><span class="tp-star" aria-hidden="true">⭐</span><span class="tp-t"><b>Perfect ${info.kind}!</b><small>No misses${info.bonus?` · +${info.bonus} 🍌 bonus`:""}</small></span></div>`:"")+
        (info.best>=2?`<div class="tm-best"><span aria-hidden="true">🔥</span> Best combo: <b>${info.best} in a row</b></div>`:"");
      const rw=$("#screen .reward"),h=$("#screen .card h2");
      if(rw)rw.after(box);else if(h)h.after(box);
      if(info.perfect)setTimeout(()=>sfx("badge"),1100);
    }
    const big=info&&info.perfect||!!$("#screen .cert");
    haptic("success");if(big)setTimeout(()=>haptic("heavy"),700);
  }catch(e){}
  return r;
}}

/* ---------- Streak milestones: 3, 7, 14, 30, 50, 100 days in a row ---------- */
const STREAK_MS=[[3,10,"3 days in a row!","You're warming up! 🔥"],[7,25,"7 days in a row!","You're on fire!"],[14,40,"14 days in a row!","Two whole weeks. Unstoppable!"],
  [30,75,"30 days in a row!","A whole month of code. Legendary!"],[50,100,"50 days in a row!","Fifty days! TypeMonkey is amazed."],[100,200,"100 days in a row!","One hundred days! You're a coding legend. 👑"]];
const parseDay=s=>{const [y,m,d]=String(s).split("-").map(Number);return new Date(y,m-1,d)};
function streakRun(){if(!S.lastDay||!S.streak)return null;const d=parseDay(S.lastDay);d.setDate(d.getDate()-(S.streak-1));return dayStr(d)}   // first day of this streak
function msRec(){const run=streakRun();let m=S.streakMs;if(!m||typeof m!=="object"||m.run!==run||!Array.isArray(m.got)){m=S.streakMs={run,got:[]}}return m}
/* first launch with this feature: streaks already reached before don't pop up again */
if(!S.streakMs)S.streakMs={run:streakRun(),got:STREAK_MS.filter(x=>x[0]<=S.streak).map(x=>x[0])};
let msPending=null;
function checkStreakMilestone(){
  const m=msRec();const hit=STREAK_MS.filter(x=>x[0]<=S.streak&&!m.got.includes(x[0]));if(!hit.length)return null;
  hit.forEach(x=>m.got.push(x[0]));const top=hit[hit.length-1];S.bananas+=top[1];   // the caller saves right after bumpStreak()
  msPending=top;setTimeout(showStreakMilestone,1600);return top;
}
function flameSvg(){return `<svg class="tm-flame" viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id="tmfo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB13B"/><stop offset="1" stop-color="#F2541B"/></linearGradient><linearGradient id="tmfi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFC845"/></linearGradient></defs>
  <path fill="url(#tmfo)" d="M50 3C60 27 86 42 86 76c0 25-17 41-36 41S14 101 14 76c0-19 10-30 17-42 2 14 8 21 15 23-3-20 0-36 4-54z"/>
  <path fill="url(#tmfi)" d="M51 50c6 13 19 21 19 39 0 15-9 23-20 23s-20-8-20-23c0-10 6-17 10-23 1 8 5 12 9 13-2-10-1-20 2-29z"/></svg>`}
function showStreakMilestone(){
  if(!msPending)return;
  if($(".celebrate")||document.hidden){setTimeout(showStreakMilestone,700);return}
  const [days,ban,title,line]=msPending;msPending=null;
  const today=new Date(),wk=[];for(let i=6;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);wk.push([d.toLocaleDateString(undefined,{weekday:"narrow"}),i<Math.min(days,7)])}
  const g=document.createElement("div");g.className="celebrate tm-ms";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label",`${days} day streak`);
  g.innerHTML=`<div class="tm-ms-in">
    <div class="tm-ms-stage" aria-hidden="true"><div class="tm-ms-rays"></div><div class="tm-ms-fl">${flameSvg()}<b class="tm-ms-n">${days}</b></div><div class="tm-ms-mk">${monkey("cheer")}</div></div>
    <div class="tm-ms-label">Streak milestone</div><h2>${title}</h2><p>${line}</p>
    <div class="tm-ms-week" aria-hidden="true">${wk.map(([l,on])=>`<span class="${on?"on":""}"><i>${on?"🔥":""}</i>${l}</span>`).join("")}</div>
    <div class="tm-ms-ban">+${ban} 🍌 bonus bananas</div>
    <button class="btn tm-ms-ok" id="msOk">Continue</button></div>`;
  document.body.appendChild(g);
  sfx("badge");setTimeout(()=>sfx("success"),520);haptic("heavy");setTimeout(()=>haptic("success"),600);
  setTimeout(()=>confetti(110),350);
  const ok=g.querySelector("#msOk");try{ok.focus({preventScroll:true})}catch(e){}
  ok.onclick=()=>{g.classList.add("out");setTimeout(()=>{g.remove();if(typeof showBadge==="function")showBadge()},calmNow()?0:220)};
}
window.tmStreakMilestone=checkStreakMilestone;
{const _bs=bumpStreak;bumpStreak=function(){const r=_bs.apply(this,arguments);try{checkStreakMilestone()}catch(e){}return r}}

/* ---------- Badges: a strong buzz when one pops ---------- */
{const _sb=showBadge;showBadge=function(){const had=!!$(".celebrate"),n=badgeQueue.length;const r=_sb.apply(this,arguments);try{if(!had&&n&&$(".celebrate"))haptic("heavy")}catch(e){}return r}}

/* ---------- Settings: Vibration On/Off (only where the device can buzz) ---------- */
{const _sp=settingsPage;settingsPage=function(){const r=_sp.apply(this,arguments);
  try{const snd=$("#sound");if(!snd||!hapticsAvailable()||$("#haptics"))return r;
    const on=S.settings.haptics!==false,row=document.createElement("div");row.className="setrow";
    row.innerHTML=`<b>Vibration</b><div class="seg" role="radiogroup" id="haptics" aria-label="Vibration">${[["on","On"],["off","Off"]].map(([v,l])=>`<button role="radio" aria-checked="${(on?"on":"off")===v}" data-v="${v}">${l}</button>`).join("")}</div>`;
    snd.closest(".setrow").after(row);
    row.querySelectorAll("button").forEach(b=>b.onclick=()=>{S.settings.haptics=b.dataset.v==="on";save();if(S.settings.haptics)haptic("success");settingsPage()});
  }catch(e){}
  return r}}

/* --- 30-map.js --- */
/* ===== Course map v2 (Duolingo-style path) =====
   Runs right after the core coursePage() has drawn the page and dresses it up, so the core page code stays as it is:
   - every unit gets a colorful banner ("UNIT 2", name, 3/5 ring, Free/Pro). The banner sticks to the top while you scroll its unit.
   - a dotted trail joins the lesson circles along the zigzag (green behind you, grey ahead)
   - a treasure chest waits after the last lesson of each unit; finish the unit, tap it, get bananas + XP (once)
   - finished units get a soft golden look
   Hook points: wraps coursePage (global), uses status/flat/S/save/sfx/toast/bananaBurst/calmMotion from the core. */
const MAP_COLORS=["#E8681A","#7357E8","#138A7E","#D9406F","#2C7FD0","#4E9A2E"];
const MAP_JR_COLORS=["#3E9A45","#1E8FCB","#4F82BE","#C2702A","#3B3970","#D9548F"];   // Jungle, Beach, Snowy peaks, Desert, Space, Candy
const CHEST_REWARD={ban:20,xp:10};
const chestKey=(c,u,ui)=>c.id+":"+((u.lessons[0]&&u.lessons[0].id)||ui);
const mapCalm=()=>calmMotion()||document.documentElement.classList.contains("calm");
function unitInfo(c,L,ui){
  const items=L.filter(x=>x.ui===ui&&x.l.steps),u=c.units[ui];
  const done=items.filter(x=>S.done.includes(x.l.id)).length;
  return {u,items,done,total:items.length,complete:items.length>0&&done===items.length,locked:!u.free&&!S.pro};
}
function chestState(c,ui,info){
  if(!info.total)return null;
  if((S.chests||{})[chestKey(c,info.u,ui)])return "opened";
  if(info.locked)return "pro";
  return info.complete?"ready":"locked";
}
function chestSVG(){
  return `<svg class="chest-svg" viewBox="0 0 72 64" aria-hidden="true">
    <ellipse class="cglow" cx="36" cy="26" rx="34" ry="20"/>
    <g class="cloot"><ellipse cx="36" cy="30" rx="27" ry="6" fill="#5A2E0C"/>
      <circle cx="24" cy="27" r="6" fill="#FFD25C" stroke="#C88A10" stroke-width="1.5"/><circle cx="47" cy="27" r="6" fill="#FFD25C" stroke="#C88A10" stroke-width="1.5"/>
      <path d="M28 27c4 6 14 6 18-4 1 5-2 10-9 11s-10-3-9-7z" fill="#FFE14D" stroke="#B88A00" stroke-width="1.5"/><circle cx="36" cy="23" r="5.5" fill="#FFE07A" stroke="#C88A10" stroke-width="1.5"/></g>
    <g class="cbody"><rect x="6" y="28" width="60" height="30" rx="6" fill="#B06A2B" stroke="#6E3D12" stroke-width="2.5"/>
      <rect x="8" y="30" width="56" height="7" rx="3" fill="#C98143" opacity=".7"/>
      <rect x="15" y="28" width="7" height="30" fill="#F2B632" stroke="#9A6A10" stroke-width="1.5"/><rect x="50" y="28" width="7" height="30" fill="#F2B632" stroke="#9A6A10" stroke-width="1.5"/></g>
    <g class="clid"><path d="M6 30V20C6 9 18 4 36 4S66 9 66 20V30Z" fill="#C47A35" stroke="#6E3D12" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M12 15C18 9 26 8 36 8" stroke="#E7A160" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M15 30V12.5" stroke="#F2B632" stroke-width="7"/><path d="M57 30V12.5" stroke="#F2B632" stroke-width="7"/>
      <rect x="28" y="22" width="16" height="16" rx="3.5" fill="#FFD25C" stroke="#9A6A10" stroke-width="2"/>
      <circle cx="36" cy="28.5" r="2.6" fill="#6E3D12"/><rect x="34.8" y="29" width="2.4" height="5" rx="1" fill="#6E3D12"/></g>
  </svg>`;
}
function chestNodeHTML(c,ui,info,k){
  const st=chestState(c,ui,info);if(!st)return "";
  const sub={locked:`Finish all ${info.total} lessons to open`,pro:"Pro",ready:"Tap to open!",opened:`Opened · +${CHEST_REWARD.ban} 🍌`}[st];
  return `<div class="pnode chest ${st}" style="--off:${[0,1,2,1,0,-1,-2,-1][k%8]}">
    <button class="pbtn chestbtn" data-chest="${ui}" aria-label="Treasure chest for unit ${ui+1}${st==="ready"?": tap to open":st==="opened"?" (opened)":" (locked)"}" ${st==="ready"?"":"disabled"}>${chestSVG()}${st==="locked"||st==="pro"?`<span class="clock">🔒</span>`:""}</button>
    <div class="plabel"><b>${st==="opened"?"Treasure found!":"Treasure chest"}</b><span>${sub}</span></div></div>`;
}
function bannerHTML(c,ui,info){
  const W=c.kids?WORLDS[ui%WORLDS.length]:null,p=info.total?info.done/info.total:0;
  const tag=info.u.free?"Free":S.pro?"Unlocked":"🔒 Pro";
  return `<div class="ub-badge">${W?W.emoji:info.complete?"★":ui+1}</div>
    <div class="ub-txt"><span class="ub-eye">Unit ${ui+1}${W?` · ${W.name}`:""} <span class="ub-tag">${tag}</span></span><h3>${esc(info.u.name)}</h3></div>
    <div class="ub-ring${info.complete?" full":""}" style="--p:${p}" aria-label="${info.done} of ${info.total} lessons done"><b>${info.complete?"✓":`${info.done}/${info.total}`}</b></div>`;
}
/* Trail: one curvy dotted segment between each pair of circles, worked out from layout positions (ignores the pop-in animation) */
function drawTrail(path){
  const btns=[...path.querySelectorAll(":scope > .pnode > .pbtn")];let svg=path.querySelector(":scope > svg.trail");
  if(btns.length<2){if(svg)svg.remove();return}
  const W=path.clientWidth,H=path.scrollHeight;if(!W)return;
  const pts=btns.map(b=>{const pn=b.parentElement;let dx=0;try{dx=new DOMMatrixReadOnly(getComputedStyle(pn).transform).m41}catch(e){}
    return {x:pn.offsetLeft+b.offsetLeft+b.offsetWidth/2+dx,y:pn.offsetTop+b.offsetTop+b.offsetHeight/2,done:pn.classList.contains("done")||pn.classList.contains("opened"),shut:/\b(locked|pro)\b/.test(pn.className)}});
  const seg=pts.slice(1).map((b,i)=>{const a=pts[i],m=(b.y-a.y)*.5;
    return `<path class="${a.done&&!b.shut?"on":""}" d="M${a.x.toFixed(1)} ${a.y.toFixed(1)}C${a.x.toFixed(1)} ${(a.y+m).toFixed(1)} ${b.x.toFixed(1)} ${(b.y-m).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}"/>`}).join("");
  if(!svg){svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("class","trail");svg.setAttribute("aria-hidden","true");path.prepend(svg)}
  svg.setAttribute("width",W);svg.setAttribute("height",H);svg.setAttribute("viewBox",`0 0 ${W} ${H}`);svg.innerHTML=seg;
}
let mapRO=null;
function openChest(c,ui,btn){
  const info=unitInfo(c,flat(c),ui),key=chestKey(c,info.u,ui);
  if(chestState(c,ui,info)!=="ready")return;
  S.chests=S.chests&&typeof S.chests==="object"?S.chests:{};
  S.chests[key]=true;S.bananas+=CHEST_REWARD.ban;S.xp+=CHEST_REWARD.xp;save();renderStats();
  const pn=btn.closest(".pnode");btn.disabled=true;
  const finish=()=>{pn.classList.remove("ready","opening");pn.classList.add("opened");
    btn.setAttribute("aria-label",`Treasure chest for unit ${ui+1} (opened)`);
    pn.querySelector(".plabel").innerHTML=`<b>Treasure found!</b><span>Opened · +${CHEST_REWARD.ban} 🍌</span>`;
    const r=btn.getBoundingClientRect(),f=document.createElement("div");f.className="chest-pop";f.setAttribute("aria-hidden","true");
    f.innerHTML=`+${CHEST_REWARD.ban} 🍌 <span>+${CHEST_REWARD.xp} XP</span>`;f.style.left=(r.left+r.width/2)+"px";f.style.top=(r.top)+"px";document.body.appendChild(f);setTimeout(()=>f.remove(),1600);
    if(typeof bananaBurst==="function"){bananaBurst();const bs=document.querySelectorAll("body > .burst"),bx=bs[bs.length-1];if(bx){bx.style.left=(r.left+r.width/2)+"px";bx.style.top=(r.top+r.height/2)+"px"}}
    sfx("complete");setTimeout(()=>sfx("coins"),350);
    toast(`Treasure! +${CHEST_REWARD.ban} 🍌 bananas and +${CHEST_REWARD.xp} XP`);
    const p=pn.closest(".path");if(p)drawTrail(p)};
  if(mapCalm()){finish();return}
  pn.classList.add("opening");sfx("tap");setTimeout(finish,620);
}
function decorateMap(c){
  const L=flat(c),units=[...document.querySelectorAll("#screen .unit")];if(units.length!==c.units.length)return;
  const tb=document.querySelector(".topbar");document.documentElement.style.setProperty("--tbh",(tb?tb.offsetHeight:0)+"px");
  if(mapRO){mapRO.disconnect();mapRO=null}
  units.forEach((el,ui)=>{
    const info=unitInfo(c,L,ui),pal=c.kids?MAP_JR_COLORS:MAP_COLORS;
    el.classList.add("umap");if(info.complete)el.classList.add("ucomplete");if(info.locked)el.classList.add("ulocked");
    el.style.setProperty("--uc",pal[ui%pal.length]);
    const head=el.querySelector(":scope > .unit-head");if(head){head.classList.add("ubanner");head.innerHTML=bannerHTML(c,ui,info)}
    const path=el.querySelector(":scope > .path");if(!path)return;
    const k=path.querySelectorAll(":scope > .pnode").length;
    path.insertAdjacentHTML("beforeend",chestNodeHTML(c,ui,info,k));
    const cb=path.querySelector(".chestbtn");if(cb)cb.onclick=()=>openChest(c,ui,cb);
    drawTrail(path);
  });
  if(typeof ResizeObserver==="function"){let raf=0;mapRO=new ResizeObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>document.querySelectorAll("#screen .path").forEach(drawTrail))});
    document.querySelectorAll("#screen .path").forEach(p=>mapRO.observe(p))}
}
/* The core page places the hopping TypeMonkey while it draws; hold that until the map is dressed so his hop starts from the final positions */
{const core=coursePage,coreWalk=placeWalker;let held=null;
  placeWalker=function(){held=arguments};
  coursePage=function(cid){held=null;const r=core.apply(this,arguments);
    try{const c=courseById(cid);if(c&&c.units)decorateMap(c)}catch(e){console.error("map",e)}
    if(held){const a=held;held=null;coreWalk.apply(this,a)}return r};}

/* --- 40-monkey.js --- */
/* ===== 40-monkey: TypeMonkey grows with you (levels from XP), a livelier mascot, and a Profile page =====
   Everything lives in this IIFE so names never clash with other feature files. Public bits are on window:
   TMLevel (level math + titles), profilePage. Core functions are wrapped chain-safely (call the previous one first). */
(function(){
  /* ---------- Levels: gentle curve, L2 at 50 XP, L3 at 120, ... L30 at 9,570 ---------- */
  const MAX=30;
  const TITLES=["Baby Banana","Banana Sprout","Curious Climber","Loop Swinger","Bug Squasher","Variable Wrangler","Function Friend","Treetop Tinkerer","String Juggler","Code Captain",
    "Array Acrobat","Logic Explorer","Debug Detective","Loop Master","Jungle Engineer","Class Climber","Algorithm Ace","Recursion Ranger","Canopy Coder","Code Wizard",
    "Byte Boss","Data Dynamo","Syntax Sensei","Pixel Pioneer","Jungle Architect","Silverback Coder","Compiler Whisperer","Galaxy Brain","Grand Banana","Banana Legend"];
  /* free shop items at milestone levels (if already owned you get its price in bananas instead) */
  const GIFTS={3:["hat","party"],5:["neck","bowtie"],10:["hat","grad"],15:["hat","headphones"],20:["hat","wizard"],25:["neck","cape"],30:["hat","crown"]};
  const need=L=>{const k=Math.max(0,L-1);return 40*k+10*k*k};
  const bananasFor=L=>10+2*L;
  function info(xp){
    xp=Math.max(0,Math.floor(+xp||0));let L=1;while(L<MAX&&xp>=need(L+1))L++;
    const base=need(L),next=L<MAX?need(L+1):base,span=Math.max(1,next-base);
    return {lvl:L,title:TITLES[L-1],xp,base,next,into:xp-base,span,toGo:Math.max(0,next-xp),pct:L>=MAX?100:Math.min(100,(xp-base)/span*100),max:L>=MAX};
  }
  const slotTable=slot=>({fur:FURS,hat:HATS,eyes:EYES,neck:NECKS,pet:typeof PETS!=="undefined"?PETS:{}})[slot]||{};
  const giftItem=L=>{const g=GIFTS[L];if(!g)return null;const it=slotTable(g[0])[g[1]];return it?{slot:g[0],id:g[1],name:it.name,price:it.price}:null};
  const stage=L=>L>=30?"Legend":L>=20?"Grown-up":L>=10?"Big kid":L>=5?"Little monkey":"Baby";
  window.TMLevel={MAX,TITLES,GIFTS,need,info,bananasFor,giftItem,stage};
  const calm=()=>{try{return !!(S.settings&&S.settings.calm)||matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
  const fmt=n=>Number(n).toLocaleString("en-US");

  /* ---------- Mascot polish: blinking eyes, a curious (not sad) "think" face, a hop when tapped ---------- */
  const _monkey=monkey;
  monkey=function(mood,look){
    let s=_monkey.apply(this,arguments);
    try{
      s=s.replace(/(<circle cx="47" cy="[-\d.]+" r="4\.6"[\s\S]*?<circle cx="74\.6"[^>]*\/>)/,(m)=>{
        if(mood==="think")m=m.replace(/cx="47"/,'cx="48.6"').replace(/cx="73"/,'cx="74.6"').replace(/cx="48\.6" cy="([-\d.]+)" r="1\.5"/,'cx="50.2" cy="$1" r="1.5"').replace(/cx="74\.6" cy="([-\d.]+)" r="1\.5"/,'cx="76.2" cy="$1" r="1.5"');
        return `<g class="tm-eyes" style="animation-delay:${(-Math.random()*5).toFixed(2)}s">${m}</g>`});
      if(mood==="think"){
        s=s.replace('<path d="M52 79 Q60 77 69 80" stroke="#3A1A05" stroke-width="3" fill="none" stroke-linecap="round"/>',
          '<path d="M52 78 Q60 85.5 69 77" stroke="#3A1A05" stroke-width="3.1" fill="none" stroke-linecap="round"/>');
        // raised, curious eyebrows (right one higher), drawn just before the nose
        s=s.replace('<circle cx="56" cy="68"','<path class="tm-brow" d="M39 39.5 Q46 35.5 53 38.5" stroke="#3A1A05" stroke-width="2.6" fill="none" stroke-linecap="round"/><path class="tm-brow" d="M67 35.5 Q74 30 81 34" stroke="#3A1A05" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="56" cy="68"');
      }
    }catch(e){}
    return s;
  };
  const HOPPABLE=".buddy .tm,.mwrap .tm,#brandMonkey .tm,.prof-stage .tm,.stage-monkey .tm,.fin-stage .tm,.lvup-stage .tm";
  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest(".tm");if(!t||!t.matches(HOPPABLE)||t.closest(".shopitem"))return;
    if(calm())return;t.classList.remove("tm-hop");void t.getBoundingClientRect();t.classList.add("tm-hop");
    t.addEventListener("animationend",function f(ev){if(ev.animationName==="tmHop"){t.classList.remove("tm-hop");t.removeEventListener("animationend",f)}});
    if(!t.closest("#brandMonkey"))try{sfx("tap")}catch(_){}
  });

  /* ---------- Top bar: level chip on the mascot; tapping the mascot opens the Profile ---------- */
  const _renderStats=renderStats;
  renderStats=function(){
    _renderStats.apply(this,arguments);
    try{const bm=$("#brandMonkey");if(!bm)return;const I=info(S.xp);
      let chip=bm.querySelector(".tm-lvl");if(!chip){chip=document.createElement("span");chip.className="tm-lvl";chip.setAttribute("aria-hidden","true");bm.appendChild(chip)}
      chip.textContent=I.lvl;chip.classList.toggle("gold",I.lvl>=10);chip.classList.toggle("legend",I.max);
      bm.title=`Level ${I.lvl} · ${I.title}. Tap for your profile`;
      const hb=$("#homeBtn");if(hb)hb.setAttribute("aria-label",`TypeMonkey, level ${I.lvl}. Open your profile`);
    }catch(e){}
  };
  (function wireBrand(){const bm=document.getElementById("brandMonkey");if(!bm)return;
    bm.addEventListener("click",e=>{e.stopPropagation();sfx("tap");profilePage()});
    // keyboard: the brand button itself (Enter/Space) also opens the profile; the "TypeMonkey" word still goes home on a mouse click
    const hb=document.getElementById("homeBtn");if(hb)hb.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();profilePage()}});
  })();

  /* ---------- Save hook: best streak + level-up detection (chain-safe wrapper) ---------- */
  let granting=false,pendingTimer=null;
  const _save=save;
  save=function(){
    try{if(!granting){S.bestStreak=Math.max(+S.bestStreak||0,+S.streak||0);
      const L=info(S.xp).lvl;if(typeof S.mlevel!=="number"||S.mlevel>L)S.mlevel=L;}}catch(e){}
    _save.apply(this,arguments);
    try{if(!granting&&info(S.xp).lvl>S.mlevel)queueLevelUp(1500)}catch(e){}
  };
  function queueLevelUp(ms){clearTimeout(pendingTimer);pendingTimer=setTimeout(tryShow,ms)}
  function tryShow(){
    if(info(S.xp).lvl<=S.mlevel)return;
    if(document.querySelector(".celebrate,.gate")){queueLevelUp(800);return}   // wait for badges / grown-up gate
    showLevelUp();
  }
  function showLevelUp(){
    const from=S.mlevel,I=info(S.xp),to=I.lvl;let ban=0;const gifts=[];
    for(let L=from+1;L<=to;L++){ban+=bananasFor(L);const g=giftItem(L);
      if(g){if(S.owned[g.slot]&&!S.owned[g.slot].includes(g.id)){S.owned[g.slot].push(g.id);gifts.push(g)}else ban+=g.price||0}}
    S.bananas+=ban;S.mlevel=to;granting=true;try{save()}finally{granting=false}
    const gift=gifts[gifts.length-1];
    const g=document.createElement("div");g.className="celebrate lvlup";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label",`Level ${to}: ${I.title}`);
    const sparks=Array.from({length:14},(_,i)=>`<i style="--a:${i*360/14}deg;--r:${80+(i%3)*22}px;--d:${(i%5)*.12}s">${["✨","⭐","🍌","✨","💫"][i%5]}</i>`).join("");
    g.innerHTML=`<div class="card lvup-card">
      <div class="lvup-stage" aria-hidden="true"><div class="rays"></div><div class="lvup-sparks">${sparks}</div>${monkey("cheer")}</div>
      <div class="label">Level up!${to-from>1?` · +${to-from} levels`:""}</div>
      <h2 class="lvup-num">Level ${to}!</h2>
      <div class="lvup-title">${esc(I.title)}</div>
      <p class="muted">${to>=MAX?"You reached the top. TypeMonkey is a true legend, thanks to you!":`TypeMonkey grew a little! ${stage(to)!==stage(from)?`Now a <b>${stage(to)}</b>. `:""}${fmt(I.toGo)} XP to Level ${to+1}.`}</p>
      <div class="lvup-rewards"><span class="pill kid">+${ban} 🍌</span>${gifts.map(x=>`<span class="pill ok">🎁 ${esc(x.name)}</span>`).join("")}</div>
      ${gift?`<div class="lvup-gift"><div class="mini-monkey">${withPet("happy",{...S.look,[gift.slot]:gift.id})}</div><div><b>⭐ Rare reward: ${esc(gift.name)}</b><span>You can only get this by levelling up. Want TypeMonkey to wear it?</span></div></div>`:""}
      <div class="row" style="justify-content:center">${gift?`<button class="btn banana" id="lv-wear">Wear it!</button>`:""}<button class="btn${gift?" ghost":""}" id="lv-ok">${gift?"Later":"Yay!"}</button></div>
    </div>`;
    document.body.appendChild(g);
    try{sfx("complete");setTimeout(()=>sfx("badge"),500)}catch(e){}
    if(!calm())setTimeout(()=>confetti(90),200);
    const close=()=>{g.remove();try{if(typeof rerender==="function"&&rerender===profilePage)profilePage()}catch(e){}if(typeof showBadge==="function")showBadge()};
    g.querySelector("#lv-ok").onclick=close;
    if(gift)g.querySelector("#lv-wear").onclick=()=>{S.look[gift.slot]=gift.id;save();toast(`TypeMonkey is wearing: ${gift.name}`);close()};
    setTimeout(()=>{try{g.querySelector(gift?"#lv-wear":"#lv-ok").focus()}catch(e){}},60);
  }
  // celebrate a level reached while the app was closed (never on a first load: S.mlevel starts at the current level)
  setTimeout(()=>{try{if(typeof S.mlevel!=="number"){S.mlevel=info(S.xp).lvl;S.bestStreak=Math.max(+S.bestStreak||0,+S.streak||0)}else if(info(S.xp).lvl>S.mlevel)queueLevelUp(1200)}catch(e){}},0);

  /* ---------- Home: a slim level card under TypeMonkey's greeting ---------- */
  const levelCard=()=>{const I=info(S.xp);return `<button class="lvcard" id="lvcard" aria-label="Level ${I.lvl}, ${esc(I.title)}. Open your profile">
    <span class="lvnum"><small>LV</small>${I.lvl}</span>
    <span class="lvtext"><b>${esc(I.title)}</b><span class="lvbar"><span style="width:${I.pct}%"></span></span><span class="lvsub">${I.max?"Max level reached!":`${fmt(I.toGo)} XP to Level ${I.lvl+1}`}</span></span>
    <span class="lvgo" aria-hidden="true">Profile ›</span></button>`};
  const _home=home;
  home=function(){
    _home.apply(this,arguments);
    try{if($("#lvcard"))return;const st=$("#screen .stack");if(!st)return;const anchor=st.querySelector(":scope > .buddy");
      const tmp=document.createElement("div");tmp.innerHTML=levelCard();const el=tmp.firstElementChild;
      if(anchor)anchor.after(el);else st.prepend(el);el.onclick=profilePage}catch(e){}
  };

  /* ---------- Profile page ---------- */
  function weekXp(){
    const d=S.xpDays;if(!d||typeof d!=="object")return null;
    const out=[];for(let i=6;i>=0;i--){const t=new Date();t.setHours(12,0,0,0);t.setDate(t.getDate()-i);
      out.push({k:dayStr(t),lab:t.toLocaleDateString("en-US",{weekday:"short"}),full:t.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}),xp:Math.max(0,Math.floor(+d[dayStr(t)]||0)),today:i===0})}
    return out;
  }
  function chart(days){
    const max=Math.max(...days.map(x=>x.xp)),tot=days.reduce((n,x)=>n+x.xp,0);const top=days.findIndex(x=>x.xp===max&&max>0);
    return `<div class="card prof-week"><div class="pw-head"><div><div class="label">This week</div><h3>${fmt(tot)} XP</h3></div><span class="muted">last 7 days</span></div>
      <div class="pw-bars" role="img" aria-label="XP per day, last 7 days: ${days.map(x=>`${x.lab} ${x.xp}`).join(", ")}">${days.map((x,i)=>`<div class="pw-col${x.today?" today":""}" title="${x.full}: ${fmt(x.xp)} XP">
        <span class="pw-val">${(x.today||i===top)&&x.xp?fmt(x.xp):""}</span><span class="pw-bar" style="height:${max?Math.max(x.xp?6:0,x.xp/max*100):0}%"></span><span class="pw-lab">${x.today?"Today":x.lab}</span></div>`).join("")}</div>
      ${max?"":`<p class="muted pw-empty">No XP yet this week. One lesson fills the first bar!</p>`}</div>`;
  }
  function startedCourses(){
    try{return COURSES.filter(c=>c.units&&!c.soon).map(c=>{const [d,n]=countLessons(c);const inProg=flat(c).some(x=>S.progress[x.l.id]);return {c,d,n,go:d>0||inProg}}).filter(x=>x.go).sort((a,b)=>(b.c.id===S.lastCourse)-(a.c.id===S.lastCourse)||b.d/b.n-a.d/a.n)}catch(e){return []}
  }
  function profilePage(){
    try{SFX.stopMusic()}catch(e){}
    const back=rerender===profilePage?home:rerender;rerender=profilePage;try{setMode(false)}catch(e){}
    if(typeof S.mlevel!=="number")S.mlevel=info(S.xp).lvl;
    const I=info(S.xp),list=badgeList(),got=list.filter(b=>S.badges[b.id]).length,best=Math.max(+S.bestStreak||0,S.streak);
    const days=weekXp(),courses=startedCourses();
    const size=Math.round(118+Math.min(I.lvl,MAX)/MAX*38);   // TypeMonkey literally grows on the profile stage
    const nextGift=Object.keys(GIFTS).map(Number).find(L=>L>I.lvl);
    const tile=(icon,val,lab,cls="")=>`<div class="ptile ${cls}"><span class="pt-ic" aria-hidden="true">${icon}</span><b>${val}</b><span>${lab}</span></div>`;
    $("#screen").innerHTML=`<div class="stack prof">
      <div class="row prof-top"><button class="btn ghost sm" id="back">← Back</button><span class="label">Your profile</span></div>
      <section class="card prof-hero">
        <div class="prof-stage" style="--ms:${size}px"><div class="rays" aria-hidden="true"></div>${withPet("happy")}</div>
        <div class="prof-id">
          <span class="prof-lv">Level ${I.lvl} · ${stage(I.lvl)}</span>
          <h1>${esc(I.title)}</h1>
          <div class="prof-bar" role="progressbar" aria-label="XP to next level" aria-valuemin="0" aria-valuemax="${I.span}" aria-valuenow="${I.max?I.span:I.into}"><span style="width:${I.pct}%"></span></div>
          <div class="prof-xp"><span>${I.max?`${fmt(S.xp)} XP`:`${fmt(I.into)} / ${fmt(I.span)} XP`}</span><span>${I.max?"Max level 🏆":`${fmt(I.toGo)} XP to Lv ${I.lvl+1}`}</span></div>
        </div>
      </section>
      <div class="ptiles">
        ${tile("⚡",fmt(S.xp),"Total XP")}
        ${tile("🔥",S.streak,`Day streak`,S.streak?"hot":"")}
        ${tile("🏔️",best,"Best streak")}
        ${tile("📚",S.done.length,"Lessons done")}
        ${tile("🍌",fmt(S.bananas),"Bananas")}
        ${tile("🏆",`${got}<small>/${list.length}</small>`,"Badges")}
      </div>
      ${days?chart(days):""}
      <div class="card prof-road"><div class="pw-head"><div><div class="label">⭐ Rare level rewards</div><h3>${nextGift?`Next gift at Level ${nextGift}`:"Every gift unlocked!"}</h3><p class="muted" style="margin:2px 0 0">Not sold in the shop. The only way to get them is to level up.</p></div></div>
        <div class="road">${Object.keys(GIFTS).map(Number).map(L=>{const gi=giftItem(L);if(!gi)return "";const on=I.lvl>=L;
          return `<div class="road-i ${on?"on":""} ${L===nextGift?"next":""}"><div class="mini-monkey">${withPet("happy",{...S.look,[gi.slot]:gi.id})}</div><b>${esc(gi.name)}</b><span class="pill ${on?"ok":L===nextGift?"go":""}">${on?"✓ Lv "+L:"Lv "+L}</span></div>`}).join("")}</div></div>
      <div class="card prof-courses"><div class="label">Your courses</div>
        ${courses.length?courses.map(x=>`<button class="pcourse" data-c="${x.c.id}"><span class="pc-t"><b>${esc(x.c.name)}</b><span>${x.d} of ${x.n} lessons${x.d===x.n&&x.n?" · complete 🎉":""}</span></span><span class="pc-bar"><span style="width:${x.n?x.d/x.n*100:0}%"></span></span></button>`).join("")
          :`<p class="muted">No courses started yet. Pick one on Home and TypeMonkey starts growing!</p>`}
      </div>
      <div class="pbtns"><button class="tool" id="pshop"><b>🛍️ Shop</b><span>Outfits for TypeMonkey</span></button><button class="tool" id="pbadges"><b>🏆 Badges</b><span>${got} of ${list.length} earned</span></button></div>
    </div>`;
    $("#back").onclick=()=>back();$("#pshop").onclick=()=>shop();$("#pbadges").onclick=badgesPage;
    $$(".pcourse").forEach(b=>b.onclick=()=>coursePage(b.dataset.c));
    try{foot()}catch(e){}window.scrollTo(0,0);
    (window.tmProfileHooks||[]).forEach(f=>{try{f()}catch(e){console.warn(e)}});   // later modules add to the profile here
  }
  window.profilePage=profilePage;
})();

/* --- 50-beginner.js --- */
/* ---------- 50-beginner: help for people who have never coded ----------
   1. Word helper: coding words in lesson text (bold words and inline code like console.log()) get a dotted
      underline. Tap one for a plain-English meaning. Works in every course.
   2. Tap coach: the first few times you meet a demo, a fill-in-the-gap puzzle or a tile puzzle, a bouncing
      hand points at exactly what to tap next (the right piece, then Check / Run, then Continue), with a
      short "do this" line. Wrong piece placed? The hand points at it to take it back. Skipped for people
      who told onboarding "I already code".
   Hooks: renderStep (decorate words, start the coach), wireTiles (remembers the tile plan).
   State: S.coach={demo,fill,tiles} (times shown), S.glossTip (the one-time "tap a word" tip was shown). */

const GLOSS={
  "code":["Code","Instructions for a computer, written in a coding language. Like a recipe the computer follows step by step."],
  "program":["Program","A set of code instructions that does something, like a game or an app."],
  "javascript":["JavaScript","A coding language. It runs inside every web browser, so websites and web games use it."],
  "python":["Python","A coding language that reads almost like English. Used for AI, games, science and more."],
  "console":["The console","The box under your code where the computer shows its answers and messages."],
  "console.log":["console.log( )","JavaScript's way to say “show this message”. Whatever is inside the ( ) appears in the console."],
  "print":["print( )","Python's way to say “show this on the screen”. Whatever is inside the ( ) appears in the output box."],
  "output":["Output","What your code shows when it runs. It appears in the box under the code."],
  "( )":["Parentheses ( )","Round brackets. The thing inside them is what the instruction works with. print(\"hi\") shows hi."],
  "\" \"":["Quotes \" \"","Quotes go around words so the computer knows they're text to show, not instructions to follow."],
  "string":["String","Text, like a word or a sentence. Strings go inside quotes: \"banana\"."],
  "strings":["String","Text, like a word or a sentence. Strings go inside quotes: \"banana\"."],
  "str":["str (string)","Python's name for text, like \"banana\". It goes inside quotes."],
  "variable":["Variable","A box with a name on it. You put something in it, then use the name to get it back later."],
  "const":["const","Makes a new named box (a variable) in JavaScript. A const box keeps the same thing inside."],
  "let":["let","Makes a new named box (a variable) in JavaScript that you can change later."],
  "var":["var","An old way to make a variable. let and const are the modern ways."],
  "value":["Value","The thing stored in a box, like 3, \"banana\" or True."],
  "number":["Number","A number the computer can do math with, like 7 or 3.5. Numbers don't need quotes."],
  "int":["int","A whole number, like 3 or 100. No decimal point."],
  "float":["float","A number with a decimal point, like 3.5."],
  "bool":["bool (true or false)","A value that's only ever yes or no: True or False."],
  "boolean":["Boolean","A value that's only ever yes or no: true or false."],
  "comment":["Comment","A note for people. The computer skips it. Starts with # in Python or // in JavaScript."],
  "#":["# (comment)","In Python, everything after # on a line is a note for people. The computer skips it."],
  "=":["= (equals sign)","Puts a value into a box. snack = \"banana\" puts banana in the box called snack."],
  "==":["== (double equals)","Asks a question: are these two the same? The answer is true or false."],
  "+":["+ (plus)","Adds numbers (2 + 3 is 5). With text, it glues words together (\"Ty\" + \"pe\" is \"Type\")."],
  "operator":["Operator","A symbol that does something with values, like + to add or > to compare."],
  "if":["if","Lets the code make a choice: do this part only if something is true."],
  "else":["else","Goes with if: what to do when the if part is not true."],
  "elif":["elif","Short for “else if”: check another choice when the first if wasn't true."],
  "loop":["Loop","Code that repeats. Instead of writing the same thing 10 times, a loop does it for you."],
  "for":["for","Starts a loop: do something once for each item, or a set number of times."],
  "while":["while","Starts a loop that keeps repeating while something stays true."],
  "function":["Function","A named set of instructions you can use again and again, like a recipe card with a title."],
  "def":["def","Python's word for making a new function (a reusable set of instructions)."],
  "return":["return","Sends an answer back out of a function to whoever used it."],
  "parameter":["Parameter","A named input a function asks for, like the size in “make a pizza of size large”."],
  "argument":["Argument","The actual value you hand to a function when you use it."],
  "list":["List","A box that holds many things in order, like a shopping list: [\"apple\", \"banana\"]."],
  "array":["Array","A box that holds many things in order, like a shopping list: [\"apple\", \"banana\"]."],
  "index":["Index","An item's position in a list. Computers start counting at 0, so the first item is index 0."],
  "dictionary":["Dictionary","A box of labeled values: each label (key) points to a value, like a real dictionary."],
  "key":["Key","The label used to look up a value, like a word you look up in a dictionary."],
  "object":["Object","A bundle of related values with names, like a pet with a name, age and favorite food."],
  "class":["Class","A blueprint for making objects. One Pet class can make lots of different pets."],
  "method":["Method","A function that belongs to something, like a list's append() that adds an item to it."],
  "input":["Input","Information the user types in while the program runs."],
  "error":["Error","The computer couldn't follow an instruction. It's normal! The message gives a clue about what to fix."],
  "bug":["Bug","A mistake in code that makes it do the wrong thing. Fixing it is called debugging."],
  "syntax":["Syntax","The spelling and grammar rules of a coding language."],
  "keyword":["Keyword","A special word the language already knows, like if, for or print."],
  "html":["HTML","The language that builds the parts of a web page: headings, text, pictures and buttons."],
  "css":["CSS","The language that styles a web page: colors, sizes and layout."],
  "tag":["Tag","An HTML label in angle brackets, like <h1>, that tells the browser what something is."],
  "sql":["SQL","A language for asking questions to a database, like “show me every player with over 100 points”."],
  "query":["Query","A question you ask a database with SQL."],
  "table":["Table","Data in rows and columns, like a spreadsheet."],
  "database":["Database","An organized place that stores lots of information, made of tables."],
  "run":["Run","Tell the computer to follow your code now. Press ▶ Run to see what it does."]
};
function glossKey(t){
  let k=String(t||"").replace(/\s+/g," ").trim().toLowerCase();
  if(GLOSS[k])return k;
  const n=k.replace(/\(\s*[^)]*\)\s*;?$/,"").replace(/[;:,.!]+$/,"").trim();
  if(GLOSS[n])return n;
  if(n.endsWith("s")&&GLOSS[n.slice(0,-1)])return n.slice(0,-1);
  return null;
}
function glossDecorate(){
  const els=$$("#screen .card p b, #screen .card p code.i, #screen .card li b, #screen .card li code.i, #screen .card h2 code.i");
  let any=false;
  for(const el of els){if(el.classList.contains("term")||el.closest("button"))continue;
    const k=glossKey(el.textContent);if(!k)continue;
    el.classList.add("term");el.dataset.term=k;el.setAttribute("role","button");el.tabIndex=0;el.setAttribute("aria-label",`${el.textContent}: what does this mean?`);
    el.onclick=e=>{e.stopPropagation();glossShow(el)};el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();glossShow(el)}};any=true}
  if(any&&!S.glossTip&&!(S.profile&&S.profile.level==="code")){
    const card=$("#screen .card");if(card&&!card.querySelector(".gloss-tip")){
      const tip=document.createElement("p");tip.className="gloss-tip";tip.innerHTML=`💬 New word? Tap any <span class="term-demo">underlined word</span> to see what it means.`;
      const h=card.querySelector("h2");(h||card.firstChild)&&card.insertBefore(tip,h?h.nextSibling:card.firstChild);
      S.glossTip=true;save()}}
}
function glossClose(){const p=$("#glossPop");if(p)p.remove();document.removeEventListener("pointerdown",glossOutside,true)}
function glossOutside(e){const p=$("#glossPop");if(p&&!p.contains(e.target)&&!e.target.classList.contains("term"))glossClose()}
function glossShow(el){
  glossClose();const [title,text]=GLOSS[el.dataset.term]||[];if(!title)return;
  try{sfx("tap")}catch(e){}
  const p=document.createElement("div");p.id="glossPop";p.className="gloss-pop";p.setAttribute("role","dialog");p.setAttribute("aria-label",title);
  p.innerHTML=`<div class="gp-head"><b>${esc(title)}</b><button class="x" aria-label="Close">×</button></div><p>${esc(text)}</p>`;
  document.body.appendChild(p);glossY=scrollY;
  const r=el.getBoundingClientRect(),W=innerWidth,pw=Math.min(320,W-24);p.style.width=pw+"px";
  const left=Math.max(12,Math.min(W-pw-12,r.left+r.width/2-pw/2));p.style.left=left+"px";
  const h=p.offsetHeight,below=r.bottom+10+h<innerHeight-8;
  p.style.top=(below?r.bottom+10:Math.max(8,r.top-10-h))+"px";p.classList.add(below?"below":"above");
  p.style.setProperty("--ax",Math.max(16,Math.min(pw-16,r.left+r.width/2-left))+"px");
  p.querySelector(".x").onclick=glossClose;
  setTimeout(()=>document.addEventListener("pointerdown",glossOutside,true),0);
}
let glossY=0;addEventListener("scroll",()=>{if($("#glossPop")&&Math.abs(scrollY-glossY)>40)glossClose()},{passive:true});

/* ---- Tap coach ---- */
const COACH_TIMES=3;
const COACH={on:false,kind:null,s:null,hand:null,raf:0,ran:false,lastMsg:""};
let TILE_PLAN=null;
{const _wt=wireTiles;wireTiles=function(s,p){TILE_PLAN=p;return _wt.apply(this,arguments)}}
const coachWanted=kind=>{if(S.profile&&S.profile.level==="code")return false;if(cur&&(cur.review||cur.daily))return false;
  const C=S.coach=S.coach&&typeof S.coach==="object"?S.coach:{};return (C[kind]||0)<COACH_TIMES};
const visible=el=>{if(!el||el.hidden||el.disabled)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=="hidden"};
const txt=el=>(el.textContent||"").trim();
function coachStop(){COACH.on=false;cancelAnimationFrame(COACH.raf);if(COACH.hand)COACH.hand.remove();COACH.hand=null;$$(".coach-glow").forEach(e=>e.classList.remove("coach-glow"))}
function coachTarget(){
  const s=COACH.s;
  if(COACH.kind==="demo"){
    if(!COACH.ran&&visible($("#trund")))return [$("#trund"),"Tap ▶ Run to see what this code does"];
    return [$("#go"),"Now tap Continue"];
  }
  if(COACH.kind==="fill"){
    if(visible($("#go")))return [$("#go"),"Great job! Tap Continue"];
    const slots=$$(".slot");
    const wrong=slots.find(b=>b.classList.contains("filled")&&!b.classList.contains("right")&&txt(b)!==s.blanks[+b.dataset.s]);
    if(wrong)return [wrong,"Oops! Tap this piece to take it back"];
    const empty=slots.find(b=>!b.classList.contains("filled"));
    if(empty){const want=s.blanks[+empty.dataset.s];const tok=$$(".token").find(b=>!b.disabled&&txt(b)===want);
      if(tok)return [tok,`Tap <b>${esc(want)}</b> to drop it into the gap`]}
    return [$("#check"),"All filled in! Tap Check"];
  }
  if(COACH.kind==="tiles"){
    const p=TILE_PLAN;if(!p||!$("#screen").classList.contains("tapmode"))return [null,""];
    if(visible($("#go"))&&!$("#go").disabled)return [$("#go"),"You did it! Tap Continue"];
    const placed=$$("#tbuild .tile.on"),want=p.pieces.map(x=>x.trim());
    for(let k=0;k<placed.length;k++)if(txt(placed[k])!==want[k])return [placed[k],"Oops! Tap this one to take it back"];
    if(placed.length<want.length){const t=$$("#ttray .tile").find(b=>txt(b)===want[placed.length]);
      if(t)return [t,placed.length?"Now tap this piece next":`These are puzzle pieces of code. Tap this one first`]}
    const run=[$("#trun"),$("#run-c")].find(visible);
    return [run,"All pieces in place! Tap ▶ Run to try your code"];
  }
  return [null,""];
}
function coachTick(){
  if(!COACH.on)return;
  if(!COACH.hand||!COACH.card||!COACH.card.isConnected){coachStop();return}
  const [el,msg]=coachTarget();
  $$(".coach-glow").forEach(e=>{if(e!==el)e.classList.remove("coach-glow")});
  if(el&&visible(el)){
    el.classList.add("coach-glow");
    const r=el.getBoundingClientRect(),H=COACH.hand;H.hidden=false;
    const x=Math.min(innerWidth-40,Math.max(4,r.right-Math.min(34,r.width/2))),y=Math.min(innerHeight-40,r.bottom-20);
    H.style.transform=`translate(${x}px,${y}px)`;
    if(msg!==COACH.lastMsg){COACH.lastMsg=msg;const t=$("#screen .card .todo span");if(t)t.innerHTML="👉 "+msg;}
  }else if(COACH.hand)COACH.hand.hidden=true;
  COACH.raf=requestAnimationFrame(coachTick);
}
function coachStart(kind,s){
  coachStop();if(!coachWanted(kind))return;
  S.coach[kind]=(S.coach[kind]||0)+1;save();
  Object.assign(COACH,{on:true,kind,s,ran:false,lastMsg:""});
  const H=document.createElement("div");H.className="coach-hand";H.setAttribute("aria-hidden","true");H.hidden=true;
  H.innerHTML=`<span class="ch-f">👆</span>`;
  document.body.appendChild(H);COACH.hand=H;COACH.card=$("#screen .card");
  if(kind==="demo"){const b=$("#trund");if(b)b.addEventListener("click",()=>{COACH.ran=true},{once:true})}
  COACH.raf=requestAnimationFrame(coachTick);
}

{const _rs=renderStep;renderStep=function(){
  coachStop();glossClose();TILE_PLAN=null;
  const r=_rs.apply(this,arguments);
  try{const s=cur&&cur.l&&cur.l.steps[cur.step];
    glossDecorate();
    if(s&&!(cur.c&&cur.c.kids)){
      if(s.type==="talk"&&s.demo&&cur.c.runnable&&$("#trund"))coachStart("demo",s);
      else if(s.type==="fill"&&!s.auto)coachStart("fill",s);
      else if(s.type==="code"&&TILE_PLAN&&$("#screen").classList.contains("tapmode"))coachStart("tiles",s);
    }}catch(e){console.warn(e)}
  return r}}

/* --- 60-safekeep.js --- */
/* ---------- 60-safekeep: a second copy of progress on the device (iPhone/iPad app only) ----------
   iOS treats a web view's localStorage as "best effort": the system may clear it. Losing a long streak is the thing
   players of streak apps get angriest about, so every save is also written to the app's own settings storage
   (UserDefaults, via the TMCloud plugin's localGet/localSet). At launch, if that copy is newer than what the web view
   has (for example the web view's storage was wiped), it is merged back in with mergeState() (newest wins, and a
   newer "Erase everything" still wins). Does nothing on the web. */
const Safe={
  KEY:"progress",timer:null,last:null,s:null,
  plugin(){try{const C=window.Capacitor,P=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.TMCloud;return P&&P.localSet?P:null}catch(e){return null}},
  write(){const P=Safe.plugin();if(!P)return;clearTimeout(Safe.timer);Safe.timer=null;
    try{const v=JSON.stringify(S);if(v===Safe.last)return;Safe.last=v;P.localSet({key:Safe.KEY,value:v}).catch(()=>{})}catch(e){}},
  queue(){if(!Safe.plugin())return;
    if(S!==Safe.s){Safe.s=S;Safe.write();return}          // a whole new state (erase, restore, sync): write right away
    clearTimeout(Safe.timer);Safe.timer=setTimeout(Safe.write,1200)},
  async restore(){const P=Safe.plugin();if(!P)return;
    try{const r=await P.localGet({key:Safe.KEY});if(!r||!r.value)return Safe.write();
      const got=JSON.parse(r.value);if(!got||typeof got!=="object")return;
      if((+got.savedAt||0)<=(+S.savedAt||0)+1000)return Safe.write();
      S=mergeState(S,normState({...got,settings:{...(got.settings||{}),...(S.savedAt?S.settings:{})}}));
      try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
      Safe.s=S;renderStats();
      if($("#onb")&&S.onboarded)home();else if(!$("#quit")&&typeof rerender==="function")rerender();
      Safe.write();
    }catch(e){}}
};
{const _save=save;save=function(){const r=_save.apply(this,arguments);try{Safe.queue()}catch(e){}return r}}
document.addEventListener("visibilitychange",()=>{if(document.hidden&&Safe.timer)Safe.write()});
Safe.s=S;setTimeout(()=>Safe.restore(),300);

/* --- 70-streak.js --- */
/* ---------- 70-streak: a forgiving streak ----------
   Duolingo's published streak experiments show that a streak which is easy to keep and hard to lose keeps people
   coming back. So:
   - Banana Freezes 🧊: hold up to 2. If you miss a day, one is used automatically and your streak is kept. Everyone
     starts with 1; more cost bananas in the Shop.
   - A short "🔥 N day streak!" celebration after the first lesson of each day (milestone days keep their big one).
   - Missed days the freeze covered show as 🧊 in the week strip.
   - Lost a streak anyway? A kind welcome-back (your best streak is never lost) instead of a scolding.
   Hooks: bumpStreak (daily celebration), home (freeze/welcome notices, 🧊 chip and frozen days), shop (Freeze card),
   goalSheet (explains freezes). State: S.freezes, S.frozen=[days], S.freezeNote, S.lostStreak. */
const FREEZE_MAX=2,FREEZE_PRICE=60;
if(typeof S.freezes!=="number")S.freezes=1;
if(!Array.isArray(S.frozen))S.frozen=[];
function dayDiff(a,b){return Math.round((parseDay(b)-parseDay(a))/864e5)}
function applyFreezes(){
  if(!S.streak||!S.lastDay)return;
  const now=new Date(),today=dayStr(now),y=dayStr(new Date(now.getFullYear(),now.getMonth(),now.getDate()-1));
  if(S.lastDay===today||S.lastDay===y)return;
  const missed=dayDiff(S.lastDay,today)-1;if(missed<1)return;
  if(missed<=(S.freezes||0)){
    const L=parseDay(S.lastDay);
    for(let i=1;i<=missed;i++)S.frozen.push(dayStr(new Date(L.getFullYear(),L.getMonth(),L.getDate()+i)));
    S.frozen=S.frozen.slice(-30);S.freezes-=missed;S.lastDay=y;
    try{if(S.streakMs&&typeof streakRun==="function")S.streakMs.run=streakRun()}catch(e){}   // same streak: milestones already won stay won
    S.freezeNote={used:missed,streak:S.streak,day:today};save();
  }else if(!S.lostStreak||S.lostStreak.day!==S.lastDay){
    S.lostStreak={n:S.streak,day:S.lastDay,shown:false};save();
  }
}
applyFreezes();
document.addEventListener("visibilitychange",()=>{if(!document.hidden){const b=S.freezeNote;applyFreezes();if(S.freezeNote!==b&&typeof rerender==="function"&&rerender===home)home()}});

/* ---- little overlays (reuse the milestone look) ---- */
function streakCard({label,title,line,days,extra="",mood="cheer",big=false}){
  if($(".celebrate")||document.hidden){setTimeout(()=>streakCard(...arguments),700);return}
  const now=new Date(),dow=(now.getDay()+6)%7,P=typeof practicedDays==="function"?practicedDays():new Set(),FZ=new Set(S.frozen||[]);
  const wk=[...Array(7)].map((_,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-dow+i),k=dayStr(d);
    return [["M","T","W","T","F","S","S"][i],FZ.has(k)?"fz":P.has(k)?"on":"",i===dow]});
  const g=document.createElement("div");g.className="celebrate tm-ms tm-day";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label",title);
  g.innerHTML=`<div class="tm-ms-in">
    <div class="tm-ms-stage" aria-hidden="true">${big?`<div class="tm-ms-rays"></div>`:""}<div class="tm-ms-fl">${label==="Banana Freeze"?`<span class="tm-ice">🧊</span>`:flameSvg()}${days!=null?`<b class="tm-ms-n">${days}</b>`:""}</div><div class="tm-ms-mk">${monkey(mood)}</div></div>
    <div class="tm-ms-label">${label}</div><h2>${title}</h2><p>${line}</p>
    <div class="tm-ms-week" aria-hidden="true">${wk.map(([l,k,t])=>`<span class="${k==="on"?"on":""} ${k==="fz"?"fz":""} ${t?"now":""}"><i>${k==="on"?"🔥":k==="fz"?"🧊":""}</i>${l}</span>`).join("")}</div>
    ${extra}<button class="btn tm-ms-ok" id="dsOk">Continue</button></div>`;
  document.body.appendChild(g);
  try{sfx(label==="Banana Freeze"?"hint":"success");haptic("success")}catch(e){}
  const ok=g.querySelector("#dsOk");try{ok.focus({preventScroll:true})}catch(e){}
  ok.onclick=()=>{g.classList.add("out");setTimeout(()=>{g.remove();if(typeof showBadge==="function")showBadge()},calmNow()?0:220)};
}
const DAY_LINES=["One lesson a day keeps the bananas coming!","TypeMonkey is doing a happy dance.","Come back tomorrow to keep it going!","Your coding brain is growing!","Little steps every day add up."];

/* first lesson of the day: celebrate the streak (unless a milestone celebration is already coming) */
{const _bs=bumpStreak;bumpStreak=function(){
  const before=S.lastDay;const r=_bs.apply(this,arguments);
  try{if(S.lastDay!==before&&!msPending&&!(cur&&cur.review)){const n=S.streak;
    setTimeout(()=>streakCard({label:"Daily streak",title:n===1?"You started a streak!":`${n} day streak!`,
      line:n===1?"Do a lesson tomorrow to make it 2. 🔥":DAY_LINES[n%DAY_LINES.length],days:n,mood:"cheer"}),1700)}}catch(e){}
  return r}}

/* ---- Home: notices, the 🧊 chip and frozen days in the week strip ---- */
{const _home=home;home=function(){const r=_home.apply(this,arguments);
  try{
    const card=$("#todayCard");
    if(card){
      const head=card.querySelector(".thead b");if(head&&!card.querySelector(".fzchip"))head.insertAdjacentHTML("beforeend",`<span class="fzchip" title="Banana Freezes">🧊 ${S.freezes||0}</span>`);
      const now=new Date(),dow=(now.getDay()+6)%7,FZ=new Set(S.frozen||[]);
      card.querySelectorAll(".week .wd").forEach((el,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-dow+i);
        if(FZ.has(dayStr(d))){el.classList.add("fz");const ic=el.querySelector("i");if(ic)ic.textContent="🧊"}});
    }
    const N=S.freezeNote;
    if(N&&N.day===dayStr(new Date())&&!N.shown){N.shown=true;save();
      setTimeout(()=>streakCard({label:"Banana Freeze",title:"Your streak is safe!",
        line:`You missed ${N.used===1?"a day":N.used+" days"}, so ${N.used===1?"a Banana Freeze was":"Banana Freezes were"} used. Your ${N.streak}-day streak is still going!`,
        days:null,mood:"happy",extra:`<div class="tm-ms-ban">🧊 ${S.freezes||0} left · get more in the Shop</div>`}),500)}
    const L=S.lostStreak;
    if(L&&!L.shown&&L.n>=2&&S.lastDay===L.day){L.shown=true;save();
      setTimeout(()=>{toast(`Welcome back! 🐵 Your best streak is still ${Math.max(S.bestStreak||0,L.n)} days. Do a lesson to start a new one!`)},600)}
  }catch(e){console.warn(e)}
  return r}}

/* ---- Shop: Banana Freeze card ---- */
{const _shop=shop;shop=function(){const r=_shop.apply(this,arguments);
  try{const stage=$(".shopstage");if(stage&&!$("#fzcard")){
    const n=S.freezes||0,full=n>=FREEZE_MAX,can=S.bananas>=FREEZE_PRICE;
    stage.insertAdjacentHTML("afterend",`<div class="fzcard" id="fzcard"><span class="fz-ic" aria-hidden="true">🧊</span>
      <div class="fz-t"><b>Banana Freeze</b><span>Miss a day and keep your streak. Used automatically. You have ${n} of ${FREEZE_MAX}.</span></div>
      <button class="btn banana sm" id="fzbuy" ${full||!can?"disabled":""}>${full?"Full":`🍌 ${FREEZE_PRICE}`}</button></div>`);
    $("#fzbuy").onclick=()=>{if((S.freezes||0)>=FREEZE_MAX||S.bananas<FREEZE_PRICE)return;S.bananas-=FREEZE_PRICE;S.freezes=(S.freezes||0)+1;
      try{sfx("coins");haptic("success")}catch(e){}save();toast(`🧊 Banana Freeze ready! You have ${S.freezes}.`);shop.apply(this,arguments)};
  }}catch(e){console.warn(e)}
  return r}}

/* ---- Daily goal sheet: explain freezes ---- */
if(typeof goalSheet==="function"){const _gs=goalSheet;goalSheet=function(){const r=_gs.apply(this,arguments);
  try{const c=$(".onb-sheet .card");if(c&&!c.querySelector(".fznote"))c.insertAdjacentHTML("beforeend",`<p class="fznote">🧊 <b>Banana Freezes: ${S.freezes||0}</b>. Miss a day and one is used automatically, so your streak stays. Get more in the Shop.</p>`)}catch(e){}
  return r}}

/* --- 75-review.js --- */
/* ---------- 75-review: Apple's own rating prompt, only after a happy moment ----------
   Apple's rules: use the system prompt only (no custom "rate us" screens), and iOS shows it at most 3 times a year.
   Best practice: ask after a success, never at launch, mid-task, in the kids section or right after a purchase.
   TypeMonkey asks after finishing the 5th, 15th and 40th lesson (and after a 7- or 30-day streak), at most once every
   3 weeks and 3 times a year, once any celebration on screen has closed. Native app only (TMCloud.requestReview).
   State: S.reviewAsks=[timestamps]. */
const Review={
  plugin(){try{const C=window.Capacitor,P=C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.TMCloud;return P&&P.requestReview?P:null}catch(e){return null}},
  okNow(){
    const now=Date.now(),A=(S.reviewAsks||[]).filter(t=>now-t<365*864e5);
    if(A.length>=3)return false;if(A.length&&now-Math.max(...A)<21*864e5)return false;
    if(S.boughtAt&&now-S.boughtAt<2*864e5)return false;
    return true},
  ask(){if(!Review.plugin()||!Review.okNow())return false;
    let tries=0;const go=()=>{if(++tries>40)return;if($(".celebrate")||document.hidden||($("#quit")&&!$("#screen .reward"))){setTimeout(go,1500);return}
      S.reviewAsks=[...(S.reviewAsks||[]).filter(t=>Date.now()-t<365*864e5),Date.now()];save();
      try{Review.plugin().requestReview().catch(()=>{})}catch(e){}};
    setTimeout(go,2500);return true}
};
const REVIEW_AT=[5,15,40];
{const _fin=finish;finish=function(){
  const kid=!!(cur&&cur.c&&cur.c.kids),special=!!(cur&&(cur.daily||cur.review)),before=(S.done||[]).length;
  const r=_fin.apply(this,arguments);
  try{const n=(S.done||[]).length;
    if(!kid&&!special&&n>before&&REVIEW_AT.includes(n))Review.ask();
    else if(!kid&&!special&&(S.streak===7||S.streak===30)&&S.lastDay===dayStr(new Date())&&!(S.reviewStreaks||[]).includes(S.streak)){
      S.reviewStreaks=[...(S.reviewStreaks||[]),S.streak];if(Review.ask())save()}
  }catch(e){}
  return r}}
/* remember when the full version was bought, so we never ask right after paying */
{const _u=unlockFull;unlockFull=function(after){return _u.call(this,function(){try{S.boughtAt=Date.now();save()}catch(e){}if(after)return after.apply(this,arguments)})}}

/* --- 80-syntax.js --- */
/* ---------- 80-syntax: code that looks like real code ----------
   - Syntax colors (keywords, text in quotes, numbers, comments, function names) on code tiles, the line you are
     building, read-only code examples and quiz code. The editor box itself stays plain (it's a text field).
   - After a run that doesn't pass in tap mode, the first tile that's out of place wiggles with a red outline, so you
     can see exactly what to fix (Grasshopper-style), instead of just "not quite".
   Purely visual: the text of every tile stays exactly the same. */
const SYN_KW=new Set(("if else elif for while do return function def class const let var new this self import from as in of not and or is "+
  "True False None true false null undefined print try catch except finally raise throw break continue switch case default "+
  "public private static void int float double bool boolean string String char long using namespace struct func guard "+
  "SELECT FROM WHERE ORDER BY GROUP JOIN ON AS INSERT INTO VALUES UPDATE SET DELETE LIMIT DESC ASC COUNT SUM AVG AND OR NOT LEFT HAVING DISTINCT "+
  "lambda with yield async await interface extends implements override virtual auto std cout cin endl include println Console WriteLine").split(" "));
function synHTML(src){
  const re=/(#(?![a-z]*include)[^\n]*|\/\/[^\n]*|--\s[^\n]*)|("(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|`[^`]*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;
  let out="",i=0,m;
  while((m=re.exec(src))){out+=esc(src.slice(i,m.index));const t=esc(m[0]);
    if(m[1])out+=`<span class="sy-c">${t}</span>`;
    else if(m[2])out+=`<span class="sy-s">${t}</span>`;
    else if(m[3])out+=`<span class="sy-n">${t}</span>`;
    else if(m[4])out+=SYN_KW.has(m[4])?`<span class="sy-k">${t}</span>`:`<span class="sy-f">${t}</span>`;
    else out+=SYN_KW.has(m[5])?`<span class="sy-k">${t}</span>`:t;
    i=m.index+m[0].length}
  return out+esc(src.slice(i));
}
function synPaint(root){
  if(!root)return;
  const lang=(cur&&cur.c&&kindOf(cur.c))||"";if(lang==="web"||(cur&&cur.c&&cur.c.kids))return;   // HTML/CSS and Jr. blocks: leave as they are
  root.querySelectorAll(".tile:not([data-sy]),.editor pre:not([data-sy]):not(#fcode)").forEach(el=>{
    if(el.children.length)return;const t=el.textContent;if(!t.trim())return;
    el.innerHTML=synHTML(t);el.dataset.sy="1"});
}
const synObs=new MutationObserver(()=>{try{synPaint($("#screen"));synPaint($(".actionbar"))}catch(e){}});
try{synObs.observe(document.getElementById("screen"),{childList:true,subtree:true})}catch(e){}

/* wrong tile after a run that didn't pass */
const wrongObs=new MutationObserver(()=>{try{
  const fb=$("#fb .feedback.bad");if(!fb||fb.dataset.tw)return;fb.dataset.tw="1";
  if(!$("#screen").classList.contains("tapmode")||typeof TILE_PLAN==="undefined"||!TILE_PLAN)return;
  const want=TILE_PLAN.pieces.map(x=>x.trim()),placed=$$("#tbuild .tile.on");
  const k=placed.findIndex((el,i)=>el.textContent.trim()!==want[i]);
  if(k<0)return;const el=placed[k];el.classList.remove("tilewrong");void el.offsetWidth;el.classList.add("tilewrong");
  setTimeout(()=>{try{el.classList.remove("tilewrong")}catch(e){}},2600);
  try{haptic("warning")}catch(e){}
}catch(e){}});
try{wrongObs.observe(document.getElementById("screen"),{childList:true,subtree:true})}catch(e){}

/* --- 85-quests.js --- */
/* ---------- 85-quests: three small daily quests ----------
   A fresh set of 3 every day (the same 3 all day), shown on Home under the Today card. Each one done gives
   +10 bananas; all three done gives a +25 banana bonus and a little celebration. Everything is counted on the
   device. Hooks: finish, dailyDone, answered, Run buttons, home. State: S.quests={day,p:{lessons,right,runs},done:[],all}. */
const QUESTS={
  lesson1:{t:"Finish a lesson",n:1,get:p=>p.lessons},
  lesson2:{t:"Finish 2 lessons",n:2,get:p=>p.lessons},
  xp30:{t:"Earn 30 XP",n:30,get:()=>xpToday()},
  xp60:{t:"Earn 60 XP",n:60,get:()=>xpToday()},
  right8:{t:"Get 8 answers right",n:8,get:p=>p.right},
  right15:{t:"Get 15 answers right",n:15,get:p=>p.right},
  runs3:{t:"Run your code 3 times",n:3,get:p=>p.runs},
  daily:{t:"Do the daily challenge",n:1,get:()=>dailyDoneToday()?1:0}
};
const QUEST_ICON={lesson1:"📘",lesson2:"📚",xp30:"⚡",xp60:"⚡",right8:"💡",right15:"💡",runs3:"▶️",daily:"🎯"};
const QUEST_BAN=10,QUEST_ALL=25;
function questDay(){
  const t=dayStr(new Date());let Q=S.quests;
  if(!Q||Q.day!==t){
    const [y,m,d]=t.split("-").map(Number),seed=y*372+m*31+d,pick=(a,k)=>a[(seed*(k+7)+k)%a.length];
    const kid=!!(S.profile&&S.profile.why==="kid");
    const ids=[pick(["lesson1","lesson1","lesson2"],1),pick(kid?["right8","xp30"]:["xp30","right8","xp60","right15"],2),pick(kid?["daily","right8"]:["runs3","daily"],3)];
    if(ids[1]===ids[2])ids[2]="daily";
    Q=S.quests={day:t,ids,p:{lessons:0,right:0,runs:0},done:[],all:false};
  }
  return Q;
}
function questCheck(quiet){
  const Q=questDay();let got=[];
  for(const id of Q.ids){const q=QUESTS[id];if(!q||Q.done.includes(id))continue;if(q.get(Q.p)>=q.n){Q.done.push(id);got.push(id)}}
  if(!got.length)return;
  S.bananas+=QUEST_BAN*got.length;
  const all=!Q.all&&Q.done.length>=Q.ids.length;if(all){Q.all=true;S.bananas+=QUEST_ALL}
  save();renderStats();
  if(quiet)return;
  setTimeout(()=>{try{
    if(all){toast(`🏆 All 3 daily quests done! +${QUEST_ALL} bonus bananas`);sfx("badge");haptic("success");if(!calmNow())confetti(60)}
    else{toast(`✅ Quest done: ${QUESTS[got[0]].t} · +${QUEST_BAN} 🍌`);sfx("coins")}
  }catch(e){}},1200);
}
function questCard(){
  const Q=questDay();
  const rows=Q.ids.map(id=>{const q=QUESTS[id];if(!q)return "";const v=Math.min(q.n,q.get(Q.p)),done=Q.done.includes(id);
    return `<div class="qrow ${done?"done":""}"><span class="qic" aria-hidden="true">${done?"✔️":QUEST_ICON[id]||"⭐"}</span>
      <span class="qt"><b>${q.t}</b><span class="qbar"><i style="width:${Math.round(v/q.n*100)}%"></i></span></span>
      <span class="qn">${done?`+${QUEST_BAN} 🍌`:`${v}/${q.n}`}</span></div>`}).join("");
  return `<section class="card quests" id="quests" aria-label="Daily quests"><div class="qhead"><div><div class="label">Daily quests</div><h3>${Q.all?"All done! 🏆":`${Q.done.length} of 3 done`}</h3></div>
    <span class="qbonus ${Q.all?"got":""}" title="Bonus for all three">🎁 +${QUEST_ALL}</span></div>${rows}</section>`;
}
{const _fin=finish;finish=function(){const counts=!!(cur&&!cur.daily);const r=_fin.apply(this,arguments);
  try{if(counts){questDay().p.lessons++;questCheck()}}catch(e){}return r}}
{const _dd=dailyDone;dailyDone=function(){const r=_dd.apply(this,arguments);try{questCheck()}catch(e){}return r}}
{const _an=answered;answered=function(ok){const r=_an.apply(this,arguments);try{if(ok){questDay().p.right++;questCheck()}}catch(e){}return r}}
document.addEventListener("click",e=>{try{const b=e.target.closest&&e.target.closest("button.run,#trun,#trund");if(!b||!$("#quit"))return;
  questDay().p.runs++;setTimeout(()=>questCheck(),900)}catch(_){}},true);
{const _home=home;home=function(){const r=_home.apply(this,arguments);
  try{questCheck(true);if(!$("#quests")){const anchor=$("#todayCard")||$("#daily");if(anchor)anchor.insertAdjacentHTML("afterend",questCard())}}catch(e){console.warn(e)}
  return r}}

/* --- 90-name.js --- */
/* ---------- 90-name: name your monkey ----------
   Finch's players name their pet, and that small choice is a big part of why they care about it. On the Profile,
   a name tag under the monkey ("Name your monkey ✏️") opens a little sheet with ideas and a text box. The name then
   shows on the Profile and on the Home level card. State: S.monkeyName (empty = not named yet). */
const NAME_IDEAS=["Bongo","Coco","Pixel","Byte","Mango","Ziggy","Loop","Nana"];
const monkeyName=()=>String(S.monkeyName||"").trim();
function nameSheet(){
  const box=document.createElement("div");box.className="gate onb-sheet";box.setAttribute("role","dialog");box.setAttribute("aria-label","Name your monkey");
  const nm=monkeyName();
  box.innerHTML=`<div class="card"><div class="sheethead"><h2>Name your monkey</h2><button class="x" id="nmx" aria-label="Close">×</button></div>
    <div class="nm-stage" aria-hidden="true">${withPet("cheer")}</div>
    <div class="nm-ideas">${NAME_IDEAS.map(n=>`<button class="lang nm-idea" data-n="${n}" aria-pressed="${n===nm}">${n}</button>`).join("")}</div>
    <input class="nm-in" id="nmIn" maxlength="14" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Or type a name" value="${esc(nm)}" aria-label="Monkey name">
    <div class="row"><button class="btn" id="nmOk">Save name</button>${nm?`<button class="btn ghost" id="nmClear">No name</button>`:""}</div></div>`;
  document.body.appendChild(box);
  const close=()=>box.remove(),inp=box.querySelector("#nmIn");
  box.onclick=e=>{if(e.target===box)close()};box.querySelector("#nmx").onclick=close;
  box.querySelectorAll(".nm-idea").forEach(b=>b.onclick=()=>{inp.value=b.dataset.n;box.querySelectorAll(".nm-idea").forEach(x=>x.setAttribute("aria-pressed",x===b));try{sfx("tap")}catch(e){}});
  const done=v=>{S.monkeyName=v;save();close();if(v){toast(`Hi, ${v}! 🐵`);try{sfx("success");haptic("success")}catch(e){}}if(typeof window.profilePage==="function"&&$(".prof"))window.profilePage()};
  box.querySelector("#nmOk").onclick=()=>done(inp.value.replace(/[<>]/g,"").replace(/\s+/g," ").trim().slice(0,14));
  inp.onkeydown=e=>{if(e.key==="Enter")box.querySelector("#nmOk").click()};
  const c=box.querySelector("#nmClear");if(c)c.onclick=()=>done("");
}
(window.tmProfileHooks=window.tmProfileHooks||[]).push(()=>{
  const id=$(".prof-id");if(!id||$("#nmTag"))return;const nm=monkeyName();
  id.insertAdjacentHTML("afterbegin",`<button class="nm-tag ${nm?"":"empty"}" id="nmTag" type="button">${nm?`🐵 ${esc(nm)} <span aria-hidden="true">✏️</span>`:"Name your monkey ✏️"}</button>`);
  $("#nmTag").onclick=nameSheet});
{const _home=home;home=function(){const r=_home.apply(this,arguments);
  try{const nm=monkeyName(),t=$("#lvcard b");if(nm&&t&&!t.dataset.nm){t.dataset.nm="1";t.insertAdjacentHTML("afterbegin",`<span class="nm-on">${esc(nm)} · </span>`)}}catch(e){}
  return r}}

$("#homeBtn").onclick=home;$("#gearBtn").onclick=settingsPage;
$("#sndBtn").onclick=()=>{S.settings.sound=S.settings.sound===false;save();if(!S.settings.sound)SFX.stopMusic(true);else if(cur&&cur.l&&$(".lessonbar"))setTimeout(()=>jrMusic(cur.l.steps[cur.step]),60);toast(S.settings.sound?"Sounds on 🔊":"Sounds off 🔇");if(S.settings.sound)setTimeout(()=>sfx("correct"),40);if(rerender===settingsPage)settingsPage()};
try{addWarmups()}catch(e){console.warn(e)}
renderStats();home();
/* App: hide the launch screen the moment Home has painted (capacitor.config.json keeps a 3 s safety limit) */
try{requestAnimationFrame(()=>requestAnimationFrame(()=>{try{const SP=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.SplashScreen;if(SP&&SP.hide)SP.hide({fadeOutDuration:200})}catch(e){}}))}catch(e){}
try{storeInit()}catch(e){}   // App Store / Google Play: real price + already-bought check (does nothing on the web)
