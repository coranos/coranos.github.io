BigInteger.valueOf = nbv;
BigInteger.prototype.toByteArrayUnsigned = function() {
	var ba = this.toByteArray();
	if (ba.length) {
		if (ba[0] == 0)
			ba = ba.slice(1);
		return ba.map(function(v) {
			return (v < 0) ? v + 256 : v;
		});
	} else
		return ba;
};
var Ripple = {};
(function() {
	var B58 = Ripple.Base58 = {
		alphabet : "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz",
		base : BigInteger.valueOf(58),
		decode : function(input, minLength) {
			var bi = BigInteger.valueOf(0);
			for (var i = 0; i < input.length; i++) {
				var alphaIndex = B58.alphabet.indexOf(input[i]);
				if (alphaIndex < 0)
					throw "Invalid character";
				bi = bi.multiply(B58.base).add(BigInteger.valueOf(alphaIndex));
			}
			var bytes = bi.toByteArrayUnsigned();
			while (bytes.length < minLength)
				bytes.unshift(0);
			return bytes;
		}
	};
})();
Ripple.Address = function(bytes) {
	if ("string" == typeof bytes)
		bytes = Ripple.Address.decodeString(bytes);
	this.hash = bytes;
};
Ripple.Address.decodeString = function(string) {
	var bytes = Ripple.Base58.decode(string, 21);
	var payload = bytes.slice(0, 17);
	var checksum = bytes.slice(17, 21);

	//console.log("payload " + JSON.stringify(payload));
	//console.log("checksum " + JSON.stringify(checksum));

	var sha2 = window.Crypto.SHA256(window.Crypto.SHA256(payload, {
		asBytes : true
	}), {
		asBytes : true
	});

	//console.log("sha2 " + JSON.stringify(sha2));

	if (checksum[0] != sha2[0] || checksum[1] != sha2[1] || checksum[2] != sha2[2] || checksum[3] != sha2[3]) {

		var checksum0 = [];
		checksum0.push(checksum[0]);
		checksum0.push(checksum[1]);
		checksum0.push(checksum[2]);
		checksum0.push(checksum[3]);

		var bytes0 = [];
		bytes0.push(sha2[0]);
		bytes0.push(sha2[1]);
		bytes0.push(sha2[2]);
		bytes0.push(sha2[3]);

		var msg2 = JSON.stringify(checksum0);

		var msg3 = JSON.stringify(bytes0);

		throw "Checksum validation failed! " + msg2 + " !-" + msg3 + " ";
	}
	return sha2;
};

function check_address(address) {
	try {
		Ripple.Address(address);
		return true;
	} catch (err) {
		//console.log(err);
		return false;
	}
}