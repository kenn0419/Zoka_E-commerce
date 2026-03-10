import { Avatar, Upload, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../../../store/auth.store";
import styles from "./AvatarProfile.module.scss";
import { useAvatarChangeMutation } from "../../../../queries/profile.query";

const { Text } = Typography;

export default function AvatarProfile() {
  const { user, setUser } = useAuthStore();
  const changeAvatarMutation = useAvatarChangeMutation();

  const handleChangeAvatar = (file: File) => {
    const payload: IProfileAvatarChangeRequest = {
      avatar: file,
    };
    changeAvatarMutation.mutate(payload, {
      onSuccess: (data) => {
        message.success("Avatar updated");
        setUser(data);
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message);
      },
    });

    return false;
  };
  return (
    <div className={styles.profile}>
      <Upload showUploadList={false} beforeUpload={handleChangeAvatar}>
        <Avatar
          size={56}
          src={user?.avatarUrl}
          icon={!user?.avatarUrl && <UserOutlined />}
          className={styles.avatar}
        />
      </Upload>

      <div className={styles.info}>
        <Text className={styles.username}>{user?.fullName || "User"}</Text>
      </div>
    </div>
  );
}
