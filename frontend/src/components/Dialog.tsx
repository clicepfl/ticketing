import { ParticipantInfos } from "@/api";
import { useState } from "react";

export type DialogValues =
  | ({ status: DialogType.SUCCESS } & ParticipantInfos)
  | ({ status: DialogType.WARNING; warning: string } & ParticipantInfos)
  | { status: DialogType.ERROR; error?: string };

export enum DialogType {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

function DialogCategory({ label, value }: { label: string; value: string }) {
  const id = label
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/ /g, "");

  return (
    <p>
      {label}: {value}
    </p>
  );
}

function DialogCloseButton({ handleClick }: { handleClick: () => void }) {
  return (
    <button className="bg-slate-100 border-2 px-2 mt-3" onClick={handleClick}>
      Close
    </button>
  );
}

export function Dialog({
  values,
  setValues,
}: {
  values: DialogValues | null;
  setValues: (values: DialogValues | null) => void;
}) {
  if (values !== null) {
    const dialogColor = (() => {
      switch (values.status) {
        case DialogType.SUCCESS:
          return "border-[#34d399]";
        case DialogType.WARNING:
          return "border-[#facc15]";
        case DialogType.ERROR:
          return "border-[#ef4444]";
      }
    })();

    const dialogSections = (() => {
      switch (values.status) {
        case DialogType.SUCCESS:
          return (
            <>
              <DialogCategory label={"First Name"} value={values.firstName} />
              <DialogCategory label={"Surname"} value={values.surname} />
              <DialogCategory label={"Sciper"} value={values.sciper} />
              {values.group ? (
                <DialogCategory label={"Group"} value={values.group} />
              ) : (
                <></>
              )}
            </>
          );
        case DialogType.WARNING:
          return (
            <>
              <DialogCategory label={"Warning"} value={values.warning} />
              <DialogCategory label={"First Name"} value={values.firstName} />
              <DialogCategory label={"Surname"} value={values.surname} />
              <DialogCategory label={"Sciper"} value={values.sciper} />
              {values.group ? (
                <DialogCategory label={"Group"} value={values.group} />
              ) : (
                <></>
              )}
            </>
          );
        case DialogType.ERROR:
          return (
            <>
              {values.error ? (
                <DialogCategory label={"Error"} value={values.error} />
              ) : (
                <p>An unknown error occurred</p>
              )}
            </>
          );
      }
    })();

    return (
      <div className="absolute top-0 left-0 flex w-full h-full justify-center items-center">
        <div
          className={`dialog box-border p-10 bg-white border-4 flex flex-col gap-3 ${dialogColor} ${
            values !== null ? "visible" : "hidden"
          }`}
        >
          {dialogSections}
          <DialogCloseButton handleClick={() => setValues(null)} />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
