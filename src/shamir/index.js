import { randomBytes } from './random-byte'
import shamir from './shamir-core'
import Tx from 'ethereumjs-tx'

const ethUtil = require('ethereumjs-util')

const hash = require('hash.js')

class ShamirSecret {
    constructor() {
        this.secretParts = []
        this.inputParts = []
    }

    /**
     * Generate private key, address and shamir parts
     * @param { Number } sharesNum  divide secret into `sharesNum` parts
     * @param { Number } thresholdNum  required `thresholdNum`parts to recover original secret
     */
    create(sharesNum, thresholdNum) {
        let privateKey = new Buffer(randomBytes(32), 'hex')
        // console.log('privateKey', privateKey, 'publicKey', publicKey, 'address', address)

        if (!privateKey || !sharesNum || !thresholdNum) {
            return console.log(`Usage:\n./generateShares.js '<my super secret data>' <shareCount> <thresholdCount>`);
        }

        sharesNum = parseInt(sharesNum);
        thresholdNum = parseInt(thresholdNum);

        if (isNaN(sharesNum) || sharesNum <= 0) {
            return console.log('Shares must be an integer greater than 0');
        }

        if (typeof thresholdNum !== 'number' || thresholdNum <= 0 || thresholdNum > sharesNum) {
            return console.log('Threshold must be an integer greater than 0 and less than the number of sharesNum');
        }

        let hexSecret = Buffer.from(privateKey).toString('hex');
        let checksum = hash.sha256().update(hexSecret).digest('hex').substr(56);
        let checkedHexSecret = hexSecret + checksum;

		let publicKey = ethUtil.privateToPublic(privateKey)
		let address = ethUtil.publicToAddress(publicKey)
		privateKey = privateKey.toString('hex')
		publicKey = publicKey.toString('hex')
		address = `0x${address.toString('hex')}`
			
		this.secretParts = shamir.generateShares(checkedHexSecret, sharesNum, thresholdNum)
        return {
            secretParts: this.secretParts,
			address: address,
			publicKey: publicKey, 
            privateKey: privateKey
        }
    }

    /**
     * Recover private key from given parts
     */
    recover() {
        let checkedHexSecret = shamir.deriveSecret(this.inputParts);
        let hexSecret = checkedHexSecret.substr(0, checkedHexSecret.length - 8);
        let storedChecksum = checkedHexSecret.substr(-8);
        let derivedChecksum = hash.sha256().update(hexSecret).digest('hex').substr(56);
        if (derivedChecksum !== storedChecksum) {
            console.log('Checksum did not match, likely invalid or not enough keys');
            this.inputParts = []
            return 'Checksum did not match, likely invalid or not enough keys'
        }
		let secret = Buffer.from(hexSecret, 'hex').toString('hex')
		console.log('Derived secret (DEBUG)', secret);
		window.sign = txConfig => {
			this.sign(secret, txConfig)
		}
		// return this.sign(secret, {})
    }
	
	/**
	 * Signature data
	 * @param { string } privateKey
	 * @param { object } txConfig
	 * @param { number } txConfig.nonce 交易序号
	 * @param { number } txConfig.gasPrice
	 * @param { number } txConfig.gasLimit
	 * return Promise
	 */
	sign(privateKey, txConfig) {
		if (!txConfig) {
			txConfig = {}
		}
	    const tx = new Tx({
	        nonce: txConfig.nonce || 0,
	        gasPrice: txConfig.gasPrice || 1100000000,
	        gasLimit: txConfig.gasLimit || 4000000,
	        to: txConfig.to || '',
	        value: txConfig.value || 0,
	        data: txConfig.data || '',
	    })
		tx.sign(Buffer.from(privateKey, 'hex'))
		console.log(`0x${tx.serialize().toString('hex')}`)
	    return `0x${tx.serialize().toString('hex')}`
	}
	
	/**
	 * Signature data list
	 * @param { string } privateKey
	 * @param { object } txConfig
	 * @param { number } txConfig.nonce 交易序号
	 * @param { number } txConfig.gasPrice
	 * @param { number } txConfig.gasLimit
	 * return Promise
	 */
	multiSign(privateKey, txConfig, list) {
	    if (!txConfig) {
	        txConfig = {}
	    }
	    const tx = new Tx({
	        nonce: txConfig.nonce || 0,
	        gasPrice: txConfig.gasPrice || 1100000000,
	        gasLimit: txConfig.gasLimit || 4000000,
	        to: txConfig.to || '',
	        value: txConfig.value || 0,
	        data: txConfig.data || '',
	    })
	    tx.sign(Buffer.from(privateKey, 'hex'))
	    console.log(`0x${tx.serialize().toString('hex')}`)
	    return `0x${tx.serialize().toString('hex')}`
	}
	
	/**
	 * Show one part one time
	 */
	* show() {
	    for (let part of this.secretParts) {
	        yield part;
	    }
	}

	/**
	 * Add secret part
	 * @param { string } secret part 
	 */
	input(part) {
	    this.inputParts.push(part)
	}
}

export default ShamirSecret