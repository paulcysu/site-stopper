document.addEventListener('DOMContentLoaded', function() {
  const newUrlInput = document.getElementById('new-url');
  const addUrlButton = document.getElementById('add-url');
  const blockedUrlsList = document.getElementById('blocked-urls');
  const newKeywordInput = document.getElementById('new-keyword');
  const addKeywordButton = document.getElementById('add-keyword');
  const blockedKeywordsList = document.getElementById('blocked-keywords');

  function loadBlocklist() {
    chrome.storage.sync.get(['blockedUrls', 'blockedKeywords'], function(result) {
      displayBlockedItems(result.blockedUrls || [], blockedUrlsList, 'url');
      displayBlockedItems(result.blockedKeywords || [], blockedKeywordsList, 'keyword');
    });
  }

  function saveBlocklist(blockedUrls, blockedKeywords) {
    chrome.storage.sync.set({blockedUrls: blockedUrls, blockedKeywords: blockedKeywords}, function() {
      if (chrome.runtime.lastError) {
        console.error('Error saving blocklist:', chrome.runtime.lastError);
      } else {
        console.log('Blocklist saved successfully');
        displayBlockedItems(blockedUrls, blockedUrlsList, 'url');
        displayBlockedItems(blockedKeywords, blockedKeywordsList, 'keyword');
        updateBackgroundScript(blockedUrls, blockedKeywords);
      }
    });
  }

  loadBlocklist();

  addUrlButton.addEventListener('click', function() {
    addBlockedItem(newUrlInput, 'url');
  });

  addKeywordButton.addEventListener('click', function() {
    addBlockedItem(newKeywordInput, 'keyword');
  });

  blockedUrlsList.addEventListener('click', function(e) {
    removeBlockedItem(e, 'url');
  });

  blockedKeywordsList.addEventListener('click', function(e) {
    removeBlockedItem(e, 'keyword');
  });

  function addBlockedItem(input, type) {
    const newItem = input.value.trim();
    if (newItem) {
      chrome.storage.sync.get(['blockedUrls', 'blockedKeywords'], function(result) {
        const blockedUrls = result.blockedUrls || [];
        const blockedKeywords = result.blockedKeywords || [];
        if (type === 'url' && !blockedUrls.includes(newItem)) {
          blockedUrls.push(newItem);
        } else if (type === 'keyword' && !blockedKeywords.includes(newItem)) {
          blockedKeywords.push(newItem);
        }
        saveBlocklist(blockedUrls, blockedKeywords);
        input.value = '';
      });
    }
  }

  function removeBlockedItem(e, type) {
    if (e.target.classList.contains('remove-item')) {
      const itemToRemove = e.target.dataset.item;
      chrome.storage.sync.get(['blockedUrls', 'blockedKeywords'], function(result) {
        let blockedUrls = result.blockedUrls || [];
        let blockedKeywords = result.blockedKeywords || [];
        if (type === 'url') {
          blockedUrls = blockedUrls.filter(url => url !== itemToRemove);
        } else if (type === 'keyword') {
          blockedKeywords = blockedKeywords.filter(keyword => keyword !== itemToRemove);
        }
        saveBlocklist(blockedUrls, blockedKeywords);
      });
    }
  }

  function displayBlockedItems(items, listElement, type) {
    listElement.innerHTML = '';
    items.forEach(function(item) {
      const li = document.createElement('li');
      const itemText = document.createElement('span');
      itemText.textContent = item;
      li.appendChild(itemText);
      const removeButton = document.createElement('button');
      removeButton.innerHTML = '&times;';
      removeButton.className = 'remove-item';
      removeButton.dataset.item = item;
      li.appendChild(removeButton);
      listElement.appendChild(li);
    });
  }

  function updateBackgroundScript(blockedUrls, blockedKeywords) {
    chrome.runtime.sendMessage({
      type: 'UPDATE_BLOCKLIST',
      blockedUrls: blockedUrls,
      blockedKeywords: blockedKeywords
    }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error updating background script:', chrome.runtime.lastError);
      } else {
        console.log('Background script updated successfully:', response);
        // Reload the blocklist to ensure UI is in sync
        loadBlocklist();
      }
    });
  }
});