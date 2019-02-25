const getSharedSecretBytes = (privateKeyBytes, publicKeyBytes) => {
  const camoPrivateKeyBytes = nacl.camo.hashsecret(privateKeyBytes);
  const secretBytes = nacl.camo.scalarMult(camoPrivateKeyBytes, publicKeyBytes);

  const context = blake2bInit(32);
  blake2bUpdate(context, secretBytes);
  const hashedSecretBytes = blake2bFinal(context);

  return hashedSecretBytes;
}

const getSharedSecret = (privateKey, publicKey) => {
  const privateKeyBytes = hexToBytes(privateKey);
  const publicKeyBytes = hexToBytes(publicKey);
  const secretBytes = getSharedSecretBytes(privateKeyBytes, publicKeyBytes);
  const secret = bytesToHex(secretBytes);
  return secret;
}

const hexToBytes = (hex) => {
  const ret = new Uint8Array(hex.length / 2);
  for (var i = 0; i < ret.length; i++) {
    ret[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return ret;
}

const bytesToHex = (array) => {
  return [...array].map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const getCamoPublicKey = (privateKey) => {
  return bytesToHex(getCamoPublicKeyBytes(hexToBytes(privateKey)));
}

const getCamoPublicKeyBytes = (privateKeyBytes) => {
  const camoPrivateKeyBytes = nacl.camo.hashsecret(privateKeyBytes);
  const camoPublicKeyBytes = nacl.camo.scalarMult.base(camoPrivateKeyBytes);
  return camoPublicKeyBytes;
}

const getNewSeed = () => {
  const seed_elt = document.getElementById('seed');
  const seed = new Uint8Array(32);
  window.crypto.getRandomValues(seed);
  const hex = bytesToHex(seed);
  // console.log('privateKey Set', hex.length, hex);
  seed_elt.value = hex;
  return false;
}
