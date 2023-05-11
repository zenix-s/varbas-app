"use client";
import { StateProps } from "@/types";
import { time } from "console";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/components/button";
import { toast } from "react-hot-toast";
const { Colors, getBgColor, getHexColor } = require("@/actions/getColors");

interface FormNewEstadoProps {
  idProject: Number;
}

const FormNewEstado: React.FC<FormNewEstadoProps> = ({ idProject }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      nombre: "",
      color: "",
      id_proyecto: idProject,
    },
  });

  const CleanInputs = () => {
    setValue("nombre", "");
    setValue("color", "");
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    const newEstado = {
      nombre: data.nombre,
      color: data.color,
      id_proyecto: idProject,
    };

    axios
      .post("/api/proyectos/estado", newEstado)
      .then((res) => {
        toast.success("Estado creado correctamente");
        CleanInputs();
      })
      .catch((err) => {
        toast.error("Error al crear el estado");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        router.refresh();
      });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <div>
          <input
            type="text"
            className="input-bordered input"
            placeholder="Nombre del estado"
            {...register("nombre", { required: true })}
          />
        </div>
        <div>
          <select
            {...register("color", { required: true })}
            className="select-bordered select"
            defaultValue="Selecciona un color"
          >
            <option disabled>Selecciona un color</option>
            {Colors.map((color: string) => (
              <option
                key={color}
                value={color}
                style={{
                  backgroundColor: getHexColor(color),
                }}
              >
                {color}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          theme="primary"
          label={loading ? "Cargando..." : "Crear estado"}
        />
      </form>
    </div>
  );
};

export default FormNewEstado;
