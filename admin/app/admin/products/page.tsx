"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import UpdateProducts from './components/update-product';
import CreateProduct from './components/create-product';
import Image from 'next/image';

export type ProductType = {
  id: number;
  name: string;
  price: number;
  category: string;
  discount: number;
  stock: number;
  image_url: string;
  description: string;
}

const Products = () => {
  const [open, setOpen] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductType[] | []>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    const fetchProucts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, status } = await axios.get('http://localhost:8000/api/admin/products');
        if (status !== 200) {
          throw new Error(`Failed to fetch products: ${status}`);
        }
        setProducts(data.data.products);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProucts();
  }, []);


  // handle delete
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete the product?");

    if (!confirmed) {
      return
    }

    try {
      const { status } = await axios.delete(`http://localhost:8000/api/admin/products/${id}`);
      if (status !== 200) {
        throw new Error("Failed to delete user");
      }
      setProducts((prevUsers: ProductType[]) => prevUsers.filter((user) => user.id !== id));
    } catch (err: any) {
      if (err?.response) {
        setError(err.response.data.message);
      } else {
        setError(err.message)
      }
    }
  }

  // handle open update dialog
  const handleOpenUpdateDialog = (product: ProductType) => {
    setOpen((prev) => !prev);
    setSelectedProduct(product);
  }

  return (
    <div>
      <div className='py-4 flex justify-between'>
        <p className='text-xl font-bold'>Product Table</p>
        <button onClick={() => setOpenCreateModal(true)} className='bg-blue-500 p-2 text-white'>Create</button>
        {openCreateModal && <CreateProduct open={openCreateModal} setOpen={setOpenCreateModal} product={null} />}
      </div>
      <div>
        {isLoading && <p>Loading products...</p>}
        {error && <div className='my-4 p-2 bg-red-500 text-white'>Error: {error}</div>}
        {(products && products.length > 0) ? (
          <table className='w-full'>
            <thead>
              <tr className='border-b text-left'>
                <th>ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Category</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: ProductType) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    <Image src={product.image_url} alt="image" height={50} width={50} className="object-cover" />
                  </td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.discount}</td>
                  <td>{product.stock}</td>
                  <td><button onClick={() => handleOpenUpdateDialog(product)}>Update</button></td>
                  <td><button onClick={() => handleDelete(product.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='py-4'>No products yet</p>
        )}
      </div>
      {open && <UpdateProducts open={open} setOpen={setOpen} product={selectedProduct} />}
    </div>
  );
};

export default Products;