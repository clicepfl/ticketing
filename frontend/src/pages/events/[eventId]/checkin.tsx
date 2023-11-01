import { checkin } from "@/api";
import { Dialog, DialogType, DialogValues } from "@/components/Dialog";
import QRCodeScanner from "@/components/QRCodeScanner";
import { QrcodeSuccessCallback } from "html5-qrcode";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";

export default function Checkin(props: { eventId: string }) {
  const [dialogValues, setDialogValues] = useState(null as DialogValues | null);

  async function tryCheckin(userId: string) {
    const response = await checkin(props.eventId, userId);
    if ("status" in response) {
      setDialogValues({
        status: DialogType.ERROR,
        error: response.description || "An error occurred",
      });
    } else {
      const status: any = response.hasCheckedIn
        ? { status: DialogType.WARNING, warning: "Already checked in" }
        : { status: DialogType.SUCCESS };

      setDialogValues((value) => {
        if (value === null) {
          return {
            firstName: response.firstName,
            surname: response.surname,
            sciper: response.sciper,
            group: response.group,
            ...status,
          };
        } else {
          return value;
        }
      });
    }
  }

  const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
    console.log(`${decodedText}, ${decodedResult}`);
    if (dialogValues === null) {
      tryCheckin(decodedText);
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { eventId: context.params?.eventId } };
};
