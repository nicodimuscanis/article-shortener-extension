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
  
  var selectElement = document.getElementById('open-method');

  // Получаем текущее значение настройки из хранилища расширения
  chrome.storage.sync.get(['openMethod'], function(result) {
    var openMethod = result.openMethod || 'currentTab';
    selectElement.value = openMethod;
  });

  selectElement.onchange = function() {
    var openMethod = selectElement.value;

    // Сохраняем выбранное значение настройки в хранилище расширения
    chrome.storage.sync.set({ openMethod: openMethod });
  };
});
