/********************
 * 共通定数定義
 ********************/
 var EventApiDbId = "eventsApiKey"
 var EventLockCountBorder = 3;

 /********************
  * 共通変数定義
  ********************/
var EventLockCount = 0;

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
function isAleCostume(costumeId) {
  return costumeId == "c021";
}
function isEventSkill(skillId) {
  return skillId == "s007" || skillId == "s008" || skillId == "s009" || skillId == "s010" || skillId == "s014" || skillId == "s015";
}
function formatNowISOString() {
  return formatDateISOString(new Date());
}
function formatDateISOString(now) {
  function padZero(n) {
    return ("0" + n).slice(-2)
  }
  return now.getFullYear() + "-" + padZero(now.getMonth() + 1) + "-" + padZero(now.getDate()) + "T" + padZero(now.getHours()) + ":" + padZero(now.getMinutes()) + ":" + padZero(now.getSeconds());
}
function formatYMDISOString(dt) {
  function padZero(n) {
    return ("0" + n).slice(-2)
  }
  return dt.getFullYear() + "-" + padZero(dt.getMonth() + 1) + "-" + padZero(dt.getDate());
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
    {id: "m01", nm: "高坂穂乃果", snm: "穂乃果", c1nm:"ほ", c2nm:"ほの", birthday:"8/3", img: "https://i.gyazo.com/42f32915a494f5d453efd3a73048b13e.png"},
    {id: "m02", nm: "絢瀬絵里", snm: "絵里", c1nm:"え", c2nm:"えり", birthday:"10/21", img: "https://i.gyazo.com/5c8abc5a0b2aea555125ce6f182a5f14.png"},
    {id: "m03", nm: "南ことり", snm: "ことり", c1nm:"こ", c2nm:"こと", birthday:"9/12", img: "https://i.gyazo.com/781d2bf4000267e48b97590a391c1c7e.png"},
    {id: "m04", nm: "園田海未", snm: "海未", c1nm:"う", c2nm:"うみ", birthday:"3/15", img: "https://i.gyazo.com/58ed36ed6b41121bf568993efc8bc8f2.png"},
    {id: "m05", nm: "星空凛", snm: "凛", c1nm:"り", c2nm:"りん", birthday:"11/1", img: "https://i.gyazo.com/f9da436e320cfa077a3b01da8ab02333.png"},
    {id: "m06", nm: "西木野真姫", snm: "真姫", c1nm:"ま", c2nm:"まき", birthday:"4/19", img: "https://i.gyazo.com/40b2b7475dbb0c3662980d4583c0ecdd.png"},
    {id: "m07", nm: "東條希", snm: "希", c1nm:"の", c2nm:"のぞ", birthday:"6/9", img: "https://i.gyazo.com/21ad88598faf4917695d25084cfe4b50.png"},
    {id: "m08", nm: "小泉花陽", snm: "花陽", c1nm:"は", c2nm:"ぱな", birthday:"1/17", img: "https://i.gyazo.com/a4d9f2365d9dfc693245c4499710cf1c.png"},
    {id: "m09", nm: "矢沢にこ", snm: "にこ", c1nm:"に", c2nm:"にこ", birthday:"7/22", img: "https://i.gyazo.com/2a5c3a858c8a9a17e78a777e60f0158b.png"}
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
    var reg = new RegExp("^" + startKeyChr + "[0-9]+$");
    for (var i = 0; i < len; i++) {
      k = LS.key(i);
      if (reg.test(k)) l.push(getJson(k));
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
  function remove(id) {
    LS.removeItem(id);
  }


  d.init = function(argument) {
    //データマイグレーション
    var migLen = Migrate.length;
    var lastUpdDbVer = d.getLastUpdVersion();
    var currentMig = Migrate[migLen - 1];
    var currentVer = currentMig.dbver;
    if (lastUpdDbVer < currentVer) {

      var updateMsg = lastUpdDbVer == "0" ? "初回のデータ登録を行います。" : currentMig.msg + "<br /><br />データを更新します。";

      Dialog.open({
        type: "confirm",
        text1: "データ更新",
        text2: updateMsg,
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
          ListView.showPercent();
          ListView.updateLive();
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
  d.getLive = function(id) {
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
  };
  d.getLiveList = function() {
    return getList("l", null);
  }
  d.getMemberCostumeList = function(memId) {
    if (memId == null) {
      return null;
    } else {
      var cosList = d.getCostumeList();
      var clsLen = cosList.length;
      var l = [];
      for (var i = 0; i < clsLen; i++) {
        var cos = cosList[i];
        if (cos.hr[memId] != null) {
          l.push({
            id: cos.id,
            nm: cos.nm,
            hr: cos.hr[memId],
            r: cos.r[memId]
          });
        }
      }
      return l;
    }
  };
  d.getMemberSkillList = function(memId) {
    if (memId == null) {
      return null;
    } else {
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
    }
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
  d.getStatisticsCostume = function(method, aleCostume) {
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
      case "hasNotR":
        condFunc = function (hr, r) {return !r;}
        break;
      case "hasNotAny":
        condFunc = function (hr, r) {return !hr || !r;}
        break;
      case "hasNone":
      default:
        condFunc = function (hr, r) {return !hr && !r;}
        break;
    }
    var condFunc2;
    switch (aleCostume) {
      case "exclude":
      condFunc2 = function (cos) {return !isAleCostume(cos.id);}
        break;
      case "include":
      default:
        condFunc2 = function (cos) {return true;}
        break;
    }

    //衣装を抽出
    var cosList =d.getCostumeList();
    var cosLen = cosList.length;
    for (var i = 0; i < cosLen; i++) {
      var cos = cosList[i];
      for (var mid in cos.hr) {
        if (condFunc(cos.hr[mid], cos.r[mid]) && condFunc2(cos)) {
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
      condFunc2 = function (ski) {return !isEventSkill(ski.id);}
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
  d.saveLive = function (lvId, updCmbObj) {
    var liveData = getJson(lvId);
    var cmbData = liveData.cb;
    cmbData.e = updCmbObj.e;
    cmbData.n = updCmbObj.n;
    cmbData.h = updCmbObj.h;
    cmbData.ex = updCmbObj.ex;
    cmbData.c = updCmbObj.c;
    liveData.cb = cmbData;
    setJson(lvId, liveData);
  }
  d.saveSetting = function(settingId, val) {
    var settingData = d.getAllSetting(settingId);
    if (settingData == null) settingData = {};
    settingData[settingId] = val;
    setJson(SETTING_KEY, settingData);
  };
  d.getEvents = function(eventId) {
    var id = "events_" + eventId;
    return getJson(id);
  };
  d.saveEvents = function(eventId, events) {
    var id = "events_" + eventId;
    setJson(id, {
      "date": formatNowISOString(),
      "events": events
    });
  };
  d.loadInportData = function(str) {
    var dt = JSON.parse(str);
    for (var k in dt) {
      setJson(k, dt[k]);
    }
  };

  d.delete = function(id) {
    remove(id);
  }

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
  v.updateLive = function() {
    v.showLive();
  };

  v.setMemberCostume = function(memId) {
    var memCostume = DB.getMemberCostumeList(memId);
    var cosCnt = {"hr": 0, "r": 0};
    if (memCostume != null) {
      for (var i = 0; i < memCostume.length; i++) {
        if (memCostume[i].hr) cosCnt.hr += 1;
        if (memCostume[i].r) cosCnt.r += 1;
      }
    }
    memCosView = riot.mount("member-costume", {"cos": memCostume, "cnt": cosCnt});
  };
  v.setMemberSkill = function(memId) {
    riot.mount("member-skill", {"skill": DB.getMemberSkillList(memId)});
  };
  v.setMemberList = function () {
    riot.mount("member-list", {"mem": DB.getMemberList()});
  };
  v.setMemberStatus = function(memId) {
    riot.mount("member-profile", {"target": DB.getMember(memId), "all": DB.getMemberList()});
    v.setMemberCostume(memId);
    v.setMemberSkill(memId);
    $(document.getElementById("memStatus")).css("display", "block");
  };
  v.showLive = function() {
    riot.mount("live-list", {"liveList": DB.getLiveList()});
  };
  v.setStatisticsCostume = function() {
    var method = jq("statisticsCostumeMethod").val();
    var aleCostume = jq("statisticsAleCostume").val();
    riot.mount("statistics-costume", {mem: DB.getStatisticsCostume(method, aleCostume)});
    jq("statisticsResultCostume").css("display", "block");
    jq("statisticsResultSkill").css("display", "none");
  };
  v.setStatisticsSkill = function() {
    var border = jq("statisticsSkillBorder").val();
    var method = jq("statisticsSkillMethod").val();
    var eventSkill = jq("statisticsEventSkill").val();
    riot.mount("statistics-skill", {mem: DB.getStatisticsSkill(border, method, eventSkill)});
    jq("statisticsResultCostume").css("display", "none");
    jq("statisticsResultSkill").css("display", "block");
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
    jq("dataVer").text(DB.getLastUpdVersion());
  };
  v.reflectDesign = function() {
    var $wrapper = jq("wrapper");
    var val;
    jq("settingPage").find('.design [name]').each(function(){
      $(this).children().each(function(i, opt){
        val = $(opt).attr("value");
        if (val != null && val != "") $wrapper.removeClass(val);
      });
      val = $(this).val();
      if (val != null && val != "") $wrapper.addClass(val);

      // メニューのタブ設定であれば、メニュータブの幅調整
      if ($(this).attr("data-ismenutab") != null) v.updateMenu();
    });
  };
  v.updateMenu = function () {
    var $menu = jq("menu");
    var minWidth = 0;
    $menu.find("[data-page]").each(function() {
      if ($(this).css("display") != "none") minWidth += 70;
    });
    $menu.find("table").css("min-width", minWidth + "px");
  };

  v.showPercent = function() {
    var cosPer = {cntHR: 0, cntR: 0, obtHR: 0, obtR: 0};
    var skiPer = {cnt: 0, obt: 0, obtCnt: 0};
    var cos = DB.getCostumeList();
    var ski = DB.getSkillList();
    for (var i = 0; i < cos.length; i++) {
      for (var memid in cos[i].hr) {
        if (cos[i].hr[memid] != null) {
          cosPer.cntHR += 1;
          cosPer.cntR += 1;
          if (cos[i].hr[memid]) cosPer.obtHR += 1;
          if (cos[i].r[memid]) cosPer.obtR += 1;
        }
      }
    }
    for (var i = 0; i < ski.length; i++) {
      if (!isEventSkill(ski[i].id)) {
        for (var memid in ski[i].val) {
          skiPer.cnt += 10;
          skiPer.obt += ski[i].val[memid];
          skiPer.obtCnt += ski[i].val[memid] > 0 ? 1 : 0;
        }
      }
    }
    var cosPercentHR = Math.floor(cosPer.obtHR * 100 / cosPer.cntHR);
    var cosPercentR = Math.floor(cosPer.obtR * 100 / cosPer.cntR);
    var skiPercent = Math.floor(skiPer.obt * 100 / skiPer.cnt);
    jq("perObtCostumeHRtxt").text(cosPercentHR)
    jq("perObtCostumeHR").css("width", (cosPercentHR / 2) + "%");
    jq("perObtCostumeRtxt").text(cosPercentR)
    jq("perObtCostumeR").css("width", (cosPercentR / 2) + "%");
    jq("perObtSkilltxt").text(skiPercent)
    jq("perObtSkill").css("width", skiPercent + "%");
    jq("cntObtHR").text(cosPer.obtHR);
    jq("cntObtR").text(cosPer.obtR);
    jq("cntObtSkill").text(skiPer.obtCnt);
  };
  v.showAllEvensCalendar = function() {
    var apiKey = DB.getAllSetting();
    if (apiKey != null) apiKey = apiKey[EventApiDbId];
    if (apiKey == null || apiKey == "") {
      jq("eventsList").css("display", "none");
      return ;
    }



    var eventsTypeList = ["versionup", "game", "campaign"];
    for (var i = 0, len = eventsTypeList.length; i < len; i++) {
      v.showEvensCalendar(eventsTypeList[i]);
    }
  }
  v.showEvensCalendar = function(et) {
    var evInf = DB.getEvents(et);
    //FullCalendarに合わせて終了日+1 になっているので、1引く
    if (evInf != null) {
      if (evInf.events != null) {
        for (var i = 0; i < evInf.events.length; i++) {
          var dt = new Date(evInf.events[i].end);
          dt.setDate(dt.getDate() - 1);
          evInf.events[i].end =　formatYMDISOString(dt);
        }
      }
      riot.mount("#" + et + "Events", "events-calendar", {
        "events": evInf.events
      });
    }
  }

  v.init = function() {
    v.showCostume();
    v.showSkill();
    v.showPercent();
    v.showLive();
    v.setMemberList();
    v.setSetting();
    v.setVersion();
    v.reflectDesign();

    v.showAllEvensCalendar();
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
    $dialog.find(".descArea").css("display", "block");
    $dialog.find(".editArea").css("display", "block");
    $dialog.find(".confirmArea").css("display", "none");
    $dialog.find(".editArea .costumeedit").css("display", "block");
    $dialog.find(".editArea .skiledit").css("display", "none");
    $dialog.find(".editArea .liveedit").css("display", "none");
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
      ListView.showPercent();
      if (prm.isUpdMemberPage) {
        ListView.setMemberCostume(member.id);
      }
    };
  }


  function editSkill(prm) {
    var $dialog = jq("dialog");
    $dialog.find(".descArea").css("display", "block");
    $dialog.find(".editArea").css("display", "block");
    $dialog.find(".confirmArea").css("display", "none");
    $dialog.find(".editArea .costumeedit").css("display", "none");
    $dialog.find(".editArea .skiledit").css("display", "block");
    $dialog.find(".editArea .liveedit").css("display", "none");

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
      ListView.showPercent();
      if (prm.isUpdMemberPage) {
        ListView.setMemberSkill(member.id);
      }
    };
  }

  function editLive(prm) {
    var $dialog = jq("dialog");
    $dialog.find(".descArea").css("display", "block");
    $dialog.find(".editArea").css("display", "block");
    $dialog.find(".confirmArea").css("display", "none");
    $dialog.find(".editArea .costumeedit").css("display", "none");
    $dialog.find(".editArea .skiledit").css("display", "none");
    $dialog.find(".editArea .liveedit").css("display", "block");

    // 名前表示
    var lv = DB.getLive(prm.editId);
    jq("editTgt").text(lv.nm).attr("data-tgtid", lv.id);
    jq("editMember").text("");

    var getnm = function(rnk) {
      var nm = "-";
      switch (rnk) {
        case "fc": nm = "FULL COMBO"; break;
        case "ap": nm = "ALL PERFECT"; break;
      }
      return nm;
    }

    //コンボ状態設定
    jq("livecombo_e").attr("data-val", lv.cb.e);
    jq("livecombo_n").attr("data-val", lv.cb.n);
    jq("livecombo_h").attr("data-val", lv.cb.h);
    jq("livecombo_ex").attr("data-val", lv.cb.ex);
    jq("livecombo_c").attr("data-val", lv.cb.c);
    jq("livecombo_e").find("span").text(getnm(lv.cb.e));
    jq("livecombo_n").find("span").text(getnm(lv.cb.n));
    jq("livecombo_h").find("span").text(getnm(lv.cb.h));
    jq("livecombo_ex").find("span").text(getnm(lv.cb.ex));
    jq("livecombo_c").find("span").text(getnm(lv.cb.c));

    okCallback = function() {
      //キーの取得
      var tgtId = jq("editTgt").attr("data-tgtid");
      //更新
      DB.saveLive(tgtId, {
        e: jq("livecombo_e").attr("data-val"),
        n: jq("livecombo_n").attr("data-val"),
        h: jq("livecombo_h").attr("data-val"),
        ex: jq("livecombo_ex").attr("data-val"),
        c: jq("livecombo_c").attr("data-val")
      });
      ListView.updateLive();
    };
  }

  d.open = function(prm){
    var $dialog = jq("dialog");
    //表示内容の切り替え
    if (prm.type == "edit") {
      switch (prm.target) {
        case "costume":
          $dialog.find(".description .memName").text(DB.getMember(prm.mem).nm);
          editCostume(prm);
          break;
        case "skill":
          $dialog.find(".description .memName").text(DB.getMember(prm.mem).nm);
          editSkill(prm);
          break;
        case "live":
          $dialog.find(".description .memName").text("");
          editLive(prm);
          break;
      }
    } else if (prm.type == "confirm") {
      $dialog.find(".descArea").css("display", "none");
      $dialog.find(".editArea").css("display", "none");
      $dialog.find(".confirmArea").css("display", "block");
      $dialog.find(".confirmArea .confirmTxt1").text(prm.text1);
      $dialog.find(".confirmArea .confirmTxt2").append(prm.text2);
      okCallback = prm.okCallback;
    }

    $dialog
    .css(_getVanishPointCss())
    .css("display", "block")
    .animate(
      {top: "10px" , bottom: "10px", left: "10px", right: "10px"}
    );
  };

  d.close = function(){
    var $dialog = jq("dialog");
    $dialog
    .animate(
      _getVanishPointCss(),
      {complete: function(){$(this).css("display", "none");}}
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
    jq("menu").animate(
      {"bottom": "0px"}
    ).addClass("active");
  };

  m.close = function() {
    var $menu = jq("menu");
    var outerHeight = $menu.height() + parseInt($menu.css("border-top-width"), 10) + parseInt($menu.css("border-bottom-width"), 10);
    $menu.animate(
      {"bottom": "-" + outerHeight + "px"}
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
      if ($(elm).hasClass(showpage)) $(elm).css("display", "block");
      else $(elm).css("display", "none");
    });
    switch (showpage) {
      case "page_member":
        ListView.setMemberStatus(null);
        break;
      case "page_setting":
        jq("settingPage").find(".itm").css("display", "none");
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
    var nval;
    //画面に設定を反映
    $(this).children().each(function(i, opt){
      nval = $(opt).attr("value");
      if (nval != null && nval != "") $wrapper.removeClass(nval);
    });
    if (sVal != null && sVal != "") $wrapper.addClass(sVal);
    //保存
    DB.saveSetting(sKey, sVal);

    if ($(this).attr("data-ismenutab") != null)  ListView.updateMenu();
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

    jq("loadEventsApiKey").on("click", function() {
      var apiKey = DB.getAllSetting();
      if (apiKey != null) apiKey = apiKey[EventApiDbId];
      jq("eventsApiKey").val(apiKey == null ? "" : apiKey);
    });
    jq("saveEventsApiKey").on("click", function() {
      var str = jq("eventsApiKey").val();
      DB.saveSetting(EventApiDbId, str);
      Dialog.open({
        "type": "confirm",
        "text1": "OK",
        "text2": "保存しました。再読込を行います。",
        "okCallback": function() {
          location.reload();
        }
      });
    });

    jq("updateEvents").on("click", function() {
      if (EventLockCount >= EventLockCountBorder) {
        Dialog.open({
          "type": "confirm",
          "text1": "エラー",
          "text2": "イベント取得処理を連続して失敗しています。処理を中断します。"
        });
        return;
      }


      //APIキーがある場合のみ処理を行う
      var apiKey = DB.getAllSetting();
      if (apiKey != null) apiKey = apiKey[EventApiDbId];
      if (apiKey == null || apiKey == "") {
        Dialog.open({
          "type": "confirm",
          "text1": "エラー",
          "text2": "イベント取得APIキーが未設定のため処理できません。"
        });
        return ;
      }

      //APIから取得するかのしきい値
      var borderDate = new Date();
      borderDate.setDate(borderDate.getDate() - 1);
      borderDate = formatDateISOString(borderDate);

      //個別で判断しているが、できれば一括で管理したい……

      var key1 = "versionup";
      var savedInf1 = DB.getEvents(key1);
      if (savedInf1 == null || savedInf1.date < borderDate) {
        EventsCalendar.GetVersionUpEvents(apiKey, function(events) {
          DB.saveEvents(key1, events);
          ListView.showEvensCalendar(key1);
          //リセット
          EventLockCount = 0;
        }, function() {
          EventLockCount = EventLockCount + 1;
          Dialog.open({
            "type": "confirm",
            "text1": "エラー",
            "text2": "イベントが取得できませんでした。イベント取得APIキーが不正な可能性があります。"
                    + "\r\n（システム側不正かもしれませんが）"
                    + "\r\n連打するとサーバ負荷になるのでおやめください。"
          });
        });
      } else {
        Dialog.open({
          "type": "confirm",
          "text1": "情報",
          "text2": "イベント取得の再取得は最後に実行してから 1 日間経過する必要があります。（サーバ負荷のため）"
        });
      }

      var key2 = "game";
      var savedInf2 = DB.getEvents(key2);
      if (savedInf2 == null || savedInf2.date < borderDate) {
        EventsCalendar.GetGameEvents(apiKey, function(events) {
          DB.saveEvents(key2, events);
          ListView.showEvensCalendar(key2);
        });
      }

      var key3 = "campaign";
      var savedInf3 = DB.getEvents(key3);
      if (savedInf3 == null || savedInf3.date < borderDate) {
        EventsCalendar.GetCampaignEvents(apiKey, function(events) {
          DB.saveEvents(key3, events);
          ListView.showEvensCalendar(key3);
        });
      }


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
    $(document).on("click", "#statusMemberList a, #statusMemberStage a", function() {
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
    $(document).on("click", "#live_list .itm", function() {
      Dialog.open({
        type: "edit",
        target: "live",
        editId: $(this).attr("data-editId")
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
    jq("dialog").find(".slctbox").each(function(){
      var $self = $(this);
      var $slct = $self.find(".slcttxt");
      var $pd = $self.find(".pulldown");
      var $opts = $pd.find("a");
      $slct.on("click", function(e) {
        $pd.css("display", "block");
        e.stopPropagation();
      });
      $opts.on("click", function(e) {
        var val = $(this).attr("data-val");
        var txt = $(this).text();
        $slct.attr("data-val", val);
        $slct.find("span").text(txt);
        $pd.css("display", "none");
        e.stopPropagation();
      });
    });
    jq("dialog").on("click", function() {
      $(this).find(".pulldown").css("display", "none");
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
        if ($(elm).hasClass(itm)) $(elm).css("display", "block");
        else $(elm).css("display", "none");
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
