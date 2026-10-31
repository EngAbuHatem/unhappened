/* ========= 1) بيانات الشهود: لكل شيء مصلحة منظمة ========= */
// wronged = يدّعي أنه تضرر لأن الحدث لم يقع (مدّعٍ)
// relieved = يدّعي أنه نجا لأن الحدث لم يقع (مدّعى عليه)
const POOL = [
  { n:'كرسي المكتب', i:'🪑', wronged:'حُرمتُ من وظيفتي كأهم كرسي في العالم، فلا أحد يجلس عليّ ساعات الآن.', relieved:'أخيرًا ارتحتُ! لو حدث «{e}» لبقيتُ محمّلًا بالجالسين إلى الأبد.', ask:'وسادة ذهبية وإجازة مدفوعة' },
  { n:'دفتر الملاحظات', i:'📓', wronged:'مستقبلي المهني اختفى، وصفحاتي بقيت بيضاء بسبب غياب «{e}».', relieved:'كنتُ سأنقرض لو وقع «{e}»، وأنا ما زلتُ مطلوبًا والحمد لله.', ask:'تعويض معنوي عن كل سطر لم يُكتب' },
  { n:'الحمامة', i:'🐦', wronged:'كنتُ سأعود ساعي بريد معتمدًا لولا غياب «{e}».', relieved:'لو وقع «{e}» لانتهت علاقتي بالبشر عند فتات الخبز.', ask:'لقب رسمي: ساعي بريد فخري' },
  { n:'ساعة الحائط', i:'⏰', wronged:'فقدتُ هيبتي، فالجميع ينظر إلى هواتفهم ولا ينظر إليّ بسبب ما حدث بدل «{e}».', relieved:'«{e}» كان سيسرق مني مفهوم الانتظار، وأنا أحميه منذ قرن.', ask:'دقيقة صمت كل ساعة' },
  { n:'كوب الشاي', i:'🍵', wronged:'برد قبل أن يُشرب بسبب العالم الذي لم يشهد «{e}».', relieved:'لو حدث «{e}» لانشغل الناس عني ونسوني حتى يبرد.', ask:'غطاء، واعتذار علني' },
  { n:'المفتاح', i:'🗝️', wronged:'ضعتُ في الجيوب الخطأ لأن «{e}» لم يحدث ليدلّني على الطريق.', relieved:'لو وقع «{e}» لاستبدلوني بقفل ذكي بلا قلب.', ask:'سلسلة مفاتيح من الفضة' },
  { n:'المظلة', i:'☂️', wronged:'«{e}» كان سيغيّر الطقس لصالحي، والآن أُنسى في كل مكان.', relieved:'لو وقع «{e}» لانتهى المطر والحاجة إليّ.', ask:'مطر مضمون ثلاث مرات أسبوعيًا' },
  { n:'المرآة', i:'🪞', wronged:'رأيتُ كل شيء إلا «{e}»، وهذا إهمال في حق شاهدة عيان.', relieved:'لو وقع «{e}» لرأيتُ ما لا يُحتمل، وأنا مرآة حساسة.', ask:'انعكاس أجمل بقية العمر' },
  { n:'الشاحن', i:'🔌', wronged:'بقيتُ متصلًا بلا هدف منذ غاب «{e}»!', relieved:'«{e}» كان سيستنزفني حتى آخر وات.', ask:'مقبس خاص بي وحدي' },
  { n:'الحذاء', i:'👟', wronged:'سرتُ آلاف الخطوات في عالم ناقص لأن «{e}» لم يحدث.', relieved:'لو وقع «{e}» لجلس الناس ولم يمشوا، وبطُلت مهنتي.', ask:'نعل جديد وإجازة قصيرة' }
];
const EVIDENCE = [
  'رسالة بريد إلكتروني مفقودة وقّعها شخص غير موجود',
  'صورة ملتقطة من خط زمني ملغى',
  'بصمة غبار على رف لم يُنصب أصلًا',
  'ظلّ لا يخص أحدًا في تسجيل كاميرا من يوم لم يأتِ',
  'إيصال بقيمة صفر دينار عن خدمة لم تُقدَّم',
  'شهادة جار افتراضي سمع ضجيجًا لم يحدث'
];
const JUDGES = ['القاضي ساعة الرمل', 'القاضية الميزان المائل', 'القاضي المطرقة الخشبية', 'القاضية ورقة التقويم المنسية'];
const LAWYERS = ['المحامي قلم الحبر', 'المحامية المسطرة', 'المحامي ملف الأوراق', 'المحامية النظّارة'];

/* ========= 2) عشوائية ثابتة من نص السؤال (نفس السؤال = نفس المحاكمة) ========= */
function hash(str){ let h = 1779033703 ^ str.length; for (const c of str){ h = Math.imul(h ^ c.charCodeAt(0), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; }
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const pick = (arr, r) => arr[Math.floor(r() * arr.length)];
function shuffle(arr, r){ const a = [...arr]; for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ========= 3) محرك المحاكمة ========= */
function runTrial(event, version, parent){
  const r = rng(hash(event + '#' + version));
  const banned = parent ? parent.winners.map(w => w.evidence) : [];
  // في الاستئناف: نرجّح الكفة المعاكسة لحكم النسخة الأصلية
  const bias = parent ? (parent.verdict.guilty ? 0.3 : 0.7) : 0.5;
  const witnesses = shuffle(POOL, r).slice(0, 5).map(o => {
    const wronged = r() < bias;
    return {
      name: o.n, icon: o.i, wronged,
      claim: (wronged ? o.wronged : o.relieved).replaceAll('{e}', event),
      ask: o.ask,
      weight: 1 + Math.floor(r() * 3),
      evidence: pick(EVIDENCE.filter(e => !banned.includes(e)), r),
      lawyer: pick(LAWYERS, r)
    };
  });
  const score = witnesses.reduce((s, w) => s + (w.wronged ? w.weight : -w.weight), 0);
  const guilty = score > 0;                                   // المتضررون من الغياب يربحون
  const winners = witnesses.filter(w => w.wronged === guilty);
  const top = [...winners].sort((a, b) => b.weight - a.weight)[0];
  const ruling = guilty
    ? `حكمت المحكمة بإدانة غياب «${event}»، وإلزام العالم بتعويض ${top.name}: ${top.ask}.`
    : `حكمت المحكمة ببراءة العالم من غياب «${event}»، وبرفض مطالب المتضررين، مع منح ${top.name} ${top.ask}.`;
  return { witnesses, winners, verdict: { guilty, score, ruling }, judge: pick(JUDGES, r), year: 2100 + Math.floor(r() * 200), banned };
}

/* ========= 4) الحالة وشجرة النسخ ========= */
let event = '', versions = [], current = 0, caseNo = 0;
const $ = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function openCase(text){
  text = text.trim(); if (!text) return $('q').focus();
  event = text.replace(/[؟?]+$/, '').replace(/^ماذا لو\s+/, '');
  caseNo = 100 + (hash(event) % 900);
  versions = [{ id: 0, parent: null, ...runTrial(event, 0, null) }];
  current = 0; $('court').hidden = false; render();
  $('court').scrollIntoView({ behavior: 'smooth' });
}
function appeal(){
  const parent = versions[current];
  const v = { id: versions.length, parent: parent.id, ...runTrial(event, versions.length, parent) };
  versions.push(v); current = v.id; render();
}

/* ========= 5) العرض ========= */
function render(){
  const v = versions[current], parent = v.parent !== null ? versions[v.parent] : null;
  $('timeline').innerHTML = versions.map(x =>
    `<button class="${x.id === current ? 'on' : ''}" data-v="${x.id}">${x.parent === null ? 'الخط الأصلي' : `استئناف ${x.id} ← من ${x.parent === 0 ? 'الأصل' : x.parent}`}</button>`).join('');
  document.querySelectorAll('#timeline button').forEach(b => b.onclick = () => { current = +b.dataset.v; render(); });

  const lawyerBlock = parent ? `
    <div class="lawyer2150">⚖️ يتقدّم محامٍ من عام ${v.year} بطلب الاستئناف نيابةً عن المستقبل الذي لم يحدث.<br>
    رفضت المحكمة أي دليل من المستقبل الأصلي، لأنه أُلغي بمجرد صدور الحكم الأول.</div>
    <div class="banned">🚫 أدلة مرفوضة: ${parent.banned.length || parent.winners.length ? parent.winners.map(w => `<s>${esc(w.evidence)}</s>`).join(' • ') : ''}</div>` : '';

  $('case').innerHTML = `<article class="file">
    <h2>القضية رقم ${caseNo}${parent ? '-' + v.id : ''}: بشأن «${esc(event)}»</h2>
    <p class="sub">${v.judge} يترأس الجلسة${parent ? ' (محاكمة مُعادة)' : ''}</p>
    ${lawyerBlock}
    ${v.witnesses.map(w => `<div class="w ${w.wronged ? 'p' : 'd'}">
      <b>${w.icon} ${w.name}</b> <span class="side">— ${w.wronged ? 'مدّعٍ: يطلب تعويضًا' : 'مدّعى عليه: يدافع عن الغياب'} • وزن الشهادة ${'●'.repeat(w.weight)}</span>
      <p>${esc(w.claim)}</p>
      <p class="ev">📎 الدليل: ${esc(w.evidence)} • ${w.lawyer} يترافع</p></div>`).join('')}
    <div class="verdict"><h3>${v.verdict.guilty ? 'أُدين الغياب' : 'بُرِّئ العالم'}</h3><p>${esc(v.verdict.ruling)}</p></div>
    <div class="actions">
      <button id="appeal">🔴 استأنف الحكم نيابةً عن المستقبل الذي لم يحدث</button>
      <button id="share">نسخ الحكم للمشاركة</button>
    </div></article>`;
  $('appeal').onclick = appeal;
  $('share').onclick = () => {
    navigator.clipboard.writeText(`⚖️ محكمة الأشياء التي لم تحدث\nالقضية: ${event}\n${v.verdict.ruling}\n\nلكل مستقبل لم يحدث… قضية لم تُغلق بعد.\n— dev.Eng._.Salem.M`)
      .then(() => { $('share').textContent = 'تم النسخ ✅'; });
  };
}

/* ========= 6) ربط الواجهة ========= */
$('open').onclick = () => openCase($('q').value);
$('q').addEventListener('keydown', e => { if (e.key === 'Enter') openCase($('q').value); });
['ماذا لو لم يخترع أحد الإنترنت؟', 'ماذا لو لم يُخترع الكرسي؟', 'ماذا لو لم يصل الإنسان إلى القمر؟', 'ماذا لو لم يكن للأحد وجود؟']
  .forEach(t => { const b = document.createElement('button'); b.textContent = t; b.onclick = () => { $('q').value = t; openCase(t); }; $('ideas').appendChild(b); });
