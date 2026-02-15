export function generateOrderCode(): string {
  const timestamp = Date.now(); // milliseconds
  const random = Math.floor(Math.random() * 1000); // 0-999

  return `OD${timestamp}${random}`;
}
