import { Dialog, DialogType, DialogValues } from "@/components/Dialog";
import QRCodeScanner from "@/components/QRCodeScanner";
import { QrcodeSuccessCallback } from "html5-qrcode";
import { useEffect, useState } from "react";

var lock = false;

export default function Home() {
  const [dialogValues, setDialogValues] = useState(null as DialogValues | null);

  const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
    // Stop scanning?
    setDialogValues({
      status: DialogType.WARNING,
      warning: "Already served",
      firstName: "Ludovic",
      surname: "Mermod",
      group: "smth",
      sciper: "325084",
    });
    if (!lock) {
      console.log(`Scan result: ${decodedText}`, decodedResult);
      alert(decodedText);
      lock = true;
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center">
      <QRCodeScanner
        qrCodeSuccessCallback={onScanSuccess}
        fps={10}
        qrbox={{ width: 250, height: 250 }}
      />
      <Dialog values={dialogValues} setValues={setDialogValues} />
      <p>{JSON.stringify(dialogValues)}</p>
    </div>
  );
}
