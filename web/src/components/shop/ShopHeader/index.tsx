import { Button, Avatar, Spin } from "antd";
import {
  UserOutlined,
  StarFilled,
  ShopOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import styles from "./ShopHeader.module.scss";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import { useChatStore } from "../../../store/chat.store";
import { useQueryClient } from "@tanstack/react-query";

interface ShopHeaderProps {
  shop: IShopResponse;
  isLoading: boolean;
}

export default function ShopHeader({ shop, isLoading }: ShopHeaderProps) {
  const navigate = useNavigate();
  const { openChatWithConversation, openChatWithPartner } = useChatStore();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <Spin />;
  }

  const handleClickThumbnail = () => {
    navigate(`/public/${PATH.SHOP}/${shop.slug}`);
  };

  const handleClickChat = () => {
    console.log("👆 Chat button clicked", {
      hasOwner: !!shop?.owner,
      ownerId: shop?.owner?.id,
      shopName: shop?.name
    });

    if (!shop?.owner?.id ) {
      console.warn("⚠️ Cannot open chat: Shop owner information is missing");
      return;
    }

    const conversations = queryClient.getQueryData<{
      pages: { items: IConversationResponse[] }[];
    }>(["conversations"]);

    const existing = conversations?.pages
      .flatMap((page) => page.items)
      .find((c) => c.partner.id === shop.owner?.id);

    if (existing) {
      console.log("📍 Found existing conversation:", existing.id);
      openChatWithConversation(existing.id);
    } else {
      console.log("🆕 Creating new chat with partner", shop.owner.id);
      openChatWithPartner({
        id: shop.owner.id,
        fullName: shop.owner.fullName,
        avatarUrl: shop.owner.avatarUrl || "",
      });
    }
    
    // Explicitly set open to true to trigger the popup
    useChatStore.getState().setOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.banner}>
          <Avatar
            size={72}
            src={shop?.logoUrl}
            icon={<UserOutlined />}
            className={styles.avatar}
            onClick={handleClickThumbnail}
          />
          <div className={styles.shopInfo}>
            <div className={styles.shopName}>{shop?.name}</div>
            <div className={styles.online}>Online 2 phút trước</div>
            <div className={styles.actions}>
              <Button type="primary" ghost icon={<ShopOutlined />}>
                Theo dõi
              </Button>
              <Button icon={<MessageOutlined />} onClick={handleClickChat}>
                Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.stat}>
          <span>Sản phẩm:</span>
          <b>428</b>
        </div>
        <div className={styles.stat}>
          <span>Đang theo:</span>
          <b>23</b>
        </div>
        <div className={styles.stat}>
          <span>Người theo dõi:</span>
          <b>2,9tr</b>
        </div>
        <div className={styles.stat}>
          <span>Đánh giá:</span>
          <b>
            <StarFilled /> 4.9
          </b>
        </div>
        <div className={styles.stat}>
          <span>Tham gia:</span>
          <b>{dayjs(shop?.createdAt).format("DD/MM/YYYY")}</b>
        </div>
      </div>
    </div>
  );
}
