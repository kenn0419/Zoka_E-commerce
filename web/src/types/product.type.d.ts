interface IProductListItemResponse {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  avgRating: number;
  minPrice: number;
  maxPrice: number;
  hasStock: boolean;
  status?: string;
  flashSaleEndTime?: string | null; // Added flashSaleEndTime
}

interface IVariantImageResponse {
  id: string;
  imageUrl: string;
}

interface IVariantResponse {
  id: string;
  name: string;
  originalPrice: number;
  displayPrice: number;
  isFlashSale: boolean;
  flashSaleEndTime?: string | null;
  stock: number;
  sold: number;
  images: IVariantImage[];
}

interface IProductDetailResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  avgRating: number;
  minPrice: number;
  maxPrice: number;
  hasStock: boolean;
  sold: number;
  flashSaleEndTime?: string | null; // Added flashSaleEndTime
  variants: IVariantResponse[]; // Changed type to IVariantResponse[]
  category: ICategoryResponse; // Assuming ICategoryResponse, not ICategoryDetailResponse as per original document
  shop: IShopResponse; // Assuming IShopResponse, not IShopDetailResponse as per original document
}

interface IProductFilterQueries extends IPaginationQueries {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

interface IProductCreationRequest {
  name: string;
  categoryId: string;
  description?: string;
  shopId: string;
  thumbnail: File | null;
  variantFiles: File[] | null;
  variants: IProductVariantCreaionRequest[];
}

interface IProductVariantCreaionRequest {
  id?: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
}

type IProductSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "rating_desc";
