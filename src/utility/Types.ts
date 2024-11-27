export interface IAuthBody {
  username: string;
  displayName: string;
  email: string;
  password: string;
  rememberCheck: boolean;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
