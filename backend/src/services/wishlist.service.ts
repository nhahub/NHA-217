import prisma from '../utils/prisma';
import { AppError } from '../middlewares/error.middleware';

export const addToWishlist = async (userId: string, productId: string) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId },
  });

  if (existingItem) {
    throw new AppError('Product already in wishlist', 400);
  }

  await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  return getWishlist(userId);
};

export const getWishlist = async (userId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  return wishlist;
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) throw new AppError('Wishlist not found', 404);

  const item = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId },
  });

  if (!item) throw new AppError('Item not found in wishlist', 404);

  await prisma.wishlistItem.delete({
    where: { id: item.id },
  });

  return getWishlist(userId);
};
