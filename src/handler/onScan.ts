import { ScanStatus, log } from 'wechaty-puppet'
import QrcodeTerminal from 'qrcode-terminal'

export default (qrcode, status) => {
	if (status === ScanStatus.Waiting) {
    	QrcodeTerminal.generate(qrcode)

	    const qrcodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`

	    log.info('StarterBot', 'onScan: %s', qrcodeImageUrl) 
    }
}
