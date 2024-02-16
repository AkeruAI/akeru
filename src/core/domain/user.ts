export type User = {
  id: string;
  name: string;
  email: string;
};

export type HumanUserBody = Omit<User, 'id'>;
