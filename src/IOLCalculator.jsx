import { useMemo, useState } from "react";

// ─────────────────────────────────────────────────────────────
// IOL presets — lenses from manufacturers distributed in Saudi Arabia.
// A = nominal manufacturer A-constant where known; null = not
// preloaded, enter it. VERIFY every value against IOLCon (iolcon.org)
// or your own optimized constants before clinical use.
// ─────────────────────────────────────────────────────────────
const IOLS = [
  { id: "custom", mfr: "—", name: "Custom (enter constants)", A: 118.9 },
  // Alcon
  { id: "sn60wf", mfr: "Alcon", name: "AcrySof IQ SN60WF", A: 118.7 },
  { id: "sa60at", mfr: "Alcon", name: "AcrySof SA60AT", A: 118.4 },
  { id: "ma60ac", mfr: "Alcon", name: "AcrySof MA60AC (3-piece)", A: 118.9 },
  { id: "sn6at", mfr: "Alcon", name: "AcrySof IQ Toric SN6AT3–T9", A: 119.0 },
  { id: "tfnt00", mfr: "Alcon", name: "AcrySof IQ PanOptix TFNT00", A: 119.1 },
  { id: "tfnt30", mfr: "Alcon", name: "AcrySof IQ PanOptix Toric TFNT30–T60", A: 119.1 },
  { id: "dft015", mfr: "Alcon", name: "AcrySof IQ Vivity DFT015", A: 119.1 },
  { id: "dft315", mfr: "Alcon", name: "AcrySof IQ Vivity Toric DFT315–T615", A: 119.1 },
  { id: "sn6ad1", mfr: "Alcon", name: "AcrySof IQ ReSTOR SN6AD1", A: 118.9 },
  { id: "cna0t0", mfr: "Alcon", name: "Clareon CNA0T0", A: 119.1 },
  { id: "cna0t3", mfr: "Alcon", name: "Clareon Toric CNA0T3–T9", A: 119.1 },
  { id: "cnwtt0", mfr: "Alcon", name: "Clareon PanOptix CNWTT0", A: 119.1 },
  { id: "cnwtt3", mfr: "Alcon", name: "Clareon PanOptix Toric CNWTT3–T6", A: 119.1 },
  { id: "cnwet0", mfr: "Alcon", name: "Clareon Vivity CNWET0", A: 119.1 },
  { id: "cnwet3", mfr: "Alcon", name: "Clareon Vivity Toric CNWET3–T6", A: 119.1 },
  // Johnson & Johnson Vision
  { id: "zcb00", mfr: "J&J", name: "Tecnis 1-Piece ZCB00", A: 118.8 },
  { id: "pcb00", mfr: "J&J", name: "Tecnis PCB00 (preloaded)", A: 118.8 },
  { id: "zct", mfr: "J&J", name: "Tecnis Toric ZCT150–600", A: 119.3 },
  { id: "icb00", mfr: "J&J", name: "Tecnis Eyhance ICB00", A: 118.8 },
  { id: "dib00", mfr: "J&J", name: "Tecnis Eyhance Toric DIB00", A: 119.3 },
  { id: "zxr00", mfr: "J&J", name: "Tecnis Symfony ZXR00", A: 119.3 },
  { id: "zxt", mfr: "J&J", name: "Tecnis Symfony Toric ZXT", A: 119.3 },
  { id: "zfr00v", mfr: "J&J", name: "Tecnis Synergy ZFR00V", A: 119.3 },
  { id: "drn00v", mfr: "J&J", name: "Tecnis Odyssey DRN00V", A: null },
  { id: "zmb00", mfr: "J&J", name: "Tecnis Multifocal ZMB00", A: 119.3 },
  { id: "ar40e", mfr: "J&J", name: "Sensar AR40e (3-piece)", A: 118.4 },
  // Bausch + Lomb
  { id: "mx60", mfr: "Bausch + Lomb", name: "enVista MX60", A: 119.1 },
  { id: "mx60e", mfr: "Bausch + Lomb", name: "enVista MX60E", A: 119.1 },
  { id: "mx60t", mfr: "Bausch + Lomb", name: "enVista Toric MX60T", A: 119.1 },
  { id: "ea60", mfr: "Bausch + Lomb", name: "enVista Aspire", A: null },
  { id: "mi60", mfr: "Bausch + Lomb", name: "Akreos AO MI60", A: 118.0 },
  { id: "eyecee", mfr: "Bausch + Lomb", name: "eyecee One", A: null },
  // Zeiss
  { id: "lucia611", mfr: "Zeiss", name: "CT LUCIA 611P", A: 118.9 },
  { id: "lucia621", mfr: "Zeiss", name: "CT LUCIA 621P", A: null },
  { id: "asphina409", mfr: "Zeiss", name: "CT ASPHINA 409M", A: 118.0 },
  { id: "torbi709", mfr: "Zeiss", name: "AT TORBI 709M", A: 118.3 },
  { id: "lisatri839", mfr: "Zeiss", name: "AT LISA tri 839MP", A: 118.6 },
  { id: "lisatri939", mfr: "Zeiss", name: "AT LISA tri toric 939MP", A: 118.6 },
  { id: "lara829", mfr: "Zeiss", name: "AT LARA 829MP", A: null },
  { id: "elana841", mfr: "Zeiss", name: "AT ELANA 841P", A: null },
  // Hoya
  { id: "xy1", mfr: "Hoya", name: "Vivinex XY1", A: 118.9 },
  { id: "xy1a", mfr: "Hoya", name: "Vivinex Toric XY1A", A: 118.9 },
  { id: "xw1", mfr: "Hoya", name: "Vivinex Gemetric XW1", A: null },
  { id: "isert251", mfr: "Hoya", name: "iSert 251", A: 118.4 },
  // Rayner
  { id: "rao600c", mfr: "Rayner", name: "RayOne Aspheric RAO600C", A: 118.6 },
  { id: "rao600t", mfr: "Rayner", name: "RayOne Toric RAO600T", A: 118.6 },
  { id: "rao603f", mfr: "Rayner", name: "RayOne Trifocal RAO603F", A: 118.6 },
  { id: "rao200e", mfr: "Rayner", name: "RayOne EMV RAO200E", A: null },
  // BVI / PhysIOL
  { id: "podf", mfr: "BVI (PhysIOL)", name: "FineVision POD F", A: null },
  { id: "podfgf", mfr: "BVI (PhysIOL)", name: "FineVision POD F GF", A: null },
  { id: "isopure", mfr: "BVI (PhysIOL)", name: "Isopure 123", A: null },
  // Teleon (Oculentis)
  { id: "lentis313", mfr: "Teleon", name: "Lentis L-313", A: 118.0 },
  { id: "lentiscomfort", mfr: "Teleon", name: "Lentis Comfort LS-313 MF15", A: 118.0 },
  { id: "lentismplus", mfr: "Teleon", name: "Lentis Mplus LS-313 MF30", A: 118.0 },
  // Others
  { id: "aspira", mfr: "HumanOptics", name: "Aspira-aA", A: null },
  { id: "precizon", mfr: "Ophtec", name: "Precizon Presbyopic", A: null },
  { id: "aurovue", mfr: "Aurolab", name: "Aurovue EV", A: null },
  { id: "miniwell", mfr: "SIFI", name: "Mini WELL Ready", A: null },
];

// Standard conversions from A-constant (used when no optimized constant entered)
const fromA = (A) => ({
  srktACD: 0.62467 * A - 68.747,
  hofferPACD: 0.58357 * A - 63.896,
  holladaySF: 0.5663 * A - 65.6,
});

// ───────────────────────── Formulas ─────────────────────────
// All return IOL power (D) for target refraction Rx (D at spectacle plane, V = 12 mm)

function srkt({ L, K, A, Rx }) {
  const r = 337.5 / K;
  const LCOR = L <= 24.2 ? L : -3.446 + 1.716 * L - 0.0237 * L * L;
  const Cw = -5.41 + 0.58412 * LCOR + 0.098 * K;
  const H = r - Math.sqrt(Math.max(r * r - (Cw * Cw) / 4, 0));
  const ACD = H + (0.62467 * A - 68.747) - 3.336;
  const na = 1.336, ncm1 = 0.333, V = 12;
  const Lo = L + (0.65696 - 0.02029 * L);
  const num = 1000 * na * (na * r - ncm1 * Lo) - 0.001 * Rx * (V * (na * r - ncm1 * Lo) + Lo * r);
  const den = (Lo - ACD) * (na * r - ncm1 * ACD) - 0.001 * Rx * (V * (na * r - ncm1 * ACD) + ACD * r);
  return num / den;
}

function hofferQ({ L, K, pACD, Rx }) {
  const Lc = Math.min(31, Math.max(18.5, L));
  const M = L <= 23 ? 1 : -1;
  const G = L <= 23 ? 28 : 23.5;
  const deg = Math.PI / 180;
  const t = Math.tan(K * deg);
  const ACD =
    pACD + 0.3 * (Lc - 23.5) + t * t +
    0.1 * M * Math.pow(23.5 - Lc, 2) * Math.tan(0.1 * Math.pow(G - Lc, 2) * deg) - 0.99166;
  const Kv = K + Rx / (1 - 0.012 * Rx);
  return 1336 / (L - ACD - 0.05) - 1.336 / (1.336 / Kv - (ACD + 0.05) / 1000);
}

function holladay1({ L, K, SF, Rx }) {
  const r = 337.5 / K;
  const Rag = r < 7 ? 7 : r;
  const AG = Math.min(13.5, (12.5 * L) / 23.45);
  const ACD = 0.56 + Rag - Math.sqrt(Rag * Rag - (AG * AG) / 4);
  const Alm = L + 0.2;
  const d = ACD + SF;
  const na = 1.336, ncm1 = 1 / 3, V = 12;
  const num = 1000 * na * (na * r - ncm1 * Alm) - 0.001 * Rx * (V * (na * r - ncm1 * Alm) + Alm * r);
  const den = (Alm - d) * (na * r - ncm1 * d) - 0.001 * Rx * (V * (na * r - ncm1 * d) + d * r);
  return num / den;
}

// Invert a formula: find Rx that yields a given power P (bisection)
function predictedRx(fn, base, P) {
  let lo = -15, hi = 15;
  const f = (rx) => fn({ ...base, Rx: rx }) - P;
  let flo = f(lo), fhi = f(hi);
  if (!isFinite(flo) || !isFinite(fhi) || flo * fhi > 0) return NaN;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (flo * fm <= 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}

const round05 = (x) => Math.round(x * 2) / 2;
const fmt = (x, d = 2) => (isFinite(x) ? x.toFixed(d) : "—");
const signed = (x, d = 2) => (isFinite(x) ? (x > 0 ? "+" : "") + x.toFixed(d) : "—");

// ───────────────────────── UI ─────────────────────────
const Field = ({ label, unit, value, onChange, step = 0.01, hint }) => (
  <label className="block">
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-slate-700">{label}</span>
      {unit && <span className="text-xs text-slate-400">{unit}</span>}
    </div>
    <input
      type="number"
      inputMode="decimal"
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base tabular-nums text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
    />
    {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
  </label>
);

export default function IOLCalculator() {
  const [iolId, setIolId] = useState("sn60wf");
  const [A, setA] = useState("118.7");
  const [useOpt, setUseOpt] = useState(false);
  const [opt, setOpt] = useState({ srktACD: "", pACD: "", SF: "" });

  const [AL, setAL] = useState("23.50");
  const [K1, setK1] = useState("43.50");
  const [K2, setK2] = useState("44.00");
  const [target, setTarget] = useState("-0.25");
  const [ext, setExt] = useState({ barrettP: "", barrettRx: "", h2P: "", h2Rx: "" });

  const pickIol = (id) => {
    setIolId(id);
    const iol = IOLS.find((i) => i.id === id);
    if (iol) setA(iol.A == null ? "" : String(iol.A));
  };

  const res = useMemo(() => {
    const L = +AL, k1 = +K1, k2 = +K2, Rx = +target, a = +A;
    const K = (k1 + k2) / 2;
    const warnings = [];
    if (!(L > 15 && L < 38)) warnings.push("Axial length outside 15–38 mm — check input.");
    if (!(K > 30 && K < 60)) warnings.push("Mean K outside 30–60 D — check input.");
    if (Math.abs(k1 - k2) > 3) warnings.push("Corneal astigmatism > 3 D — consider a toric IOL; spherical power here is on mean K.");
    if (L < 22) warnings.push("Short eye (< 22 mm): third-generation formulas diverge; Hoffer Q historically favoured, but a modern formula (Barrett/Kane/EVO) is recommended.");
    if (L > 26) warnings.push("Long eye (> 26 mm): SRK/T and Holladay 1 tend to leave hyperopic surprises; use a modern formula or Wang–Koch adjustment for confirmation.");
    if (A === "") warnings.push("No A-constant preloaded for this lens — enter the manufacturer or IOLCon value.");
    else if (!(a > 110 && a < 125)) warnings.push("A-constant looks wrong.");

    const c = fromA(a);
    const consts = {
      srktACD: useOpt && opt.srktACD !== "" ? +opt.srktACD : c.srktACD,
      pACD: useOpt && opt.pACD !== "" ? +opt.pACD : c.hofferPACD,
      SF: useOpt && opt.SF !== "" ? +opt.SF : c.holladaySF,
    };
    // SRK/T takes A directly; back-convert if user supplied an optimized SRK/T ACD constant
    const A_srkt = useOpt && opt.srktACD !== "" ? (+opt.srktACD + 68.747) / 0.62467 : a;

    const formulas = [
      { name: "SRK/T", fn: srkt, base: { L, K, A: A_srkt }, constLabel: `A ${fmt(A_srkt, 2)}` },
      { name: "Hoffer Q", fn: hofferQ, base: { L, K, pACD: consts.pACD }, constLabel: `pACD ${fmt(consts.pACD, 2)}` },
      { name: "Holladay 1", fn: holladay1, base: { L, K, SF: consts.SF }, constLabel: `SF ${fmt(consts.SF, 2)}` },
    ];

    const rows = formulas.map((f) => {
      const exact = f.fn({ ...f.base, Rx });
      const center = round05(exact);
      const ladder = [center + 1, center + 0.5, center, center - 0.5, center - 1].map((P) => ({
        P, rx: predictedRx(f.fn, f.base, P),
      }));
      // recommended: the step whose predicted refraction is closest to target without going hyperopic
      const nonHyper = ladder.filter((s) => isFinite(s.rx) && s.rx <= target + 1e-6);
      const pick = (nonHyper.length ? nonHyper : ladder).reduce((b, s) =>
        Math.abs(s.rx - Rx) < Math.abs(b.rx - Rx) ? s : b);
      return { ...f, exact, ladder, pick };
    });

    const external = [
      { name: "Barrett Universal II", P: ext.barrettP, rx: ext.barrettRx, url: "https://calc.apacrs.org/barrett_universal2105/" },
      { name: "Holladay 2", P: ext.h2P, rx: ext.h2Rx, url: null },
    ].map((e) => ({ ...e, P: e.P === "" ? NaN : +e.P, rx: e.rx === "" ? NaN : +e.rx }));

    const exacts = [...rows.map((r) => r.exact), ...external.map((e) => e.P)].filter(isFinite);
    const spread = exacts.length ? Math.max(...exacts) - Math.min(...exacts) : NaN;
    if (spread > 1) warnings.push(`Formulas disagree by ${fmt(spread)} D — do not rely on a single formula; confirm with a modern formula.`);

    return { K, rows, external, spread, warnings, consts };
  }, [AL, K1, K2, target, A, useOpt, opt, ext]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-8">
        <header className="mb-6 border-b border-slate-300 pb-4">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">IOL power calculator</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            SRK/T, Hoffer Q and Holladay 1 from axial length and keratometry. Powers are shown in 0.5 D steps with the predicted
            spectacle refraction for each. Educational tool — verify constants and validate against your biometer before any clinical use.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Inputs */}
          <section className="space-y-5">
            <div className="rounded-lg border border-slate-300 bg-white p-4">
              <h2 className="mb-3 text-base font-medium">Biometry</h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Axial length" unit="mm" value={AL} onChange={setAL} />
                <Field label="K1" unit="D" value={K1} onChange={setK1} step="0.25" />
                <Field label="K2" unit="D" value={K2} onChange={setK2} step="0.25" />
                <Field label="Target refraction" unit="D" value={target} onChange={setTarget} step="0.25" />
                <div className="rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <div className="text-slate-500">Mean K</div>
                  <div className="text-lg tabular-nums">{fmt(res.K)} D</div>
                  <div className="text-xs text-slate-500">Astig {fmt(Math.abs(+K1 - +K2))} D</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-300 bg-white p-4">
              <h2 className="mb-3 text-base font-medium">Lens</h2>
              <select
                value={iolId}
                onChange={(e) => pickIol(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
              >
                {IOLS.map((i) => (
                  <option key={i.id} value={i.id}>{i.mfr !== "—" ? `${i.mfr} — ` : ""}{i.name}{i.A == null ? " (enter A-constant)" : ""}</option>
                ))}
              </select>
              <div className="mt-3">
                <Field label="A-constant" value={A} onChange={setA} step="0.1"
                  hint="Nominal manufacturer value. Replace with your optimized constant (IOLCon or your own outcomes)." />
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={useOpt} onChange={(e) => setUseOpt(e.target.checked)} className="h-4 w-4 accent-teal-700" />
                Use formula-specific optimized constants
              </label>
              {useOpt && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field label="SRK/T ACD const" value={opt.srktACD} onChange={(v) => setOpt({ ...opt, srktACD: v })} hint={`blank = ${fmt(fromA(+A).srktACD)}`} />
                  <Field label="Hoffer Q pACD" value={opt.pACD} onChange={(v) => setOpt({ ...opt, pACD: v })} hint={`blank = ${fmt(fromA(+A).hofferPACD)}`} />
                  <Field label="Holladay SF" value={opt.SF} onChange={(v) => setOpt({ ...opt, SF: v })} hint={`blank = ${fmt(fromA(+A).holladaySF)}`} />
                </div>
              )}
            </div>
            <div className="rounded-lg border border-slate-300 bg-white p-4">
              <h2 className="mb-1 text-base font-medium">Barrett Universal II &amp; Holladay 2</h2>
              <p className="mb-3 text-xs text-slate-500">
                Proprietary formulas — enter results from the{" "}
                <a href="https://calc.apacrs.org/barrett_universal2105/" target="_blank" rel="noreferrer" className="text-teal-800 underline">Barrett online calculator</a>{" "}
                and from your biometer's Holladay 2 output (no free online Holladay 2 calculator is currently available).
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Barrett IOL power" unit="D" value={ext.barrettP} onChange={(v) => setExt({ ...ext, barrettP: v })} step="0.5" />
                <Field label="Barrett predicted Rx" unit="D" value={ext.barrettRx} onChange={(v) => setExt({ ...ext, barrettRx: v })} step="0.01" />
                <Field label="Holladay 2 IOL power" unit="D" value={ext.h2P} onChange={(v) => setExt({ ...ext, h2P: v })} step="0.5" />
                <Field label="Holladay 2 predicted Rx" unit="D" value={ext.h2Rx} onChange={(v) => setExt({ ...ext, h2Rx: v })} step="0.01" />
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="space-y-4">
            {res.warnings.length > 0 && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <ul className="list-disc space-y-1 pl-5">
                  {res.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
              <table className="w-full min-w-[420px] text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Formula</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Constant used</th>
                    <th className="px-3 py-3 text-right font-medium sm:px-4">Exact</th>
                    <th className="px-3 py-3 text-right font-medium sm:px-4">IOL</th>
                    <th className="px-3 py-3 text-right font-medium sm:px-4">Pred. Rx</th>
                  </tr>
                </thead>
                <tbody>
                  {res.rows.map((r) => (
                    <tr key={r.name} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium">{r.name}</td>
                      <td className="hidden px-4 py-3 text-slate-500 tabular-nums md:table-cell">{r.constLabel}</td>
                      <td className="px-3 py-3 text-right tabular-nums sm:px-4">{fmt(r.exact)}</td>
                      <td className="px-3 py-3 text-right text-lg font-semibold tabular-nums text-teal-800 sm:px-4">{signed(r.pick.P, 1)}</td>
                      <td className="px-3 py-3 text-right tabular-nums sm:px-4">{signed(r.pick.rx)}</td>
                    </tr>
                  ))}
                  {res.external.map((e) => (
                    <tr key={e.name} className="border-t border-slate-200 bg-slate-50/60">
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                        {e.url
                          ? <>Manual entry — <a href={e.url} target="_blank" rel="noreferrer" className="text-teal-800 underline">official calculator</a></>
                          : "Manual entry — from biometer (IOLMaster / Lenstar)"}
                      </td>
                      <td className="px-3 py-3 text-right text-slate-400 sm:px-4">—</td>
                      <td className="px-3 py-3 text-right text-lg font-semibold tabular-nums text-teal-800 sm:px-4">{isFinite(e.P) ? signed(e.P, 1) : "—"}</td>
                      <td className="px-3 py-3 text-right tabular-nums sm:px-4">{isFinite(e.rx) ? signed(e.rx) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 text-slate-600">
                  <tr>
                    <td colSpan={5} className="px-3 py-2 text-xs sm:px-4">
                      All values in dioptres. Suggested IOL = 0.5 D step with predicted refraction closest to target without going hyperopic. Spread between formulas: {fmt(res.spread)} D.
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {res.rows.map((r) => (
                <div key={r.name} className="rounded-lg border border-slate-300 bg-white p-4">
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="font-medium">{r.name}</h3>
                    <span className="text-xs text-slate-500">IOL power → predicted Rx</span>
                  </div>
                  <table className="w-full text-sm tabular-nums">
                    <tbody>
                      {r.ladder.map((s) => {
                        const isPick = s.P === r.pick.P;
                        return (
                          <tr key={s.P} className={isPick ? "bg-teal-50 font-semibold text-teal-900" : "text-slate-700"}>
                            <td className="py-1 pl-2">{signed(s.P, 1)} D</td>
                            <td className="py-1 pr-2 text-right">{signed(s.rx)} D</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-slate-300 bg-white p-4 text-xs leading-relaxed text-slate-600">
              <p>
                Barrett Universal II and Holladay 2 are unpublished/licensed and can only be entered manually from the official calculators. Kane, EVO, Hill-RBF, Olsen and PEARL-DGS are likewise not reimplemented here. Use their official web calculators or your biometer for confirmation,
                especially outside 22–26 mm axial length or after refractive surgery (none of these formulas is valid post-LASIK/PRK).
                Vertex distance 12 mm; keratometric index 1.3375. Toric and post-refractive cases are out of scope.
              </p>
            </div>
          </section>
        </div>
        <footer className="mt-10 border-t border-slate-300 pt-4 text-center text-sm text-slate-600">
          Developed by Abdulaziz Alhajjaj, O.D.
        </footer>
      </div>
    </div>
  );
}
