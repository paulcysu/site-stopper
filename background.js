let blockedUrls = [];
let blockedKeywords = [];
let nextRuleId = 1;

function loadBlocklist() {
    chrome.storage.sync.get(['blockedUrls', 'blockedKeywords', 'nextRuleId'], function(result) {
        blockedUrls = result.blockedUrls || [];
        blockedKeywords = result.blockedKeywords || [];
        nextRuleId = result.nextRuleId || 1;
        updateDeclarativeNetRequest();
    });
}

function updateDeclarativeNetRequest() {
    chrome.declarativeNetRequest.getDynamicRules(existingRules => {
        const rulesToRemove = existingRules.map(rule => rule.id);
        const rulesToAdd = blockedUrls.map(url => ({
            id: nextRuleId++,
            priority: 1,
            action: { type: 'block' },
            condition: {
                urlFilter: url,
                resourceTypes: ['main_frame']
            }
        }));

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rulesToRemove,
            addRules: rulesToAdd
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error updating rules:', JSON.stringify(chrome.runtime.lastError));
            } else {
                console.log('Rules updated successfully');
                console.log('Current rules:', rulesToAdd);
                chrome.storage.sync.set({nextRuleId: nextRuleId});
            }
        });
    });
}

loadBlocklist();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'UPDATE_BLOCKLIST') {
        blockedUrls = request.blockedUrls;
        blockedKeywords = request.blockedKeywords;
        updateDeclarativeNetRequest();
        sendResponse({status: 'Blocklist updated'});
    } else if (request.type === 'GET_KEYWORDS') {
        sendResponse({keywords: blockedKeywords});
    }
    return true; // Indicates that we will send a response asynchronously
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        try {
            chrome.tabs.sendMessage(tabId, {
                type: 'CHECK_KEYWORDS',
                keywords: blockedKeywords
            }, function(response) {
                if (chrome.runtime.lastError) {
                    console.log(`Error sending message to tab ${tabId}:`, chrome.runtime.lastError);
                }
            });
        } catch (error) {
            console.log(`Failed to send message to tab ${tabId}:`, error);
        }
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && (changes.blockedUrls || changes.blockedKeywords)) {
        loadBlocklist();
    }
});
