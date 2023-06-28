document.addEventListener('DOMContentLoaded', function() {
  var tokenInput = document.getElementById('token-input');
  var saveButton = document.getElementById('save-button');

  // Восстанавливаем сохраненное значение токена, если оно есть
  chrome.storage.sync.get(['token'], function(result) {
    if (result.token) {
      tokenInput.value = result.token;
    }
  });

  // Сохраняем токен при нажатии на кнопку "Сохранить"
  saveButton.addEventListener('click', function() {
    var token = tokenInput.value;

    // Сохраняем токен в хранилище расширения
    chrome.storage.sync.set({ 'token': token }, function() {
      console.log('Токен сохранен: ' + token);
    });
  });
});
