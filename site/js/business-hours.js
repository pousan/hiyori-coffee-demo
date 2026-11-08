/**
 * ひより珈琲 デモサイト 営業日サンプル描画スクリプト (business-hours.js)
 * 固定対象週: 2026年11月9日（月）〜15日（日）
 * 端末の日時やタイムゾーン変換は使用せず、文字列データをそのまま表示する。
 */
(function () {
  'use strict';

  var TARGET_PERIOD_LABEL = '表示例：2026年11月9日〜15日';
  var COMMON_STATUS_TEXT = '営業日サンプルを表示しています。';

  // 共通の営業日マスターデータ（臨時休業フラグは通常営業より優先される）
  var WEEKLY_SCHEDULE_DATA = [
    {
      dateShort: '11/9',
      dateLong: '11月9日',
      dayOfWeek: '月',
      regularStatus: '営業',
      regularHours: '9:00〜17:00',
      isTempClosed: false
    },
    {
      dateShort: '11/10',
      dateLong: '11月10日',
      dayOfWeek: '火',
      regularStatus: '定休日',
      regularHours: 'お休み',
      isTempClosed: false
    },
    {
      dateShort: '11/11',
      dateLong: '11月11日',
      dayOfWeek: '水',
      regularStatus: '営業',
      regularHours: '9:00〜17:00',
      isTempClosed: false
    },
    {
      dateShort: '11/12',
      dateLong: '11月12日',
      dayOfWeek: '木',
      regularStatus: '営業',
      regularHours: '9:00〜17:00',
      isTempClosed: true
    },
    {
      dateShort: '11/13',
      dateLong: '11月13日',
      dayOfWeek: '金',
      regularStatus: '営業',
      regularHours: '9:00〜17:00',
      isTempClosed: false
    },
    {
      dateShort: '11/14',
      dateLong: '11月14日',
      dayOfWeek: '土',
      regularStatus: '営業',
      regularHours: '9:00〜17:00',
      isTempClosed: false
    },
    {
      dateShort: '11/15',
      dateLong: '11月15日',
      dayOfWeek: '日',
      regularStatus: '営業',
      regularHours: '9:00〜17:00',
      isTempClosed: false
    }
  ];

  /**
   * 臨時休業を通常の営業時間より優先して表示用データを解決する
   */
  function resolveDayInfo(item) {
    if (item.isTempClosed) {
      return {
        dateShort: item.dateShort,
        dateLong: item.dateLong,
        dayOfWeek: item.dayOfWeek,
        isOpen: false,
        statusFormal: '臨時休業',
        statusCompact: '臨休',
        hoursText: 'お休み（臨時休業）',
        summaryText: '臨時休業'
      };
    }

    if (item.regularStatus === '定休日') {
      return {
        dateShort: item.dateShort,
        dateLong: item.dateLong,
        dayOfWeek: item.dayOfWeek,
        isOpen: false,
        statusFormal: '定休日',
        statusCompact: '定休',
        hoursText: 'お休み（毎週火曜）',
        summaryText: '定休日'
      };
    }

    return {
      dateShort: item.dateShort,
      dateLong: item.dateLong,
      dayOfWeek: item.dayOfWeek,
      isOpen: true,
      statusFormal: '営業',
      statusCompact: '営業',
      hoursText: item.regularHours,
      summaryText: '営業 ' + item.regularHours
    };
  }

  /**
   * トップページの「今週の営業日」7日分カードを描画
   */
  function renderTopWeeklyList(container) {
    container.innerHTML = '';

    WEEKLY_SCHEDULE_DATA.forEach(function (rawItem) {
      var day = resolveDayInfo(rawItem);
      var li = document.createElement('li');
      li.className = 'weekly-card' + (day.isOpen ? '' : ' is-closed');

      var dateSpan = document.createElement('span');
      dateSpan.className = 'weekly-card-date';
      dateSpan.textContent = day.dateShort + '（' + day.dayOfWeek + '）';

      var bodyDiv = document.createElement('div');
      bodyDiv.className = 'weekly-card-body';

      var badgeSpan = document.createElement('span');
      badgeSpan.className = 'badge ' + (day.isOpen ? 'badge-open' : 'badge-closed');
      badgeSpan.textContent = day.statusFormal;

      var hoursSpan = document.createElement('span');
      hoursSpan.className = 'weekly-card-hours';
      hoursSpan.textContent = day.hoursText;

      bodyDiv.appendChild(badgeSpan);
      bodyDiv.appendChild(hoursSpan);
      li.appendChild(dateSpan);
      li.appendChild(bodyDiv);
      container.appendChild(li);
    });
  }

  /**
   * 営業日・アクセスページの週カレンダー（7列）と詳細一覧を描画
   */
  function renderAccessCalendar(tableRow, detailList) {
    if (tableRow) {
      tableRow.innerHTML = '';
      WEEKLY_SCHEDULE_DATA.forEach(function (rawItem) {
        var day = resolveDayInfo(rawItem);
        var td = document.createElement('td');

        var dateSpan = document.createElement('span');
        dateSpan.className = 'cal-date';
        dateSpan.innerHTML =
          day.dateShort + '<span class="sr-only">（' + day.dayOfWeek + '）</span>';

        var statusSpan = document.createElement('span');
        statusSpan.className =
          'cal-status ' + (day.isOpen ? 'cal-status-open' : 'cal-status-closed');

        // 画面上はスマホ7列でも収まる短い表記（営業・定休・臨休）、読み上げでは正式な区分名を使用
        if (day.statusCompact !== day.statusFormal) {
          var visualText = document.createElement('span');
          visualText.setAttribute('aria-hidden', 'true');
          visualText.textContent = day.statusCompact;

          var srText = document.createElement('span');
          srText.className = 'sr-only';
          srText.textContent = day.statusFormal;

          statusSpan.appendChild(visualText);
          statusSpan.appendChild(srText);
        } else {
          statusSpan.textContent = day.statusFormal;
        }

        var hoursSpan = document.createElement('span');
        hoursSpan.className = 'cal-hours';
        hoursSpan.textContent = day.isOpen ? day.hoursText : 'お休み';

        td.appendChild(dateSpan);
        td.appendChild(statusSpan);
        td.appendChild(hoursSpan);
        tableRow.appendChild(td);
      });
    }

    if (detailList) {
      detailList.innerHTML = '';
      WEEKLY_SCHEDULE_DATA.forEach(function (rawItem) {
        var day = resolveDayInfo(rawItem);
        var li = document.createElement('li');
        li.className = 'calendar-detail-item';

        var dateSpan = document.createElement('span');
        dateSpan.className = 'calendar-detail-date';
        dateSpan.textContent = day.dateShort + '（' + day.dayOfWeek + '）';

        var infoDiv = document.createElement('div');
        infoDiv.className = 'calendar-detail-info';

        var badgeSpan = document.createElement('span');
        badgeSpan.className = 'badge ' + (day.isOpen ? 'badge-open' : 'badge-closed');
        badgeSpan.textContent = day.statusFormal;

        var hoursSpan = document.createElement('span');
        hoursSpan.className = 'weekly-card-hours';
        hoursSpan.textContent = day.hoursText;

        infoDiv.appendChild(badgeSpan);
        infoDiv.appendChild(hoursSpan);
        li.appendChild(dateSpan);
        li.appendChild(infoDiv);
        detailList.appendChild(li);
      });
    }
  }

  function initBusinessHours() {
    var periodElements = document.querySelectorAll('[data-hours-period]');
    for (var i = 0; i < periodElements.length; i++) {
      periodElements[i].textContent = TARGET_PERIOD_LABEL;
    }

    var statusElements = document.querySelectorAll('[data-hours-status]');
    for (var j = 0; j < statusElements.length; j++) {
      statusElements[j].textContent = COMMON_STATUS_TEXT;
    }

    var topList = document.getElementById('weekly-hours-list');
    if (topList) {
      renderTopWeeklyList(topList);
    }

    var calRow = document.getElementById('week-calendar-row');
    var detailList = document.getElementById('access-hours-detail');
    if (calRow || detailList) {
      renderAccessCalendar(calRow, detailList);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBusinessHours);
  } else {
    initBusinessHours();
  }
})();
