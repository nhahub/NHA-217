import prisma from '../utils/prisma';
import { AppError } from '../middlewares/error.middleware';

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    productCount: cat._count.products,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
  }));
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        include: { images: true },
        take: 10,
      },
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return {
    ...category,
    products: category.products.map((p: any) => ({
      ...p,
      price: Number(p.price),
      images: p.images.map((img: any) => img.url),
    })),
    productCount: category._count.products,
  };
};

export const createCategory = async (data: { name: string }) => {
  // Check if category already exists
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError('Category already exists', 400);
  }

  const category = await prisma.category.create({
    data,
  });

  return category;
};

export const updateCategory = async (id: string, data: { name?: string }) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Check if new name already exists
  if (data.name && data.name !== category.name) {
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new AppError('Category name already exists', 400);
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data,
  });

  return updatedCategory;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  if (category._count.products > 0) {
    throw new AppError('Cannot delete category with existing products', 400);
  }

  await prisma.category.delete({
    where: { id },
  });
};

