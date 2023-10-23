import { useState } from "react";

export enum DialogType {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

function DialogCategory({ label }: { label: String }) {
  const id = label
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/ /g, "");

  return (
    <p className="">
      {label + " : "}
      {"Placeholder"}
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
  values: {} | null;
  setValues: (values: {} | null) => void;
}) {
  const [dialogType, setDialogType] = useState(DialogType.SUCCESS);
  const dialogColor =
    " border-[" +
    (() => {
      switch (dialogType) {
        case DialogType.SUCCESS:
          return "#34d399";
        case DialogType.WARNING:
          return "#facc15";
        case DialogType.WARNING:
          return "#ef4444";
      }
    })() +
    "] ";

  const dialogSections = (() => {
    switch (dialogType) {
      case DialogType.SUCCESS:
        return (
          <>
            <DialogCategory label={"First Name"} />
            <DialogCategory label={"Surname"} />
            <DialogCategory label={"Sciper"} />
            <DialogCategory label={"Group"} />
          </>
        );
      case DialogType.WARNING:
        return (
          <>
            <DialogCategory label={"Warning"} />
            <DialogCategory label={"First Name"} />
            <DialogCategory label={"Surname"} />
            <DialogCategory label={"Sciper"} />
            <DialogCategory label={"Group"} />
          </>
        );
      case DialogType.ERROR:
        return (
          <>
            <DialogCategory label={"Error"} />
          </>
        );
    }
  })();

  return values == null ? null : (
    <div className="absolute top-0 left-0 flex w-full h-full justify-center items-center">
      <div
        className={
          "dialog box-border p-10 bg-white border-4 flex flex-col gap-3 " +
          dialogColor +
          (values == null ? "visible" : "hidden")
        }
      >
        {dialogSections}
        <DialogCloseButton handleClick={() => setValues(null)} />
      </div>
    </div>
  );
}
