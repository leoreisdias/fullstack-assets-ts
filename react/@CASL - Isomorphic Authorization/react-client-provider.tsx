"use client";
import { ReactNode, createContext, useContext } from "react";
import { createContextualCan } from "@casl/react";
import { AppAbility, defineAbilityFor } from "@/config/permissions";

const AbilityContext = createContext<AppAbility>(undefined!);
export const Can = createContextualCan(AbilityContext.Consumer);

type Session = {
  role: "ADMIN" | "USER";
};

export function AccessProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <AbilityContext.Provider value={defineAbilityFor(session)}>
      {children}
    </AbilityContext.Provider>
  );
}

export const useAccess = () => {
  const abilities = useContext(AbilityContext);

  // NOTE: To provide only can/cannot methods AND fix the "this" class error if happens (troubleshoot)
  return {
    can: abilities.can.bind(abilities),
    cannot: abilities.cannot.bind(abilities),
  };
};
