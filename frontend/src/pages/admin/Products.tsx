import { useEffect, useState } from 'react';
import { productService, Product } from '@/services/product';
import { categoryService, Category } from '@/services/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock must be non-negative'),
  categoryId: z.string().uuid('Please select a category'),
  images: z.string().optional(),
  salePrice: z.union([z.string(), z.number()]).optional(),
  saleEndDate: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll({ limit: 1000 }),
        categoryService.getAll(),
      ]);
      setProducts(productsData.products);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      const images = data.images ? data.images.split(',').map(url => url.trim()).filter(Boolean) : [];
      
      const payload = {
        ...data,
        images,
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        saleEndDate: data.saleEndDate ? new Date(data.saleEndDate).toISOString() : null,
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, payload);
      } else {
        await productService.create(payload as any);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      reset();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('price', typeof product.price === 'string' ? parseFloat(product.price) : product.price);
    setValue('stock', product.stock);
    setValue('categoryId', product.categoryId);
    setValue('images', product.images?.join(', ') || '');
    setValue('salePrice', product.salePrice ? product.salePrice.toString() : '');
    setValue('saleEndDate', product.saleEndDate ? new Date(product.saleEndDate).toISOString().slice(0, 16) : '');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.delete(id);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory.</p>
        </div>
        <Button 
          onClick={() => { setEditingProduct(null); reset(); setShowModal(true); }}
          className="gap-2 shadow-lg shadow-primary/25"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-10 bg-gray-50 dark:bg-gray-900 border-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <Button variant="ghost" size="icon" onClick={() => { setShowModal(false); reset(); setEditingProduct(null); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input {...register('name')} />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea {...register('description')} className="w-full p-2 border rounded-lg" rows={4} />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                  {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <Input type="number" {...register('stock', { valueAsNumber: true })} />
                  {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="col-span-2 text-sm font-semibold text-primary mb-2">Limited Time Offer (Optional)</div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sale Price</label>
                  <Input type="number" step="0.01" placeholder="Leave empty to disable" {...register('salePrice')} />
                  {errors.salePrice && <p className="text-sm text-red-500 mt-1">{errors.salePrice.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sale End Date</label>
                  <Input type="datetime-local" {...register('saleEndDate')} />
                  {errors.saleEndDate && <p className="text-sm text-red-500 mt-1">{errors.saleEndDate.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select {...register('categoryId')} className="w-full p-2 border rounded-lg">
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Images (comma-separated URLs)</label>
                <Input {...register('images')} placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">{editingProduct ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); reset(); setEditingProduct(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-gray-500 text-xs truncate max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
