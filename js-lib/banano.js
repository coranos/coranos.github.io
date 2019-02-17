const uint5ToUint4 = (uint5) => {
  const length = uint5.length / 4 * 5;
  const uint4 = new Uint8Array(length);
  for (let i = 1; i <= length; i++) {
    const n = i - 1;
    const m = i % 5;
    const z = n - ((i - m) / 5);
    const right = uint5[z - 1] << (5 - m);
    const left = uint5[z] >> m;
    uint4[n] = (left + right) % 16;
  }
  return uint4;
}

const array_crop = (array) => {
  const length = array.length - 1;
  const cropped_array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    cropped_array[i] = array[i + 1];
  }
  return cropped_array;
}

const uint4ToHex = (uint4) => {
  var hex = "";
  for (let i = 0; i < uint4.length; i++) {
    hex += uint4[i].toString(16).toUpperCase();
  }
  return hex;
}

const uint8ToUint4 = (uintValue) => {
  const uint4 = new Uint8Array(uintValue.length * 2);
  for (let i = 0; i < uintValue.length; i++) {
    uint4[i * 2] = uintValue[i] / 16 | 0;
    uint4[i * 2 + 1] = uintValue[i] % 16;
  }

  return uint4;
}

const equal_arrays = (array1, array2) => {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] != array2[i]) return false;
  }
  return true;
}

const uint4ToUint8 = (uintValue) => {
  const length = uintValue.length / 2;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8[i] = (uintValue[i * 2] * 16) + uintValue[i * 2 + 1];
  }

  return uint8;
}

const stringToUint5 = (string) => {
  const letter_list = '13456789abcdefghijkmnopqrstuwxyz'.split('');
  const length = string.length;
  const string_array = string.split('');
  const uint5 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint5[i] = letter_list.indexOf(string_array[i]);
  }
  return uint5;
}

const getAccountPublicKey = (account) => {
  if (account === undefined) {
    throw new Error(`Undefined BANANO Account`);
  }
  if (((!account.startsWith('ban_1')) && (!account.startsWith('ban_3'))) || (account.length !== 64)) {
    throw new Error(`Invalid BANANO Account ${account}`);
  }
  const account_crop = account.substring(4, 64);
  const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(account_crop);
  if (!isValid) {
    throw new Error(`Invalid BANANO account ${account}`);
  }

  const key_uint4 = array_crop(uint5ToUint4(stringToUint5(account_crop.substring(0, 52))));
  const hash_uint4 = uint5ToUint4(stringToUint5(account_crop.substring(52, 60)));
  const key_array = uint4ToUint8(key_uint4);
  const blake_hash = blake.blake2b(key_array, null, 5).reverse();

  if (!equal_arrays(hash_uint4, uint8ToUint4(blake_hash))) {
    throw new Error(`Incorrect checksum`);
  }

  return uint4ToHex(key_uint4);
}

const hexToUint8 = (hexValue) => {
  const length = (hexValue.length / 2) | 0;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16);
  }
  return uint8;
}

const decToHex = (decValue, bytes = null) => {
  var dec = decValue.toString().split(''),
    sum = [],
    hex = '',
    hexArray = [],
    i, s
  while (dec.length) {
    s = 1 * dec.shift();
    for (i = 0; s || i < sum.length; i++) {
      s += (sum[i] || 0) * 10;
      sum[i] = s % 16;
      s = (s - sum[i]) / 16;
    }
  }
  while (sum.length) {
    hexArray.push(sum.pop().toString(16));
  }

  hex = hexArray.join('');

  if (hex.length % 2 != 0) {
    hex = "0" + hex;
  }

  if (bytes > hex.length / 2) {
    var diff = bytes - hex.length / 2;
    for (var j = 0; j < diff; j++) {
      hex = "00" + hex;
    }
  }

  return hex;
}


const generateAccountSecretKeyBytes = (seedBytes, accountIndex) => {
  const accountBytes = hexToUint8(decToHex(accountIndex, 4));
  const context = blake.blake2bInit(32);
  blake.blake2bUpdate(context, seedBytes);
  blake.blake2bUpdate(context, accountBytes);
  const newKey = blake.blake2bFinal(context);
  return newKey;
}

const uint4ToUint5 = (uintValue) => {
  var length = uintValue.length / 5 * 4;
  var uint5 = new Uint8Array(length);
  for (let i = 1; i <= length; i++) {
    let n = i - 1;
    let m = i % 4;
    let z = n + ((i - m) / 4);
    let right = uintValue[z] << m;
    let left;
    if (((length - i) % 4) == 0) {
      left = uintValue[z - 1] << 4;
    } else {
      left = uintValue[z + 1] >> (4 - m);
    }
    uint5[n] = (left + right) % 32;
  }
  return uint5;
}

const getAccount = (publicKey) => {
  const keyBytes = uint4ToUint8(hexToUint4(publicKey)); // For some reason here we go from u, to hex, to 4, to 8??
  const checksum = uint5ToString(uint4ToUint5(uint8ToUint4(blake2b(keyBytes, null, 5).reverse())));
  const account = uint5ToString(uint4ToUint5(hexToUint4(`0${publicKey}`)));

  return `ban_${account}${checksum}`;
}

const uint5ToString = (uint5) => {
  const letter_list = '13456789abcdefghijkmnopqrstuwxyz'.split('');
  let string = "";
  for (let i = 0; i < uint5.length; i++) {
    string += letter_list[uint5[i]];
  }

  return string;
}

const hexToUint4 = (hexValue) => {
  const uint4 = new Uint8Array(hexValue.length);
  for (let i = 0; i < hexValue.length; i++) {
    uint4[i] = parseInt(hexValue.substr(i, 1), 16);
  }

  return uint4;
}

const generateAccountKeyPair = (accountSecretKeyBytes) => {
  return nacl.sign.keyPair.fromSecretKey(accountSecretKeyBytes);
}

const getPublicKey = (privateKey) => {
  const accountKeyPair = generateAccountKeyPair(hexToBytes(privateKey));
  return bytesToHex(accountKeyPair.publicKey);
}

const getPrivateKey = (seed, seedIx) => {
  const seedBytes = hexToBytes(seed);
  const accountBytes = generateAccountSecretKeyBytes(seedBytes, seedIx);
  return bytesToHex(accountBytes);
}
