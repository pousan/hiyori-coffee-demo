/**
 * ひより珈琲 デモサイト お問い合わせ・予約フォームモック (contact.js)
 * 実際の通信・保存・URL変更・コンソール出力は一切行わない。
 */
(function () {
  'use strict';

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function initContactForm() {
    var form = document.getElementById('contact-form');
    var submitBtn = document.getElementById('contact-submit');

    if (!form || !submitBtn) {
      return;
    }

    var nameInput = document.getElementById('contact-name');
    var emailInput = document.getElementById('contact-email');
    var topicSelect = document.getElementById('contact-topic');
    var conditionalGroup = document.getElementById('conditional-seat-fields');
    var dateInput = document.getElementById('contact-date');
    var guestsSelect = document.getElementById('contact-guests');
    var messageInput = document.getElementById('contact-message');
    var confirmCheckbox = document.getElementById('contact-confirm');

    var errorBanner = document.getElementById('form-error-summary');
    var successBanner = document.getElementById('form-result');

    // カスタムバリデーションを使用
    form.noValidate = true;

    // ご用件に応じた「ご希望日」「人数」欄の表示切替
    function updateConditionalFields() {
      if (!topicSelect || !conditionalGroup) {
        return;
      }
      if (topicSelect.value === 'seat') {
        conditionalGroup.hidden = false;
      } else {
        conditionalGroup.hidden = true;
        if (dateInput) {
          dateInput.value = '';
        }
        if (guestsSelect) {
          guestsSelect.value = '';
        }
      }
    }

    if (topicSelect) {
      topicSelect.addEventListener('change', updateConditionalFields);
      updateConditionalFields();
    }

    function setFieldError(inputEl, errorElId, message) {
      var errorEl = document.getElementById(errorElId);
      if (!inputEl || !errorEl) {
        return;
      }
      var hintId = inputEl.getAttribute('data-hint-id');
      if (message) {
        inputEl.setAttribute('aria-invalid', 'true');
        errorEl.textContent = message;
        errorEl.hidden = false;
        var describedBy = hintId ? hintId + ' ' + errorElId : errorElId;
        inputEl.setAttribute('aria-describedby', describedBy);
      } else {
        inputEl.setAttribute('aria-invalid', 'false');
        errorEl.textContent = '';
        errorEl.hidden = true;
        if (hintId) {
          inputEl.setAttribute('aria-describedby', hintId);
        } else {
          inputEl.removeAttribute('aria-describedby');
        }
      }
    }

    function clearAllFeedback() {
      setFieldError(nameInput, 'contact-name-error', '');
      setFieldError(emailInput, 'contact-email-error', '');
      setFieldError(topicSelect, 'contact-topic-error', '');
      setFieldError(messageInput, 'contact-message-error', '');
      setFieldError(confirmCheckbox, 'contact-confirm-error', '');

      if (errorBanner) {
        errorBanner.textContent = '';
        errorBanner.hidden = true;
      }
      if (successBanner) {
        successBanner.textContent = '';
        successBanner.hidden = true;
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearAllFeedback();

      var firstInvalidField = null;

      // 1. お名前（必須・空白のみ不可・100文字以内）
      var nameRaw = nameInput ? nameInput.value : '';
      var nameTrimmed = nameRaw.trim();
      if (!nameTrimmed) {
        setFieldError(
          nameInput,
          'contact-name-error',
          'お名前を入力してください（空白のみの入力はできません）。'
        );
        if (!firstInvalidField) firstInvalidField = nameInput;
      } else if (nameRaw.length > 100) {
        setFieldError(
          nameInput,
          'contact-name-error',
          'お名前は100文字以内で入力してください。'
        );
        if (!firstInvalidField) firstInvalidField = nameInput;
      }

      // 2. メールアドレス（必須・空白のみ不可・254文字以内・形式チェック）
      var emailRaw = emailInput ? emailInput.value : '';
      var emailTrimmed = emailRaw.trim();
      if (!emailTrimmed) {
        setFieldError(
          emailInput,
          'contact-email-error',
          'メールアドレスを入力してください。'
        );
        if (!firstInvalidField) firstInvalidField = emailInput;
      } else if (emailTrimmed.length > 254 || !EMAIL_PATTERN.test(emailTrimmed)) {
        setFieldError(
          emailInput,
          'contact-email-error',
          'メールアドレスを正しい形式（例：sample@example.com・254文字以内）で入力してください。'
        );
        if (!firstInvalidField) firstInvalidField = emailInput;
      }

      // 3. ご用件（必須）
      var topicVal = topicSelect ? topicSelect.value : '';
      if (topicVal !== 'inquiry' && topicVal !== 'seat') {
        setFieldError(
          topicSelect,
          'contact-topic-error',
          'ご用件を選択してください。'
        );
        if (!firstInvalidField) firstInvalidField = topicSelect;
      }

      // 4. お問い合わせ内容（必須・空白のみ不可・1000文字以内）
      var msgRaw = messageInput ? messageInput.value : '';
      var msgTrimmed = msgRaw.trim();
      if (!msgTrimmed) {
        setFieldError(
          messageInput,
          'contact-message-error',
          'お問い合わせ内容を入力してください（空白のみの入力はできません）。'
        );
        if (!firstInvalidField) firstInvalidField = messageInput;
      } else if (msgRaw.length > 1000) {
        setFieldError(
          messageInput,
          'contact-message-error',
          'お問い合わせ内容は1000文字以内で入力してください。'
        );
        if (!firstInvalidField) firstInvalidField = messageInput;
      }

      // 5. デモの確認（必須）
      var isConfirmed = confirmCheckbox ? confirmCheckbox.checked : false;
      if (!isConfirmed) {
        setFieldError(
          confirmCheckbox,
          'contact-confirm-error',
          'デモの確認チェックボックスにチェックを入れてください。'
        );
        if (!firstInvalidField) firstInvalidField = confirmCheckbox;
      }

      // エラーがある場合は要約を表示し、最初の不正項目へフォーカス移動
      if (firstInvalidField) {
        if (errorBanner) {
          errorBanner.textContent = '入力内容をご確認ください。';
          errorBanner.hidden = false;
        }
        firstInvalidField.focus();
        return;
      }

      // 成功時：入力をクリアし、モック完了メッセージを通知（入力内容は転載しない）
      form.reset();
      updateConditionalFields();

      if (successBanner) {
        successBanner.textContent =
          '送信デモが完了しました。内容は送信・保存されていません。予約は成立していません。';
        successBanner.hidden = false;
      }
    });

    // submit処理を登録してから送信ボタンを有効化する
    submitBtn.disabled = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
