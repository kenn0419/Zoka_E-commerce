import instance from "./axios-customize";

export const profileApi = {
  fetchProfile: async (): Promise<IApiResponse<IUserResponse>> => {
    return await instance.get("/profile");
  },

  updateProfile: async (
    data: IProfileUpdateRequest,
  ): Promise<IApiResponse<IUserResponse>> => {
    return await instance.patch("/profile", { ...data });
  },

  changePassword: async (
    data: IProfilePasswordChangeRequest,
  ): Promise<IApiResponse<null>> => {
    return await instance.patch("/profile/change-password", { ...data });
  },

  changeAvatar: async (
    data: FormData,
  ): Promise<IApiResponse<IUserResponse>> => {
    return await instance.patch("/profile/change-avatar", data);
  },
};
