export type TServerCommand = {
  update: boolean;
  delete: boolean;
};

export type TUserReqBody = {
  id: string;
  name: string;
  email?: string;
  password?: string;
  updatePassword: string;
};
