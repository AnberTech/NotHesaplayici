/* Not Hesaplayıcı sitesi: tema, görünme animasyonu, dil menüsü ve üç hesaplayıcı.
   Hesap kuralları uygulamayla aynı: ortalama aşağı, gereken final yukarı yuvarlanır. */
(function(){
var D=document,$=function(s,r){return (r||D).querySelector(s)},$$=function(s,r){return [].slice.call((r||D).querySelectorAll(s))};
var NH=window.NH||{lang:'en',scale:'us',t:{}},T=NH.t||{};

try{var th=localStorage.getItem('theme');if(th)D.documentElement.dataset.theme=th}catch(e){}
var tb=$('#theme');if(tb)tb.onclick=function(){var d=D.documentElement.dataset.theme==='light'?'dark':'light';D.documentElement.dataset.theme=d;try{localStorage.setItem('theme',d)}catch(e){}};

if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  $$('.reveal').forEach(function(el){io.observe(el)});
}else $$('.reveal').forEach(function(el){el.classList.add('in')});

var lm=$('.lang-menu');
if(lm){D.addEventListener('click',function(e){if(lm.open&&!lm.contains(e.target))lm.open=false});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&lm.open){lm.open=false;$('summary',lm).focus()}})}

$$('.tabs button').forEach(function(b){b.onclick=function(){
  $$('.tabs button').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',String(x===b))});
  $$('.pane').forEach(function(p){p.classList.toggle('on',p.id==='pane-'+b.dataset.tab)})}});

/* harf, en düşük ortalama, katsayı */
var SCALES={
  aa:[['AA',90,4],['BA',85,3.5],['BB',80,3],['CB',75,2.5],['CC',70,2],['DC',65,1.5],['DD',60,1],['FD',50,.5],['FF',0,0]],
  a1:[['A1',95,4],['A2',90,3.75],['A3',85,3.5],['B1',80,3.25],['B2',75,3],['B3',70,2.75],['C1',65,2.5],['C2',60,2.25],['D1',55,2],['D2',50,1.75],['F1',0,0]],
  us:[['A',93,4],['A−',90,3.7],['B+',87,3.3],['B',83,3],['B−',80,2.7],['C+',77,2.3],['C',73,2],['C−',70,1.7],['D+',67,1.3],['D',63,1],['D−',60,.7],['F',0,0]]
};
var DEMO={aa:['BA','BB','AA'],a1:['A3','B2','A1'],us:['A−','B','A']};
/* hedef harf notu için varsayılan: en düşük geçer not */
var PASS={aa:'DD',a1:'D2',us:'D−'};
function fmt(x,d){try{return x.toLocaleString(NH.lang,{minimumFractionDigits:d,maximumFractionDigits:d})}catch(e){return x.toFixed(d)}}
function num(box,k,def){var el=$('[data-k='+k+']',box);if(!el||el.value==='')return def||0;var v=parseFloat(String(el.value).replace(',','.'));return isNaN(v)?(def||0):Math.max(0,Math.min(100,v))}
function scaleKey(box){var s=$('[data-k=scale]',box);return s&&SCALES[s.value]?s.value:(SCALES[NH.scale]?NH.scale:'us')}
function letter(sc,x){for(var i=0;i<sc.length;i++)if(x>=sc[i][1])return sc[i][0];return sc[sc.length-1][0]}
function out(box,k,v){var el=$('[data-o='+k+']',box);if(el)el.textContent=v}
function weights(box){var mw=num(box,'midw'),hw=num(box,'hww'),fw=100-mw-hw;out(box,'fw',fw>=0?fmt(fw,0)+'%':'—');return {mw:mw,hw:hw,fw:fw}}

/* gereken final: (hedef × 100 − vize × vize ağırlığı − ödev × ödev ağırlığı) ÷ final ağırlığı, yukarı yuvarlanır;
   final barajı varsa sonuç barajdan düşük olamaz */
function need(target,w,mid,hw,minf){
  var pay=target*100-mid*w.mw-hw*w.hw,n;
  if(w.fw<=0)n=pay<=0?0:Infinity;else n=pay<=0?0:Math.ceil(pay/w.fw-1e-9);
  if(n<=100&&minf>n)n=minf;
  return n;
}

var calcs={
  avg:function(box){
    var w=weights(box),f=num(box,'final'),sc=SCALES[scaleKey(box)];
    var r=$('[data-k=finalr]',box);if(r&&D.activeElement!==r)r.value=f;
    if(w.fw<0){out(box,'avg','—');out(box,'letter','—');out(box,'msg',T.weights||'');return}
    var exact=num(box,'mid')*w.mw/100+num(box,'hw')*w.hw/100+f*w.fw/100,a=Math.floor(exact+1e-9);
    out(box,'avg',fmt(a,0));out(box,'letter',letter(sc,a));out(box,'msg',Math.abs(exact-a)>1e-9?'= '+fmt(exact,2):'');
  },
  need:function(box){
    var w=weights(box),mid=num(box,'mid'),hw=num(box,'hw'),minf=num(box,'minf'),sc=SCALES[scaleKey(box)],pass=targetMin(box,sc);
    var tb=$('[data-o=table]',box);
    if(w.fw<0){out(box,'need','—');out(box,'msg',T.weights||'');if(tb)tb.innerHTML='';return}
    var n=need(pass,w,mid,hw,minf),msg='';
    if(n>100){out(box,'need','>100');msg=T.impossible}
    else{out(box,'need',fmt(n,0));if(n===0)msg=T.already;else if(minf>0&&n===minf&&need(pass,w,mid,hw,0)<minf)msg=(T.baraj||'').replace('%d',fmt(minf,0))}
    out(box,'msg',msg||'');
    if(!tb)return;
    tb.innerHTML='';
    sc.forEach(function(g){if(g[1]<=0)return;var v=need(g[1],w,mid,hw,minf),tr=D.createElement('tr');
      tr.className=(v>100?'na':(v===0?'ok':''))+(g[1]===pass?' hit':'');
      [g[0],fmt(g[1],0),fmt(g[2],2),v>100?'>100':fmt(v,0)].forEach(function(c,i){var td=D.createElement('td'),sp=D.createElement('span');sp.dir='ltr';sp.textContent=c;td.appendChild(sp);if(i===3){td.className='n';if(v>100)td.title=T.impossible||''}tr.appendChild(td)});
      tb.appendChild(tr)});
  },
  gpa:function(box){
    var pts={},tot=0,k=0;SCALES[scaleKey(box)].forEach(function(g){pts[g[0]]=g[2]});
    $$('.row',box).forEach(function(r){var c=parseFloat(String($('.cc',r).value).replace(',','.'))||0,g=$('.cg',r).value;if(c>0&&g in pts){tot+=c*pts[g];k+=c}});
    out(box,'gpa',fmt(k?tot/k:0,2));out(box,'credits',fmt(k,0));
  }
};
function targetMin(box,sc){var t=$('[data-k=target]',box);if(!t)return 50;for(var i=0;i<sc.length;i++)if(sc[i][0]===t.value)return sc[i][1];return 50}
function fillTargets(box,key){var t=$('[data-k=target]',box);if(!t)return;t.innerHTML='';
  SCALES[key].forEach(function(g){if(g[1]<=0)return;var o=D.createElement('option');o.value=g[0];o.textContent=g[0]+' (≥ '+fmt(g[1],0)+')';t.appendChild(o)});t.value=PASS[key]}
function run(box){var f=calcs[box.dataset.calc];if(f)f(box)}

function fillLetters(sel,sc,val){sel.innerHTML='';sc.forEach(function(g){var o=D.createElement('option');o.textContent=g[0];sel.appendChild(o)});sel.value=val||sc[Math.min(4,sc.length-1)][0]}
function addRow(box,name,c,g){
  var t=$('template',box).content.cloneNode(true),r=$('.row',t);
  $('.cn',r).value=name||'';$('.cc',r).value=c;fillLetters($('.cg',r),SCALES[scaleKey(box)],g);
  $('.x',r).onclick=function(){r.remove();run(box)};$('[data-o=rows]',box).appendChild(r);
}
function demoRows(box){
  var names=T.courses||['','',''],L=DEMO[scaleKey(box)]||DEMO.us;
  $('[data-o=rows]',box).innerHTML='';[[names[0],4,L[0]],[names[1],3,L[1]],[names[2],3,L[2]]].forEach(function(x){addRow(box,x[0],x[1],x[2])});
}
/* not sistemi seçimi sayfadaki bütün hesaplayıcılarda ortak */
function setScale(key){
  $$('[data-calc]').forEach(function(box){
    var s=$('[data-k=scale]',box);if(s)s.value=key;
    if(box.dataset.sc!==key){if(box.dataset.calc==='gpa')demoRows(box);fillTargets(box,key)}
    box.dataset.sc=key;
    run(box)});
}

$$('[data-calc]').forEach(function(box){
  if(box.dataset.calc==='gpa')$('[data-act=add]',box).onclick=function(){addRow(box,'',3);run(box)};
  box.addEventListener('input',function(e){
    var k=e.target.dataset.k;if(k==='scale')return;
    if(k==='finalr'){var f=$('[data-k=final]',box);if(f)f.value=e.target.value}
    run(box)});
  box.addEventListener('change',function(e){if(e.target.dataset.k==='scale')setScale(e.target.value);else run(box)});
});
/* adresle doldurma: ?mid=55&midw=40&target=CC&scale=aa (yapay zekâ asistanları hazır sonuç linki verebilsin diye) */
var Q={};try{new URLSearchParams(location.search).forEach(function(v,k){Q[k]=v})}catch(e){}
setScale(SCALES[Q.scale]?Q.scale:(SCALES[NH.scale]?NH.scale:'us'));
var first=$('[data-calc]');
if(first&&Object.keys(Q).length){
  ['mid','midw','hw','hww','final','minf'].forEach(function(k){var el=$('[data-k='+k+']',first);if(el&&Q[k]!=null&&!isNaN(parseFloat(Q[k])))el.value=Math.max(0,Math.min(100,parseFloat(Q[k])))});
  var tg=$('[data-k=target]',first);if(tg&&Q.target){var want=Q.target.replace(/-/g,'−').toUpperCase().replace('−','−');[].forEach.call(tg.options,function(o){if(o.value.toUpperCase()===want)tg.value=o.value})}
  run(first);
}
})();
