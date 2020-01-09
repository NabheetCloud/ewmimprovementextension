
chrome.runtime.onInstalled.addListener(function () {
  chrome.alarms.create('checkNewIems', {
    delayInMinutes: 10, periodInMinutes: 360
  }
  );

});
chrome.alarms.onAlarm.addListener(function (alarm) {
  fetch('https://sapimprovementfinder.com/api/contents/')
    .then(res => res.json())
    .then(data => data.filter(e => { if (e.topic.name.includes("EWM")) return e.name; }))
    .then(data => {
      if (data.length > 0) {
        chrome.storage.sync.get('EWMImprovementCount', function (dstoredData) {
          if (!dstoredData.EWMImprovementCount) {
            chrome.storage.sync.set({ EWMImprovementCount: data.length }, function () {
              console.log("Count saved!");
            });
          } else {
            if (data.length != dstoredData.EWMImprovementCount) {
              chrome.storage.sync.set({ EWMImprovementCount: data.length }, function () {
                console.log("Count saved!");
              });
              var opt = {
                type: "basic",
                title: "New SAP EWM Improvements",
                message: "SAP EWM Improvements have been released!",
                iconUrl: "log.png",
              };
              chrome.notifications.clear('notify2', function () {
                chrome.notifications.create('notify2', opt, function () { console.log("Last error:", chrome.runtime.lastError); });
              });
            }
          }
        });
      }
    });
});
