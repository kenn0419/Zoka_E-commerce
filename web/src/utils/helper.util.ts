export function renderStatus(status: string) {
  switch (status) {
    case "PENDING":
      return "Chờ thanh toán";
    case "PAID":
      return "Đã thanh toán";
    case "SHIPPING":
      return "Đang giao";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "orange";
    case "PAID":
      return "blue";
    case "SHIPPING":
      return "processing";
    case "COMPLETED":
      return "green";
    case "CANCELLED":
      return "red";
    default:
      return "default";
  }
}

export const includeRole = (user: any, role: string) => {
  return user?.roles?.some((item: any) => item.name === role);
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
