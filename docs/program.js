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
    {id: "m01", nm: "高坂穂乃果", snm: "穂乃果", c1nm:"ほ" , birthday:"8/3"},
    {id: "m02", nm: "絢瀬絵里", snm: "絵里", c1nm:"え" , birthday:"10/21"},
    {id: "m03", nm: "南ことり", snm: "ことり", c1nm:"こ" , birthday:"9/12"},
    {id: "m04", nm: "園田海未", snm: "海未", c1nm:"う" , birthday:"3/15"},
    {id: "m05", nm: "星空凛", snm: "凛", c1nm:"り" , birthday:"11/1"},
    {id: "m06", nm: "西木野真姫", snm: "真姫", c1nm:"ま" , birthday:"4/19"},
    {id: "m07", nm: "東條希", snm: "希", c1nm:"の" , birthday:"6/9"},
    {id: "m08", nm: "小泉花陽", snm: "花陽", c1nm:"は" , birthday:"1/17"},
    {id: "m09", nm: "矢沢にこ", snm: "にこ", c1nm:"に" , birthday:"7/22"}
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

    //LS.clear();


    //データマイグレーション
    var migLen = Migrate.length;
    var lastUpdDbVer = d.getLastUpdVersion();
    var currentMig = Migrate[migLen - 1];
    var currentVer = currentMig.dbver;
    if (lastUpdDbVer < currentVer) {

      Dialog.open({
        type: "confirm",
        text1: currentMig.msg,
        text2: "データを更新してもいいですか？",
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
    settingData[settingId] = val;
    setJson(SETTING_KEY, settingData);
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
  v.setSetting = function () {
    var $settingTbl = $(document.getElementById("settingTbl"));
    var st = DB.getAllSetting();
    for (var k in st) {
      $settingTbl.find('[name="' + k + '"]').val(st[k]).trigger("change");
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
    $(document.getElementById("sysVer")).text(SysVer);
    $(document.getElementById("dataVer")).text(DB.getLastUpdVersion());
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
    var $dialog = $(document.getElementById("dialog"));
    $dialog.find(".descArea .edritDesc").show();
    $dialog.find(".descArea p").show();
    $dialog.find(".costumeedit").show();
    $dialog.find(".skiledit").hide();
    $dialog.find(".confirm").hide();

    // 名前表示
    var member = DB.getMember(prm.mem);
    $(document.getElementById("editMember")).text(member.nm).attr("data-memid", member.id);

    //衣装表示
    var costume = DB.getCostume(prm.editId);
    $(document.getElementById("editTgt")).text(costume.nm).attr("data-tgtid", costume.id);
    $(document.getElementById("edit_hr")).prop("checked", costume.hr[member.id]);
    $(document.getElementById("edit_r")).prop("checked", costume.r[member.id]);

    //保存処理の設置
    okCallback = function() {
      //保存値の取得
      var isHr = $(document.getElementById("edit_hr")).prop("checked");
      var isR = $(document.getElementById("edit_r")).prop("checked");
      //キーの取得
      var memId = $(document.getElementById("editMember")).attr("data-memid");
      var tgtId = $(document.getElementById("editTgt")).attr("data-tgtid");

      DB.saveCostume(tgtId, memId, isHr, isR);
      ListView.updateCostume();
    };
  }


  function editSkill(prm) {
    var $dialog = $(document.getElementById("dialog"));
    $dialog.find(".descArea .edritDesc").show();
    $dialog.find(".descArea p").show();
    $dialog.find(".costumeedit").hide();
    $dialog.find(".skiledit").show();
    $dialog.find(".confirm").hide();

    // 名前表示
    var member = DB.getMember(prm.mem);
    $(document.getElementById("editMember")).text(member.nm).attr("data-memid", member.id);

    //衣装表示
    var skill = DB.getSkill(prm.editId);
    $(document.getElementById("editTgt")).text(skill.nm).attr("data-tgtid", skill.id);
    $(document.getElementById("inpNumVal")).text(skill.val[member.id]);

    okCallback = function() {
      //保存値の取得
      var val = $(document.getElementById("inpNumVal")).text();
      val = val == "MAX" ? 10 : Number(val);

      //キーの取得
      var memId = $(document.getElementById("editMember")).attr("data-memid");
      var tgtId = $(document.getElementById("editTgt")).attr("data-tgtid");

      DB.saveSkill(tgtId, memId, val);
      ListView.updateSkill();
    };
  }

  d.open = function(prm){
    var $dialog = $(document.getElementById("dialog"));
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
      $dialog.find(".descArea .edritDesc").hide();
      $dialog.find(".descArea p").show();
      $dialog.find(".costumeedit").hide();
      $dialog.find(".skiledit").hide();
      $dialog.find(".confirm").show();
      $("#dialog .descArea p").append(prm.text1);
      $("#dialog .confirm p").append(prm.text2);
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
    var $dialog = $(document.getElementById("dialog"));
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
 * イベントリスナ定義
 * この関数はhtml読み込み後に実行される
 */
function setEventListener() {


    $("#menu_key").on("click", function(){
      Menu.toggle();
    });

    $("#menu td").on("click", function(){
      var showpage = $(this).attr("data-page");
      $contents = $("#contents");
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
    $("#dialogCloseBtn").on("click", function() {
      Dialog.close();
    });
    $("#okbtn").on("click", function() {
      Dialog.ok();
    });

    $("#btnNumMinus").on("click", function() {
      var val = $("#inpNumVal").text();
      val = (val == "MAX") ? 10 : Number(val);
      val = val - 1;
      if (val >= 10) val = "MAX";
      if (val <= 0) val = 0;
      $("#inpNumVal").text(val);
    });
    $("#btnNumPlus").on("click", function() {
      var val = $("#inpNumVal").text();
      val = (val == "MAX") ? 10 : Number(val);
      val = val + 1;
      if (val >= 10) val = "MAX";
      if (val <= 0) val = 0;
      $("#inpNumVal").text(val);
    });

    $("#settingTbl select").on("change", function() {
      var $wrapper = $(document.getElementById("wrapper"));
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
    });
    jq("saveSkillOrderbtn").on("click", function(){
      jq("sortableSkills").find("li").each(function(i, elm) {
        var id = $(elm).attr("data-id");
        var ski = DB.getSkill(id);
        ski["co"] = i;
        DB.save(id, ski);
      });
      ListView.updateSkill();
    });
}



/********************
 * 画面表示後処理
 ********************/

$(function(){


  //
  DB.init();


  //イベントリスナ登録
  setEventListener();



  //表示処理
  ListView.setMemberList();
  ListView.showCostume();
  ListView.showSkill();
  ListView.setSetting();
  ListView.setVersion();
});
