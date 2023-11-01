import { Dialog, DialogType, DialogValues } from "@/components/Dialog";
import QRCodeScanner from "@/components/QRCodeScanner";
import { QrcodeSuccessCallback } from "html5-qrcode";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Checkin() {
  const router = useRouter();
  const eventId = router.query.eventId;

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

    if (dialogValues !== null) {
      console.log(`Scan result: ${decodedText}`, decodedResult);
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
