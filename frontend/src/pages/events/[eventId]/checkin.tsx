import { checkin, getParticipants } from "@/api";
import { Dialog, DialogType, DialogValues } from "@/components/Dialog";
import QRCodeScanner from "@/components/QRCodeScanner";
import { Participant } from "@/models";
import { QrcodeSuccessCallback } from "html5-qrcode";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

export default function Checkin(props: {
  eventId: string;
  participants: Participant[];
}) {
  const [dialogValues, setDialogValues] = useState(null as DialogValues | null);
  const [filter, setFilter] = useState(null as string | null);
  const [filteredParticipants, setFilteredParticipants] = useState(
    [] as Participant[]
  );

  function ParticipantDisplay(props: { participant: Participant }) {
    return (
      <div
        className="border-l-2 border-b-2 border-sky-800 p-2 select-none cursor-pointer"
        onClick={() => tryCheckin(props.participant.uid)}
      >
        <p>{`${props.participant.firstName} ${props.participant.surname}`}</p>
        <p className="text-sm text-gray-600">{`${props.participant.email} - ${props.participant.sciper}`}</p>
      </div>
    );
  }

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

  useEffect(() => {
    if (filter === null || filter.length < 5) {
      setFilteredParticipants([]);
      return;
    }

    setFilteredParticipants(
      props.participants.filter(
        (p) =>
          p.email.toLowerCase().includes(filter.toLowerCase()) ||
          p.firstName.toLowerCase().includes(filter.toLowerCase()) ||
          p.surname.toLowerCase().includes(filter.toLowerCase()) ||
          p.sciper.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter]);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6">
      <QRCodeScanner
        qrCodeSuccessCallback={onScanSuccess}
        fps={10}
        qrbox={{ width: 250, height: 250 }}
      />
      <Dialog values={dialogValues} setValues={setDialogValues} />
      <div className="w-4/5">
        <input
          className="border-[3px] border-clic-blue rounded-lg px-2 focus:border-clic-red origin-right outline outline-0 w-full"
          placeholder="Search"
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="absolute mx-2">
          {filteredParticipants.map((p) => (
            <ParticipantDisplay participant={p} key={p.uid} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      eventId: context.params?.eventId,
      participants: await getParticipants(context.params?.eventId as string)
    },
  };
};
