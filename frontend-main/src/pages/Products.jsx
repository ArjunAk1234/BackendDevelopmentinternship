import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Package, Edit2, X, Check, ShoppingBag } from 'lucide-react';

const Products = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', category: '', stock: '' });
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const load = async () => {
        try {
            const res = await API.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to load products');
        }
    };

    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price) return;

        setLoading(true);
        try {
            await API.post('/products', {
                name: form.name,
                price: parseFloat(form.price),
                category: form.category || undefined,
                stock: form.stock ? parseInt(form.stock) : 0
            });
            setForm({ name: '', price: '', category: '', stock: '' });
            load();
        } catch (err) {
            alert('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingProduct.name.trim() || !editingProduct.price) return;

        try {
            await API.put(`/products/${editingProduct.id}`, {
                name: editingProduct.name,
                price: parseFloat(editingProduct.price),
                category: editingProduct.category || undefined,
                stock: editingProduct.stock ? parseInt(editingProduct.stock) : 0
            });
            setEditingProduct(null);
            load();
        } catch (err) {
            alert('Failed to update product');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await API.delete(`/products/${id}`);
            load();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct({
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category || '',
            stock: product.stock || 0
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
                    <p className="text-gray-500">
                        {user.role === 'admin' ? 'Manage your product inventory' : 'Browse available products'}
                    </p>
                </div>
                {user.role === 'admin' && (
                    <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold">
                        Admin Access
                    </span>
                )}
            </div>

            {user.role === 'admin' && (
                <form onSubmit={handleAdd} className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <input
                            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                            placeholder="Product name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <input
                            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: e.target.value })}
                            required
                        />
                        <input
                            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                            placeholder="Category (optional)"
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                        />
                        <input
                            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                            type="number"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={e => setForm({ ...form, stock: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </form>
            )}

            {products.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 text-lg">No products available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
                        >
                            {editingProduct?.id === product._id ? (
                                <div className="space-y-3">
                                    <input
                                        className="w-full px-3 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none"
                                        value={editingProduct.name}
                                        onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    />
                                    <input
                                        className="w-full px-3 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none"
                                        type="number"
                                        step="0.01"
                                        value={editingProduct.price}
                                        onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                    />
                                    <input
                                        className="w-full px-3 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none"
                                        placeholder="Category"
                                        value={editingProduct.category}
                                        onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                    />
                                    <input
                                        className="w-full px-3 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none"
                                        type="number"
                                        placeholder="Stock"
                                        value={editingProduct.stock}
                                        onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdate}
                                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                                        >
                                            <Check size={16} /> Save
                                        </button>
                                        <button
                                            onClick={() => setEditingProduct(null)}
                                            className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Package className="text-indigo-600" size={24} />
                                        </div>
                                        {user.role === 'admin' && (
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-gray-400 hover:text-indigo-500 transition"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-gray-400 hover:text-red-500 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                                    {product.category && (
                                        <p className="text-xs text-gray-500 mb-3">{product.category}</p>
                                    )}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-2xl font-bold text-indigo-600">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        {product.stock !== undefined && (
                                            <span className={`text-xs font-semibold px-2 py-1 rounded ${product.stock > 10
                                                    ? 'bg-green-100 text-green-700'
                                                    : product.stock > 0
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                Stock: {product.stock}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;