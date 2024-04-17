"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';

type UserType = {
    id: number;
    user_id: number;
    order_date: string;
    shipping_address: string;
    grand_total: string;
    payment_status: string;
    order_status: string;
}

const Orders = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<UserType[] | []>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { data, status } = await axios.get('http://localhost:8000/api/admin/orders');

                if (status !== 200) {
                    throw new Error(`Failed to fetch orders: ${status}`);
                }
                setOrders(data.data.orders);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateOrderStatus = async (orderId: number, orderStatus: string) => {
        if (orderStatus === 'dispatched') {
            alert("Order is already dispatched.");
        }

        const confirmed = window.confirm(`Are you sure you want to dispatch this order?`);
        if (!confirmed) {
            return;
        }

        try {
            const { status } = await axios.patch(`http://localhost:8000/api/admin/orders/${orderId}`);
            if (status !== 200) {
                throw new Error("Failed to update order");
            }

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
        <div>
            {isLoading && <p>Loading orders...</p>}
            {error && <div className='my-4 p-2 bg-red-500 text-white'>Error: {error}</div>}
            {(orders && orders.length > 0) ? (
                <table className='w-full'>
                    <thead>
                        <tr className='border-b text-left'>
                            <th>ID</th>
                            <th>Ordered By</th>
                            <th>Order Date</th>
                            <th>Shipping Address</th>
                            <th>Grand Total</th>
                            <th>Payment Status</th>
                            <th>Order Status</th>
                            <th>Update Order Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: UserType) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user_id}</td>
                                <td>{order.order_date}</td>
                                <td>{order.shipping_address}</td>
                                <td>Rs {order.grand_total}</td>
                                <td>{order.payment_status}</td>
                                <td>{order.order_status}</td>
                                <td>
                                    <div className='space-x-2'>
                                        <input
                                            type='checkbox'
                                            className='cursor-pointer'
                                            onChange={() => handleUpdateOrderStatus(order.id, order.order_status)}
                                            checked={order.order_status === "dispatched"}
                                            disabled={order.order_status === 'dispatched'}
                                        />
                                        <span>Mark Dispatched</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className='py-4'>No orders yet</p>
            )}
        </div>
    );
};

export default Orders;