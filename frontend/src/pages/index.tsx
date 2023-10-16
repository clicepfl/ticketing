import { Dialog } from "@/components/Dialog";
import QRCodeScanner from "@/components/QRCodeScanner";
import { useState } from "react";


function onScanSuccess(decodedText: any, decodedResult: any) {
  // Stop scanning?
  console.log(`Scan result: ${decodedText}`, decodedResult);
}

function onScanFailure(error: any) {
  console.log(`Scan result: ${error}`);
}

export default function Home() {
  const [decodedResults, setDecodedResults] = useState([]);

  return (
    <div>
      <QRCodeScanner
        qrCodeSuccessCallback={onScanSuccess}
        qrCodeErrorCallback={onScanFailure}
      />
      <Dialog />
    </div>
  );
}
