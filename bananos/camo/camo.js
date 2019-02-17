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

const getNewPrivateKey = () => {
  const private_key_elt = document.getElementById('private_key');
  const privateKey = new Uint8Array(32);
  window.crypto.getRandomValues(privateKey);
  const hex = bytesToHex(privateKey);
  // console.log('privateKey Set', hex.length, hex);
  private_key_elt.value = hex;
  return false;
}
