(function(){
  var home=document.querySelector('main'),homeTitle=document.title;
  var view=document.createElement('main');view.className='wrap';view.id='article-view';view.hidden=true;
  home.parentNode.insertBefore(view,home.nextSibling);
  var list=document.getElementById('post-list'),posts=[],cache={};

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
  function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
  function show(d){return d.replace(/-/g,'.');}

  // 記事ファイルの書き方：「## 見出し」「[img:画像のパス]」、空行で段落を区切る
  function parse(text){
    return text.replace(/\r/g,'').split(/\n{2,}/).map(function(b){
      b=b.trim();if(!b)return '';
      if(b.indexOf('## ')===0)return '<h2 class="sub">'+esc(b.slice(3))+'</h2>';
      var m=b.match(/^\[img:(.+)\]$/);
      if(m)return '<img class="post-img" src="'+esc(m[1])+'" alt="">';
      return '<p>'+esc(b).replace(/\n/g,'<br>')+'</p>';
    }).join('');
  }

  function renderList(){
    list.innerHTML='';
    posts.forEach(function(p){
      var c=document.createElement('article');c.className='card linked';
      c.innerHTML='<div class="meta">'+show(p.date)+' <span class="tag">'+esc(p.tag)+'</span></div>'+
        '<h3><a href="#'+esc(p.id)+'">'+esc(p.title)+'</a></h3><p>'+esc(p.summary)+'</p>'+
        '<a class="more" href="#'+esc(p.id)+'">続きを読む →</a>';
      c.addEventListener('click',function(e){if(!e.target.closest('a'))location.hash=p.id;});
      list.appendChild(c);
    });
    if(!posts.length)list.innerHTML='<div class="card"><p>記事は準備中です。</p></div>';
  }

  function showPost(i){
    var p=posts[i],older=posts[i+1],newer=posts[i-1];
    function draw(html){
      view.innerHTML='<a class="back" href="#posts">← 記事一覧へ戻る</a>'+
        '<article class="card"><div class="meta">'+show(p.date)+' <span class="tag">'+esc(p.tag)+'</span></div>'+
        '<h1 class="post-title">'+esc(p.title)+'</h1><div class="post-body">'+html+'</div></article>'+
        '<div class="pn"><span>'+(older?'<a href="#'+esc(older.id)+'">← '+esc(older.title)+'</a>':'')+'</span>'+
        '<span>'+(newer?'<a href="#'+esc(newer.id)+'">'+esc(newer.title)+' →</a>':'')+'</span></div>';
    }
    document.title=p.title+' | わんこ日和';
    home.hidden=true;view.hidden=false;window.scrollTo(0,0);
    if(cache[p.id]!==undefined){draw(cache[p.id]);return;}
    view.innerHTML='<p>読み込み中…</p>';
    fetch('posts/'+p.file).then(function(r){if(!r.ok)throw 0;return r.text();}).then(function(t){
      cache[p.id]=parse(t);if(location.hash.slice(1)===p.id)draw(cache[p.id]);
    }).catch(function(){view.innerHTML='<a class="back" href="#posts">← 記事一覧へ戻る</a><p>記事を読み込めませんでした。</p>';});
  }

  function route(){
    var id=location.hash.slice(1),i=-1;
    posts.forEach(function(p,k){if(p.id===id)i=k;});
    if(i>=0){showPost(i);return;}
    var was=!view.hidden;view.hidden=true;home.hidden=false;document.title=homeTitle;
    var t=id&&document.getElementById(id);
    if(t){setTimeout(function(){t.scrollIntoView();},0);}else if(was){window.scrollTo(0,0);}
  }
  window.addEventListener('hashchange',route);

  // 予約投稿：日付が今日より先の記事は、その日が来るまで表示しない
  fetch('posts/posts.json').then(function(r){return r.json();}).then(function(a){
    posts=a.filter(function(p){return p.date<=today();}).sort(function(x,y){return x.date<y.date?1:-1;});
    renderList();route();
  }).catch(function(){list.innerHTML='<div class="card"><p>記事を読み込めませんでした。</p></div>';});
})();
