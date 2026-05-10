import { useState } from "react";

// ─── METRICS ─────────────────────────────────────────────────────────────────
const METRICS_CONFIG = {
  partDollars: {
    label: "Part Dollars", prefix: "$", suffix: "", weight: 2,
    tiers: [
      { min: 600,  grade: "A+", color: "#00e87a", label: "EXCELLENT", desc: "Outstanding parts sales. You're maximizing every ticket with high-value add-ons." },
      { min: 400,  grade: "A",  color: "#00cc66", label: "GREAT",     desc: "Strong parts revenue. Keep pushing filters, wipers, and accessories on every job." },
      { min: 250,  grade: "B",  color: "#7fff00", label: "GOOD",      desc: "Decent parts sales but room to grow. Add one more part per ticket consistently." },
      { min: 150,  grade: "C",  color: "#ffd600", label: "FAIR",      desc: "Parts sales are below target. Recommend filters, wipers, and fluids on every car." },
      { min: 50,   grade: "D",  color: "#ff8c00", label: "POOR",      desc: "Very few parts sold. Every car that leaves without parts is money left behind." },
      { min: 0,    grade: "F",  color: "#ff3b5c", label: "CRITICAL",  desc: "Almost no parts sold. This is the #1 fix — parts have zero payroll cost attached." },
    ],
    goal: "$400+",
    fix: "Ask every customer: 'When did you last change your cabin filter / wipers / battery?' One add-on per car changes everything. Even $30 in parts per car × 6 cars = $180 extra.",
  },
  laborDollars: {
    label: "Labor Dollars", prefix: "$", suffix: "", weight: 1,
    tiers: [
      { min: 600,  grade: "A+", color: "#00e87a", label: "EXCELLENT", desc: "Top-tier labor billing. You're tackling complex, high-value repairs all day." },
      { min: 400,  grade: "A",  color: "#00cc66", label: "GREAT",     desc: "Strong labor revenue. Look for brake, AC, and alignment upsells to push even higher." },
      { min: 250,  grade: "B",  color: "#7fff00", label: "GOOD",      desc: "Solid labor billing. Target one larger job per day to break into the A range." },
      { min: 150,  grade: "C",  color: "#ffd600", label: "FAIR",      desc: "Labor dollars are below target. Too many quick low-labor jobs in the mix." },
      { min: 75,   grade: "D",  color: "#ff8c00", label: "POOR",      desc: "Low labor billing. Focus on brakes, tune-ups, and suspension — those pay the most hours." },
      { min: 0,    grade: "F",  color: "#ff3b5c", label: "CRITICAL",  desc: "Critically low labor. Talk to your advisor — you may not be getting the right jobs assigned." },
    ],
    goal: "$400+",
    fix: "Ask the advisor for brake jobs, AC services, and alignments. Those jobs pay the highest flat rate hours and dramatically increase your labor dollars.",
  },
  totalDollars: {
    label: "Total Dollars", prefix: "$", suffix: "", weight: 3,
    tiers: [
      { min: 1500, grade: "A+", color: "#00e87a", label: "EXCELLENT", desc: "Elite production. You're one of the top revenue generators in this store today." },
      { min: 1000, grade: "A",  color: "#00cc66", label: "GREAT",     desc: "Strong total revenue. This is exactly where you want to be every single shift." },
      { min: 700,  grade: "B",  color: "#7fff00", label: "GOOD",      desc: "Above average day. Push for $1,000+ by adding parts and requesting bigger jobs." },
      { min: 450,  grade: "C",  color: "#ffd600", label: "FAIR",      desc: "Below goal. Need more orders, more parts per ticket, or bigger jobs — ideally all three." },
      { min: 200,  grade: "D",  color: "#ff8c00", label: "POOR",      desc: "Low production. Identify the bottleneck — is it slow traffic, small jobs, or lack of parts?" },
      { min: 0,    grade: "F",  color: "#ff3b5c", label: "CRITICAL",  desc: "Very low revenue. Speak with your manager about job flow and workload distribution." },
    ],
    goal: "$1,000+",
    fix: "Total = Parts + Labor. Fix both sides. More cars + more parts per car + bigger jobs = $1,000+ daily. Start with parts — it's the fastest lever you can pull.",
  },
  payrollPct: {
    label: "Payroll %", prefix: "", suffix: "%", weight: 3, invert: true,
    tiers: [
      { max: 10,  grade: "A+", color: "#00e87a", label: "EXCELLENT", desc: "World-class efficiency. Every hour you work generates exceptional profit for the store." },
      { max: 15,  grade: "A",  color: "#00cc66", label: "GREAT",     desc: "Excellent payroll management. Strong revenue vs. your labor cost ratio." },
      { max: 20,  grade: "B",  color: "#7fff00", label: "GOOD",      desc: "Acceptable range. Increase parts sales and bigger jobs to push under 15%." },
      { max: 25,  grade: "C",  color: "#ffd600", label: "FAIR",      desc: "Payroll is eating into profit. Boost revenue — especially parts — to fix this quickly." },
      { max: 35,  grade: "D",  color: "#ff8c00", label: "POOR",      desc: "High payroll drain. The store barely breaks even on your labor. Fix parts sales now." },
      { max: 999, grade: "F",  color: "#ff3b5c", label: "CRITICAL",  desc: "Store is losing money on your shift. Every clocked minute costs more than you earn." },
    ],
    goal: "Under 15%",
    fix: "Lower payroll % by selling more parts. Parts have ZERO payroll cost — they only help your number. $100 in parts per car × 5 cars = major improvement in payroll %.",
  },
  frhProd: {
    label: "FRH's Produced", prefix: "", suffix: "", weight: 2,
    tiers: [
      { min: 10,  grade: "A+", color: "#00e87a", label: "EXCELLENT", desc: "Exceptional production. You're billing more hours than most techs across the country." },
      { min: 7,   grade: "A",  color: "#00cc66", label: "GREAT",     desc: "Strong flat rate output. You're staying busy and billing very efficiently all shift." },
      { min: 5,   grade: "B",  color: "#7fff00", label: "GOOD",      desc: "Good FRH output. Look for ways to reduce wait time and dead time between jobs." },
      { min: 3,   grade: "C",  color: "#ffd600", label: "FAIR",      desc: "Below average hours billed. Too many small jobs or too much waiting between cars." },
      { min: 1.5, grade: "D",  color: "#ff8c00", label: "POOR",      desc: "Low billable hours. You may be clocked in but not producing enough actual work." },
      { min: 0,   grade: "F",  color: "#ff3b5c", label: "CRITICAL",  desc: "Almost no billable hours. Check job assignments with the advisor urgently." },
    ],
    goal: "6.0+",
    fix: "FRH's come from taking on complex jobs and completing them efficiently. Ask the advisor to keep cars flowing consistently. Every gap between jobs is lost billing.",
  },
  numOrders: {
    label: "# of Orders", prefix: "", suffix: "", weight: 2,
    tiers: [
      { min: 10, grade: "A+", color: "#00e87a", label: "EXCELLENT", desc: "Incredible volume! You're moving cars faster than almost anyone on the team." },
      { min: 7,  grade: "A",  color: "#00cc66", label: "GREAT",     desc: "High order count. You're staying busy and serving a large number of customers." },
      { min: 5,  grade: "B",  color: "#7fff00", label: "GOOD",      desc: "Solid order count. Aim for 7+ by staying efficient and minimizing turnaround time." },
      { min: 3,  grade: "C",  color: "#ffd600", label: "FAIR",      desc: "Low order count. More cars should be coming your way — talk to the advisor." },
      { min: 1,  grade: "D",  color: "#ff8c00", label: "POOR",      desc: "Very few orders. Either traffic is slow or you're not being assigned enough jobs." },
      { min: 0,  grade: "F",  color: "#ff3b5c", label: "CRITICAL",  desc: "Almost no orders. Communicate urgently with your advisor about your workload." },
    ],
    goal: "5+",
    fix: "Tell your advisor first thing every morning: 'I'm ready for cars.' Stay visible, stay fast, and the cars will keep coming. Don't wait — go ask.",
  },
  servPerFrh: {
    label: "Serv $ / FRH", prefix: "$", suffix: "", weight: 3,
    tiers: [
      { min: 250, grade: "A+", color: "#00e87a", label: "EXCELLENT", desc: "Elite revenue per hour. Every FRH you bill is extremely profitable for the store." },
      { min: 175, grade: "A",  color: "#00cc66", label: "GREAT",     desc: "Strong dollar-per-hour. You're doing high-value jobs and selling parts well." },
      { min: 130, grade: "B",  color: "#7fff00", label: "GOOD",      desc: "Above average. Push parts add-ons more consistently to break into the A range." },
      { min: 90,  grade: "C",  color: "#ffd600", label: "FAIR",      desc: "Below average value per hour. Billing time but not generating enough per job." },
      { min: 50,  grade: "D",  color: "#ff8c00", label: "POOR",      desc: "Low revenue per FRH. Cheap jobs only. Mix in brakes, AC, alignment work." },
      { min: 0,   grade: "F",  color: "#ff3b5c", label: "CRITICAL",  desc: "Critically low per-hour value. Oil changes alone can't sustain the store. Upsell urgently." },
    ],
    goal: "$150+",
    fix: "Serv$/FRH = Total Dollars ÷ FRH's. Raise it two ways: (1) Sell more parts per ticket, (2) Do bigger jobs. A $30 cabin filter turns a $50/hr job into a $100/hr job instantly.",
  },
  frhPerOrder: {
    label: "FRH / Order", prefix: "", suffix: "", weight: 2,
    tiers: [
      { min: 3.0, grade: "A+", color: "#00e87a", label: "EXCELLENT", desc: "Complex, high-value work per car. You're doing the most profitable jobs available." },
      { min: 2.0, grade: "A",  color: "#00cc66", label: "GREAT",     desc: "Good job complexity. You're bundling services and completing meaningful repairs." },
      { min: 1.4, grade: "B",  color: "#7fff00", label: "GOOD",      desc: "Decent per-car value. Look for one more service to add on each vehicle that comes in." },
      { min: 1.0, grade: "C",  color: "#ffd600", label: "FAIR",      desc: "Jobs are too small per car. Are you doing oil changes only? Bundle more services." },
      { min: 0.5, grade: "D",  color: "#ff8c00", label: "POOR",      desc: "Very low per-car work. Every car must get a full inspection and at least one add-on." },
      { min: 0,   grade: "F",  color: "#ff3b5c", label: "CRITICAL",  desc: "Almost no work per car. Perform a proper multi-point inspection on every vehicle." },
    ],
    goal: "1.4+",
    fix: "'While I have your car...' — always inspect and recommend. Brakes + oil change = 2.5 FRH/Order. Oil change alone = 0.5. The difference between A and F is just asking.",
  },
};

const METRIC_KEYS = Object.keys(METRICS_CONFIG);
const emptyValues = () => Object.fromEntries(METRIC_KEYS.map(k => [k, ""]));

// ─── GRADING ─────────────────────────────────────────────────────────────────
function getTier(key, value) {
  const cfg = METRICS_CONFIG[key];
  if (!cfg || value === "" || value === null) return null;
  const v = parseFloat(value);
  if (isNaN(v)) return null;
  if (cfg.invert) {
    for (const t of cfg.tiers) { if (v <= t.max) return t; }
    return cfg.tiers[cfg.tiers.length - 1];
  }
  for (const t of cfg.tiers) { if (v >= t.min) return t; }
  return cfg.tiers[cfg.tiers.length - 1];
}

function gradeToScore(grade) {
  return { "A+": 100, "A": 88, "B": 72, "C": 52, "D": 32, "F": 10 }[grade] || 0;
}

function calcScore(values) {
  let tw = 0, tws = 0;
  METRIC_KEYS.forEach(k => {
    const tier = getTier(k, values[k]);
    const w = METRICS_CONFIG[k].weight;
    if (tier) { tws += gradeToScore(tier.grade) * w; tw += 100 * w; }
  });
  return tw === 0 ? 0 : Math.round((tws / tw) * 100);
}

function scoreToGrade(s) {
  if (s >= 95) return "A+";
  if (s >= 84) return "A";
  if (s >= 70) return "B";
  if (s >= 55) return "C";
  if (s >= 38) return "D";
  return "F";
}

function scoreColor(s) {
  if (s >= 84) return "#00e87a";
  if (s >= 70) return "#7fff00";
  if (s >= 55) return "#ffd600";
  if (s >= 38) return "#ff8c00";
  return "#ff3b5c";
}

function gradeColor(g) {
  return { "A+": "#00e87a", "A": "#00cc66", "B": "#7fff00", "C": "#ffd600", "D": "#ff8c00", "F": "#ff3b5c" }[g] || "#555";
}

function overallLabel(s) {
  if (s >= 95) return "ELITE PERFORMANCE";
  if (s >= 84) return "GREAT SHIFT";
  if (s >= 70) return "SOLID SHIFT";
  if (s >= 55) return "AVERAGE SHIFT";
  if (s >= 38) return "BELOW AVERAGE";
  return "ROUGH DAY — REFOCUS";
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  card: { background: "#0d0d18", border: "1px solid #1a1a28", borderRadius: 12, padding: 20, marginBottom: 14 },
  input: { width: "100%", background: "#0a0a12", border: "1px solid #1e1e2e", borderRadius: 8, color: "#e8e8f0", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, padding: "10px 12px", outline: "none", boxSizing: "border-box" },
  label: { fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, fontWeight: 700, display: "block" },
  btn: { width: "100%", background: "linear-gradient(135deg, #4f8cff, #00c2ff)", border: "none", borderRadius: 12, color: "#000", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, padding: 16, cursor: "pointer", boxShadow: "0 4px 24px rgba(79,140,255,0.3)", marginTop: 6 },
  ghost: { width: "100%", background: "transparent", border: "1px solid #1e1e2e", borderRadius: 12, color: "#555", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 1, padding: 12, cursor: "pointer", marginTop: 10 },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2, color: "#4f8cff", marginBottom: 14 },
};

// ─── METRIC INPUT ─────────────────────────────────────────────────────────────
function MetricInput({ metricKey, value, onChange }) {
  const cfg = METRICS_CONFIG[metricKey];
  const tier = getTier(metricKey, value);
  const bc = tier ? `${tier.color}44` : "#1e1e2e";
  const tc = tier ? tier.color : "#e8e8f0";
  return (
    <div style={{ background: "#0a0a12", border: `1.5px solid ${bc}`, borderRadius: 10, padding: "12px 14px", transition: "border-color 0.3s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: tier ? tier.color : "#2a2a3e", display: "inline-block", boxShadow: tier ? `0 0 5px ${tier.color}` : "none" }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#777", letterSpacing: 1, textTransform: "uppercase" }}>{cfg.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {tier && <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: tier.color, letterSpacing: 1 }}>{tier.grade} · {tier.label}</span>}
          <span style={{ fontSize: 9, color: "#2a2a3e", fontFamily: "'IBM Plex Mono', monospace" }}>Goal: {cfg.goal}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {cfg.prefix && <span style={{ color: "#555", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14 }}>{cfg.prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(metricKey, e.target.value)} placeholder="—" step="0.1"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: tc, fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700 }} />
        {cfg.suffix && <span style={{ color: "#555", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14 }}>{cfg.suffix}</span>}
      </div>
      {tier && value !== "" && (
        <div style={{ marginTop: 8, padding: "7px 10px", background: `${tier.color}0d`, borderRadius: 6, borderLeft: `2px solid ${tier.color}88` }}>
          <div style={{ fontSize: 11, color: `${tier.color}cc`, lineHeight: 1.5 }}>{tier.desc}</div>
        </div>
      )}
    </div>
  );
}

// ─── SCORE RING ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 120 }) {
  const c = scoreColor(score);
  const g = scoreToGrade(score);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: `3px solid ${c}`, boxShadow: `0 0 28px ${c}55`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `${c}08` }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: size * 0.38, color: c, lineHeight: 1 }}>{g}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: size * 0.1, color: `${c}88` }}>{score}/100</div>
    </div>
  );
}

// ─── METRIC RESULT CARD ───────────────────────────────────────────────────────
function MetricResultCard({ metricKey, value }) {
  const cfg = METRICS_CONFIG[metricKey];
  const tier = getTier(metricKey, value);
  if (!tier || value === "") return null;
  const display = `${cfg.prefix}${parseFloat(value).toFixed(metricKey === "numOrders" ? 0 : 1)}${cfg.suffix}`;
  return (
    <div style={{ border: `1px solid ${tier.color}33`, borderRadius: 10, padding: 14, marginBottom: 10, background: `${tier.color}05` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{cfg.label}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700, color: tier.color }}>{display}</div>
          <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>Goal: {cfg.goal}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: tier.color, lineHeight: 1 }}>{tier.grade}</div>
          <div style={{ fontSize: 10, color: tier.color, letterSpacing: 1 }}>{tier.label}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, marginBottom: tier.grade !== "A+" ? 10 : 0 }}>{tier.desc}</div>
      {tier.grade !== "A+" && (
        <div style={{ padding: "8px 12px", background: "#050510", borderRadius: 6, borderLeft: `2px solid #4f8cff` }}>
          <div style={{ fontSize: 9, color: "#4f8cff", fontWeight: 700, marginBottom: 3, letterSpacing: 1.5 }}>💡 HOW TO IMPROVE</div>
          <div style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>{cfg.fix}</div>
        </div>
      )}
    </div>
  );
}

// ─── ACTION PLAN ──────────────────────────────────────────────────────────────
function ActionPlan({ values }) {
  const urgent = METRIC_KEYS.filter(k => { const t = getTier(k, values[k]); return t && (t.grade === "F" || t.grade === "D"); });
  const warn   = METRIC_KEYS.filter(k => { const t = getTier(k, values[k]); return t && t.grade === "C"; });
  const good   = METRIC_KEYS.filter(k => { const t = getTier(k, values[k]); return t && (t.grade === "A+" || t.grade === "A"); });

  if (urgent.length === 0 && warn.length === 0) return (
    <div style={{ ...S.card, background: "#080e08", border: "1px solid #00e87a33" }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#00e87a", letterSpacing: 2, marginBottom: 6 }}>🏆 CRUSHING IT TODAY!</div>
      <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>No red flags. Keep selling parts on every ticket, take complex jobs, and stay consistent. Elite techs don't coast — they push for A+ on everything.</div>
      {good.length > 0 && <div style={{ marginTop: 10, fontSize: 11, color: "#00e87a88" }}>✅ {good.map(k => METRICS_CONFIG[k].label).join(" · ")}</div>}
    </div>
  );

  return (
    <div style={S.card}>
      <div style={{ ...S.title, color: "#ff3b5c" }}>🚨 ACTION PLAN</div>
      {urgent.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: "#ff3b5c", letterSpacing: 2, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>🔴 Fix These First — Critical Issues</div>
          {urgent.map(k => {
            const cfg = METRICS_CONFIG[k]; const tier = getTier(k, values[k]);
            return (
              <div key={k} style={{ padding: "12px 14px", background: "#ff3b5c08", border: "1px solid #ff3b5c22", borderRadius: 8, marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#ff3b5c", marginBottom: 4 }}>{cfg.label} — Grade {tier.grade} ({tier.label})</div>
                <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5, marginBottom: 8 }}>{tier.desc}</div>
                <div style={{ fontSize: 11, color: "#4f8cff", lineHeight: 1.5 }}>💡 {cfg.fix}</div>
              </div>
            );
          })}
        </div>
      )}
      {warn.length > 0 && (
        <div>
          <div style={{ fontSize: 9, color: "#ffd600", letterSpacing: 2, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>🟡 Needs Attention — Fair Ratings</div>
          {warn.map(k => {
            const cfg = METRICS_CONFIG[k]; const tier = getTier(k, values[k]);
            return (
              <div key={k} style={{ padding: "12px 14px", background: "#ffd60008", border: "1px solid #ffd60022", borderRadius: 8, marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#ffd600", marginBottom: 4 }}>{cfg.label} — Grade {tier.grade} ({tier.label})</div>
                <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5, marginBottom: 8 }}>{tier.desc}</div>
                <div style={{ fontSize: 11, color: "#4f8cff", lineHeight: 1.5 }}>💡 {cfg.fix}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SINGLE MODE ──────────────────────────────────────────────────────────────
function SingleMode() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [values, setValues] = useState(emptyValues());
  const [view, setView] = useState("entry");
  const score = calcScore(values);
  const filled = METRIC_KEYS.filter(k => values[k] !== "").length;

  if (view === "results") return (
    <div>
      <div style={{ ...S.card, textAlign: "center" }}>
        {name && <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3, color: "#444", marginBottom: 8 }}>{name.toUpperCase()}{date && ` · ${new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}</div>}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><ScoreRing score={score} size={130} /></div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: scoreColor(score), letterSpacing: 3, marginBottom: 4 }}>{overallLabel(score)}</div>
        <div style={{ fontSize: 11, color: "#444", marginBottom: 16 }}>Overall performance score — all metrics weighted by importance</div>
        {/* Gradient bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#333", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>
            <span>F — CRITICAL</span><span>D — POOR</span><span>C — FAIR</span><span>B — GOOD</span><span>A — GREAT</span><span>A+</span>
          </div>
          <div style={{ height: 8, background: "#1a1a28", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${score}%`, background: "linear-gradient(90deg,#ff3b5c,#ff8c00,#ffd600,#7fff00,#00cc66,#00e87a)", borderRadius: 99, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
          </div>
        </div>
        {/* Grade ref */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 4, marginTop: 14 }}>
          {[["A+","#00e87a","Elite"],["A","#00cc66","Great"],["B","#7fff00","Good"],["C","#ffd600","Fair"],["D","#ff8c00","Poor"],["F","#ff3b5c","Fail"]].map(([g,c,l]) => {
            const active = scoreToGrade(score) === g;
            return (
              <div key={g} style={{ background: active ? `${c}22` : "#0a0a12", border: `1px solid ${active ? c : "#111"}`, borderRadius: 6, padding: "6px 2px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, color: c }}>{g}</div>
                <div style={{ fontSize: 8, color: "#555" }}>{l}</div>
              </div>
            );
          })}
        </div>
      </div>

      <ActionPlan values={values} />

      <div style={S.card}>
        <div style={S.title}>📊 DETAILED BREAKDOWN</div>
        <div style={{ fontSize: 11, color: "#444", marginBottom: 14, lineHeight: 1.5 }}>Each metric graded individually with specific feedback on what's wrong and exactly how to fix it.</div>
        {METRIC_KEYS.map(k => <MetricResultCard key={k} metricKey={k} value={values[k]} />)}
      </div>

      <button style={S.ghost} onClick={() => { setView("entry"); setValues(emptyValues()); setName(""); setDate(""); }}>↩ ENTER NEW SHIFT</button>
    </div>
  );

  return (
    <div>
      <div style={S.card}>
        <div style={S.title}>👤 TECH INFO</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label style={S.label}>Tech Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. F. Mendoza" style={S.input} /></div>
          <div><label style={S.label}>Shift Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...S.input, colorScheme: "dark" }} /></div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.title}>📋 ENTER SHIFT NUMBERS</div>
        <div style={{ fontSize: 11, color: "#444", marginBottom: 14, lineHeight: 1.6 }}>Type each number and watch it grade instantly — A+ (elite) down to F (critical). The dot and color update in real time.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {METRIC_KEYS.map(k => <MetricInput key={k} metricKey={k} value={values[k]} onChange={(key, val) => setValues(v => ({ ...v, [key]: val }))} />)}
        </div>
      </div>
      {filled >= 3 && (
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: "#333", letterSpacing: 2, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>LIVE SCORE PREVIEW</div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><ScoreRing score={score} size={90} /></div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: scoreColor(score), letterSpacing: 2 }}>{overallLabel(score)}</div>
        </div>
      )}
      <button style={S.btn} onClick={() => setView("results")}>SEE FULL ANALYSIS →</button>
    </div>
  );
}

// ─── COMPARE MODE ─────────────────────────────────────────────────────────────
function CompareMode() {
  const [techA, setTechA] = useState({ name: "", values: emptyValues() });
  const [techB, setTechB] = useState({ name: "", values: emptyValues() });
  const [view, setView] = useState("entry");
  const [active, setActive] = useState("A");
  const scoreA = calcScore(techA.values), scoreB = calcScore(techB.values);
  const cur = active === "A" ? techA : techB;
  const setCur = active === "A" ? setTechA : setTechB;

  if (view === "results") {
    const winner = scoreA > scoreB ? (techA.name || "Tech A") : scoreB > scoreA ? (techB.name || "Tech B") : "TIE";
    const diff = Math.abs(scoreA - scoreB);
    let wA = 0, wB = 0;
    METRIC_KEYS.forEach(k => {
      const cfg = METRICS_CONFIG[k], va = parseFloat(techA.values[k]), vb = parseFloat(techB.values[k]);
      if (!isNaN(va) && !isNaN(vb) && techA.values[k] !== "" && techB.values[k] !== "") {
        if (cfg.invert) { if (va < vb) wA++; else if (vb < va) wB++; }
        else { if (va > vb) wA++; else if (vb > va) wB++; }
      }
    });
    return (
      <div>
        <div style={{ ...S.card, background: "#080f08", border: "1px solid #00e87a33", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: "#333", letterSpacing: 2, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>🏆 WINNER</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: "#00e87a", letterSpacing: 3 }}>{winner}</div>
          {diff > 0 && <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>Leads by {diff} points</div>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[[techA, scoreA, "A"], [techB, scoreB, "B"]].map(([tech, sc, lb]) => (
            <div key={lb} style={{ ...S.card, textAlign: "center", marginBottom: 0 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 2, color: "#444", marginBottom: 8 }}>{tech.name || `TECH ${lb}`}</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><ScoreRing score={sc} size={80} /></div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: scoreColor(sc), letterSpacing: 1 }}>{overallLabel(sc).split(" ")[0]}</div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={S.title}>⚔️ METRIC-BY-METRIC BATTLE</div>
          {METRIC_KEYS.map(k => {
            const cfg = METRICS_CONFIG[k];
            const va = parseFloat(techA.values[k]), vb = parseFloat(techB.values[k]);
            const hasA = !isNaN(va) && techA.values[k] !== "", hasB = !isNaN(vb) && techB.values[k] !== "";
            if (!hasA && !hasB) return null;
            const tA = getTier(k, techA.values[k]), tB = getTier(k, techB.values[k]);
            const cA = tA?.color || "#555", cB = tB?.color || "#555";
            let winA = false, winB = false;
            if (hasA && hasB) { if (cfg.invert) { winA = va < vb; winB = vb < va; } else { winA = va > vb; winB = vb > va; } }
            return (
              <div key={k} style={{ padding: "10px 0", borderBottom: "1px solid #0d0d18" }}>
                <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, textTransform: "uppercase", textAlign: "center", marginBottom: 6 }}>{cfg.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr", gap: 4, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    {winA && <span style={{ fontSize: 11, marginRight: 4 }}>🏆</span>}
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700, color: cA }}>{hasA ? `${cfg.prefix}${va.toFixed(k === "numOrders" ? 0 : 1)}${cfg.suffix}` : "—"}</span>
                    {tA && <div style={{ fontSize: 8, color: cA }}>{tA.grade} · {tA.label}</div>}
                  </div>
                  <div style={{ fontSize: 8, color: "#222", textAlign: "center" }}>vs</div>
                  <div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700, color: cB }}>{hasB ? `${cfg.prefix}${vb.toFixed(k === "numOrders" ? 0 : 1)}${cfg.suffix}` : "—"}</span>
                    {winB && <span style={{ fontSize: 11, marginLeft: 4 }}>🏆</span>}
                    {tB && <div style={{ fontSize: 8, color: cB }}>{tB.grade} · {tB.label}</div>}
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {[[techA.name || "Tech A", wA], [techB.name || "Tech B", wB]].map(([n, w]) => (
              <div key={n} style={{ textAlign: "center", background: "#0a0a12", borderRadius: 8, padding: 10 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#4f8cff" }}>{w}</div>
                <div style={{ fontSize: 9, color: "#444" }}>{n} WINS</div>
              </div>
            ))}
          </div>
        </div>
        <button style={S.ghost} onClick={() => { setView("entry"); setTechA({ name: "", values: emptyValues() }); setTechB({ name: "", values: emptyValues() }); setActive("A"); }}>↩ NEW COMPARISON</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {["A", "B"].map(lb => (
          <button key={lb} onClick={() => setActive(lb)} style={{ padding: "12px 0", background: active === lb ? "#4f8cff" : "#0d0d18", border: `1px solid ${active === lb ? "#4f8cff" : "#1a1a28"}`, borderRadius: 10, color: active === lb ? "#000" : "#555", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, cursor: "pointer" }}>
            {(lb === "A" ? techA.name : techB.name) || `TECH ${lb}`}
          </button>
        ))}
      </div>
      <div style={S.card}>
        <div style={S.title}>👤 TECH {active} INFO</div>
        <input value={cur.name} onChange={e => setCur(t => ({ ...t, name: e.target.value }))} placeholder={`Tech ${active} name`} style={S.input} />
      </div>
      <div style={S.card}>
        <div style={S.title}>📋 METRICS — TECH {active}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {METRIC_KEYS.map(k => <MetricInput key={k} metricKey={k} value={cur.values[k]} onChange={(key, val) => setCur(t => ({ ...t, values: { ...t.values, [key]: val } }))} />)}
        </div>
      </div>
      <button style={S.btn} onClick={() => setView("results")}>RUN COMPARISON →</button>
    </div>
  );
}

// ─── LEADERBOARD MODE ─────────────────────────────────────────────────────────
function LeaderboardMode() {
  const [techs, setTechs] = useState([{ id: 1, name: "", values: emptyValues() }, { id: 2, name: "", values: emptyValues() }]);
  const [view, setView] = useState("entry");
  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(3);

  const addTech = () => { setTechs(t => [...t, { id: nextId, name: "", values: emptyValues() }]); setActiveId(nextId); setNextId(n => n + 1); };
  const removeTech = id => { if (techs.length <= 2) return; const remaining = techs.filter(x => x.id !== id); setTechs(remaining); if (activeId === id) setActiveId(remaining[0]?.id); };
  const updateName = (id, val) => setTechs(t => t.map(x => x.id === id ? { ...x, name: val } : x));
  const updateMetric = (id, key, val) => setTechs(t => t.map(x => x.id === id ? { ...x, values: { ...x.values, [key]: val } } : x));

  const ranked = [...techs].map(t => ({ ...t, score: calcScore(t.values) })).sort((a, b) => b.score - a.score);
  const active = techs.find(t => t.id === activeId);
  const rankEmoji = i => ["🥇", "🥈", "🥉"][i] || `${i + 1}.`;

  if (view === "results") return (
    <div>
      <div style={S.card}>
        <div style={{ ...S.title, color: "#ffd600" }}>🏆 TEAM LEADERBOARD</div>
        <div style={{ fontSize: 11, color: "#444", marginBottom: 14 }}>Ranked best to worst by overall performance score</div>
        {ranked.map((t, i) => {
          const c = scoreColor(t.score), g = scoreToGrade(t.score);
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #0d0d18" }}>
              <div style={{ fontSize: i < 3 ? 24 : 15, minWidth: 30, textAlign: "center", fontFamily: i >= 3 ? "'Bebas Neue', sans-serif" : "inherit", color: i >= 3 ? "#444" : "inherit" }}>{rankEmoji(i)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 1, color: "#e8e8f0", marginBottom: 2 }}>{t.name || `Tech ${t.id}`}</div>
                <div style={{ fontSize: 9, color: c, letterSpacing: 1, marginBottom: 5, textTransform: "uppercase" }}>{overallLabel(t.score)}</div>
                <div style={{ height: 5, background: "#1a1a28", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${t.score}%`, background: c, borderRadius: 99 }} />
                </div>
              </div>
              <div style={{ textAlign: "center", minWidth: 52 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: c, lineHeight: 1 }}>{g}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#444" }}>{t.score}/100</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={S.card}>
        <div style={S.title}>📊 KEY METRIC RANKINGS</div>
        {["totalDollars", "payrollPct", "servPerFrh", "numOrders", "frhPerOrder"].map(k => {
          const cfg = METRICS_CONFIG[k];
          const vals = ranked.map(t => parseFloat(t.values[k])).filter(v => !isNaN(v));
          const maxV = vals.length ? Math.max(...vals) : 1, minV = vals.length ? Math.min(...vals) : 0;
          return (
            <div key={k} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase" }}>{cfg.label}</div>
                <div style={{ fontSize: 9, color: "#2a2a3e", fontFamily: "'IBM Plex Mono', monospace" }}>Goal: {cfg.goal}</div>
              </div>
              {ranked.map((t, i) => {
                const v = parseFloat(t.values[k]);
                const tier = getTier(k, t.values[k]);
                const c = tier?.color || "#2a2a3e";
                const has = !isNaN(v) && t.values[k] !== "";
                const range = maxV - minV || 1;
                const barPct = has ? (cfg.invert ? Math.round(((maxV - v) / range) * 80) + 15 : Math.round(((v - minV) / range) * 80) + 15) : 5;
                const display = has ? `${cfg.prefix}${v.toFixed(k === "numOrders" ? 0 : 1)}${cfg.suffix}` : "—";
                return (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <div style={{ fontSize: 13, minWidth: 26 }}>{rankEmoji(i)}</div>
                    <div style={{ fontSize: 10, color: "#666", minWidth: 88, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name || `Tech ${t.id}`}</div>
                    <div style={{ flex: 1, height: 6, background: "#1a1a28", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${has ? barPct : 0}%`, background: c, borderRadius: 99 }} />
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: c, minWidth: 54, textAlign: "right" }}>{display}</div>
                    {tier && <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: c, minWidth: 22 }}>{tier.grade}</div>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div style={S.card}>
        <div style={S.title}>📋 FULL GRADE REPORT</div>
        {ranked.map((t, i) => {
          const grades = METRIC_KEYS.map(k => getTier(k, t.values[k])).filter(Boolean);
          const counts = {};
          grades.forEach(g => { counts[g.grade] = (counts[g.grade] || 0) + 1; });
          return (
            <div key={t.id} style={{ padding: "12px 0", borderBottom: "1px solid #0d0d18" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{rankEmoji(i)}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#e8e8f0", flex: 1 }}>{t.name || `Tech ${t.id}`}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: scoreColor(t.score) }}>{scoreToGrade(t.score)} · {t.score}/100</span>
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {[["A+","#00e87a"],["A","#00cc66"],["B","#7fff00"],["C","#ffd600"],["D","#ff8c00"],["F","#ff3b5c"]].map(([g,c]) => counts[g] ? (
                  <div key={g} style={{ padding: "3px 8px", background: `${c}12`, border: `1px solid ${c}33`, borderRadius: 4, display: "flex", gap: 3, alignItems: "center" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: c }}>{g}</span>
                    <span style={{ fontSize: 9, color: `${c}aa` }}>×{counts[g]}</span>
                  </div>
                ) : null)}
              </div>
              {/* worst metric callout */}
              {(() => {
                const worst = METRIC_KEYS.filter(k => { const tier = getTier(k, t.values[k]); return tier && (tier.grade === "F" || tier.grade === "D"); });
                if (worst.length === 0) return null;
                return <div style={{ marginTop: 8, fontSize: 10, color: "#ff3b5c99" }}>⚠️ Needs work: {worst.map(k => METRICS_CONFIG[k].label).join(", ")}</div>;
              })()}
            </div>
          );
        })}
      </div>

      <button style={S.ghost} onClick={() => setView("entry")}>↩ EDIT TECHS</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {techs.map(t => (
          <button key={t.id} onClick={() => setActiveId(t.id)} style={{ padding: "7px 12px", background: activeId === t.id ? "#4f8cff" : "#0d0d18", border: `1px solid ${activeId === t.id ? "#4f8cff" : "#1a1a28"}`, borderRadius: 8, color: activeId === t.id ? "#000" : "#666", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, cursor: "pointer" }}>
            {t.name || `Tech ${t.id}`}
          </button>
        ))}
        <button onClick={addTech} style={{ padding: "7px 12px", background: "#0d0d18", border: "1px dashed #2a2a3e", borderRadius: 8, color: "#4f8cff", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, cursor: "pointer" }}>+ ADD TECH</button>
      </div>

      {active && (
        <div>
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={S.title}>👤 TECH INFO</div>
              {techs.length > 2 && <button onClick={() => removeTech(active.id)} style={{ background: "transparent", border: "1px solid #ff3b5c44", borderRadius: 6, color: "#ff3b5c", fontSize: 10, padding: "4px 9px", cursor: "pointer" }}>REMOVE</button>}
            </div>
            <input value={active.name} onChange={e => updateName(active.id, e.target.value)} placeholder={`Tech ${active.id} name`} style={S.input} />
          </div>
          <div style={S.card}>
            <div style={S.title}>📋 METRICS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {METRIC_KEYS.map(k => <MetricInput key={k} metricKey={k} value={active.values[k]} onChange={(key, val) => updateMetric(active.id, key, val)} />)}
            </div>
          </div>
        </div>
      )}
      <button style={S.btn} onClick={() => setView("results")}>VIEW LEADERBOARD →</button>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("single");
  const tabs = [{ id: "single", icon: "👤", label: "SINGLE" }, { id: "compare", icon: "⚔️", label: "COMPARE" }, { id: "leaderboard", icon: "🏆", label: "RANKING" }];
  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e8e8f0", fontFamily: "'IBM Plex Sans', sans-serif", backgroundImage: "linear-gradient(rgba(79,140,255,0.02) 1px, transparent 1px),linear-gradient(90deg,rgba(79,140,255,0.02) 1px,transparent 1px)", backgroundSize: "40px 40px" }}>
      <div style={{ background: "#0d0d1aee", borderBottom: "1px solid #1a1a28", padding: "16px 20px 0", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, background: "linear-gradient(135deg,#4f8cff,#00e87a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 4, lineHeight: 1 }}>TECH TRACKER</div>
          <div style={{ fontSize: 9, color: "#222", letterSpacing: 2, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>STORE #005185 · FIRESTONE 3650 N ELSTON · CHICAGO</div>
          <div style={{ display: "flex" }}>
            {tabs.map(t => <button key={t.id} onClick={() => setMode(t.id)} style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", borderBottom: mode === t.id ? "2px solid #4f8cff" : "2px solid transparent", color: mode === t.id ? "#4f8cff" : "#2a2a3e", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>{t.icon} {t.label}</button>)}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 80px" }}>
        {mode === "single" && <SingleMode />}
        {mode === "compare" && <CompareMode />}
        {mode === "leaderboard" && <LeaderboardMode />}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input::placeholder{color:#2a2a3e;}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.3);}
        button{transition:opacity 0.15s;}
        button:active{opacity:0.75;}
      `}</style>
    </div>
  );
}
