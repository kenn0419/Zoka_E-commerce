import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/order.service";

export const useMyOrdersQuery = (params: IOrderQueries) => {
  return useQuery({
    queryKey: ["my-orders", { ...params }],
    queryFn: () => orderService.fetchMyOrders(params),
  });
};

export const useShopOrdersQuery = (shopId: string, params: IOrderQueries) => {
  return useQuery({
    queryKey: ["shop-orders", shopId, { ...params }],
    queryFn: () => orderService.fetchShopOrders(shopId, params),
  });
};

export const useAllOrdersQuery = (params: IOrderQueries) => {
  return useQuery({
    queryKey: ["all-orders", { ...params }],
    queryFn: () => orderService.fetchAllOrders(params),
  });
};

export const useChangeOrderStatusByShopMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, status }: { code: string; status: IOrderStatus }) =>
      orderService.changeOrderStatusByShop(code, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["shop-orders"] });
    },
  });
};

export const useChangeOrderStatusByAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: IOrderStatus }) =>
      orderService.changeOrderStatusByAdmin(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["shop-orders"] });
      queryClient.invalidateQueries({ queryKey: ["all-orders"] });
    },
  });
};
