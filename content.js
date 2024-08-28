(function() {
  let extensionActive = true;

  function checkExtensionContext() {
      try {
          if (!chrome.runtime || !chrome.runtime.id) {
              throw new Error('Extension context invalid');
          }
          return true;
      } catch (e) {
          console.log('Extension context is invalid:', e);
          extensionActive = false;
          return false;
      }
  }

  function blockContent(keywords) {
      const bodyText = document.body.innerText.toLowerCase();
      if (keywords.some(keyword => bodyText.includes(keyword.toLowerCase()))) {
          document.body.innerHTML = '<h1>This content is blocked due to keyword match</h1>';
      }
  }

  function getKeywords() {
      if (!checkExtensionContext()) return;

      try {
          chrome.runtime.sendMessage({type: 'GET_KEYWORDS'}, function(response) {
              if (chrome.runtime.lastError) {
                  console.log('Error getting keywords:', chrome.runtime.lastError);
                  return;
              }
              if (response && response.keywords) {
                  blockContent(response.keywords);
              }
          });
      } catch (error) {
          console.log('Failed to get keywords:', error);
      }
  }

  function initContentScript() {
      if (!checkExtensionContext()) return;

      // Initial check on page load
      getKeywords();

      // Watch for dynamic content changes
      const observer = new MutationObserver(function(mutations) {
          if (extensionActive) {
              getKeywords();
          } else {
              observer.disconnect();
          }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
          if (!extensionActive) return;

          if (request.type === 'CHECK_KEYWORDS') {
              blockContent(request.keywords);
          }
      });
  }

  // Start the content script
  initContentScript();

  // Periodically check if the extension is still active
  setInterval(checkExtensionContext, 5000);
})();