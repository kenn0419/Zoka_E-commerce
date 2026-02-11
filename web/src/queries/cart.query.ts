import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cart.service";

const CART_KEY = {
  me: ["cart"],
  summary: ["cart", "summary"],
};

export const useCartQuery = (enabled = true) => {
  return useQuery<ICartResponse>({
    queryKey: CART_KEY.me,
    queryFn: cartService.getUserCart,
    enabled,
  });
};

export const useCartSummaryQuery = (enabled = true) => {
  return useQuery<ICartSummaryResponse>({
    queryKey: CART_KEY.summary,
    queryFn: cartService.getUserCartSummary,
    enabled,
    select: (res) => res,
    staleTime: 30_000,
  });
};

export const useAddToCartMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY.me });
      qc.invalidateQueries({ queryKey: CART_KEY.summary });
    },
  });
};

export const useClearCartMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearUserCart,
    onSuccess: () => {
      qc.setQueryData<ICartResponse>(CART_KEY.me, (old) =>
        old ? { ...old, items: [] } : old,
      );
      qc.invalidateQueries({ queryKey: CART_KEY.summary });
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, quantity }: IUpdateCartRequest) =>
      cartService.updateQuantity({ cartItemId, quantity }),

    onSuccess: (data) => {
      qc.setQueryData(CART_KEY.me, data);
      qc.invalidateQueries({ queryKey: CART_KEY.summary });
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cartService.removeCartItem(id),
    onSuccess: (data) => {
      qc.setQueryData(CART_KEY.me, data);
      qc.invalidateQueries({ queryKey: CART_KEY.summary });
    },
  });
};

export const useUpdateSelectionMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartService.updateSelection,
    onSuccess: (data) => {
      qc.setQueryData(CART_KEY.me, data);
      qc.invalidateQueries({ queryKey: CART_KEY.summary });
    },
  });
};
