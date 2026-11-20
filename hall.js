/* Magic Hall public edition, 2026-11-20.
 * Derived from the Kiro-built gallery first created on 2026-11-17.
 * The candle/glow model continues that design. This edition uses local,
 * original fictional assets only. There is no archive API or polling.
 */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const canvas = $('sky');
  const ctx = canvas.getContext('2d');
  const audio = $('audio');
  const reducedMotionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const ui = {
    en: {
      about:'The idea',eyebrow:'A LIVING MEMORY GALLERY',intro:'Some moments deserve more than a folder.',
      introDetail:'A gold candle holds a picture. A blue candle holds a song.<br>Each one remembers where it began.',
      loading:'Lighting the candles…',enter:'Enter the hall',soundNote:'Enter with sound · mute any time',
      sampleNote:'An original, fictional collection made for this public demo.',exploreEyebrow:'YOUR MEMORIES, ALIGHT',
      exploreTitle:'Follow a little light.',exploreDetail:'<span class="gold-dot"></span> Gold for art <span class="blue-dot"></span> Blue for music',
      nowPlaying:'THE BLUE CANDLES',sourceShort:'Its story ↗',nextArt:'Find a picture',nextSong:'Another song',collection:'Collection',
      sceneFootnote:'Fictional demo collection · no personal archive',artEyebrow:'FROM A GOLDEN CANDLE',source:'Return to the conversation ↗',
      storyEyebrow:'WHERE IT BEGAN',fictionLabel:'Fictional conversation · created for this demo',
      storyFootnote:'A creation is richer when you can return to its first spark.',collectionEyebrow:'A FEW THINGS WORTH KEEPING',
      collectionTitle:'The collection',aboutEyebrow:'THE IDEA BEHIND THE HALL',aboutTitle:'Keep the spark.',
      aboutText:'We create pictures, music and stories in conversation. Then we lose them in folders. Magic Hall turns those scattered creations into a place you can return to—and keeps the conversation attached.',
      aboutDetail:'This public edition uses only an original fictional collection. Every gold candle opens art, every blue candle plays music, and every story opens here in the hall.',
      aboutExplore:'Back to the hall',settingsEyebrow:'MAKE YOURSELF AT HOME',settingsTitle:'Atmosphere',candlelight:'Candlelight',
      volume:'Music volume',gentleMotion:'Gentle motion',copyLook:'Copy atmosphere settings',copied:'Copied.',copyFailed:'Clipboard unavailable in this browser.',
      originalArt:'Original demo artwork',originalMusic:'Original demo score',art:'ART',music:'MUSIC',play:'Play music',pause:'Pause music',
      mute:'Mute music',unmute:'Unmute music',view:'View',listen:'Listen to',settings:'Atmosphere settings',
      loadError:'The collection could not load. Please reload the page.',audioError:'This track could not play. Try another song.',audioBlocked:'Tap play to begin the music.'
    },
    zh: {
      about:'大殿的由来',eyebrow:'一座会发光的记忆画廊',intro:'有些时刻，值得一个比文件夹更美的去处。',
      introDetail:'金色烛火里藏着一幅画，蓝色烛火里藏着一首歌。<br>每一盏，都记得它从哪里来。',
      loading:'正在点亮烛火……',enter:'推门进去',soundNote:'入场会响起音乐 · 随时可以静音',
      sampleNote:'本公开演示使用专门创作的虚构画作、音乐与对话。',exploreEyebrow:'让记忆重新亮起来',
      exploreTitle:'循着一小束光。',exploreDetail:'<span class="gold-dot"></span> 金色是画 <span class="blue-dot"></span> 蓝色是歌',
      nowPlaying:'蓝色烛火正在歌唱',sourceShort:'这首歌的来处 ↗',nextArt:'找一幅画',nextSong:'换一首歌',collection:'藏品',
      sceneFootnote:'虚构演示藏品 · 不含个人资料库',artEyebrow:'来自一盏金色烛火',source:'潜回那段对话 ↗',
      storyEyebrow:'它诞生的那一刻',fictionLabel:'虚构对话 · 为本演示创作',
      storyFootnote:'一件作品的温度，也藏在它最初的那一点心动里。',collectionEyebrow:'几件值得留住的小事',collectionTitle:'藏品',
      aboutEyebrow:'大殿的由来',aboutTitle:'把心动留下来。',
      aboutText:'我们在对话里创造画、音乐和故事，然后把它们留在文件夹里。魔法大殿把散落的作品变成一个可以重访的地方，也把它诞生的那段对话一起留住。',
      aboutDetail:'这个公开版本只使用原创的虚构示例。点金烛看画，点蓝烛听歌，每一件作品的来源对话都能在大殿里打开。',
      aboutExplore:'回到大殿',settingsEyebrow:'调成你喜欢的样子',settingsTitle:'大殿的气氛',candlelight:'烛光亮度',volume:'音乐音量',
      gentleMotion:'轻柔动画',copyLook:'复制气氛设置',copied:'已复制。',copyFailed:'当前浏览器暂不能复制。',
      originalArt:'原创演示画作',originalMusic:'原创演示音乐',art:'画作',music:'音乐',play:'播放音乐',pause:'暂停音乐',
      mute:'静音',unmute:'开启声音',view:'欣赏',listen:'聆听',settings:'气氛设置',
      loadError:'藏品未能加载，请刷新页面。',audioError:'这首歌暂时无法播放，请换一首。',audioBlocked:'点击播放，让音乐响起来。'
    }
  };
  let lang = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
  let W=0,H=0,DPR=1,unit=1,entered=false;
  let data={paintings:[],songs:[],stories:[]},candles=[],stars=[],hover=null;
  let currentArt=null,currentSong=null,currentStory=null,lastArtIndex=-1;
  let glowAmount=1,motion=!reducedMotionQuery.matches;
  let audioContext=null,analyser=null,frequencies=null,level=0;
  let frameRequest=0;
  audio.volume=.35;
  const tr = (key) => ui[lang][key] || key;
  const localized = (value) => typeof value==='object' ? (value[lang] || value.en || '') : (value || '');
  const rand=(a,b)=>a+Math.random()*(b-a);
  const lerp=(a,b,t)=>a+(b-a)*t;
  const announce=(text)=>{$('status').textContent=text;};
  const chooseDifferent=(length,previous)=> length>1 ? (previous+1+Math.floor(Math.random()*(length-1)))%length : 0;

  // The original Kiro design uses pre-rendered glow sprites and depth-aware candles.
  function glowSprite(inner,mid,outer){
    const c=document.createElement('canvas');c.width=c.height=128;
    const g=c.getContext('2d'),gradient=g.createRadialGradient(64,64,0,64,64,64);
    gradient.addColorStop(0,inner);gradient.addColorStop(.18,mid);gradient.addColorStop(1,outer);
    g.fillStyle=gradient;g.fillRect(0,0,128,128);return c;
  }
  const goldGlow=glowSprite('rgba(255,244,214,1)','rgba(255,190,90,.55)','rgba(255,150,40,0)');
  const blueGlow=glowSprite('rgba(235,248,255,1)','rgba(120,180,255,.55)','rgba(60,110,255,0)');
  function placeCandle(kind,index){
    const d=Math.pow(Math.random(),.8),spread=lerp(.88,.40,d);
    return {kind,d,u:.5+(Math.random()-.5)*spread,v:lerp(.15,.46,d*.75+Math.random()*.25),
      size:lerp(1,.31,d),phase:rand(0,Math.PI*2),bob:rand(.25,.55),flick:rand(2,5),
      item:kind==='gold'?data.paintings[index%data.paintings.length]:data.songs[index%data.songs.length],out:false,flash:0,button:null};
  }
  function build(){
    const mobile=W<760;
    candles=[...Array.from({length:mobile?22:52},(_,i)=>placeCandle('gold',i)),...Array.from({length:mobile?10:20},(_,i)=>placeCandle('blue',i))];
    candles.sort((a,b)=>b.d-a.d);
    stars=Array.from({length:mobile?105:210},()=>({u:Math.random(),v:Math.random()*.60,r:rand(.3,1.1),tw:rand(.5,2),ph:rand(0,6.28)}));
    const targets=$('candleTargets');targets.replaceChildren();
    candles.forEach((c,i)=>{
      const b=document.createElement('button');b.className='candle-target';b.type='button';
      b.dataset.kind=c.kind;b.dataset.item=c.item.id;b.dataset.candle=String(i);
      b.setAttribute('aria-label',`${c.kind==='gold'?tr('view'):tr('listen')} ${localized(c.item.title)}`);
      b.addEventListener('click',()=>activateCandle(c));
      b.addEventListener('pointerenter',()=>setHover(c));b.addEventListener('focus',()=>setHover(c));
      b.addEventListener('pointerleave',clearHover);b.addEventListener('blur',clearHover);
      c.button=b;targets.append(b);
    });
  }
  function resize(){
    const previousMobile=W<760;
    W=innerWidth;H=innerHeight;DPR=Math.min(devicePixelRatio||1,2);
    canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
    unit=Math.max(.85,Math.min(W,H*1.6)/1000);
    if(candles.length && previousMobile!==(W<760))build();
  }
  function posOf(c,t){
    const bob=motion?Math.sin(t*c.bob+c.phase)*5*c.size*unit:0;
    const sway=motion?Math.sin(t*c.bob*.6+c.phase*2)*3*c.size*unit:0;
    return{x:c.u*W+sway,y:c.v*H+bob};
  }
  function frame(ms){
    const t=motion?ms/1000:0;
    if(analyser && !audio.paused){analyser.getByteFrequencyData(frequencies);let sum=0;for(let i=2;i<40;i++)sum+=frequencies[i];level=lerp(level,sum/(38*255),.12);}else level=lerp(level,0,.10);
    ctx.clearRect(0,0,W,H);
    for(const s of stars){const alpha=motion?.25+.35*(.5+.5*Math.sin(t*s.tw+s.ph)):.4;ctx.fillStyle=`rgba(220,230,255,${alpha})`;ctx.fillRect(s.u*W,s.v*H,s.r*unit,s.r*unit);}
    ctx.globalCompositeOperation='lighter';
    for(const c of candles){
      const {x,y}=posOf(c,t);
      if(c.button){c.button.style.left=x+'px';c.button.style.top=y+'px';}
      if(c.out)continue;
      const flick=motion?.85+.15*Math.sin(t*c.flick*3+c.phase)*Math.sin(t*c.flick*1.7):1;
      const playing=c.kind==='blue'&&currentSong===c.item&&!audio.paused;
      const boost=1+level*.9+(hover===c?.9:0)+c.flash+(playing?.6:0);
      const size=c.size*unit,glowR=31*size*flick*(.85+.35*boost);
      ctx.globalAlpha=Math.min(1,(.35+.5*(1-c.d))*(.75+.25*boost)*glowAmount);
      ctx.drawImage(c.kind==='gold'?goldGlow:blueGlow,x-glowR,y-glowR,glowR*2,glowR*2);
      if(c.flash>0)c.flash=Math.max(0,c.flash-.018);
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    for(const c of candles){
      if(c.out||c.size<.43)continue;const {x,y}=posOf(c,t),size=c.size*unit;
      const flick=motion?1+.12*Math.sin(t*c.flick*4+c.phase):1;
      ctx.fillStyle=c.kind==='gold'?'rgba(246,232,205,.92)':'rgba(214,228,250,.9)';
      ctx.fillRect(x-2.2*size,y+3*size,4.4*size,15*size);ctx.beginPath();
      ctx.ellipse(x,y,2.1*size,4.6*size*flick,0,0,Math.PI*2);ctx.fillStyle='#fff7e6';ctx.fill();
    }
    if(hover && !$('hint').hidden){const p=posOf(hover,t);$('hint').style.left=Math.max(120,Math.min(W-120,p.x))+'px';$('hint').style.top=Math.max(98,p.y-18)+'px';}
    frameRequest=requestAnimationFrame(frame);
  }
  function setHover(c){if(!entered)return;hover=c;$('hint').textContent=`${c.kind==='gold'?tr('art'):tr('music')} · ${localized(c.item.title)}`;$('hint').hidden=false;}
  function clearHover(){hover=null;$('hint').hidden=true;}
  function activateCandle(c){if(!entered)return;c.flash=1;clearHover();if(c.kind==='gold')showArt(c.item);else playSong(c.item);}
  function showArt(item){
    currentArt=item;lastArtIndex=data.paintings.indexOf(item);updateArt();
    if(!$('artDialog').open)$('artDialog').showModal();
    announce(`${tr('view')} ${localized(item.title)}`);
  }
  function updateArt(){if(!currentArt)return;$('artImage').src=currentArt.src;$('artImage').alt=localized(currentArt.alt);$('artTitle').textContent=localized(currentArt.title);$('artDescription').textContent=localized(currentArt.description);$('artMeta').textContent=tr('originalArt');}
  function nextArt(){if(!data.paintings.length)return;showArt(data.paintings[chooseDifferent(data.paintings.length,lastArtIndex)]);}
  function hookAnalyser(){
    if(audioContext){audioContext.resume().catch(()=>{});return;}
    try{audioContext=new(window.AudioContext||window.webkitAudioContext)();const source=audioContext.createMediaElementSource(audio);analyser=audioContext.createAnalyser();analyser.fftSize=256;frequencies=new Uint8Array(analyser.frequencyBinCount);source.connect(analyser);analyser.connect(audioContext.destination);audioContext.resume().catch(()=>{});}catch{analyser=null;}
  }
  async function playSong(item){
    if(!item)return;hookAnalyser();currentSong=item;
    if(audio.getAttribute('src')!==item.src)audio.src=item.src;
    $('player').hidden=false;updateTrack();
    try{await audio.play();announce(`${tr('listen')} ${localized(item.title)}`);}catch{announce(tr('audioBlocked'));}
  }
  function nextSong(){if(!data.songs.length)return;const old=data.songs.indexOf(currentSong);playSong(data.songs[chooseDifferent(data.songs.length,old)]);}
  function updateTrack(){
    if(currentSong){$('songTitle').textContent=localized(currentSong.title);$('songMeta').textContent=tr('originalMusic');}
    $('player').classList.toggle('paused',audio.paused);
    $('playPause').setAttribute('aria-label',tr(audio.paused?'play':'pause'));
    $('playPause').firstElementChild.textContent=audio.paused?'▶':'Ⅱ';
    $('mute').textContent=audio.muted?'♩':'♪';$('mute').setAttribute('aria-label',tr(audio.muted?'unmute':'mute'));$('mute').title=tr(audio.muted?'unmute':'mute');
  }
  function openStory(id){currentStory=data.stories.find(s=>s.id===id);if(!currentStory)return;updateStory();if(!$('storyDialog').open)$('storyDialog').showModal();}
  function updateStory(){
    if(!currentStory)return;$('storyTitle').textContent=localized(currentStory.title);$('storyMessages').replaceChildren();
    for(const message of currentStory.messages){const article=document.createElement('article');article.className=`story-message ${message.role}`;const speaker=document.createElement('p');speaker.className='speaker';speaker.textContent=localized(message.speaker);const body=document.createElement('p');body.textContent=localized(message.text);article.append(speaker,body);$('storyMessages').append(article);}
  }
  function buildCollection(){
    const grid=$('collectionGrid');grid.replaceChildren();
    for(const item of data.paintings){const button=document.createElement('button');button.className='collection-item';const image=document.createElement('img');image.src=item.src;image.alt=localized(item.alt);image.loading='lazy';const title=document.createElement('span');title.className='item-title';title.textContent=localized(item.title);const kind=document.createElement('span');kind.className='item-kind';kind.textContent=tr('art');button.append(image,title,kind);button.onclick=()=>{$('collectionDialog').close();showArt(item);};grid.append(button);}
    for(const item of data.songs){const button=document.createElement('button');button.className='collection-item music';const title=document.createElement('span');title.className='item-title';title.textContent='♪  '+localized(item.title);const kind=document.createElement('span');kind.className='item-kind';kind.textContent=tr('music')+' · '+tr('originalMusic');button.append(title,kind);button.onclick=()=>{$('collectionDialog').close();playSong(item);};grid.append(button);}
  }
  function translate(){
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=lang==='zh'?'魔法大殿 — 会发光的记忆画廊':'Magic Hall — A living memory gallery';
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=tr(el.dataset.i18n);});
    $('languageButton').textContent=lang==='en'?'中文':'EN';$('languageButton').setAttribute('aria-label',lang==='en'?'Switch to Chinese':'Switch to English');
    $('settingsButton').setAttribute('aria-label',tr('settings'));$('settingsButton').title=tr('settings');
    if(data.paintings.length)$('enter').firstElementChild.textContent=tr('enter');
    for(const c of candles)c.button.setAttribute('aria-label',`${c.kind==='gold'?tr('view'):tr('listen')} ${localized(c.item.title)}`);
    updateArt();updateTrack();updateStory();
    if($('collectionDialog').open)buildCollection();
  }
  function enter(){
    if(entered||!data.paintings.length)return;entered=true;$('door').classList.add('open');$('experience').inert=false;
    ['candleTargets','controls','sceneCaption','sceneFootnote'].forEach(id=>$(id).hidden=false);
    setTimeout(()=>{$('door').hidden=true;},reducedMotionQuery.matches?0:650);
    playSong(data.songs[0]);$('nextArt').focus({preventScroll:true});
  }
  const close=(id)=>$(id).close();
  $('enter').onclick=enter;$('nextArt').onclick=nextArt;$('nextSong').onclick=nextSong;
  $('artClose').onclick=()=>close('artDialog');$('storyClose').onclick=()=>close('storyDialog');$('collectionClose').onclick=()=>close('collectionDialog');
  $('aboutClose').onclick=$('aboutExplore').onclick=()=>close('aboutDialog');$('settingsClose').onclick=()=>close('settingsDialog');
  $('aboutButton').onclick=()=>$('aboutDialog').showModal();$('settingsButton').onclick=()=>$('settingsDialog').showModal();
  $('collectionButton').onclick=()=>{buildCollection();$('collectionDialog').showModal();};
  $('artSource').onclick=()=>currentArt&&openStory(currentArt.story);$('songSource').onclick=()=>currentSong&&openStory(currentSong.story);
  $('languageButton').onclick=()=>{lang=lang==='en'?'zh':'en';translate();};
  $('playPause').onclick=()=>{if(!currentSong){nextSong();return;}if(audio.paused)playSong(currentSong);else audio.pause();};
  $('mute').onclick=()=>{audio.muted=!audio.muted;updateTrack();};
  $('glow').oninput=(e)=>{glowAmount=Number(e.target.value);};$('volume').oninput=(e)=>{audio.volume=Number(e.target.value);};
  $('motion').checked=motion;$('motion').onchange=(e)=>{motion=e.target.checked;};
  reducedMotionQuery.addEventListener('change',e=>{motion=!e.matches;$('motion').checked=motion;});
  $('copyLook').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify({candlelight:glowAmount,volume:audio.volume,motion},null,2));$('copyStatus').textContent=tr('copied');}catch{$('copyStatus').textContent=tr('copyFailed');}};
  audio.addEventListener('play',updateTrack);audio.addEventListener('pause',updateTrack);audio.addEventListener('error',()=>{updateTrack();announce(tr('audioError'));});
  for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frameRequest);frameRequest=0;}else if(!frameRequest)frameRequest=requestAnimationFrame(frame);});
  translate();
  fetch('data/gallery.json').then(r=>{if(!r.ok)throw new Error('Collection unavailable');return r.json();}).then(collection=>{
    if(!collection.paintings?.length||!collection.songs?.length||!collection.stories?.length)throw new Error('Collection incomplete');
    data=collection;resize();build();translate();$('enter').disabled=false;frameRequest=requestAnimationFrame(frame);
  }).catch(()=>{$('enter').disabled=true;$('enter').firstElementChild.textContent=tr('loadError');announce(tr('loadError'));});
})();
