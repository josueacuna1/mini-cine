import type { Dispatch, SetStateAction } from 'react';
import type { WeekPlan, Room, Screening } from '../domain/types';
import { useMemo, useState } from 'react';
import DaySelector from '../components/planner/DaySelector';
import RoomSelector from '../components/planner/RoomSelector';
import CreateScreeningForm from '../components/planner/CreateScreeningForm';
import DayScheduleList from '../components/planner/DayScheduleList';

type Props = {
  weekPlan: WeekPlan;
  setWeekPlan: Dispatch<SetStateAction<WeekPlan>>;
};

export default function PlannerView({ weekPlan, setWeekPlan }: Props) {
  const [day, setDay] = useState<number>(1);
  const [roomId, setRoomId] = useState<string>(weekPlan.rooms[0]?.id ?? '');
  const [editing, setEditing] = useState<Screening | null>(null);

  const selectedRoom: Room | undefined = useMemo(
    () => weekPlan.rooms.find(r => r.id === roomId),
    [weekPlan.rooms, roomId]
  );

  return (
    <section className="view-animate">
      <h2>Planificador de funciones</h2>
      <section className="planner__config">
        <div className="planner__configCard">
          <div className="planner__configGrid">
            <div>
              <label className="planner__label">Día</label>
              <DaySelector day={day} onChange={setDay} />
            </div>

            <div>
              <label className="planner__label">Sala</label>
              <RoomSelector rooms={weekPlan.rooms} value={roomId} onChange={setRoomId} />
            </div>
          </div>
          <div className="planner__form">
            {selectedRoom ? (
              <CreateScreeningForm
                weekPlan={weekPlan}
                setWeekPlan={setWeekPlan}
                day={day}
                room={selectedRoom}
                editing={editing}
                setEditing={setEditing}
              />
            ) : (
              <em className="planner__empty">No hay salas disponibles.</em>
            )}
          </div>
        </div>
      </section>

      {selectedRoom && (
        <div className="planner__scheduleCard">
          <div className="planner__scheduleHeader">
            <span className="planner__scheduleTitle">Funciones del día</span>
            <span className="planner__scheduleMeta">
              {selectedRoom.name} · {selectedRoom.size}{selectedRoom.seats ? ` · ${selectedRoom.seats} asientos` : ''}
            </span>
          </div>

          <DayScheduleList
            weekPlan={weekPlan}
            setWeekPlan={setWeekPlan}
            day={day}
            room={selectedRoom}
            onEdit={setEditing}
            editing={editing}
          />
        </div>
      )}
    </section>
  );
}