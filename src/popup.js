document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentUrl = tabs[0].url;
    var endpoint = 'https://300.ya.ru/api/sharing-url';

    // Получаем сохраненные параметры из хранилища
    chrome.storage.sync.get(['token', 'openMethod'], function(result) {
      var token = result.token;
      var openMethod = result.openMethod || 'currentTab';
      var xhr = new XMLHttpRequest();
      //делаем post {{'article_url': <link>}, headers = {'Authorization': 'OAuth <token>'}}
      xhr.open('POST', endpoint);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', 'OAuth ' + token);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          var response = JSON.parse(xhr.responseText);
          if (xhr.status === 200) {
            var sharingUrl = response.sharing_url;
            if (sharingUrl) {
              if (openMethod === 'currentTab') {
                chrome.tabs.update(tabs[0].id, { url: sharingUrl });
                window.close();
              } else if (openMethod === 'newTab') {
                chrome.tabs.create({ url: sharingUrl });
              } else if (openMethod === 'popupWindow') {
                chrome.windows.create({
                    url: sharingUrl,
                    type: 'popup',
                    width: 500,
                    height: 600
                });
                window.close();
              }
            }
          } else {
            console.error('Ошибка при выполнении запроса:', xhr.status);
            var errorMessage = xhr.status + ': ' + response.status + ', ' + response.message + ' Попробуйте ввести вашу ссылку или текст вручную в открывшемся окне';
            var errorElement = document.getElementById('error-message');
            errorElement.innerHTML = '';
            var errorSpan = document.createElement('span');
            errorSpan.style.color = 'blue';
            errorSpan.textContent = errorMessage;
            //открываем страницу для ввода ссылки вручную
            chrome.windows.create({
              url: 'https://300.ya.ru',
              type: 'popup',
              width: 500,
              height: 600
            });

            errorElement.appendChild(errorSpan);
          }
        }
      };

      xhr.send(JSON.stringify({ 'article_url': currentUrl }));
    });
  });
});
