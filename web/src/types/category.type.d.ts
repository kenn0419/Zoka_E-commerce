interface ICategoryResponse {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  thumbnailUrl?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  children: ICategoryResponse[];
}

interface ICategoryCreationRequest {
  name: string;
  parentId?: string;
  description?: string;
  thumbnail?: File;
}

interface ICategoryUpdateRequest {
  name?: string;
  parentId?: string;
  description?: string;
  thumbnail?: File;
}

type ICategorySort = "name_asc" | "name_desc" | "newest" | "oldest";
