"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const ProductForm = ({ product, onSubmit, onCancel ,edit}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: product ? {
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      stock: product.stock || '',
      category: product.category || '',
      image: product.imageUrl ,
    } : {
      name: '',
      price: '',
      description: '',
      stock: '',
      category: '',
      image: null,
    }
  });

  const [imagePreview, setImagePreview] = useState(product?.image || null);

  // Product categories
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Beauty & Personal Care",
    "Toys & Games",
    "Sports & Outdoors",
    "Health & Wellness",
    "Jewelry",
    "Automotive",
    "Other"
  ];

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        stock: product.stock || '',
        category: product.category || '',
        image: null,
      });
      setImagePreview(product.image || null);
    } else {
      reset({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: '',
        image: null,
      });
      setImagePreview(null);
    }
  }, [product, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setValue('image', null);
      setImagePreview(product?.image || null);
    }
  };

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Product name is required" })}
              className={`w-full  px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                id="price"
                type="number"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price cannot be negative" }
                })}
                step="0.01"
                className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.price ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                id="stock"
                type="number"
                {...register("stock", {
                  required: "stock is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "stock cannot be negative or less than 0" }
                })}
                className={`w-full px-3 py-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.stock ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              {...register("category", { required: "Category is required" })}
              className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.category ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              rows="4"
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.description ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}

            { (
              <div className="mt-2">
                { !imagePreview ?
                 ( (edit && product.imageUrl.size !== null )&& <img
                    src={product.imageUrl}
                    alt="Product preview"
                    className="h-40 object-contain border rounded-md"
                  />)
                :
                 imagePreview &&
                  <img 
                    src={imagePreview}
                    alt="Product preview"
                    className="h-40 object-contain border rounded-md"
                  />                  
                }
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;