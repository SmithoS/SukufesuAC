Migrate = [
  {
    dbver: "1.00.00",
    msg: "2017/01/28 時点でのデータを追加します。<br />初期登録用のデータです。",
    upd : function(db) {
      //衣装
      db.save("c001", {id:"c001",so: 1, nm:"僕たちは今の中で",  hr: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false},r: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false}});
      db.save("c002", {id:"c002",so: 2, nm:"それは僕たちの奇跡", hr: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false},r: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false}});
      db.save("c003", {id:"c003",so: 3, nm:"スクールユニティ",  hr: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false},r: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false}});
      db.save("c004", {id:"c004",so: 4, nm:"Snow halation",  hr: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false},r: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false}});
      db.save("c005", {id:"c005",so: 5, nm:"チャイナガール",   hr: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false},r: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false}});
      db.save("c006", {id:"c006",so: 6, nm:"タカラモノズ",     hr: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false},r: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false}});
      db.save("c007", {id:"c007",so: 7, nm:"ブレザーズハット",  hr: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false},r: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false}});
      //スキル
      db.save("s001", {id: "s001",so: 1,nm: "ジャッジサポート",st: "st1",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
      db.save("s002", {id: "s002",so: 2,nm: "ビジュアルスコアプラス",st: "st1",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
      db.save("s003", {id: "s003",so: 3,nm: "メンバーフォーカス",st: "st2",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
      db.save("s004", {id: "s004",so: 4,nm: "ダンスフォーカス",st: "st2",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
      db.save("s005", {id: "s005",so: 5,nm: "メンバーライトアップ",st: "st3",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
      db.save("s006", {id: "s006",so: 6,nm: "フラワーシャワー",st: "st3",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
      db.save("s007", {id: "s007",so: 7,nm: "シンボルシャワー",st: "st3",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
      //設定
      db.save("_setting", {
        cos_mark: "cos_hart",
        cos_hr_color: "cos_hr_red",
        cos_r_color: "cos_r_blue",
        skill_mark: "skill_dia"
      });
    }
  },
  {
    dbver: "1.00.01",
    msg: "設定項目を追加しました。",
    upd : function(db) {
      //名前表示タイプ
      db.saveSetting("name_display_type", "name_display_short");
      //メニュー表示形式
      db.saveSetting("menu_show_type", "menu_show_fixed");
      //ブレザーズハット名前修正
      var cos = db.getCostume("c007");
      cos.nm = "ブレザーズ・ハット";
      db.save("c007", cos);
    }
  },
  {
    dbver: "1.00.02",
    msg: "スキル「ジャッジサポート♪」を追加しました。",
    upd : function(db) {
      db.save("s008", {id: "s008",so: 8,nm: "ジャッジサポート♪",st: "st1",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
    }
  },
  {
    dbver: "1.00.03",
    msg: "衣装名「僕らは今のなかで」を修正しました。",
    upd : function(db) {
      //名前修正
      var cos = db.getCostume("c001");
      cos.nm = "僕らは今のなかで";
      db.save("c001", cos);
    }
  },
  {
    dbver: "1.00.04",
    msg: "衣装「これからのSomeday」を追加しました。",
    upd : function(db){
      //勧誘警告レベル廃止
      var st = db.getAllSetting();
      if (st.hasOwnProperty("invitation_warn_skill_lv")) delete st["invitation_warn_skill_lv"];
      db.save("_setting", st);
      //これサム追加
      registCostume(db, 8, "これからのSomeday");
    }
  },
  {
    dbver: "1.00.05",
    msg: "楽曲ページ（フルコン管理）の実装に伴い、楽曲一覧を登録します。",
    upd : function(db){
      db.save("l001", {id:"l001",so: 1, nm:"僕らのLIVE 君とのLIFE", cb:{}});
      db.save("l002", {id:"l002",so: 2, nm:"Snow halation", cb:{}});
      db.save("l003", {id:"l003",so: 3, nm:"夏色えがおで1，2，Jump！", cb:{}});
      db.save("l004", {id:"l004",so: 4, nm:"もぎゅっと ”love” で接近中！", cb:{}});
      db.save("l005", {id:"l005",so: 5, nm:"Wonderful Rush", cb:{}});
      db.save("l006", {id:"l006",so: 6, nm:"Music S．T．A．R．T！！", cb:{}});
      db.save("l007", {id:"l007",so: 7, nm:"僕らは今のなかで", cb:{}});
      db.save("l008", {id:"l008",so: 8, nm:"それは僕たちの奇跡", cb:{}});
      db.save("l009", {id:"l009",so: 9, nm:"ラブノベルス", cb:{}});
      db.save("l010", {id:"l010",so: 10, nm:"知らないLove＊教えてLove", cb:{}});
      db.save("l011", {id:"l011",so: 11, nm:"sweet＆sweet holiday", cb:{}});
      db.save("l012", {id:"l012",so: 12, nm:"Mermaid festa vol．2 ～Passionate～", cb:{}});
      db.save("l013", {id:"l013",so: 13, nm:"乙女式れんあい塾", cb:{}});
      db.save("l014", {id:"l014",so: 14, nm:"告白日和、です！", cb:{}});
      db.save("l015", {id:"l015",so: 15, nm:"soldier game", cb:{}});
      db.save("l016", {id:"l016",so: 16, nm:"ススメ→トゥモロウ", cb:{}});
      db.save("l017", {id:"l017",so: 17, nm:"WAO-WAO Powerful day！", cb:{}});
      db.save("l018", {id:"l018",so: 18, nm:"春情ロマンティック", cb:{}});
      db.save("l019", {id:"l019",so: 19, nm:"PSYCHIC FIRE", cb:{}});
      db.save("l020", {id:"l020",so: 20, nm:"ユメノトビラ", cb:{}});
      db.save("l021", {id:"l021",so: 21, nm:"これからのSomeday", cb:{}});
      db.save("l022", {id:"l022",so: 22, nm:"Love wing bell", cb:{}});
      db.save("l023", {id:"l023",so: 23, nm:"baby maybe 恋のボタン", cb:{}});
      db.save("l024", {id:"l024",so: 24, nm:"Mermaid festa vol．1", cb:{}});
      db.save("l025", {id:"l025",so: 25, nm:"きっと青春が聞こえる", cb:{}});
      db.save("l026", {id:"l026",so: 26, nm:"輝夜の城で踊りたい", cb:{}});
      db.save("l027", {id:"l027",so: 27, nm:"LOVELESS WORLD", cb:{}});
      db.save("l028", {id:"l028",so: 28, nm:"タカラモノズ", cb:{}});
      db.save("l029", {id:"l029",so: 29, nm:"どんなときもずっと", cb:{}});
      db.save("l030", {id:"l030",so: 30, nm:"Angelic Angel", cb:{}});
      db.save("l031", {id:"l031",so: 31, nm:"SUNNY DAY SONG", cb:{}});
      db.save("l032", {id:"l032",so: 32, nm:"僕たちはひとつの光", cb:{}});
    }
  },
  {
    dbver: "1.00.06",
    msg: "衣装「ウェディング風衣装」を追加しました。",
    upd : function(db){
      registCostume(db, 9, "ウェディング風衣装");
    }
  },
  {
    dbver: "1.00.07",
    msg: "楽曲「Wonder zone」衣装「パンキッシュ・ロック・ガール」を追加しました。",
    upd : function(db){
      registCostume(db, 10, "パンキッシュ・ロック・ガール");
      registLive(db, 33, "Wonder zone");
    }
  },
  {
    dbver: "1.00.08",
    msg: "楽曲「Dancing stars on me!」を追加します。",
    upd : function(db){
      registLive(db, 34, "Dancing stars on me!");
    }
  },
  {
    dbver: "1.00.09",
    msg: "衣装「Dancing stars on me!」を追加します。",
    upd : function(db){
      registCostume(db, 11, "Dancing stars on me!");
    }
  },
  {
    dbver: "1.00.10",
    msg: "スキル「メンバーフラワーシャワー」、楽曲「Cutie Panther」を追加します。",
    upd : function(db){
      db.save("s009", {id: "s009",so: 9,nm: "メンバーフラワーシャワー",st: "st3",val: {m01: 0,m02: 0,m03: 0,m04: 0,m05: 0,m06: 0,m07: 0,m08: 0,m09: 0}});
      registLive(db, 35, "Cutie Panther");
    }
  },
  {
    dbver: "1.00.11",
    msg: "衣装「ユニット衣装（BiBiのレザーグロス・クイーン）」を追加します。ユニットごとに表記を切り替えるような対応は今後追加します",
    upd : function(db){
      registCostume(db, 12, "ユニット衣装");
    }
  },
  {
    dbver: "1.00.12",
    msg: "楽曲「Oh,Love&Peace!」衣装「水着風衣装」を追加します。",
    upd : function(db){
      registLive(db, 36, "Oh,Love&Peace!");
      registCostume(db, 13, "水着風衣装");
    }
  },
  {
    dbver: "1.00.13",
    msg: "衣装「Music S.T.A.R.T!!」を追加します。",
    upd : function(db){
      registCostume(db, 14, "Music S.T.A.R.T!!");
    }
  }
];

function registCostume(db, num, name) {
  var idval = "c" + ("000" + num).slice(-3);
  db.save(idval, {
    id: idval,
    so: num,
    nm: name,
    hr: {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false},
    r:  {m01: false,m02: false,m03: false,m04: false,m05: false,m06: false,m07: false,m08: false,m09: false}
  });
}

function registLive(db, num, name) {
  var idval = "l" + ("000" + num).slice(-3);
  db.save(idval, {
    id: idval,
    so: num,
    nm: name,
    cb: {}
  });
}
