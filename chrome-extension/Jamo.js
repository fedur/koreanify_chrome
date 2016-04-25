// JamoExtension.js
// Manages everything related to the creation of sylables in the converter
// github.com/fedur/kroeanify_extension

JamoCodes = {};
JamoCodes.initial = {
	gg : 1,
	g : 0,
	n : 2,
	d : 3,
	dd : 4,
	r : 5,
	l : 5,
	m : 6,
	b : 7,
	bb : 8,
	s : 9,
	ss : 10,
	ng : 11,
	j : 12,
	jj : 13,
	c : 14,
	k : 15,
	t : 16,
	p : 17,
	h : 18
};

JamoCodes.medial = {
	a : 0,
	ae : 1,
	ya : 2,
	yae : 3,
	eo : 4,
	e : 5,
	yae : 6,
	yeo : 7,
	o : 8,
	wa : 9,
	wae : 10,
	oe : 11,
	yo : 12,
	u : 13,
	weo : 14,
	we : 15,
	wi : 16,
	yu : 17,
	eu : 18,
	ui : 19,
	i : 20,
};

JamoCodes.terminal =  {
	g : 1,
	gg : 2,
	n : 4,
	d : 7,
	r : 8,
	l : 8,
	m : 16,
	b : 17,
	s : 19,
	ss : 20,
	ng : 21,
	j : 22,
	c : 23,
	k : 24,
	t : 25,
	p : 26,
	h : 27,
};

/*
	JAMO CLASS DEFINITION
*/

// Jamo Constructor
function Jamo() { 

	if (!(this instanceof Jamo)) {
		console.log("construct");
		return new Jamo();
	}

	// We get all the valid romanized english to Korean letter possibilities
	/* This will be later done using an external db, right now, it's only fetching from JamoDb 
	which right now is just storing the valid letters in an object */

	validLetters = []; // validLetters[InitialOrMedialOrFinal][TheLetters]
	validLetters.push(getSortedArrayFromKeys(JamoCodes.initial));
	validLetters.push(getSortedArrayFromKeys(JamoCodes.medial));
	validLetters.push(getSortedArrayFromKeys(JamoCodes.terminal));

	var regexString = "";

	for (i = 0; i<validLetters.length; i++) { 
		regexString += "("; // Starts the set representing all valid characters that can form a Jamo

		for (j = 0; j<validLetters[i].length; j++) { // Adds all letters that can form the jamo
			regexString += "(?:" + validLetters[i][j] + ")";
			if (j != validLetters[i].length -1)
				regexString += "|";
		}

		regexString += ")"; // Ends the set representing all the characters forming a Jamo.
		regexString += "?"; // Matching the Jamo 0 or 1 times, since we can have letters like 'a' that has no initial nor final jamo.
	}

	this.regexString = new RegExp(regexString);

};
// Jamo Methods

Jamo.prototype.getRegex = function () {
    return this.regexString;
};


Jamo.prototype.createSyllable = function(initialJ, medialJ, terminalJ) {
    if (initialJ == undefined) 
        initialJ = 11; //Empty Character -> ㅇ
    else
        initialJ = JamoCodes.initial[initialJ];

    if (medialJ == undefined)
        return -1;
    else
        medialJ = JamoCodes.medial[medialJ];

    if (terminalJ == undefined)
        terminalJ = 0;
    else
        terminalJ = JamoCodes.terminal[terminalJ];

    return initialJ*588+medialJ*28+terminalJ+44032
}


Jamo.prototype.getKoreanSyllable = function(word) {
    var result = this.regexString.exec(word);
    return String.fromCharCode(this.createSyllable(result[1], result[2], result[3]));
}

// Priate method
function getSortedArrayFromKeys(obj) {
    var sortedKeys = [];
    for (var key in obj) {
        sortedKeys.push(key);
    }

    sortedKeys.sort(function(a,b) {
        if (a < b)
            return 1;
        else
            return -1;
    });

    return sortedKeys;
}
var yo = new Jamo();
yo;