import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/order.service";

export const useCheckoutPreviewQuery = (
  params: ICheckoutPreviewRequest,
  enabled: boolean,
) => {
  return useQuery<ICheckoutPreviewResponse>({
    queryKey: ["checkout-preview", { ...params }],
    queryFn: () => orderService.checkoutPreview(params),
    enabled,
  });
};
