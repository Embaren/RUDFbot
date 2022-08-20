const crypto = require('crypto');

//type CipherType = "aes-128-gcm" | "aes-128-ccm" | "aes-192-gcm" | "aes-192-ccm" | "aes-256-gcm" | "aes-256-ccm";

Cipher = class {
    constructor(key, config/*: {
        type: CipherType,
        numAuthTagBytes?: number,
        numIvBytes?: number,
        stringBase?: "base64",
    }*/) {
        config.numAuthTagBytes = config.numAuthTagBytes || 16;
        config.numIvBytes = config.numIvBytes || 12;
        config.stringBase = config.stringBase || "base64";
        if (config.numAuthTagBytes < 16) { console.warn(`Be careful of short auth tags`); }
        if (config.numIvBytes < 12) { console.warn(`Be careful of short ivs`); }
		this.key = key;
		this.config = config;
    }


    encrypt(msg) {
		const type = this.config.type;
		const numIvBytes = this.config.numIvBytes;
		const numAuthTagBytes = this.config.numAuthTagBytes;
		const stringBase = this.config.stringBase;
        const iv = crypto.randomBytes(numIvBytes);
        const cipher = crypto.createCipheriv(
            type,
            Buffer.from(this.key, stringBase),
            iv,
            { 'authTagLength': numAuthTagBytes }
        );

        return [
            iv.toString(stringBase),
            cipher.update(msg, "utf8", stringBase),
            cipher.final(stringBase),
            cipher.getAuthTag().toString(stringBase)
        ].join("");
    }


    decrypt(cipherText) {
		const type = this.config.type;
		const numIvBytes = this.config.numIvBytes;
		const numAuthTagBytes = this.config.numAuthTagBytes;
		const stringBase = this.config.stringBase;
        let authTagCharLength = 24; // TODO: compute from numAuthTagBytes and stringBase
        let ivCharLength = 16; // TODO: compute from numIvBytes and stringBase

        const authTag = Buffer.from(cipherText.slice(-authTagCharLength), stringBase);
        const iv = Buffer.from(cipherText.slice(0, ivCharLength), stringBase);
        const encryptedMessage = Buffer.from(cipherText.slice(ivCharLength, -authTagCharLength), stringBase);

        const decipher = crypto.createDecipheriv(
            type,
            Buffer.from(this.key, stringBase),
            iv,
            { 'authTagLength': numAuthTagBytes }
        );
        decipher.setAuthTag(authTag);

        return [
            decipher.update(encryptedMessage, stringBase, "utf8"),
            decipher.final()
        ].join("");
    }
}

//module.exports.CipherType = CipherType;
module.exports.Cipher = Cipher;