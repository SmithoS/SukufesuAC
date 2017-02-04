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
      //設定
      db.saveSetting("name_display_type", "name_display_short");
    }
  }
];
