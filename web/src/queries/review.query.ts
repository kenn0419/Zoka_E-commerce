import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { reviewService } from "../services/review.service";

export const useReviewsQuery = (productSlug: string, params: any) => {
  return useQuery({
    queryKey: ["reviews", productSlug, params],
    queryFn: () => reviewService.fetchReviews(productSlug, params),
  });
};

export const useRepliesQuery = (reviewId: string) => {
  return useInfiniteQuery({
    queryKey: ["replies", reviewId],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      reviewService.fetchReplies(reviewId, {
        cursor: pageParam,
        limit: 5,
      }),
    getNextPageParam: (lastPage: any) => lastPage.meta.nextCursor,
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useAdminReviewsQuery = (params: IReviewQueries) => {
  return useQuery({
    queryKey: ["reviews", "admin", params],
    queryFn: () => reviewService.fetchAdminReviews(params),
  });
};

export const useAdminDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReviewByAdmin(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "admin"] });
    },
  });
};

export const useShopReviewsQuery = (shopId: string, params: IReviewQueries) => {
  return useQuery({
    queryKey: ["reviews", "shop", shopId, params],
    queryFn: () => reviewService.fetchShopReviews(shopId, params),
    enabled: !!shopId,
  });
};
