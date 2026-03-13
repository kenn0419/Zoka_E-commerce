import instance from "./axios-customize";

export interface IRevenueData {
  date: string;
  revenue: number;
  cumulativeRevenue: number;
  previousRevenue: number | null;
  growthPercentage: number | null;
}

export interface IRevenueQueries {
  period?: "day" | "month" | "year";
  startDate?: string;
  endDate?: string;
}

export const statisticsApi = {
  fetchAdminRevenue: (params: IRevenueQueries) => {
    return instance.get<IRevenueData[]>("/statistics/admin/revenue", {
      params,
    });
  },
  fetchShopRevenue: (shopId: string, params: IRevenueQueries) => {
    return instance.get<IRevenueData[]>(`/statistics/shop/${shopId}/revenue`, {
      params,
    });
  },
  exportAdminRevenue: (params: IRevenueQueries) => {
    return instance.get("/statistics/admin/revenue/export", {
      params,
      responseType: "blob",
    });
  },
  exportShopRevenue: (shopId: string, params: IRevenueQueries) => {
    return instance.get(`/statistics/shop/${shopId}/revenue/export`, {
      params,
      responseType: "blob",
    });
  },
};
