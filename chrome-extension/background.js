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

chrome.commands.onCommand.addListener(function(command) {

	if (command == "translate_text") {
		chrome.tabs.executeScript( null, {file: 'translateSyllable.js'}, undefined);
		chrome.tabs.executeScript( null, {file: 'Jamo.js'}, undefined); // Class used by translateSyllable.js
		chrome.tabs.executeScript( null, {file: 'getSelection.js'}, undefined);

		// Send message to active Tab
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

			chrome.tabs.sendMessage(tabs[0].id, {"command": "get_selection"}, function(selection) {

				chrome.tabs.sendMessage(tabs[0].id, {"command": "translate_selection", "word": selection}, function(translation) {
					if (translation != null) {
						copyToClipboard(translation);
						alert(translation + ' copied to Clipboard!')
					}
					
					else alert('oops');

					// NOT READY 
					/*chrome.tabs.sendMessage(tabs[0].id, {"command": "replace_selection", "translation": translation}, function(response){
						//console.log(response);
					}); */
				});
			});
		});
  	}
});

/* OMNIBOX IMPLEMENTATION */

chrome.omnibox.onInputEntered.addListener(function(text) {
	chrome.tabs.executeScript( null, {file: 'translateSyllable.js'}, undefined);
	chrome.tabs.executeScript( null, {file: 'Jamo.js'}, undefined); // Class used by translateSyllable.js

  	// Send message to active Tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

		chrome.tabs.sendMessage(tabs[0].id, {"command": "translate_selection", "word": text}, function(response) {
			console.log(response);
			copyToClipboard(response);
			alert(response + ' copied to Clipboard!')
		});
	});
});