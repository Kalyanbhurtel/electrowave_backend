import React from 'react'
import { ProductType } from '../page'
import axios from 'axios';
import Image from 'next/image';
import { json } from 'stream/consumers';

// prop type
type PropType = {
    open: Boolean,
    setOpen: (open: boolean) => void,
    product: ProductType | null
}

const CreateProduct: React.FC<PropType> = ({ open, setOpen }) => {
    const [error, setError] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const [price, setPrice] = React.useState<number>(0);
    const [category, setCategory] = React.useState<string>('');
    const [discount, setDiscount] = React.useState<number>(0);
    const [description, setDescription] = React.useState<string>('');
    const [stock, setStock] = React.useState<number>(0);
    const [image, setImage] = React.useState<string>('');
    const [imagePreview, setImagePreview] = React.useState<string>('');

    // handle image change
    const handleImageChange = (e: any) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImage(file)
        setImagePreview(URL.createObjectURL(file));
    };


    // handle update
    const handleSubmit = async () => {
        if (!name || !price || !category || !description || !stock || !image) {
            setError("Fill in all required fields");
            return
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price.toString());
        formData.append('category', category);
        formData.append('discount', discount.toString());
        formData.append('stock', stock.toString());
        formData.append('description', description);
        formData.append('image', image);

        console.log(formData);

        try {
            const { status } = await axios.post(`http://localhost:8000/api/admin/products`, formData);
            if (status !== 200) {
                setError("Failed to update product");
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
                    <input type='text' placeholder='required' className='w-full border p-2' onChange={(e) => setName(e.target.value)} value={name} />
                </div>
                <div>
                    <label className='block'>Price</label>
                    <input type='number' placeholder="required" className='w-full border p-2' onChange={(e) => setPrice(parseFloat(e.target.value))} value={price} />
                </div>
                <div>
                    <label className='block'>Category</label>
                    <input type='text' placeholder='required' className='w-full border p-2' onChange={(e) => setCategory(e.target.value)} value={category} />
                </div>
                <div>
                    <label className='block'>Discount</label>
                    <input type='number' placeholder='optional' className='w-full border p-2' onChange={(e) => setDiscount(parseFloat(e.target.value))} value={discount} />
                </div>
                <div>
                    <label className='block'>Stock</label>
                    <input type='number' placeholder='required' className='w-full border p-2' onChange={(e) => setStock(parseInt(e.target.value))} value={stock} />
                </div>

                <div>
                    <label className='block'>Description</label>
                    <textarea placeholder='required' className='w-full border p-2' onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                </div>

                <div>
                    <label className='block'>Image</label>
                    <input type='file' accept='images/*' className='w-full border p-2' onChange={handleImageChange} />
                    <div className='flex space-x-2'>
                        {imagePreview && <Image src={imagePreview} alt="image" height={100} width={100} className='w-[100px] h-[100px] object-cover' />}
                    </div>
                </div>

                <button type="button" onClick={() => handleSubmit()} className='bg-blue-500 text-white p-2'>Upload</button>
            </form>
        </div>
    )
}

export default CreateProduct;