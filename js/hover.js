const hoverBox = document.querySelector("#hoverBox");
const globalHoverHiiri = {x: 0, y: 0};
window.addEventListener("mousemove", ({x, y}) => {globalHoverHiiri.x = x; globalHoverHiiri.y = y});

// let testiTaulu = [
//   "<css> text-shadow: 2px -6px #0014ff; <css> <c>red<c> <fs>30px<fs> Moro miten menee loladasdasd § <c>white<c> miten § <fs>50px<fs> menee<br> <c>blue<c> § <c>white<c> <fs>20px<fs> Kaunis päivä § paiva <fs>50px<fs> <c>red<c>"
// ]
// document.querySelector("popUpDmg").appendChild(luoTextiSyntaxt(testiTaulu[0]));

// addHover(".playerBox .hpBox", ["default", "ctrl\n\n\n\nasdasdasdhasdakjsdh", "alt", "shift"], ["ctrlKey", "altKey", "shiftKey"]);
// addHover(".playerBox .mpBox", "asdasdasd\nasdasd");

function addHover(target, texts = [], keys = ["default"], logic = "true") {
  const div = document.createElement("div");
  if(Array.isArray(target) && target[1]) div.setAttribute(target[1], target[2] ?? "");
  const borderPaddin = 10;

  if(!Array.isArray(target)) target = [target];
  if(typeof target[0] == "string") target[0] = document.querySelector(target[0]);
  if(typeof texts == "string") texts = [texts];
  if(typeof keys == "string") keys = [keys];
  if(keys.indexOf("default") == -1) keys.unshift("default");

  target[0].addEventListener("mouseover", mouseOver);
  target[0].addEventListener("mousemove", moveHoverBlock);
  target[0].addEventListener("mouseout", mouseOut);

  moveHoverBlock();

  function mouseOver(e) {
    e.stopPropagation();
    window.onkeydown = null;
    window.onkeyup = null;
    window.onkeydown = ({ctrlKey, altKey, shiftKey, repeat}) => keyUpAndDown({ctrlKey, altKey, shiftKey, repeat});
    window.onkeyup = ({ctrlKey, altKey, shiftKey, repeat}) => keyUpAndDown({ctrlKey, altKey, shiftKey, repeat});

    hoverBox.innerHTML = "";
    div.innerHTML = "";

    if(e.ctrlKey && keys.some(e => e == "ctrlKey")) div.append(customTextSyntax(texts[keys.indexOf("ctrlKey")]));
    else if(e.altKey && keys.some(e => e == "altKey")) div.append(customTextSyntax(texts[keys.indexOf("altKey")]));
    else if(e.shiftKey && keys.some(e => e == "shiftKey")) div.append(customTextSyntax(texts[keys.indexOf("shiftKey")]));
    else div.append(customTextSyntax(texts[keys.indexOf("default")]));
    hoverBox.append(div);

    div.style.display = div.querySelector("pre").textContent ? null : "none";
    moveHoverBlock();
  }

  function keyUpAndDown(keyMetaData) {
    if(keyMetaData.repeat) return;
    div.innerHTML = "";

    for(const key of keys) {
      if(!keyMetaData[key]) continue;
      div.append(customTextSyntax(texts[keys.indexOf(key)]));
    } if(!div.innerHTML) div.append(customTextSyntax(texts[keys.indexOf("default")]));
    div.style.display = div.querySelector("pre").textContent ? null : "none";
    moveHoverBlock();
  }

  function moveHoverBlock() {
    const {x, y} = globalHoverHiiri;
    const {height, width} = div.getBoundingClientRect();
    const maxTop = window.innerHeight - height - borderPaddin;
    const maxleft = window.innerWidth - width - borderPaddin;
    div.style.left = Math.min(x + 20, maxleft) + "px";
    div.style.top = Math.min(y, maxTop) + "px";
  }

  function mouseOut(e) {
    e.stopPropagation();
    window.onkeydown = null;
    window.onkeyup = null;
    hoverBox.innerHTML = ""
  }
}

function customTextSyntax(syn = "") {
  const pre = document.createElement("pre");
  const lines = syn.split("§");
  let selectedContainer = pre;

  for(const line of lines) {
    const span = document.createElement("span");
    selectedContainer.append(span);
    let selectedSpan = span;
    let index = 0;

    do {
      const currentLine = line.substring(index);
      const nspan = document.createElement("span");
      let [lineText] = currentLine.split("<");

      if(currentLine.startsWith("<c>")) {
        const [,color, text=""] = currentLine.split("<c>");
        [lineText] = text.split("<");
        if(selectedSpan.style.color) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.color = runVariableTest(color);
        index = line.indexOf("<c>", index + 1);
        if(index == -1) return console.error(`"<c>" has no closing!`);
      } else if(currentLine.startsWith("<f>")) {
        const [,fontSize, text=""] = currentLine.split("<f>");
        [lineText] = text.split("<");
        if(selectedSpan.style.fontSize) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontSize = runVariableTest(fontSize);
        index = line.indexOf("<f>", index + 1);
        if(index == -1) return console.error(`"<f>" has no closing!`);
      } else if(currentLine.startsWith("<b>")) {
        const [,fontWeight, text=""] = currentLine.split("<b>");
        [lineText] = text.split("<");
        if(selectedSpan.style.fontWeight) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontWeight = runVariableTest(fontWeight);
        index = line.indexOf("<b>", index + 1);
        if(index == -1) return console.error(`"<b>" has no closing!`);
      } else if(currentLine.startsWith("<cl>")) {
        const [,classList, text=""] = currentLine.split("<cl>");
        [lineText] = text.split("<");
        if(selectedSpan.classList.value) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.classList = runVariableTest(classList);
        index = line.indexOf("<cl>", index + 1);
        if(index == -1) return console.error(`"<cl>" has no closing!`);
      } else if(currentLine.startsWith("<ff>")) {
        const [,fontFamily, text=""] = currentLine.split("<ff>");
        [lineText] = text.split("<");
        if(selectedSpan.style.fontFamily) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontFamily = runVariableTest(fontFamily);
        index = line.indexOf("<ff>", index + 1);
        if(index == -1) return console.error(`"<ff>" has no closing!`);
      } else if(currentLine.startsWith("<css>")) {
        const [,rawCss, text=""] = currentLine.split("<css>");
        [lineText] = text.split("<");
        if(line.indexOf("<css>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.cssText += runVariableTest(rawCss);
        index = line.indexOf("<css>", index + 1);
        if(index == -1) return console.error(`"<css>" has no closing!`);
      } else if(currentLine.startsWith("<bcss>")) {
        const [,rawCss, text=""] = currentLine.split("<bcss>");
        [lineText] = text.split("<");
        selectedContainer.style.cssText += runVariableTest(rawCss);
        index = line.indexOf("<bcss>", index + 1);
        if(index == -1) return console.error(`"<bcss>" has no closing!`);
      } else if(currentLine.startsWith("<v>")) {
        const [,variable, text=""] = currentLine.split("<v>");
        [lineText] = text.split("<");
        try {lineText = eval(variable) ?? "" + lineText}
        catch {return console.error(`"${variable}" is not defined`)}
        index = line.indexOf("<v>", index + 1);
        if(index == -1) return console.error(`"<v>" has no closing!`);
      } else if(currentLine.startsWith("<i>")) {
        const [,source, text=""] = currentLine.split("<i>");
        const img = document.createElement("img");
        const className = source.indexOf("[") != -1 ? source.split("[")[1].split("]")[0] : "";
        img.src = runVariableTest(source.replace("[" + className + "]", ""));
        [lineText] = text.split("<");
        selectedSpan.append(img);
        img.classList = className;
        index = line.indexOf("<i>", index + 1);
        if(index == -1) return console.error(`"<i>" has no closing!`);
      } else if(currentLine.startsWith("<ct>")) {
        const [,className, text=""] = currentLine.split("<ct>", 3);
        const container = document.createElement("div");
        if(className.length) container.classList = runVariableTest(className);
        [lineText] = text.split("<", 1);
        selectedContainer.append(container);
        selectedContainer = container;
        if(selectedSpan.outerHTML !== "<span></span>") {
          selectedContainer.append(nspan);
          selectedSpan = nspan;
        } else selectedContainer.append(selectedSpan);
        index = line.indexOf("<ct>", index + 1);
        if(index == -1) return console.error(`"<ct>" has no closing!`);
      } else if(currentLine.startsWith("<nct>")) {
        const [,className, text=""] = currentLine.split("<nct>", 3);
        const container = document.createElement("div");
        if(className.length) container.classList = runVariableTest(className);
        [lineText] = text.split("<", 1);
        pre.append(container);
        selectedContainer = container;
        if(selectedSpan.outerHTML !== "<span></span>") {
          selectedContainer.append(nspan);
          selectedSpan = nspan;
        } else selectedContainer.append(selectedSpan);
        index = line.indexOf("<nct>", index + 1);
        if(index == -1) return console.error(`"<nct>" has no closing!`);
      } selectedSpan.textContent += lineText;
      index = line.indexOf("<", index + 1);
    } while(index !== -1);
  } return pre;

  function runVariableTest(data) {
    if(data.indexOf("<v>") == -1) return data;
    let index = 0;
    let finalText = "";

    while(index !== -1) {
      const currentLine = data.substring(index);
      let [lineText] = currentLine.split("<");
      if(currentLine.startsWith("<v>")) {
        const [,variable, text=""] = currentLine.split("<v>");
        [lineText] = text.split("<");
        try {lineText = eval(variable) ?? "" + lineText}
        catch {return console.error(`"${variable}" is not defined`)}
        index = data.indexOf("<v>", index + 1);
        if(index == -1) return console.error(`"<v>" has no closing!`);
      } finalText += lineText;
      index = data.indexOf("<", index + 1);
    } return finalText;
  }
}


// <f><f> = font size
// \n = line break
// <css><css> = raw css
// <c><c> = color
// <v><v> = variable
// <bcss><bcss> = raw css on base pre or container element
// <cl><cl> = set classlist on span
// <b><b> = fontweight
// <ff><ff> = font-family
// <i>img src [class name]<i> = add image
// § = new span
// <ct>class name<ct> = add div container
// <nct>class name<nct> = add new div container

// luoGlobalHover("pelaaja", [
//   "<css> color: #f00; font-size: 18px; font-weight: 600; <css> Parannus pullo <br>§ Tyyppi: §Taika<c>#f90<c> <br> § Vahinko: §10 - 50<c>#ffe000<c> <br> § Nopeus: §5s<c>#41ee36<c> <br> § Manan kulutus: §50m<c>#2eb3e0<c> <br> § lisatietoja paina [shift] <c>#4d4d4d<c> <fs>12px<fs>",
//   "Super salainen menu <fs>20px<fs><br>§Elä kerro kenellekkään miten painetaan shiftii",
//   "Super salainen crtl Menu <c>yellow<c> <fs>20px<fs><br>§Elä kerro kenellekkään miten painetaan shiftii",
// ], undefined, ["shiftKey", "ctrlKey"])

// luoGlobalHover("luovutaBox", ["Voit lopettaa vuorosi <br> § painamalla tätä nappia"]);
// luoGlobalHover("pelaajaHpText", [`
// <c>$p.style.fontSize = '15px'<c> § 
// <fs>20px<fs><c>#42f55a<c>Pelaajan terveyspisteet <br> § 
// <br> Mittari kertoo paljon sinä voit vielä §  
// <br> ottaa iskuja vastaan ennen §  
// <br> kuin kuolet. Jos elämäpisteesi §  
// <br> menevät nollaan häviät taistelun § 
// • Maksimi kapasiteetti §$pelaaja.laskeMaxHp()!$hp <css>font-weight: 700<css><c>#42f55a<c> <br>§ 
// • Sinulla on §$pelaaja.laskeHp()!$hp <css>font-weight: 700<css><c>$pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.85 ? '#34eb4c' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.5 ? '#e5eb34' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.25 ? '#eba834' : '#eb3434'<c> <br>§ 
// • Jäljellä §document.querySelector(pelaaja.laskeHp() / pelaaja.laskeMaxHp() * 100).toFixed(1)!$% <c>$pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.85 ? '#34eb4c' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.5 ? '#e5eb34' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.25 ? '#eba834' : '#eb3434'<c>  <css>font-weight: 700<css> <br> § 
// [SHIFT] piilota menu <fs>12px<fs><c>yellow<c>`], ["e.shiftKey == false"]);
// luoGlobalHover("pelaajaMpText", [`
// <c>$p.style.fontSize = '15px'<c> § 
// <fs>20px<fs><c>#34b4eb<c>Pelaajan taikamittari <br> §  
// <br> Mittari kertoo paljon pelaaja voit §  <br> käyttää manaa vaativia tavaroita. §  
// Mana kerääntyy takaisin itsestään <br>§ 
// • Sinun mana kerääntyy §$pelaaja.manaRegen!$m/s <br> <css>font-weight: 700<css>  <c>#34b4eb<c> § 
// • Maksimi kapasiteetti § §$pelaaja.laskeMaxMp()!$mp <css>font-weight: 700<css><c>#34b4eb<c> <br>§ 
// • Sinulla on  § §$pelaaja.laskeMp()!$mp <css>font-weight: 700<css><c>$pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.85 ? '#34b4eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.5 ? '#9f34eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.25 ? '#eb34b4' : '#eb3434'<c> <br>§ 
// • Jäljellä §document.querySelector(pelaaja.laskeMp() / pelaaja.laskeMaxMp() * 100).toFixed(1)!$% <c>$pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.85 ? '#34b4eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.5 ? '#9f34eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.25 ? '#eb34b4' : '#eb3434'<c>  <css>font-weight: 700<css> <br>§ 
// [SHIFT] piilota menu <fs>12px<fs><c>yellow<c>`], ["e.shiftKey == false"]);