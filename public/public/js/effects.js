(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar=document.createElement('div');bar.id='bar';document.body.appendChild(bar);

  // スクロールで要素がふわっと現れる
  var targets=document.querySelectorAll('.hero h1,.hero p,h2,.card:not(.dog)');
  targets.forEach(function(el,i){el.classList.add('reveal');});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);}});
    },{threshold:0.15});
    targets.forEach(function(el){io.observe(el);});
  }else{targets.forEach(function(el){el.classList.add('show');});}

  // スクロール進捗バー＋トップ画像のゆるいパララックス
  var hero=document.querySelector('.hero-img'),ticking=false;
  function onScroll(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?window.scrollY/h*100:0)+'%';
    if(hero&&!reduce){hero.style.transform='translateY('+Math.min(window.scrollY*0.12,60)+'px)';}
    ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});

  // 背景をふわふわ舞う肉球
  function spawnPaw(){
    var p=document.createElement('span');p.className='paw';p.textContent='\uD83D\uDC3E';
    p.style.left=Math.random()*95+'vw';p.style.fontSize=(16+Math.random()*20)+'px';
    p.style.animationDuration=(9+Math.random()*7)+'s';
    p.addEventListener('animationend',function(){p.remove();});
    document.body.appendChild(p);
  }
  if(!reduce){spawnPaw();setInterval(function(){if(!document.hidden)spawnPaw();},1400);}

  // タップ位置から肉球がぽんっと飛び出す
  function burst(x,y,n){
    if(reduce)return;
    for(var i=0;i<n;i++){
      var b=document.createElement('span');b.className='burst';b.textContent='\uD83D\uDC3E';
      var a=Math.random()*Math.PI*2,d=40+Math.random()*60;
      b.style.left=x+'px';b.style.top=y+'px';
      b.style.setProperty('--dx',Math.cos(a)*d+'px');b.style.setProperty('--dy',Math.sin(a)*d+'px');
      b.addEventListener('animationend',function(){this.remove();});
      document.body.appendChild(b);
    }
  }
  if(hero){hero.addEventListener('click',function(e){burst(e.clientX,e.clientY,7);});}

})();
