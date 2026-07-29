import { useMemo, useRef } from "react";
import type { PanInfo } from "framer-motion";

import type { Appointment } from "../../types/appointment";
import { assignLanes } from "./layout";
import { minutesToTime, timeToMinutes } from "./dateUtils";
import AppointmentBlock from "./AppointmentBlock";

export interface CalendarColumn {
  key: string;
  label: string;
}

interface TimeGridProps {
  columns: CalendarColumn[];
  startHour: number;
  endHour: number;
  pxPerMinute?: number;
  snapMinutes?: number;
  appointments: Appointment[];
  getColumnKey: (appointment: Appointment) => string | undefined;
  readOnly?: boolean;
  onSelectAppointment?: (appointment: Appointment) => void;
  onReschedule: (
    appointment: Appointment,
    columnKey: string,
    newStartTime: string,
  ) => void;
}

const TimeGrid = ({
  columns,
  startHour,
  endHour,
  pxPerMinute = 1.2,
  snapMinutes = 15,
  appointments,
  getColumnKey,
  readOnly = false,
  onSelectAppointment,
  onReschedule,
}: TimeGridProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  const totalMinutes = (endHour - startHour) * 60;
  const gridHeight = totalMinutes * pxPerMinute;

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = startHour; h <= endHour; h++) list.push(h);
    return list;
  }, [startHour, endHour]);

  const columnWidthPercent = 100 / Math.max(columns.length, 1);

  const positionedByColumn = useMemo(() => {
    const map = new Map<string, ReturnType<typeof assignLanes>>();

    for (const column of columns) {
      const items = appointments.filter(
        (appointment) => getColumnKey(appointment) === column.key,
      );
      map.set(column.key, assignLanes(items));
    }

    return map;
  }, [columns, appointments, getColumnKey]);

  const handleDragEnd = (appointment: Appointment, info: PanInfo) => {
    const body = bodyRef.current;
    if (!body || columns.length === 0) return;

    const rect = body.getBoundingClientRect();
    const relativeX = info.point.x - rect.left;
    const relativeY = info.point.y - rect.top + body.scrollTop;

    const columnIndex = Math.min(
      Math.max(Math.floor((relativeX / rect.width) * columns.length), 0),
      columns.length - 1,
    );

    const column = columns[columnIndex];
    if (!column) return;

    const rawMinutes = startHour * 60 + relativeY / pxPerMinute;
    const snapped = Math.round(rawMinutes / snapMinutes) * snapMinutes;
    const clamped = Math.min(Math.max(snapped, startHour * 60), endHour * 60);

    const newStartTime = minutesToTime(clamped);

    if (
      column.key === getColumnKey(appointment) &&
      newStartTime === appointment.startTime
    ) {
      return;
    }

    onReschedule(appointment, column.key, newStartTime);
  };

  return (
    <div className="flex w-full">
      <div className="w-16 flex-shrink-0 pt-9">
        {hours.map((hour) => (
          <div
            key={hour}
            style={{ height: 60 * pxPerMinute }}
            className="relative -top-2.5 pr-2 text-right text-xs text-stone-400"
          >
            {hour.toString().padStart(2, "0")}:00
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex border-b border-(--border) pb-2">
          {columns.map((column) => (
            <div
              key={column.key}
              style={{ width: `${columnWidthPercent}%` }}
              className="px-2 text-center text-sm font-semibold"
            >
              {column.label}
            </div>
          ))}
        </div>

        <div
          ref={bodyRef}
          className="relative border-t border-(--border)"
          style={{ height: gridHeight }}
        >
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="absolute left-0 w-full border-t border-(--border)/50"
              style={{ top: index * 60 * pxPerMinute }}
            />
          ))}

          {columns.map((column, columnIndex) => (
            <div
              key={column.key}
              className="absolute top-0 h-full border-r border-(--border)/40"
              style={{
                left: `${columnIndex * columnWidthPercent}%`,
                width: `${columnWidthPercent}%`,
              }}
            />
          ))}

          {columns.flatMap((column, columnIndex) => {
            const items = positionedByColumn.get(column.key) ?? [];

            return items.map(({ appointment, lane, laneCount }) => {
              const top =
                (timeToMinutes(appointment.startTime) - startHour * 60) *
                pxPerMinute;
              const height = Math.max(
                appointment.totalDuration * pxPerMinute,
                18,
              );

              const laneWidth = columnWidthPercent / laneCount;
              const left = columnIndex * columnWidthPercent + lane * laneWidth;

              return (
                <AppointmentBlock
                  key={appointment._id}
                  appointment={appointment}
                  readOnly={readOnly}
                  dragConstraintsRef={bodyRef}
                  onClick={() => onSelectAppointment?.(appointment)}
                  onDragEnd={(_event, info) => handleDragEnd(appointment, info)}
                  style={{
                    position: "absolute",
                    top,
                    height,
                    left: `${left}%`,
                    width: `${laneWidth}%`,
                  }}
                />
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeGrid;
