import Button from "../button";
import { useState } from "react";
import {CiCircleRemove} from 'react-icons/ci'
interface FormContainerProps {
  title: string;
  body: React.ReactElement;
  footer?: React.ReactElement;
  actionlabel: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  visible?: boolean;
  onClose?: () => void;
}

const ModalContainer: React.FC<FormContainerProps> = ({
  title,
  body,
  footer,
  actionlabel,
  onSubmit,
  visible,
  onClose,
}) => {
  return (
    <section className={`absolute top-0 left-0 z-[100] bg-neutral-500/30 
    ${visible ? "flex" : "hidden"}
    h-full w-full items-center justify-center`}>
      <div className="relative h-full w-full rounded-lg bg-slate-400 p-4 md:h-fit md:w-1/2 ">
        <div className="absolute top-0 right-0 p-4">
          <Button
            label=""
            icon={CiCircleRemove}
            theme="dark"
            onClick={() => {
              onClose && onClose();
            }}
            center
            uppercase
            trasparent
          />
        </div>
        <div className=" mb-4 h-16 w-full border-b-2 border-slate-200/30 ">
          <h2 className=" p-4 text-center text-2xl uppercase tracking-widest text-white ">
            {title}
          </h2>
        </div>
        <div className=" h-full w-full ">
          <form
            onSubmit={onSubmit}
            className=" flex h-full w-full flex-col justify-center "
          >
            {body}
            <Button label={actionlabel} theme="dark" onClick={() => {}} center shadow uppercase />
          </form>
        </div>
        {footer && <div className="form-footer">{footer}</div>}
      </div>
    </section>
  );
};

export default ModalContainer;