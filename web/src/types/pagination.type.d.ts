interface IPaginatedResponse<T> {
  items: T[];
  meta?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

interface IPaginationQueries {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

interface IInfinityQueries {
  cursor?: string;
  limit?: number;
}

interface IInfinityResponse<T> {
  items: T[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}
