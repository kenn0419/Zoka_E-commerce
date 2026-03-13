import { productApi } from "../apis/product.api";

export const productService = {
  async fetchAdminProducts(
    params: IProductFilterQueries,
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchAdminProducts({ ...params });

    return res.data;
  },

  async fetchActiveProducts(
    params: IProductFilterQueries,
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchActiveProducts({ ...params });

    return res.data;
  },

  async fetchActiveProductsByCategory(
    categorySlug: string,
    params: IProductFilterQueries,
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchProductsByCategory({
      categorySlug,
      ...params,
    });

    return res.data;
  },

  async fetchProductDetailBySlug(
    productSlug: string,
  ): Promise<IProductDetailResponse> {
    const res = await productApi.fetchProductDetailBySlug(productSlug);
    return res.data;
  },

  async fetchProductDetailById(
    productId: string,
  ): Promise<IProductDetailResponse> {
    const res = await productApi.fetchProductDetailById(productId);
    return res.data;
  },

  async fetchRelatedProducts(
    categorySlug: string,
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchProductsByCategory({
      categorySlug,
      page: 1,
      limit: 6,
    });

    return res.data;
  },

  async suggestProducts(
    search: string,
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchSuggestProducts(search);
    return res.data;
  },

  async fetchProductsByShop(
    shopId: string,
    params: IProductFilterQueries,
  ): Promise<IPaginatedResponse<IProductListItemResponse>> {
    const res = await productApi.fetchProductsByShop({
      shopId,
      ...params,
    });

    return res.data;
  },

  async fetchActiveShopProducts(
    shopSlug: string,
    params: IProductFilterQueries,
  ) {
    const res = await productApi.fetchActiveShopProducts({
      shopSlug,
      ...params,
    });
    return res.data;
  },

  async createProduct(
    data: IProductCreationRequest,
  ): Promise<IProductListItemResponse> {
    const formData = new FormData();

    const variantFiles: File[] = [];

    const variants = data.variants.map((variant) => {
      const imageIndexes: number[] = [];

      variant.images?.forEach((img: any) => {
        const index = variantFiles.length;

        variantFiles.push(img.originFileObj);
        imageIndexes.push(index);
      });

      return {
        name: variant.name,
        stock: variant.stock,
        price: variant.price,
        images: imageIndexes,
      };
    });

    const payload = {
      name: data.name,
      categoryId: data.categoryId,
      shopId: data.shopId,
      description: data.description ?? "",
      variants,
    };

    formData.append("data", JSON.stringify(payload));

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    variantFiles.forEach((file) => {
      formData.append("variantImages", file);
    });

    const res = await productApi.createProduct(formData);

    return res.data;
  },
};
