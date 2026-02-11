import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { addressService } from "../services/address.service";

const ADDRESS_KEYS = {
  all: "addresses",
};

export const useAllAddressByUserQuery = () => {
  return useQuery({
    queryKey: [ADDRESS_KEYS.all],
    queryFn: () => addressService.findAllAddressesByUser(),
    placeholderData: keepPreviousData,
  });
};

export const useAddressCreationMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressService.createAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ADDRESS_KEYS.all] });
    },
  });
};

export const useSetDefaultAddressMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressService.setDefaultAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ADDRESS_KEYS.all] });
      qc.invalidateQueries({ queryKey: ["checkout-preview"] });
    },
  });
};
