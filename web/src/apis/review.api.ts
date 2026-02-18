import instance from "./axios-customize";

export const reviewApi = {
  fetchReviews: async (
    productSlug: string,
    params: IReviewQueries,
  ): Promise<IApiResponse<IPaginatedResponse<IReviewResponse>>> => {
    return await instance.get(`/reviews/product/${productSlug}`, {
      params,
    });
  },

  fetchReplies: async (
    reviewId: string,
    params: IInfinityQueries,
  ): Promise<IApiResponse<IInfinityResponse<IReviewResponse>>> => {
    return await instance.get(`/reviews/${reviewId}/replies`, { params });
  },

  canReview: async (productId: string): Promise<IApiResponse<boolean>> => {
    return await instance.get(`/reviews/can-review/${productId}`);
  },

  createReview: async (
    payload: IReviewCreationRequest,
  ): Promise<IApiResponse<IReviewResponse>> => {
    return await instance.post(`/reviews`, payload);
  },

  replyReview: async (
    reviewId: string,
    content: string,
  ): Promise<IApiResponse<IReviewResponse>> => {
    return await instance.post(`/reviews/${reviewId}/reply`, {
      content,
    });
  },
};
