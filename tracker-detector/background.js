let trackerDomains = [];

fetch(chrome.runtime.getURL("tracker-list.json"))
  .then(resp => resp.json())
  .then(data => { trackerDomains = data.domains; });

let tabTrackers = {};

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!details.tabId || details.tabId < 0) return;
    try {
      const url = new URL(details.url);
      const domain = url.hostname;
      if (trackerDomains.some(tracker => domain.ends(tracker))) {
        if (!tabTrackers[details.tabId]) tabTrackers[details.tabId] = new Set();
        tabTrackers[details.tabId].add(domain);
      }
    } catch (e) {}
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getTrackers") {
    sendResponse(Array.from(tabTrackers[msg.tabId] || []));
  }
});

// works on cnn.com