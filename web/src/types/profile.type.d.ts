interface IProfileUpdateRequest {
  fullname: string;
  phone: string;
  gender: string;
  birthday: string;
}

interface IProfilePasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  newConfirmPassword: string;
}

interface IProfileAvatarChangeRequest {
  avatar: File;
}
