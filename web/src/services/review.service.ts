import { reviewApi } from "../apis/review.api";

export const reviewService = {
  async fetchReviews(
    productSlug: string,
    params: IReviewQueries,
  ): Promise<IPaginatedResponse<IReviewResponse>> {
    const res = await reviewApi.fetchReviews(productSlug, params);
    return res.data;
  },
  async fetchReplies(
    reviewId: string,
    params: IInfinityQueries,
  ): Promise<IInfinityResponse<IReviewResponse>> {
    const res = await reviewApi.fetchReplies(reviewId, params);
    return res.data;
  },
  async canReview(productId: string): Promise<boolean> {
    const res = await reviewApi.canReview(productId);
    return res.data;
  },
  async createReview(
    payload: IReviewCreationRequest,
  ): Promise<IReviewResponse> {
    const res = await reviewApi.createReview(payload);
    return res.data;
  },
  async replyReview(
    reviewId: string,
    content: string,
  ): Promise<IReviewResponse> {
    const res = await reviewApi.replyReview(reviewId, content);
    return res.data;
  },
};
