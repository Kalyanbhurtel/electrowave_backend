import React from 'react'
import { ProductType } from '../page'
import axios from 'axios';

// prop type
type PropType = {
    open: Boolean,
    setOpen: (open: boolean) => void,
    product: ProductType | null
}

const UpdateProducts: React.FC<PropType> = ({ open, setOpen, product }) => {
    const [error, setError] = React.useState(null);
    const [name, setName] = React.useState<string>(product?.name || '');
    const [price, setPrice] = React.useState<number>(product?.price || 0);
    const [category, setCategory] = React.useState<string>(product?.category || '');
    const [discount, setDiscount] = React.useState<number>(product?.discount || 0);
    const [description, setDescription] = React.useState<string>(product?.description || '');
    const [stock, setStock] = React.useState<number>(product?.stock || 0);

    // handle update
    const handleSubmit = async () => {
        try {
            const { status } = await axios.patch(`http://localhost:8000/api/admin/products/${product?.id}`, { name, price, category, discount, stock, description });
            if (status !== 200) {
                throw new Error("Failed to update product");
            }

            setOpen(!open);
            window.location.reload();
        } catch (err: any) {
            if (err?.response) {
                setError(err.response.data.message);
            } else {
                setError(err.message)
            }
        }
    }



    return (
        <div className='h-[100vh] w-[100vw] p-4 fixed top-0 bottom-0 bg-white'>
            <div onClick={() => setOpen(!open)} className='text-4xl h-[50px] w-[50px] border grid place-items-center cursor-pointer'>
                <div className='rotate-45 cursor-pointer'>+</div>
            </div>
            <form className=' w-[25vw] p-4 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white border space-y-4'>
                {error && <div className='my-4 p-2 bg-red-500 text-white'>Error: {error}</div>}

                <div>
                    <label className='block'>Name</label>
                    <input type='text' className='w-full border p-2' onChange={(e) => setName(e.target.value)} value={name} />
                </div>
                <div>
                    <label className='block'>Price</label>
                    <input type='number' className='w-full border p-2' onChange={(e) => setPrice(parseFloat(e.target.value))} value={price} />
                </div>
                <div>
                    <label className='block'>Category</label>
                    <input type='text' className='w-full border p-2' onChange={(e) => setCategory(e.target.value)} value={category} />
                </div>
                <div>
                    <label className='block'>Discount</label>
                    <input type='number' className='w-full border p-2' onChange={(e) => setDiscount(parseFloat(e.target.value))} value={discount} />
                </div>
                <div>
                    <label className='block'>Stock</label>
                    <input type='number' className='w-full border p-2' onChange={(e) => setStock(parseInt(e.target.value))} value={stock} />
                </div>

                <div>
                    <label className='block'>Description</label>
                    <textarea className='w-full border p-2' onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                </div>

                <button type="button" onClick={() => handleSubmit()} className='bg-blue-500 text-white p-2'>Update</button>
            </form>
        </div>
    )
}

export default UpdateProducts;