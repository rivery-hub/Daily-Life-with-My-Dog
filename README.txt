【記事の追加のしかた】

1. public/posts/ フォルダに、記事のファイル（例：walk-in-winter.md）を新しく作る
   書き方：
     ## 見出し           ← 見出しにする行
     [img:images/xxx.jpg] ← 写真を入れる行（写真は public/images/ に入れておく）
     空行で段落を区切る
   ※見出し・写真・段落は、必ず空行で区切ってください。

2. public/posts/posts.json に、記事の情報を1つ足す（既存の { } をコピーして書き換える）
   id      ：URLの末尾になる名前（半角英数字とハイフンのみ）
   date    ：公開日（例 2026-11-20）。今日より先の日付にすると、その日まで表示されません（予約投稿）
   tag     ：タグ
   title   ：記事のタイトル
   summary ：一覧に出る短い紹介文
   file    ：記事ファイル名

3. GitHub にこの2つ（と写真）をアップロードすると、自動で公開されます。

【Cloudflare Pages の設定（GitHub連携）】
   Production branch      ：main
   Build command          ：exit 0
   Build output directory ：public
