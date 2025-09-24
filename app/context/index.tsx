"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { VerifiedUserResType } from "../utils/types/signup";
import { UserType } from "../utils/types/user";

interface ContextValue {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  activeModalId: string | null;
  setActiveModalId: (id: string | null) => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  User: VerifiedUserResType | null;
  setUser: (user: VerifiedUserResType) => void;
  profile: UserType | null;
  setProfile: (user: UserType) => void;
}

const AppContext = createContext<ContextValue>({} as ContextValue);

function ContextProvider({ children }: PropsWithChildren) {
  const [expanded, setExpanded] = useState(true);

  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [page, setPage] = useState(1);
  const [User, setUser] = useState<VerifiedUserResType | null>(null);
  const [profile, setProfile] = useState<UserType | null>(null);

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
        User,
        setUser,
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
