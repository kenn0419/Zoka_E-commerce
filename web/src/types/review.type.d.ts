type ICommentSort = "newest" | "oldest" | "rating_asc" | "rating_desc";

interface IReviewQueries extends IPaginationQueries {
  sort?: ICommentSort;
  rating?: number;
}

interface IReviewCreationRequest {
  orderItemId: string;
  rating: number;
  content?: string;
  images?: File[];
}

interface IReviewResponse {
  id: string;
  rating: number;
  comment?: string;
  imageUrls: string[];
  buyer: IUserResponse;
  variant: IProductVariantResponse;
  replyCount?: number;
  createdAt: Date;
}
