import { Permission } from "./permissions";
import { Role } from "./roles";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserRole = {
  role: Role,
  permissions: Permission[]
}

export type HumanUserBody = Omit<User, 'id'>;
