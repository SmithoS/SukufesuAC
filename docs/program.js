/********************
 * 共通定数定義
 ********************/

/**
 * 現在のシステムバージョン
 * @type {String}
 */
var SysVer = "0.01α"


/********************
 * 共通関数（便利な関数）定義
 ********************/

/**
 * IDを指定してjQueryオブジェクトを取得する。
 * $("#id")よりも高速に動作することを目的とする
 * @param  {string} id DOM要素のID
 * @return {jQueryObject}
 */
function jq(id) {
  return $(document.getElementById(id));
}

/********************
 * 各種オブジェクト定義
 ********************/


var DB = (function(){
  var LAST_UPD_KEY = "lastUpd";
  var SETTING_KEY = "_setting";

  var d = {};
  var LS = localStorage;
  var _member = [
    {id: "m01", nm: "高坂穂乃果", snm: "穂乃果", c1nm:"ほ", c2nm:"ほの", birthday:"8/3"},
    {id: "m02", nm: "絢瀬絵里", snm: "絵里", c1nm:"え", c2nm:"えり", birthday:"10/21"},
    {id: "m03", nm: "南ことり", snm: "ことり", c1nm:"こ", c2nm:"こと", birthday:"9/12"},
    {id: "m04", nm: "園田海未", snm: "海未", c1nm:"う", c2nm:"うみ", birthday:"3/15"},
    {id: "m05", nm: "星空凛", snm: "凛", c1nm:"り", c2nm:"りん", birthday:"11/1"},
    {id: "m06", nm: "西木野真姫", snm: "真姫", c1nm:"ま", c2nm:"まき", birthday:"4/19"},
    {id: "m07", nm: "東條希", snm: "希", c1nm:"の", c2nm:"のぞ", birthday:"6/9"},
    {id: "m08", nm: "小泉花陽", snm: "花陽", c1nm:"は", c2nm:"ぱな", birthday:"1/17"},
    {id: "m09", nm: "矢沢にこ", snm: "にこ", c1nm:"に", c2nm:"にこ", birthday:"7/22"}
  ];

  function setJson(id, obj) {
    LS.setItem(id, JSON.stringify(obj))
  }
  function getJson(id) {
    return JSON.parse(LS.getItem(id));
  }
  function getList(startKeyChr, sortFunc) {
    var len = LS.length;
    var l = [];
    var k = null;
    for (var i = 0; i < len; i++) {
      k = LS.key(i);
      if (k.substring(0,1) == startKeyChr) l.push(getJson(k));
    }
    // 並び替え
    if (sortFunc == null) {
      sortFunc = function(o1, o2) {
        var o1odr = o1.co != null ? o1.co : o1.so;
        var o2odr = o2.co != null ? o2.co : o2.so;
        return o1odr - o2odr;
      };
    }
    l.sort(sortFunc);

    return l;
  }


  d.init = function(argument) {
    //データマイグレーション
    var migLen = Migrate.length;
    var lastUpdDbVer = d.getLastUpdVersion();
    var currentMig = Migrate[migLen - 1];
    var currentVer = currentMig.dbver;
    if (lastUpdDbVer < currentVer) {

      Dialog.open({
        type: "confirm",
        text1: "データ更新",
        text2: currentMig.msg + "\r\nデータを更新します。",
        okCallback: function() {
          for (var i = 0; i < migLen; i++) {
            var migData = Migrate[i];
            if (lastUpdDbVer < migData.dbver) {
              migData.upd(d);
            }
          }
          d.saveLastUpdVer(currentVer);

          //表示
          ListView.updateCostume();
          ListView.updateSkill();
          ListView.setSetting();
          ListView.setVersion();

          //デザイン反映
          ListView.reflectDesign();
        }
      });
    }
  };

  d.getLastUpdVersion = function () {
    var lastUpdDbVer = getJson(LAST_UPD_KEY);
    return lastUpdDbVer == null ? "0" : lastUpdDbVer.dbver
  };
  d.getMember = function(tgtId) {
    return _member.find(function(e, i, a) {
      return e.id == tgtId;
    });
  };
  d.getCostume = function(id) {
    return getJson(id);
  };
  d.getSkill = function(id) {
    return getJson(id);
  };
  d.getMemberList = function() {
    return _member;
  }
  d.getCostumeList = function() {
    return getList("c", null);
  };
  d.getSkillList = function() {
    return getList("s", null);
  }
  d.getMemberCostumeList = function(memId) {
    var cosList = d.getCostumeList();
    var clsLen = cosList.length;
    var l = [];
    for (var i = 0; i < clsLen; i++) {
      var cos = cosList[i];
      l.push({
        id: cos.id,
        nm: cos.nm,
        hr: cos.hr[memId],
        r: cos.r[memId]
      });
    }
    return l;
  };
  d.getMemberSkillList = function(memId) {
    var skiList = d.getSkillList();
    var skiLen = skiList.length;
    var l = [];
    for (var i = 0; i < skiLen; i++) {
      var ski = skiList[i];
      l.push({
        id: ski.id,
        nm: ski.nm,
        st: ski.st,
        val: ski.val[memId]
      });
    }
    return l;
  };
  d.getAllSetting = function () {
    return getJson(SETTING_KEY);
  };
  d.getExportData = function() {
    var len = LS.length;
    var dt = {};
    var k = null;
    for (var i = 0; i < len; i++) {
      k = LS.key(i);
      dt[k] = getJson(k);
    }
    return JSON.stringify(dt);
  };
  d.getStatisticsCostume = function(method) {
    //データの入れる枠を用意
    var mem = JSON.parse(JSON.stringify(_member));
    var len = mem.length;
    for (var i = 0; i < len; i++) {
      mem[i].cos = [];
    }

    //抽出条件を設定
    var condFunc;
    switch (method) {
      case "hasBoth":
        condFunc = function (hr, r) {return hr && r;}
        break;
      case "hasHR":
        condFunc = function (hr, r) {return hr;}
        break;
      case "hasAny":
        condFunc = function (hr, r) {return hr || r;}
        break;
      case "hasNotHr":
        condFunc = function (hr, r) {return !hr;}
        break;
      case "hasNone":
      default:
        condFunc = function (hr, r) {return !hr && !r;}
        break;
    }

    //衣装を抽出
    var cosList =d.getCostumeList();
    var cosLen = cosList.length;
    for (var i = 0; i < cosLen; i++) {
      var cos = cosList[i];
      for (var mid in cos.hr) {
        if (condFunc(cos.hr[mid], cos.r[mid])) {
          var m = mem.find(function(e, i, a) {
            return e.id == mid;
          });
          m.cos.push({
            id: cos.id,
            nm: cos.nm,
            hr: cos.hr[mid],
            r: cos.r[mid]
          });
        }
      }
    }
    return mem;
  };
  d.getStatisticsSkill = function(border, method, eventSkill) {
    //データの入れる枠を用意
    var mem = JSON.parse(JSON.stringify(_member));
    var len = mem.length;
    for (var i = 0; i < len; i++) {
      mem[i].skill = [];
    }

    //抽出条件を設定
    var condFunc1;
    switch (method) {
      case "under":
        condFunc1 = function (v) {return v <= border;}
        break;
      case "equals":
        condFunc1 = function (v) {return v == border;}
        break;
      case "under":
      default:
        condFunc1 = function (v) {return v >= border;}
        break;
    }
    var condFunc2;
    switch (eventSkill) {
      case "exclude":
      condFunc2 = function (ski) {return ski.id != "s007" && ski.id != "s008";}
        break;
      case "include":
      default:
        condFunc2 = function (ski) {return true;}
        break;
    }

    //スキルを抽出
    var skiList = d.getSkillList();
    var skiLen = skiList.length;
    for (var i = 0; i < skiLen; i++) {
      var ski = skiList[i];
      var skiVal = ski.val;
      for (var mid in skiVal) {
        if (condFunc1(skiVal[mid]) && condFunc2(ski)) {
          var m = mem.find(function(e, i, a) {
            return e.id == mid;
          });
          m.skill.push({
            id: ski.id,
            nm: ski.nm,
            st: ski.st,
            val: skiVal[mid]
          });
        }
      }
    }

    return mem;
  };

  d.save = function (id, data) {
    setJson(id, data);
  };
  d.saveLastUpdVer = function(verNo) {
    setJson(LAST_UPD_KEY, {dbver: verNo});
  };
  d.saveCostume = function(cosId, memId, isHr, isR) {
    var cosData = getJson(cosId);
    cosData.hr[memId] = isHr;
    cosData.r[memId] = isR;
    setJson(cosId, cosData);
  };
  d.saveSkill = function(skillId, memId, skVal) {
    var skillData = getJson(skillId);
    skillData.val[memId] = skVal;
    setJson(skillId, skillData);
  };
  d.saveSetting = function(settingId, val) {
    var settingData = d.getAllSetting(settingId);
    if (settingData == null) settingData = {};
    settingData[settingId] = val;
    setJson(SETTING_KEY, settingData);
  };
  d.loadInportData = function(str) {
    var dt = JSON.parse(str);
    for (var k in dt) {
      setJson(k, dt[k]);
    }
  };

  return d;
})();

var ListView = (function(){
  var v = {};
  var cosView;
  var skillView;
  var memCosView;
  v.showCostume = function() {
    cosView = riot.mount("costume", {
      "cos": DB.getCostumeList(),
      "mem": DB.getMemberList()
    });
  };
  v.showSkill = function() {
    var dt = DB.getSkillList();
    skillView = riot.mount("skill", {
      "skill": DB.getSkillList(),
      "mem": DB.getMemberList()
    });
  };

  v.updateCostume = function() {
    //cosView.update({"cos": DB.getCostumeList()});
    v.showCostume();
  };
  v.updateSkill = function() {
    //skillView.update({"skill": DB.getSkillList()});
    v.showSkill();
  };

  v.setMemberCostume = function(memId) {
    memCosView = riot.mount("member-costume", {"cos": DB.getMemberCostumeList(memId)});
  };
  v.setMemberSkill = function(memId) {
    riot.mount("member-skill", {"skill": DB.getMemberSkillList(memId)});
  };
  v.setMemberList = function () {
    riot.mount("member-list", {"mem": DB.getMemberList()});
  };
  v.setMemberStatus = function(memId) {
    riot.mount("member-profile", DB.getMember(memId));
    v.setMemberCostume(memId);
    v.setMemberSkill(memId);
    $(document.getElementById("memStatus")).show();
  };
  v.setStatisticsCostume = function() {
    var method = jq("statisticsCostumeMethod").val();
    riot.mount("statistics-costume", {mem: DB.getStatisticsCostume(method)});
    jq("statisticsResultCostume").show();
    jq("statisticsResultSkill").hide();
  };
  v.setStatisticsSkill = function() {
    var border = jq("statisticsSkillBorder").val();
    var method = jq("statisticsSkillMethod").val();
    var eventSkill = jq("statisticsEventSkill").val();
    riot.mount("statistics-skill", {mem: DB.getStatisticsSkill(border, method, eventSkill)});
    jq("statisticsResultCostume").hide();
    jq("statisticsResultSkill").show();
  };
  v.setSetting = function () {
    var $settingPg = jq("settingPage");
    var st = DB.getAllSetting();
    for (var k in st) {
      $settingPg.find('[name="' + k + '"]').val(st[k]);
    }
  };
  v.setSortCostume = function() {
    riot.mount("costume-sort-list", {cos: DB.getCostumeList()});
    //ソートできるように処理をバインド
    var cl = document.getElementById("sortableCostumes");
    Sortable.create(cl);
  };
  v.setSortSkill = function() {
    riot.mount("skill-sort-list", {skill: DB.getSkillList()});
    //ソートできるように処理をバインド
    var sl = document.getElementById("sortableSkills");
    Sortable.create(sl);
  };
  v.setVersion = function () {
    jq("sysVer").text(SysVer);
    jq("dataVer").text(DB.getLastUpdVersion());
  };
  v.reflectDesign = function() {
    jq("settingPage").find('.design [name]').each(function(){
      $(this).trigger("change");
    });
  };

  v.init = function() {
    v.showCostume();
    v.showSkill();
    v.setMemberList();
    v.setSetting();
    v.setVersion();
    v.reflectDesign();
  };

  return v;
})();



var Dialog = (function(){
  var d = {};
  var okCallback = null;

  function _getVanishPointCss() {
    var vanishPointX = ($(document).width() / 2) + "px";
    var vanishPointY = ($(document).height() / 2) + "px";
    return {top: vanishPointY , bottom: vanishPointY, left: vanishPointX, right: vanishPointX};
  }

  function editCostume(prm) {
    var $dialog = jq("dialog");
    $dialog.find(".descArea").show();
    $dialog.find(".editArea").show();
    $dialog.find(".confirmArea").hide();
    $dialog.find(".editArea .costumeedit").show();
    $dialog.find(".editArea .skiledit").hide();
    // 名前表示
    var member = DB.getMember(prm.mem);
    jq("editMember").text(member.nm).attr("data-memid", member.id);

    //衣装表示
    var costume = DB.getCostume(prm.editId);
    jq("editTgt").text(costume.nm).attr("data-tgtid", costume.id);
    jq("edit_hr").prop("checked", costume.hr[member.id]);
    jq("edit_r").prop("checked", costume.r[member.id]);

    //保存処理の設置
    okCallback = function() {
      //保存値の取得
      var isHr = jq("edit_hr").prop("checked");
      var isR = jq("edit_r").prop("checked");
      //キーの取得
      var memId = jq("editMember").attr("data-memid");
      var tgtId = jq("editTgt").attr("data-tgtid");

      DB.saveCostume(tgtId, memId, isHr, isR);
      ListView.updateCostume();
      if (prm.isUpdMemberPage) {
        ListView.setMemberCostume(member.id);
      }
    };
  }


  function editSkill(prm) {
    var $dialog = jq("dialog");
    $dialog.find(".descArea").show();
    $dialog.find(".editArea").show();
    $dialog.find(".confirmArea").hide();
    $dialog.find(".editArea .costumeedit").hide();
    $dialog.find(".editArea .skiledit").show();

    // 名前表示
    var member = DB.getMember(prm.mem);
    jq("editMember").text(member.nm).attr("data-memid", member.id);

    //スキル表示
    var skill = DB.getSkill(prm.editId);
    jq("editTgt").text(skill.nm).attr("data-tgtid", skill.id);
    var skillVal = skill.val[member.id];
    jq("inpNumVal").text(skillVal >= 10 ? "MAX" : skillVal);

    okCallback = function() {
      //保存値の取得
      var val = jq("inpNumVal").text();
      val = val == "MAX" ? 10 : Number(val);

      //キーの取得
      var memId = jq("editMember").attr("data-memid");
      var tgtId = jq("editTgt").attr("data-tgtid");

      DB.saveSkill(tgtId, memId, val);
      ListView.updateSkill();
      if (prm.isUpdMemberPage) {
        ListView.setMemberSkill(member.id);
      }
    };
  }

  d.open = function(prm){
    var $dialog = jq("dialog");
    //表示内容の切り替え
    if (prm.type == "edit") {
      // 名前表示
      var member = DB.getMember(prm.mem);
      $dialog.find(".description .memName").text(member.nm);

      if (prm.target == "costume") {
        editCostume(prm);
      } else {
        editSkill(prm);
      }

    } else if (prm.type == "confirm") {
      $dialog.find(".descArea").hide();
      $dialog.find(".editArea").hide();
      $dialog.find(".confirmArea").show();
      $dialog.find(".confirmArea .confirmTxt1").text(prm.text1);
      $dialog.find(".confirmArea .confirmTxt2").text(prm.text2);
      okCallback = prm.okCallback;
    }

    $dialog.stop()
    .css(_getVanishPointCss())
    .show()
    .animate(
      {top: "10px" , bottom: "10px", left: "10px", right: "10px"}
    );
  };

  d.close = function(){
    var $dialog = jq("dialog");
    $dialog.stop()
    .animate(
      _getVanishPointCss(),
      {complete: function(){$(this).hide();}}
    );
  };

  d.ok = function() {
    if (okCallback != null) {
      okCallback();
    }
    d.close();
  };

  return d;
})();


var Menu = (function() {
  var m = {};

  m.open = function() {
    jq("menu").stop().animate(
      {"bottom": "0px"}
    ).addClass("active");
  };

  m.close = function() {
    var $menu = jq("menu");
    $menu.stop().animate(
      {"bottom": "-" + $menu.outerHeight() + "px"}
    ).removeClass("active");
  };

  m.toggle = function() {
    if (jq("menu").hasClass("active")) {
      m.close();
    } else {
      m.open();
    }
  }

  return m;
})();


/********************
 * イベントリスナ設定
 ********************/

/**
 * イベントのバインド
 * この関数はhtml読み込み後に実行される
 */
function setEventListener() {
  $("#menu td").on("click", function(){
    var showpage = $(this).attr("data-page");
    $contents = jq("contents");
    $contents.find(".page").each(function(i, elm) {
      if ($(elm).hasClass(showpage)) $(elm).show();
      else $(elm).hide();
    });
    switch (showpage) {
      case "page_member":
        jq("memStatus").hide();
        break;
      case "page_setting":
        jq("settingPage").find(".itm").hide();
        break;
      default:
        break;
    }
    Menu.close();
  });

  $("#settingPage .design select").on("change", function() {
    var $wrapper = jq("wrapper");
    var sKey = $(this).attr("name")
    var sVal = $(this).val();
    //画面に設定を反映
    $(this).children().each(function(i, opt){
      $wrapper.removeClass($(opt).attr("value"));
    });
    $wrapper.addClass($(this).val());
    //保存
    DB.saveSetting(sKey, sVal);
  });
}


/**
 * イベントのバインド
 * この関数は描写処理が一通り終わった後に実行される。
 */
function setEventListenerLazy() {

    jq("menu_key").on("click", function(){
      Menu.toggle();
    });

    $(document).on("click", "#costume_list td, #costume_list .mem th", function(){
      Dialog.open({
        type: "edit",
        target: "costume",
        editId: $(this).closest(".itm").attr("data-editId"),
        mem: $(this).attr("data-mem")
      });
    });
    $(document).on("click", "#skill_list td, #skill_list .mem th", function(){
      Dialog.open({
        type: "edit",
        target: "skill",
        editId: $(this).closest(".itm").attr("data-editId"),
        mem: $(this).attr("data-mem")
      });
    });
    $(document).on("click", "#statusMemberList a", function() {
      ListView.setMemberStatus($(this).attr("data-id"));
    });
    $(document).on("click", "#memStatus member-costume tr", function() {
      Dialog.open({
        type: "edit",
        target: "costume",
        editId: $(this).attr("data-editId"),
        mem: $("#memStatus h3").attr("data-mem"),
        isUpdMemberPage: true
      });
    });
    $(document).on("click", "#memStatus member-skill tr", function() {
      Dialog.open({
        type: "edit",
        target: "skill",
        editId: $(this).attr("data-editId"),
        mem: $("#memStatus h3").attr("data-mem"),
        isUpdMemberPage: true
      });
    });
    jq("statisticsCostume").on("change", function(){
      if ($(this).prop("checked")) {
        ListView.setStatisticsCostume();
      }
    });
    jq("statisticsSkill").on("change", function(){
      if ($(this).prop("checked")) {
        ListView.setStatisticsSkill();
      }
    });
    $("#condDetailCostume select").on("change", function() {
      ListView.setStatisticsCostume();
    });
    $("#condDetailSkill select").on("change", function() {
      ListView.setStatisticsSkill();
    });
    jq("cameraBtn").on("change", function() {
      var reader = new FileReader();
      reader.onload = function(evt) {
        jq("cameraImg").attr("src", reader.result);
      };
      var imageFile = this.files[0];
      reader.readAsDataURL(imageFile);
    });


    jq("dialogCloseBtn").on("click", function() {
      Dialog.close();
    });
    jq("okbtn").on("click", function() {
      Dialog.ok();
    });

    function addSkillVal(addVal) {
      var $inv = jq("inpNumVal");
      var val = $inv.text();
      val = (val == "MAX") ? 10 : Number(val);
      val = val + addVal;
      $inv.text(val >= 10 ? "MAX" : val <= 0 ? 0 : val);
    }
    jq("btnNumMinus").on("click", function() {
      addSkillVal(-1);
    });
    jq("btnNumPlus").on("click", function() {
      addSkillVal(1);
    });


    $("#settingPage .system select").on("change", function() {
      var sKey = $(this).attr("name")
      var sVal = $(this).val();
      //保存
      DB.saveSetting(sKey, sVal);
    });

    $("#settingItemList a").on("click", function() {
      var itm = $(this).attr("data-itm");
      jq("settingPage").find(".itm").each(function(i, elm) {
        if ($(elm).hasClass(itm)) $(elm).show();
        else $(elm).hide();
      });
      switch (itm) {
        case "orderCostume":
          ListView.setSortCostume();
          break;
        case "orderSkill":
          ListView.setSortSkill();
          break;
        case "export":
          jq("exportData").val("");
          break;
        case "inport":
          jq("inportData").val("");
          break;
        default:
          break;
      }
    });

    jq("saveCosOrderbtn").on("click", function(){
      jq("sortableCostumes").find("li").each(function(i, elm) {
        var id = $(elm).attr("data-id");
        var cos = DB.getCostume(id);
        cos["co"] = i;
        DB.save(id, cos);
      });
      ListView.updateCostume();
      Dialog.open({
        "type": "confirm",
        "text1": "変更完了",
        "text2": "衣装の並び順を変更しました。"
      });
    });
    jq("saveSkillOrderbtn").on("click", function(){
      jq("sortableSkills").find("li").each(function(i, elm) {
        var id = $(elm).attr("data-id");
        var ski = DB.getSkill(id);
        ski["co"] = i;
        DB.save(id, ski);
      });
      ListView.updateSkill();
      Dialog.open({
        "type": "confirm",
        "text1": "変更完了",
        "text2": "スキルの並び順を変更しました。"
      });

    });

    jq("writeExportData").on("click", function(){
      jq("exportData").val(DB.getExportData());
    });
    jq("loadInportData").on("click", function(){
      var str = jq("inportData").val();
      if (str != null && str != "") {
        try {
          DB.loadInportData(str);
          Dialog.open({
            "type": "confirm",
            "text1": "インポート完了",
            "text2": "データのインポートが完了しました。画面を再読込します",
            "okCallback": function() {
              location.reload();
            }
          });
        } catch (e) {
          Dialog.open({
            "type": "confirm",
            "text1": "エラー",
            "text2": "入力したデータを解析できませんでした。"
          });
        }
      } else {
        Dialog.open({
          "type": "confirm",
          "text1": "エラー",
          "text2": "インポートするデータが入力されていません。"
        });
      }
    });
}



/********************
 * 画面表示後処理
 ********************/

$(function(){
  //データ初期処理。マイグレート含む
  DB.init();


  //表示処理
  ListView.init();

  //イベントリスナ登録
  setEventListener();

  //初期ページ表示
  var stg = DB.getAllSetting();
  if (stg != null) {
    var initPage = stg["init_display_page"];
    if (initPage != null) {
      jq("menu").find("[data-page='" + initPage + "']").trigger("click");
    }
  }

  //イベントリスナ定義（遅延）
  setTimeout(setEventListenerLazy, 500);

});
