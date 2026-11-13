  // days: 1=Seg ... 5=Sex
  const CLASSES = [
    { days: [1,3,5], time: "07:00", fam: "mt", name: "Muay Thai", note: "Adulto" },
    { days: [1,3],   time: "16:00", fam: "mt", name: "Muay Thai Kids", note: "Crianças" },
    { days: [3,5],   time: "19:30", fam: "mt", name: "Muay Thai", note: "Adulto" },
    { days: [2,4],   time: "07:20", fam: "jj", name: "Jiu-jitsu", note: "Adulto" },
    { days: [2,4],   time: "18:40", fam: "jj", name: "Jiu-jitsu Baby", note: "2 a 5 anos" },
    { days: [2,4],   time: "19:20", fam: "jj", name: "Jiu-jitsu Kids", note: "6 a 14 anos" },
    { days: [2,4],   time: "20:20", fam: "jj", name: "Jiu-jitsu", note: "A partir de 12 anos" },
    { days: [1,3],   time: "20:20", fam: "ll", name: "Luta livre esportiva", note: "" }
  ];
  const DAYS = { 1: "Segunda", 2: "Terça", 3: "Quarta", 4: "Quinta", 5: "Sexta" };

  const week = document.getElementById("week");
  const filters = document.getElementById("filters");
  const todayIdx = new Date().getDay(); // 0=Dom ... 6=Sáb
  const wa = t => "https://wa.me/5561999389426?text=" + encodeURIComponent(t);
  let current = "jj";

  function slotsFor(day, fam) {
    return CLASSES
      .filter(c => c.days.includes(day) && (fam === "all" || c.fam === fam))
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  function renderWeek() {
    week.innerHTML = "";
    for (let d = 1; d <= 5; d++) {
      const slots = slotsFor(d, current);
      if (!slots.length && current !== "all") continue;
      const el = document.createElement("div");
      el.className = "day" + (d === todayIdx ? " is-today" : "");
      let html = `<h3>${DAYS[d]}${d === todayIdx ? "<em>Hoje</em>" : ""}</h3>`;
      html += slots.map(s => {
        const msg = `Olá! Quero a turma de ${s.name}${s.note ? " (" + s.note + ")" : ""}, ${DAYS[d].toLowerCase()} às ${s.time.replace(":", "h")}.`;
        return `
          <div class="slot ${s.fam}">
            <time>${s.time.replace(":", "h")}</time>
            <strong>${s.name}</strong>
            ${s.note ? `<small>${s.note}</small><br>` : ""}
            <a class="slot-cta" href="${wa(msg)}" target="_blank" rel="noopener">Quero esta turma</a>
          </div>`;
      }).join("");
      if (!slots.length) html += `<p class="empty">Sem aula</p>`;
      el.innerHTML = html;
      week.appendChild(el);
    }
  }

  function renderToday() {
    const body = document.getElementById("today-body");
    const title = document.getElementById("today-title");
    const names = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
    title.textContent = names[todayIdx];
    const slots = slotsFor(todayIdx, "all");
    const now = new Date();
    const nowStr = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    const nextTime = (slots.find(s => s.time > nowStr) || {}).time;
    if (slots.length) {
      body.innerHTML = "<ul>" + slots.map(s => {
        const cls = !nextTime ? "" : (s.time < nowStr ? " is-past" : (s.time === nextTime ? " is-next" : ""));
        return `<li class="${cls.trim()}"><b>${s.time.replace(":", "h")}</b><span>${s.name}${s.note ? `<small>${s.note}</small>` : ""}</span>${s.time === nextTime ? "<em>Próxima</em>" : "<i></i>"}</li>`;
      }).join("") + "</ul>";
    } else {
      body.innerHTML = `<p>Sem aulas hoje. As turmas voltam na segunda, a partir das 7h.</p>`;
    }
  }

  filters.addEventListener("click", e => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    current = btn.dataset.f;
    filters.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c === btn)));
    renderWeek();
  });

  renderWeek();
  renderToday();


  // Kimonos: alternar frente / verso
  document.querySelectorAll(".kimono").forEach(card => {
    card.querySelector(".vt").addEventListener("click", e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      card.querySelectorAll(".vt button").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      card.querySelectorAll(".view").forEach(v => v.classList.toggle("is-on", v.dataset.v === btn.dataset.view));
    });
  });


  // Hero: vídeo leve no celular e pausa se o usuário prefere menos movimento
  (function () {
    const v = document.querySelector(".hero-video");
    if (!v) return;
    if (window.matchMedia("(max-width: 860px)").matches) {
      v.src = "assets/video/hero-mobile.mp4";
      v.load();
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
    }
    const p = v.play && v.play();
    if (p && p.catch) p.catch(() => {});
  })();
