import { Html5QrcodeScanner, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qrcode-region";

const QRCodeScanner = (props: {qrCodeSuccessCallback: QrcodeSuccessCallback; qrCodeErrorCallback: QrcodeErrorCallback }) => {

    useEffect(() => {
        // when component mounts
        const config = { fps: 10, qrbox: { width: 250, height: 250 }};
        const verbose = false;

        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default QRCodeScanner;