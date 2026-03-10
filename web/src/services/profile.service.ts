import { profileApi } from "../apis/profile.api";

export const profileService = {
  async fetchProfile(): Promise<IUserResponse> {
    const res = await profileApi.fetchProfile();

    return res.data;
  },

  async updateProfile(data: IProfileUpdateRequest): Promise<IUserResponse> {
    const res = await profileApi.updateProfile(data);

    return res.data;
  },

  async changePassword(data: IProfilePasswordChangeRequest) {
    await profileApi.changePassword(data);
  },

  async changeAvatar(
    data: IProfileAvatarChangeRequest,
  ): Promise<IUserResponse> {
    const formData = new FormData();
    if (data && data.avatar) {
      formData.append("avatar", data.avatar);
    }

    const res = await profileApi.changeAvatar(formData);

    return res.data;
  },
};
