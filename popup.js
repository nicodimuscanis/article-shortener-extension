document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentUrl = tabs[0].url;
    var endpoint = 'https://300.ya.ru/api/sharing-url';

    // Получаем сохраненный токен из хранилища
    chrome.storage.sync.get(['token'], function(result) {
      var token = result.token;

      var xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', 'OAuth ' + token);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var sharingUrl = response.sharing_url;
            if (sharingUrl) {
              chrome.tabs.update(tabs[0].id, { url: sharingUrl });
              window.close();
            }
          } else {
            console.error('Ошибка при выполнении запроса:', xhr.status);
          }
        }
      };

      xhr.send(JSON.stringify({ 'article_url': currentUrl }));
    });
  });
});
