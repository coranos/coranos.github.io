function rippleChecksum(baseSecret, maxPositive, maxAlteredCharacters) {
	importScripts("2.5.3-crypto-sha256.js");
	importScripts("jsbn.js");
	importScripts("jsbn2.js");
	importScripts("ripple-checksum.js");

	let numChecks = 0;
	let alphabet = Ripple.Base58.alphabet;

	let secretList = [];
	let matchesList = [];
	secretList.push(baseSecret);
	let html = "";

	for (let alteredCharactersIx = 0; alteredCharactersIx < maxAlteredCharacters; alteredCharactersIx++) {
		let newSecretList = [];
		postMessage(html + "pass " + (alteredCharactersIx + 1) + " of " + maxAlteredCharacters + " checking " + secretList.length + " secrets.");

		for (let secretListIx = 0; secretListIx < secretList.length; secretListIx++) {
			let oldSecret = secretList[secretListIx];

			postMessage(html + "pass " + (alteredCharactersIx + 1) + " of " + maxAlteredCharacters + " checking " + (secretListIx + 1) + " of "
					+ secretList.length + " secrets.");

			for (let secretIx = 0; (secretIx < oldSecret.length) && (matchesList.length < maxPositive); secretIx++) {
				for (let alphabetIx = 0; (alphabetIx < alphabet.length) && (matchesList.length < maxPositive); alphabetIx++) {
					let alphabetChar = alphabet.charAt(alphabetIx);
					let newSecret = oldSecret.replaceAt(secretIx, alphabetChar);

					let isNewSecret = check_address(newSecret);

					numChecks++;
					if (isNewSecret) {
						if (!containsObject(newSecret, matchesList)) {
							matchesList.push(newSecret);

							html += newSecret + " is a valid secret.<br>";
						}
					}
					if ((alteredCharactersIx + 1) != maxAlteredCharacters) {
						if (!containsObject(newSecret, newSecretList)) {
							newSecretList.push(newSecret);
						}
					}
				}
			}
		}
		secretList = newSecretList;
	}

	html += "checked " + numChecks + " secrets.<br>";
	html += "found " + matchesList.length + " matches.<br>";

	postMessage(html);
};

function containsObject(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (list[i] === obj) {
			return true;
		}
	}

	return false;
}

String.prototype.replaceAt = function(index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

self.onmessage = function(e) {
	// console.log("workerRippleChecksum " + JSON.stringify(e.data));
	rippleChecksum(e.data.baseSecret, e.data.maxPositive, e.data.maxAlteredCharacters);
};
