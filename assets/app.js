
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var I=window.I18N||{};
try{var th=localStorage.getItem('theme');if(th)document.documentElement.dataset.theme=th}catch(e){}
var tb=$('#theme');if(tb)tb.onclick=function(){var d=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=d;try{localStorage.setItem('theme',d)}catch(e){}};
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
$$('.reveal').forEach(function(el){io.observe(el)});
if(!$('#demo'))return;
function n(id){var v=parseFloat($(id).value);return isNaN(v)?0:Math.max(0,Math.min(100,v))}
var scale=[[90,'AA'],[85,'BA'],[80,'BB'],[75,'CB'],[70,'CC'],[65,'DC'],[60,'DD'],[50,'FD'],[0,'FF']];
var pts={AA:4,BA:3.5,BB:3,CB:2.5,CC:2,DC:1.5,DD:1,FD:.5,FF:0};
function letter(x){for(var i=0;i<scale.length;i++)if(x>=scale[i][0])return scale[i][1]}
function A(){var w=n('#a-w')/100,r=n('#a-v')*w+n('#a-f')*(1-w);$('#a-r').textContent=r.toFixed(2);$('#a-l').textContent=letter(r)}
function B(){var w=n('#b-w')/100,v=n('#b-v'),p=n('#b-p');var o=$('#b-r'),note=$('#b-n');
 if(w>=1){o.textContent='—';note.textContent='';return}
 var need=(p-v*w)/(1-w);
 if(need<=0){o.textContent='0';note.textContent=I.already}
 else if(need>100){o.textContent='>100';note.textContent=I.impossible}
 else{o.textContent=need.toFixed(1);note.textContent=''}}
function C(){var tot=0,k=0;$$('#rows .row').forEach(function(r){var c=parseFloat($('.cc',r).value)||0;tot+=c*pts[$('.cg',r).value];k+=c});
 $('#c-r').textContent=(k?tot/k:0).toFixed(2);$('#c-k').textContent=k}
['#a-v','#a-f','#a-w'].forEach(function(s){$(s).oninput=function(){if(s==='#a-f')$('#a-fs').value=$(s).value;A()}});
$('#a-fs').oninput=function(){$('#a-f').value=this.value;A()};
['#b-v','#b-w','#b-p'].forEach(function(s){$(s).oninput=B});
function addRow(name,c,g){var t=$('#rowtpl').content.cloneNode(true),r=$('.row',t);$('.cn',r).value=name||'';$('.cc',r).value=c;$('.cg',r).value=g;
 r.oninput=C;$('.x',r).onclick=function(){r.remove();C()};$('#rows').appendChild(t);C()}
$('#addrow').onclick=function(){addRow('',3,'CC')};
var tr=I.lang==='tr';
[[tr?'Matematik':'Calculus',4,'BA'],[tr?'Fizik':'Physics',3,'BB'],[tr?'Biyoloji':'Biology',3,'AA']].forEach(function(x){addRow(x[0],x[1],x[2])});
$$('.tabs button').forEach(function(b){b.onclick=function(){$$('.tabs button').forEach(function(x){x.classList.toggle('on',x===b)});$$('.pane').forEach(function(p){p.classList.toggle('on',p.id==='pane-'+b.dataset.tab)})}});
A();B();C();
})();
