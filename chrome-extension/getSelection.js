
// Sends the text selected by the user!

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		if (message.command == "get_selection") {
			var selection = window.getSelection().toString();
			sendResponse(selection);
		}

	}
);