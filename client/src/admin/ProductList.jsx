import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../api/axios.js";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, title) => {
    if (!window.confirm(`Delete "${title}" from inventory?`)) return;

    try {
      await api.delete(`/products/delete/${id}`);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.title?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Admin Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
              Product Inventory
            </h1>
          </div>

          <Link
            to="/admin/products/add"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-xs"
          >
            <span className="text-base leading-none">+</span>
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Search & Stats Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Filter inventory by product name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> of {products.length} products
          </p>
        </div>

        {/* Inventory Table Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
              Loading inventory...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-900 font-bold text-lg">No products found</p>
              <p className="text-sm text-slate-500 mt-1">
                Add your first product to start selling on IrshadStore.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="py-3.5 px-5">Product</th>
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5">Price</th>
                    <th className="py-3.5 px-5">Stock Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 shrink-0 flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-xs">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-400 font-mono truncate max-w-xs">
                              #{item._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                          {item.category || "General"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5 font-bold text-slate-900">
                        ${Number(item.price).toFixed(2)}
                      </td>

                      {/* Stock Badge */}
                      <td className="py-4 px-5">
                        {item.stock <= 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Out of stock (0)
                          </span>
                        ) : item.stock <= 5 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Low stock ({item.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            In stock ({item.stock})
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/products/update/${item._id}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteProduct(item._id, item.title)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;