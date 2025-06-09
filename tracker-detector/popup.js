chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.runtime.sendMessage({action: "getTrackers", tabId: tabs[0].id}, function(response) {
    const ul = document.getElementById('trackers');
    if (response && response.length > 0) {
      response.forEach(domain => {
        const li = document.createElement('li');
        li.textContent = domain;
        ul.appendChild(li);
      });
    } else {
      ul.innerHTML = "<li>No trackers detected.</li>";
    }
  });
});