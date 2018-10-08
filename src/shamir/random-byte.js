/**
		Generate 16 random alpha numeric bytes just like crypto.randomBytes in Node.js.
		@method (randomBytes)
		@param {Number} length      The string length that should be generated
		@return {String} A 16 char/UTF-8 byte string of random alpha-numeric characters
**/

function randomBytes(length) {
	const charset = "abcdef0123456789";
	let i;
	let result = "";
	let bufferLength = length * 2
	if (window.crypto && window.crypto.getRandomValues) {
		let values = new Uint32Array(bufferLength);
		window.crypto.getRandomValues(values);
		for (i = 0; i < bufferLength; i++) {
				result += charset[values[i] % charset.length];
		}
		return result;
	} else throw new Error("can't generate secure random numbers");
}

export { randomBytes }