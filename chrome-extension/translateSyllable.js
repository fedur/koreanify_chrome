// USES content script Jamo.js 
// NEED TO ADD Jamo.js in content Script 
// I.E "chrome.tabs.executeScript( null, {file: 'Jamo.js'}, undefined); "
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		if (message.command == "translate_syllable") {
			var jamoInterface = new Jamo();
			sendResponse(jamoInterface.getKoreanSyllable(message.word));
		}


		else if (message.command == "translate_selection") {
			console.log("Calling translate_selection");
			var jamoInterface = new Jamo();
			var whiteSpaceReg = /\s(?=[a-zA-Z]+)/;
			var upperCaseReg = /π*(?=[A-Z])/;

			//Get All the words (split by white space) in an array.
			var allWords = message.word.split(whiteSpaceReg); 
			var splitWords = [];
			for (i = 0; i<allWords.length; i++) {

				//Get all Syllables (split when new syllable is upperCase) in an array
				var syllables = allWords[i].split(upperCaseReg);

				for (j = 0; j<syllables.length; j++) {
					syllables[j] = syllables[j].toLowerCase();
				}

				splitWords.push(syllables);
			}
			var translation = "";
			for (word of splitWords) {
				for (syllable of word) {
					var result = jamoInterface.getRegex().exec(syllable);
					var unicode = jamoInterface.createSyllable(result[1], result[2], result[3]);
					
					if (unicode > 0) //If there's no error...
						translation += String.fromCharCode(unicode); 
					else {
						translation += syllable.toString();
						console.log(syllable.toString());
					}
				}
				// New word = whitespace
				translation += " ";
			}
			/*  WORK IN PROGRESS
			var selection = window.getSelection();
			range = selection.getRangeAt(0);            
            range.deleteContents();            
            range.insertNode(document.createTextNode(translation));  */

			sendResponse(translation);
		}
	}
);