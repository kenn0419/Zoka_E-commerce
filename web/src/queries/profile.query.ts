import { useMutation, useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";

export const useProfileChangeMutation = () => {
  return useMutation({
    mutationFn: profileService.updateProfile,
  });
};

export const useAvatarChangeMutation = () => {
  return useMutation({
    mutationFn: profileService.changeAvatar,
  });
};

export const usePasswordChangeMutation = () => {
  return useMutation({
    mutationFn: profileService.changePassword,
  });
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.fetchProfile,
  });
};
