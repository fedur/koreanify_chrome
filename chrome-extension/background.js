chrome.tabs.executeScript( null, {file: 'translateSyllable.js'}, undefined);
chrome.tabs.executeScript( null, {file: 'Jamo.js'}, undefined); // Class used by translateSyllable.js
chrome.tabs.executeScript( null, {file: 'getSelection.js'}, undefined);

chrome.commands.onCommand.addListener(function(command) {

	function copyToClipboard(text) {
		const input = document.createElement('input');
		input.style.position = 'fixed';
		input.style.opacity = 0;
		input.value = text;
		document.body.appendChild(input);
		input.select();
		document.execCommand('Copy');
		document.body.removeChild(input)
	}
	if (command == "translate_text") {

		// Send message to active Tab
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {"command": "get_selection"}, function(selection) {
				console.log(selection);
				// Send message to active Tab

				chrome.tabs.sendMessage(tabs[0].id, {"command": "translate_selection", "word": selection}, function(response) {
						console.log(response);
						copyToClipboard(response);
						alert(response + ' copied to Clipboard!')
				});

			});
		});
  	}
});
/* Starting omnibox implementation*/

chrome.omnibox.onInputEntered.addListener(function(text) {
  	chrome.tabs.sendMessage(tabs[0].id, {"command": "translate_selection", "word": text}, function(response) {
		console.log(response);
		copyToClipboard(response);
		alert(response + ' copied to Clipboard!')
	});
});