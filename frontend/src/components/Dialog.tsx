import { useState } from "react";

export enum DialogType {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

function DialogCategory({ label, show }: { label: String; show: boolean }) {
  const id = label
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/ /g, "");

  if (!show) {
    return null;
  }

  return (
    <p id={id} className="dialog-category">
      {label + " : "}{" "}
    </p>
  );
}

function DialogCloseButton({ handleClick }: any) {
  return <button onClick={handleClick}>Close</button>;
}

export function Dialog() {

  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(DialogType.ERROR);

  return (
    <dialog id="dialog" className="dialog">
      <DialogCategory label={"Error"} show={false} />
      <DialogCategory label={"First Name"} show={true} />
      <DialogCategory label={"Surname"} show={true} />
      <DialogCategory label={"Sciper"} show={true} />
      <DialogCategory label={"Group"} show={true} />
      <DialogCloseButton handleClick={()=>setShowDialog(false)} />
    </dialog>
  );
}
