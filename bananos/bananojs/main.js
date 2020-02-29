
const crypto = require('crypto');
const seedBytes = new Uint8Array(32);
window.crypto.getRandomValues(seedBytes);
const seed = window.bananoUtil.bytesToHex(seedBytes);
document.getElementById('seed').innerText = seed;
const privateKey = window.bananocoinBananojs.getPrivateKey(seed, 0);
const publicKey = window.bananocoinBananojs.getPublicKey(privateKey);
const account = window.bananocoinBananojs.getAccount(publicKey);
document.getElementById('account').innerText = account;
