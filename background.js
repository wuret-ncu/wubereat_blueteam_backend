chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(msg => {
      // Handle message however you want
    }
  );
})

chrome.runtime.onMessage.addListener((request, sender, sendResponsez))