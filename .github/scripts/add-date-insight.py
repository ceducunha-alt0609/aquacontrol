from pathlib import Path
p=Path('index.html'); s=p.read_text(encoding='utf-8')
old='<input type="date" id="in-termino" onchange="setTermino(this.value)" style="height:34px;padding:0 10px;font-size:12px;border:1.5px solid var(--border);border-radius:var(--r);background:var(--bg2);color:var(--text);font-family:var(--body)">\n <span id="termino-info" style="font-size:12px;flex:1"></span>'
new='<input type="date" id="in-termino" oninput="validarDataTerminoInsight(this.value)" onchange="setTermino(this.value)" style="height:34px;padding:0 10px;font-size:12px;border:1.5px solid var(--border);border-radius:var(--r);background:var(--bg2);color:var(--text);font-family:var(--body)">\n <span id="termino-info" style="font-size:12px;flex:1"></span>\n <span id="termino-date-insight" style="display:none;flex:1 1 100%;padding:7px 9px;border-radius:8px;background:var(--amber-l);border:1px solid rgba(215,140,0,.35);color:var(--amber);font-size:11px;font-weight:700;line-height:1.35">⚠️ Confira a data informada.</span>'
assert s.count(old)==1
s=s.replace(old,new,1)
marker='function setTermino(val){'
helper="""function validarDataTerminoInsight(val){
  const c=getCiclo(curIdx),inp=document.getElementById('in-termino'),box=document.getElementById('termino-date-insight');
  if(!box||!inp)return; box.style.display='none'; inp.style.borderColor=''; inp.style.boxShadow=''; if(!c||!val)return;
  let ref=null; if(c.lancamentos&&c.lancamentos.length)ref=[...c.lancamentos].sort((a,b)=>a.data.localeCompare(b.data)).slice(-1)[0].data; else if(c.leituraAnterior&&c.leituraAnterior.data)ref=c.leituraAnterior.data; if(!ref)return;
  const d=diffDias(ref,val); let msg=''; if(d<0)msg='⚠️ Confira a data: ela é anterior à última leitura registrada ('+fmtFull(ref)+').'; else if(d>45)msg='⚠️ Confira a data: ela está '+d+' dias após a última leitura ('+fmtFull(ref)+'). O período parece fora do padrão.';
  if(msg){box.textContent=msg;box.style.display='block';inp.style.borderColor='var(--amber)';inp.style.boxShadow='0 0 0 3px rgba(215,140,0,.12)';}
}
"""
assert s.count(marker)==1; s=s.replace(marker,helper+marker,1)
old2='<div class="fg"><label>Próxima leitura prevista</label><input type="date" id="sab-prox-leit"></div>'
new2='<div class="fg"><label>Próxima leitura prevista</label><input type="date" id="sab-prox-leit" oninput="validarSabespDataInsight(this.value)"><div id="sab-prox-insight" style="display:none;margin-top:6px;padding:7px 9px;border-radius:8px;background:var(--amber-l);border:1px solid rgba(215,140,0,.35);color:var(--amber);font-size:11px;font-weight:700;line-height:1.35">⚠️ Confira a data informada.</div></div>'
assert s.count(old2)==1; s=s.replace(old2,new2,1)
marker2='function importarContaSabesp(){'
helper2="""function validarSabespDataInsight(val){
  const box=document.getElementById('sab-prox-insight'),inp=document.getElementById('sab-prox-leit'),at=document.getElementById('sab-data-atual'); if(!box||!inp)return; box.style.display='none'; inp.style.borderColor=''; inp.style.boxShadow=''; if(!val)return;
  let ref=at&&at.value?at.value:null; const c=getCiclo(curIdx); if(!ref&&c&&c.lancamentos&&c.lancamentos.length)ref=[...c.lancamentos].sort((a,b)=>a.data.localeCompare(b.data)).slice(-1)[0].data; if(!ref)return;
  const d=diffDias(ref,val); let msg=''; if(d<0)msg='⚠️ Confira a data: a próxima leitura está anterior à leitura atual ('+fmtFull(ref)+').'; else if(d>45)msg='⚠️ Confira a data: intervalo de '+d+' dias desde a leitura atual. O período parece fora do padrão.';
  if(msg){box.textContent=msg;box.style.display='block';inp.style.borderColor='var(--amber)';inp.style.boxShadow='0 0 0 3px rgba(215,140,0,.12)';}
}
"""
assert s.count(marker2)==1; s=s.replace(marker2,helper2+marker2,1)
p.write_text(s,encoding='utf-8')
