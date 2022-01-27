function ping() {
    chrome.runtime.sendMessage('ping', response => {
      if(chrome.runtime.lastError) {
        setTimeout(ping, 1000);
      } else {
        // Do whatever you want, background script is ready now
      }
    });
  }
  
  ping();