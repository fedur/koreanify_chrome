chrome.commands.onCommand.addListener(function(command) {
	if (command == "translate_text") {


		chrome.tabs.executeScript( null, {file: 'translateSyllable.js'}, undefined);
  		chrome.tabs.executeScript( null, {file: 'Jamo.js'}, undefined); // Class used by translateSyllable.js

  		chrome.tabs.executeScript( null, {file: 'getSelection.js'}, undefined);

		// Send message to active Tab
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {"command": "get_selection"}, function(selection) {
				console.log(selection);
				// Send message to active Tab

				chrome.tabs.sendMessage(tabs[0].id, {"command": "translate_selection", "word": selection}, function(response) {
						console.log(response);
				});

			});
		});
  	}
});