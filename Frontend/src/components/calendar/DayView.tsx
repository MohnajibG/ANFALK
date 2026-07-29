import { useMemo } from "react";

import type { Appointment } from "../../types/appointment";
import type { Employee } from "../../types/employee";
import TimeGrid from "./TimeGrid";

interface DayViewProps {
  appointments: Appointment[];
  employees: Employee[];
  readOnly?: boolean;
  onSelectAppointment?: (appointment: Appointment) => void;
  onReschedule: (
    appointment: Appointment,
    columnKey: string,
    newStartTime: string,
  ) => void;
}

const employeeIdOf = (appointment: Appointment): string | undefined => {
  const employee = appointment.services[0]?.employee;
  return typeof employee === "string" ? employee : employee?._id;
};

const DayView = ({
  appointments,
  employees,
  readOnly,
  onSelectAppointment,
  onReschedule,
}: DayViewProps) => {
  const columns = useMemo(() => {
    const ids = Array.from(
      new Set(
        appointments
          .map(employeeIdOf)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    if (ids.length === 0) {
      return [{ key: "none", label: "Aucun rendez-vous" }];
    }

    return ids.map((id) => {
      const employee = employees.find((e) => e._id === id);

      return {
        key: id,
        label: employee
          ? `${employee.firstName} ${employee.lastName}`
          : "Employé",
      };
    });
  }, [appointments, employees]);

  return (
    <TimeGrid
      columns={columns}
      startHour={8}
      endHour={20}
      appointments={appointments}
      getColumnKey={(appointment) => employeeIdOf(appointment) ?? "none"}
      readOnly={readOnly}
      onSelectAppointment={onSelectAppointment}
      onReschedule={onReschedule}
    />
  );
};

export default DayView;
