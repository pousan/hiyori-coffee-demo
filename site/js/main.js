/**
 * ひより珈琲 デモサイト 共通スクリプト (main.js)
 * モバイルナビゲーション開閉・キーボード操作対応
 */
(function () {
  'use strict';

  function initNavigation() {
    var header = document.querySelector('.site-header');
    var toggleBtn = document.getElementById('nav-toggle');
    var nav = document.getElementById('global-nav');

    if (!header || !toggleBtn || !nav) {
      return;
    }

    // JS有効時のみ折りたたみナビを有効化する（JS無効時は常時展開）
    header.classList.add('js-nav-ready');
    toggleBtn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');

    function closeNav(returnFocus) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      if (returnFocus) {
        toggleBtn.focus();
      }
    }

    function openNav() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
    }

    toggleBtn.addEventListener('click', function () {
      var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeNav(false);
      } else {
        openNav();
      }
    });

    // Escapeキーでメニューを閉じ、開閉ボタンへフォーカスを戻す
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          event.preventDefault();
          closeNav(true);
        }
      }
    });

    // 768px以上に広がった際は開閉状態をリセット
    if (window.matchMedia) {
      var mq = window.matchMedia('(min-width: 768px)');
      var handleResize = function (e) {
        if (e.matches) {
          closeNav(false);
        }
      };
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handleResize);
      } else if (typeof mq.addListener === 'function') {
        mq.addListener(handleResize);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
