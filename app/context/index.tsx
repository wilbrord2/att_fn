"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Student } from "../utils/types/student";

interface ContextValue {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  activeModalId: string | null;
  setActiveModalId: (id: string | null) => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  profile: Student | null;
  setProfile: (profile: Student) => void;
}

const AppContext = createContext<ContextValue>({} as ContextValue);

function ContextProvider({ children }: PropsWithChildren) {
  const [expanded, setExpanded] = useState(true);

  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [page, setPage] = useState(1);
  const [profile, setProfile] = useState<Student | null>(null);

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        expanded,
        setExpanded,
        activeTab,
        setActiveTab,
        activeModalId,
        setActiveModalId,
        profile,
        setProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
export default ContextProvider;
