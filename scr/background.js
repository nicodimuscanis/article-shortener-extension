// Проверяем, было ли обновление расширения
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "update") {
    // Открываем страницу с описанием изменений
    chrome.tabs.create({ url: "changelog.html" });
  }
});