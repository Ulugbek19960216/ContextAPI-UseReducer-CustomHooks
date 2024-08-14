import { createContext, useContext, useReducer, type ReactNode } from "react";

export type Timer = {
  name: string;
  duration: number;
};

type TimerState = {
  isRunning: boolean;
  timers: Timer[];
};

const initialState: TimerState = {
  isRunning: true,
  timers: [],
};

type TimersContextValue = TimerState & {
  addTimer: (timerDate: Timer) => void;
  startTimer: () => void;
  stopTimer: () => void;
};
const TimersContext = createContext<TimersContextValue | null>(null);

export function useTimersContext() {
  const timerCtx = useContext(TimersContext);

  if (timerCtx === null) {
    throw new Error("Something went wrong!");
  }

  return timerCtx;
}

type TimerContextProviderProps = {
  children: ReactNode;
};

type StartTimerAction = {
  type: "START_TIMER";
};

type StopTimerAction = {
  type: "STOP_TIMER";
};

type AddTimerAction = {
  type: "ADD_TIMER";
  payload: Timer;
};
type Action = StartTimerAction | StopTimerAction | AddTimerAction;

function timersReducer(state: TimerState, action: Action): TimerState {
  if (action.type === "START_TIMER") {
    return {
      ...state,
      isRunning: true,
    };
  }
  if (action.type === "STOP_TIMER") {
    return {
      ...state,
      isRunning: false,
    };
  }

  if (action.type === "ADD_TIMER") {
    return {
      ...state,
      timers: [
        ...state.timers,
        {
          name: action.payload.name,
          duration: action.payload.duration,
        },
      ],
    };
  }
  return state;
}

export default function TimerContextProvider({
  children,
}: TimerContextProviderProps) {
  const [timerState, dispatch] = useReducer(timersReducer, initialState);
  const ctx: TimersContextValue = {
    timers: timerState.timers,
    isRunning: timerState.isRunning,
    addTimer(timerDate) {
      dispatch({ type: "ADD_TIMER", payload: timerDate });
    },

    startTimer() {
      dispatch({ type: "START_TIMER" });
    },

    stopTimer() {
      dispatch({ type: "STOP_TIMER" });
    },
  };
  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
}
