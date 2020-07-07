import { ScanStatus, log } from 'wechaty-puppet'
import { generate } from 'qrcode-terminal'

export default (qrcode, status) => {
	if (status === ScanStatus.Waiting) {
    	generate(qrcode)

	    const qrcodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`

	    log.info('StarterBot', 'onScan: %s', qrcodeImageUrl) 
    }
}
