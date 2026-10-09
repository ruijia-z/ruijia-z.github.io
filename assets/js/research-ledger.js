/* Dependency-free enhancement for the static research ledger. */
(function () {
  'use strict';
  var root = document.getElementById('ledger');
  var payload = document.getElementById('research-ledger-data');
  if (!root || !payload) return;
  var data;
  try { data = JSON.parse(payload.textContent); } catch (_) { return; }
  if (!Array.isArray(data.entries) || !data.sources) return;
  var $ = function (id) { return document.getElementById(id); };
  var labels = {
    status: {open:'待解决 · 原文提出', partial:'部分解决', preprint:'预印本进展', established:'已发表结果', watch:'待核验', released:'官方发布'},
    evidence: {explicit:'原文明确', extension:'编辑延伸', theorem:'论文结果', official:'官方报告'},
    kind: {'':'全部', question:'研究问题', result:'数学进展', ai:'AI 动态'},
    priority: {3:'优先精读', 2:'建议浏览', 1:'持续关注'}
  };
  var topics = new Map(data.topics.map(function (t) { return [t.id,t.label]; }));
  var saved = new Set(), key = 'ruijia-research-stars-v1';
  try {
    var stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(stored)) stored.filter(function (s) { return typeof s === 'string'; }).forEach(function (s) { saved.add(s); });
  } catch (_) { $('ledger-storage-note').hidden = false; }
  var state = {q:'',kind:'',topic:'',status:'',evidence:'',company:'',sort:'priority',star:false};
  var params = new URLSearchParams(window.location.search);
  Object.keys(state).forEach(function (k) { if (params.has(k)) state[k] = k === 'star' ? params.get(k) === '1' : params.get(k); });
  if (!Object.prototype.hasOwnProperty.call(labels.kind, state.kind)) state.kind = '';
  if (!topics.has(state.topic)) state.topic = '';
  if (state.status && !Object.prototype.hasOwnProperty.call(labels.status, state.status)) state.status = '';
  if (state.evidence && !Object.prototype.hasOwnProperty.call(labels.evidence, state.evidence)) state.evidence = '';
  if (!['priority','source','updated'].includes(state.sort)) state.sort = 'priority';
  var companies = Array.from(new Set(data.entries.map(function (e) { return e.company; }).filter(Boolean))).sort();
  if (!companies.includes(state.company)) state.company = '';
  var target = params.get('entry');
  if (!data.entries.some(function (e) { return e.id === target; })) target = null;
  var limit = 8, cardMap = new Map(), buttonMap = new Map(), detailMap = new Map();
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function link(text, href) {
    var a = el('a','',text);
    try {
      var url = new URL(href, window.location.origin);
      if (url.protocol !== 'https:' && url.origin !== window.location.origin) return el('span','',text);
      a.href = url.href;
    } catch (_) { return el('span','',text); }
    return a;
  }
  function badge(text, kind) { return el('span','ledger-badge' + (kind ? ' ledger-badge--' + kind : ''),text); }
  function typeset(node, attempts) {
    if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Queue) {
      window.MathJax.Hub.Queue(['Typeset',window.MathJax.Hub,node]);
    } else if ((attempts || 0) < 20) {
      window.setTimeout(function () { typeset(node,(attempts || 0)+1); }, 500);
    }
  }
  function bookmark(e, button) {
    var active = saved.has(e.id);
    button.textContent = active ? '★' : '☆';
    button.setAttribute('aria-pressed',String(active));
    button.setAttribute('aria-label',(active ? '取消收藏：' : '收藏：')+e.title);
    button.title = active ? '取消收藏' : '收藏';
  }
  function field(parent,title,text,cls) {
    if (!text) return;
    var dl = el('dl','ledger-field' + (cls ? ' ledger-field--'+cls : ''));
    dl.append(el('dt','',title),el('dd','',text)); parent.append(dl);
  }
  data.entries.forEach(function (e) {
    var card = el('article','ledger-card'); card.id = 'entry-'+e.id;
    var star = el('button','ledger-bookmark'); star.type='button'; bookmark(e,star);
    star.addEventListener('click',function () {
      if (saved.has(e.id)) saved.delete(e.id); else saved.add(e.id);
      try { localStorage.setItem(key,JSON.stringify(Array.from(saved))); } catch (_) { $('ledger-storage-note').hidden=false; }
      bookmark(e,star); apply();
    });
    var details = el('details'), summary = el('summary');
    var h = el('h3','',e.title); h.id='title-'+e.id;
    card.setAttribute('aria-labelledby',h.id);
    var badges = el('div','ledger-badges');
    badges.append(badge(labels.status[e.status],e.status),badge(labels.evidence[e.evidence]));
    e.topics.forEach(function (t) { badges.append(badge(topics.get(t))); });
    badges.append(badge(labels.priority[e.priority],'priority'));
    summary.append(h,badges,el('p','ledger-summary',e.summary));
    var detail = el('div','ledger-detail'), body = el('div','ledger-body');
    field(body,e.kind === 'ai' ? '跟踪对象' : '精确范围',e.formulation);
    field(body,'已知进展',e.known,'known'); field(body,'缺口 / 边界',e.gap,'gap');
    field(body,'核心方法',e.method); field(body,'关联与推荐',e.relevance); field(body,'下一步',e.next_step);
    var foot = el('div','ledger-foot');
    foot.append(el('span','','来源日期 '+e.source_date),el('span','','最近核查 '+e.checked_on));
    foot.append(link('条目直达',window.location.pathname+'?entry='+encodeURIComponent(e.id)+'#ledger'));
    (e.issues || []).forEach(function (week) { foot.append(link('周报 '+week,'/research/'+week+'/')); });
    body.append(foot);
    var history = el('div','ledger-history');
    (e.history || []).forEach(function (item) { history.append(el('div','',item.date+' · '+item.note)); });
    body.append(history);
    var aside = el('aside','ledger-sources'); aside.append(el('h4','','原始来源 / 核查深度'));
    e.source_ids.forEach(function (id) {
      var s = data.sources[id]; if (!s) return;
      var source = el('div','ledger-source');
      source.append(link(s.title,s.url),el('p','',s.authors),el('p','',s.date+' · '+s.version),el('p','ledger-source-depth',s.read_depth));
      aside.append(source);
    });
    detail.append(body,aside); details.append(summary,detail); card.append(star,details);
    details.addEventListener('toggle',function () { if (details.open) typeset(detail); });
    cardMap.set(e.id,card); detailMap.set(e.id,details);
    e._search = [e.title,e.summary,e.formulation,e.known,e.gap,e.method,e.relevance,e.next_step,e.company,e.topics.map(function(t){return topics.get(t);}).join(' '),e.source_ids.map(function(id){var s=data.sources[id];return s.title+' '+s.authors;}).join(' ')].join(' ').normalize('NFKC').toLocaleLowerCase();
  });
  [
    [data.entries.length,'条记录',''],
    [data.entries.filter(function(e){return e.status==='open';}).length,'原文待解','open'],
    [data.entries.filter(function(e){return e.status==='watch';}).length,'待核验','watch'],
    [data.entries.filter(function(e){return e.status==='preprint';}).length,'预印本进展','result'],
    [data.entries.filter(function(e){return e.kind==='ai';}).length,'AI 动态',''],
    [data.entries.filter(function(e){return e.status==='established';}).length,'已发表结果','result']
  ].forEach(function(stat){var node=el('div','ledger-stat ledger-stat--'+stat[2]);node.append(el('strong','',stat[0]),el('span','',stat[1]));$('ledger-stats').append(node);});
  function choice(parent,key,value,label) {
    var b=el('button','',label); b.type='button'; b.setAttribute('aria-pressed',String(state[key]===value));
    b.addEventListener('click',function(){state[key]=value;limit=8;target=null;apply();});
    parent.append(b);buttonMap.set(key+':'+value,b);
  }
  Object.keys(labels.kind).forEach(function(k){choice($('ledger-kind'),'kind',k,labels.kind[k]);});
  choice($('ledger-topics'),'topic','','全部领域');
  data.topics.forEach(function(t){choice($('ledger-topics'),'topic',t.id,t.label);});
  companies.forEach(function(c){var option=el('option','',c);option.value=c;$('ledger-company').append(option);});
  function syncControls() {
    $('ledger-query').value=state.q;
    ['status','evidence','company','sort'].forEach(function(k){$('ledger-'+k).value=state[k];});
    $('ledger-starred').checked=state.star;
    buttonMap.forEach(function(b,k){var pair=k.split(':');b.setAttribute('aria-pressed',String(state[pair[0]]===pair[1]));});
  }
  function syncUrl() {
    var url=new URL(window.location.href);
    ['q','kind','topic','status','evidence','company','sort','star','entry'].forEach(function(k){url.searchParams.delete(k);});
    Object.keys(state).forEach(function(k){if(state[k] && !(k==='sort'&&state[k]==='priority')) url.searchParams.set(k,k==='star'?'1':state[k]);});
    if(target)url.searchParams.set('entry',target);
    try { window.history.replaceState(null,'',url); } catch (_) { /* Storage restrictions should not disable the ledger. */ }
  }
  function selected() {
    var words=state.q.normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    return data.entries.filter(function(e){
      return (!state.kind||e.kind===state.kind)&&(!state.topic||e.topics.includes(state.topic))&&(!state.status||e.status===state.status)&&(!state.evidence||e.evidence===state.evidence)&&(!state.company||e.company===state.company)&&(!state.star||saved.has(e.id))&&words.every(function(w){return e._search.includes(w);});
    }).sort(function(a,b){
      var order=state.sort==='source'?b.source_date.localeCompare(a.source_date):state.sort==='updated'?b.checked_on.localeCompare(a.checked_on):b.priority-a.priority;
      return order||b.source_date.localeCompare(a.source_date)||a.id.localeCompare(b.id);
    });
  }
  function apply() {
    var rows=selected();
    if(target){var index=rows.findIndex(function(e){return e.id===target;});if(index>=0){limit=Math.max(limit,index+1);detailMap.get(target).open=true;}}
    var container=$('ledger-entries');
    cardMap.forEach(function(card){card.hidden=true;});
    rows.forEach(function(e,i){var card=cardMap.get(e.id);container.append(card);card.hidden=i>=limit;});
    $('ledger-empty').hidden=rows.length>0;
    $('ledger-more').hidden=rows.length<=limit;
    $('ledger-more').textContent='显示更多（还有 '+Math.max(0,rows.length-limit)+' 条）';
    $('ledger-result-count').textContent='显示 '+Math.min(limit,rows.length)+' / '+rows.length+' 条 · 全部 '+data.entries.length+' 条';
    syncControls();syncUrl();
  }
  var timer;
  $('ledger-query').addEventListener('input',function(event){
    state.q=event.target.value;target=null;limit=8;clearTimeout(timer);timer=setTimeout(apply,120);
  });
  ['status','evidence','company','sort'].forEach(function(k){$('ledger-'+k).addEventListener('change',function(e){state[k]=e.target.value;target=null;limit=8;apply();});});
  $('ledger-starred').addEventListener('change',function(e){state.star=e.target.checked;target=null;limit=8;apply();});
  $('ledger-reset').addEventListener('click',function(){clearTimeout(timer);state={q:'',kind:'',topic:'',status:'',evidence:'',company:'',sort:'priority',star:false};target=null;limit=8;apply();});
  $('ledger-more').addEventListener('click',function(){limit+=8;apply();});
  $('ledger-app').hidden=false;
  apply();
  if (!target && selected().length) detailMap.get(selected()[0].id).open=true;
  if(target)requestAnimationFrame(function(){cardMap.get(target).scrollIntoView({block:'start'});});
  typeset(root);
})();
