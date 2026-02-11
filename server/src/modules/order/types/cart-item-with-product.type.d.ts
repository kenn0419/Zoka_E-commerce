export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        shop: true;
      };
    };
    variant: true;
  };
}>;
