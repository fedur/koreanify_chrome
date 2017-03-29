
// Sends the text selected by the user!

chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		if (message.command == "get_selection") {
			var selection = window.getSelection().toString();
			sendResponse(selection);
		}

		else if (message.command == "replace_selection") {
			var selection = window.getSelection().toString();
			window.getSelection().getRangeAt(0).startContainer.nodeValue = message.translation;
			sendResponse(1);
		}

	}
);