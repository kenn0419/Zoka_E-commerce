import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useEffect } from "react";
import { useGetAllMyShopsQuery } from "../queries/shop.query";
import { useSellerStore } from "../store/seller.store";
import { PATH } from "../utils/path.util";

export default function SellerEntry() {
  const { data: shops = [], isLoading } = useGetAllMyShopsQuery();
  const { currentShopId, setCurrentShopId } = useSellerStore();

  useEffect(() => {
    if (shops.length === 1 && !currentShopId) {
      setCurrentShopId(shops[0].id ?? "");
    }
  }, [shops, currentShopId, setCurrentShopId]);

  if (isLoading) {
    return <Spin fullscreen />;
  }

  if (shops.length === 0) {
    return <Navigate to={`/${PATH.SELLER}/${PATH.REGISTER_SHOP}`} replace />;
  }

  if (shops.length === 1) {
    return <Navigate to={`/${PATH.SELLER}/${shops[0].id}`} replace />;
  }

  if (!currentShopId) {
    return <Navigate to={`/${PATH.SELLER}/${PATH.SELECT_SHOP}`} replace />;
  }

  return <Navigate to={`/${PATH.SELLER}/${currentShopId}`} replace />;
}
