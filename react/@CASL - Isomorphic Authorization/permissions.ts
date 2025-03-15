// NOTE: Also would work in the backend API, like NestJS, but you need to adapt the session object
import {
  AbilityBuilder,
  CreateAbility,
  ForcedSubject,
  MongoAbility,
  createMongoAbility,
} from "@casl/ability";
// import { Session } from "next-auth"; // Next Auth Session example, but it can be whatever user object

type Roles = "ADMIN" | "USER";

type Session = {
  role: Roles;
};

const actions = ["manage", "create", "read", "edit"] as const;
const modules = ["all", "module1", "module2"] as const;

type AppAbilities = [
  (typeof actions)[number],
  (
    | (typeof modules)[number]
    | ForcedSubject<Exclude<(typeof modules)[number], "all">>
  )
];

type AppAbility = MongoAbility<AppAbilities>;
const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

type DefinePermissions = (
  user: Session,
  builder: AbilityBuilder<AppAbility>
) => void;

const rolePermissions: Record<Roles, DefinePermissions> = {
  ADMIN(session, { can, cannot }) {
    can("manage", "all");
  },
  USER(session, { can }) {
    can("manage", "module1");
  },
};

function defineAbilityFor(session: Session | null): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility);

  if (!session) return builder.build();

  if (typeof rolePermissions[session.role] === "function") {
    throw new Error(`Trying to use unknown roles`);
  } else {
    rolePermissions[session.role](session, builder);
  }

  return builder.build();
}

const getUserPermissions = (session: Session | null) => {
  const abilities = defineAbilityFor(session);

  // NOTE: To provide only can/cannot methods AND fix the "this" class error if happens (troubleshoot)
  return {
    can: abilities.can.bind(abilities),
    cannot: abilities.cannot.bind(abilities),
  };
};

export { getUserPermissions, defineAbilityFor };
export type { AppAbility };
