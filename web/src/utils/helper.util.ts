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
