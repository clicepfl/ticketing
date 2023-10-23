import { Dialog } from "@/components/Dialog";
import QRCodeScanner from "@/components/QRCodeScanner";
import { useState } from "react";

type Values = {};

export default function Home() {
  const [decodedResults, setDecodedResults] = useState([]);
  const [dialogValues, setDialogValues] = useState(null as Values | null);

  function onScanSuccess(decodedText: any, decodedResult: any) {
    // Stop scanning?
    setDialogValues(null);
    console.log(`Scan result: ${decodedText}`, decodedResult);
  }
  
  function onScanFailure(error: any) {
    console.log(`Scan result: ${error}`);
  }

  return (
    <div>
      <QRCodeScanner
        qrCodeSuccessCallback={onScanSuccess}
        qrCodeErrorCallback={onScanFailure}
      />
      <Dialog values={dialogValues} setValues={setDialogValues} />
    </div>
  );
}
