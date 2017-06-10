var EventsCalendar = (function(){
  // https://developers.google.com/google-apps/calendar/v3/reference/events/list

  var CalendarIds = {
    VersionUp: "vsqkp4vvl95q34flcos9murnn0%40group.calendar.google.com",
    Shop: "9q3udc17rt1rov7c9gdt32vepk%40group.calendar.google.com",
    Game: "icpdlf09o9k7bq6j0qu9drdsak%40group.calendar.google.com",
    Campaign: "jglv29542g35ilnc0su4qsnbk4%40group.calendar.google.com",
    Other: "l8lnl40mi015m2d5ub06s8im14%40group.calendar.google.com"
  };
  function formatDateISO(date) {
    return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
  }
  function GetCalendarUrl(calName) {
    var calId = CalendarIds[calName];
    if (calId == null) return null;
    return "https://www.googleapis.com/calendar/v3/calendars/" + calId + "/events";
  }
  function GetParams(caledarKey) {
    var from = new Date();
    from.setHours(0);
    from.setMinutes(0);
    from.setSeconds(0);
    from.setMilliseconds(0);
    from.setDate(from.getDate() - 7);
    var to = new Date(from.getTime());
    to.setDate(to.getDate() + 21);
    return {
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      key: caledarKey
    };
  }
  function getEvents(calName, gcalData) {
    var events = [];
    var itm;
    var convertNameFunc;
    switch (calName) {
      case "Game":
        convertNameFunc = function (nm) {return nm.replace("ゲーム内イベント「", "").replace("」", "");}
        break;
      default:
        convertNameFunc = function (nm) {return nm;};
        break;
    }
    var urlRegExp = new RegExp('http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?');

    if (gcalData.items != null) {
      for (var i = 0, len = gcalData.items.length; i < len; i++) {
        itm = gcalData.items[i];
        var match = urlRegExp.exec(itm.description);
        var url = (match != null && match.length) > 0 ? match[0] : null;
        events.push({
          "start": itm.start.date,
          "end": itm.end.date,
          "nm": convertNameFunc(itm.summary),
          "desc": itm.description,
          "url": url,
          "type": calName.toLowerCase()
        });
      }
    }
    return events;
  }

  function GetEvents(calName, apiKey, callback, errCallback) {
    var url = GetCalendarUrl(calName);
    if (url == null) return;

    $.ajax({
      "type": "GET",
      "url": url,
      "cache": false,
      "data": GetParams(apiKey),
      "dataType": "json",
      "success": function(data) {
        callback(getEvents(calName, data));
      },
      "error": function(data) {
        if (errCallback != null) errCallback(data);
      }
    });
  }

  var e = {};
  e.GetVersionUpEvents = function (apiKey, callback, errCallback) {
    GetEvents("VersionUp", apiKey, callback, errCallback);
  }
  e.GetShopEvents = function (apiKey, callback, errCallback) {
    GetEvents("Shop", apiKey, callback, errCallback);
  }
  e.GetGameEvents = function (apiKey, callback, errCallback) {
    GetEvents("Game", apiKey, callback, errCallback);
  }
  e.GetCampaignEvents = function (apiKey, callback, errCallback) {
    GetEvents("Campaign", apiKey, callback, errCallback);
  }
  e.GetOtherEvents = function (apiKey, callback, errCallback) {
    GetEvents("Other", apiKey, callback, errCallback);
  }

  return e;
})();
