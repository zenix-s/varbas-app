"use client";
import Kanban from "./kanban/kanban";
import TableTasks from "./TableTasks/tableTasks";
import { StateProps, TaskProps, TeamMemberProps } from "@/types";
import { useState } from "react";
import Button from "@/components/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  VscTable,
  VscSymbolStructure,
  VscGraph,
  VscCalendar,
  VscProject,
  VscSettingsGear,
  VscPersonAdd,
  VscOrganization,
} from "react-icons/vsc";
import EstadisticasProject from "./estadisticas/estadisticasProject";
import EstadosSection from "./estados/EstadosSection";
import TeamSection from "./team/TeamSection";
import TaskModal from "./TaskModal";
import { headers } from "next/dist/client/components/headers";

const Tasks = ({
  tareas,
  estados,
  teamMembers,
  idProject,
}: {
  tareas: TaskProps[];
  estados: StateProps[];
  teamMembers: TeamMemberProps[];
  idProject: number;
}) => {
  const [TasksView, setTasksView] = useState("table");
  const [tasks, setTasks] = useState(tareas);
  const [states, setStates] = useState(estados);
  const [team, setTeam] = useState(teamMembers);

  const Views = [
    {
      name: "table",
      icon: VscTable,
    },
    // {
    //   name: "kanban",
    //   icon: VscProject,
    // },
    {
      name: "Estados",
      icon: VscSymbolStructure,
    },
    {
      name: "Miembros",
      icon: VscOrganization,
    },
    {
      name: "estadisticas",
      icon: VscGraph,
    },
    // {
    //   name: "calendario",
    //   icon: VscCalendar,
    // },
  ];

  /**
   * @param updatedTask
   * El parametro updatedTask es un objeto que contiene la tarea actualizada.
   * Actualiza una tarea en la base de datos y en el estado local.
   */
  const onChangeTask = async ({ updatedTask }: { updatedTask: TaskProps }) => {
    const index = tasks.findIndex((task) => task.id === updatedTask.id);

    if (index !== -1) {
      const newTasks = [...tasks];
      const oldTasks = [...tasks];
      newTasks[index] = updatedTask;
      setTasks(newTasks);

      axios
        .put("/api/proyectos/tasks", updatedTask)
        .then((res) => {
          console.log(res.data);
          if (res.data.status === 200) {
            toast.success(res.data.message);
          }
          if (res.data.status !== 200) {
            toast.error(res.data.message);
            setTasks(oldTasks);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al actualizar la tarea");
        });
    }
  };

  /**
   * @param updatedState
   * El parametro updatedState es un objeto que contiene el estado actualizado.1
   * Actualiza un estado en la base de datos y en el estado local.
   */
  const onChangeState = async ({
    updatedState,
  }: {
    updatedState: StateProps;
  }) => {
    const index = states.findIndex((state) => state.id === updatedState.id);
    if (index !== -1) {
      const newStates = [...states];
      const oldStates = [...states];
      newStates[index] = updatedState;
      setStates(newStates);

      axios
        .put("/api/proyectos/estado", updatedState)
        .then((res) => {
          console.log(res.data);
          if (res.data.status === 200) {
            toast.success(res.data.message);
          }
          if (res.data.status !== 200) {
            toast.error(res.data.message);
            setStates(oldStates);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al actualizar el estado");
        });
    }
  };

  /**
   * @param taskId
   * El parametro taskId es el id de la tarea a eliminar.
   * Elimina una tarea de la base de datos y del estado local.
   *
   */
  const onDeleteTask = async ({ taskId }: { taskId: number }) => {
    const index = tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      const newTasks = [...tasks];
      const deletedTask = newTasks[index];
      newTasks.splice(index, 1);
      setTasks(newTasks);

      axios
        .delete("/api/proyectos/tasks", { headers: { taskId: taskId } })
        .then((res) => {
          console.log(res.data);
          if (res.data.status === 200) {
            toast.success(res.data.message);
          }
          if (res.data.status !== 200) {
            toast.error(res.data.message);
            setTasks([...newTasks, deletedTask]);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al eliminar la tarea");
        });
    }
  };

  const handleTasksView = () => {
    switch (TasksView) {
      case "kanban":
        return <Kanban tareas={tasks} estados={states} />;
      case "table":
        return (
          <TableTasks
            tareas={tasks}
            estados={states}
            idProject={idProject}
            teamMembers={teamMembers}
            onChangeTask={onChangeTask}
            onDeleteTask={onDeleteTask}
          />
        );
      case "estadisticas":
        return (
          <EstadisticasProject
            tareas={tasks}
            estados={states}
            idProject={idProject}
          />
        );

      case "Estados":
        return (
          <>
            <EstadosSection
              estados={states}
              idProject={idProject}
              onChangeState={onChangeState}
            />
          </>
        );
      case "calendario":
        return null;
      case "Miembros":
        return <TeamSection idProject={idProject} teamMembers={teamMembers} />;

      default:
        return (
          <TableTasks
            tareas={tasks}
            estados={states}
            idProject={idProject}
            teamMembers={teamMembers}
            onChangeTask={onChangeTask}
            onDeleteTask={onDeleteTask}
          />
        );
    }
  };

  return (
    <>
      <TaskModal
        TeamMembers={teamMembers}
        States={states}
        idProject={idProject}
      />
      <section className="flex h-full w-full flex-col">
        <div>
          <div className="flex gap-4">
            {Views.map((view, index) => {
              return (
                <div
                  key={index}
                  className={`
                  pb-1
                  ${
                    TasksView === view.name ? "border-b-2 border-blue-500 " : ""
                  }
                `}
                >
                  <Button
                    onClick={() => setTasksView(view.name)}
                    label={view.name}
                    theme="ghost"
                    center
                    icon={view.icon}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex h-full w-full">{handleTasksView()}</div>
      </section>
    </>
  );
};

export default Tasks;
