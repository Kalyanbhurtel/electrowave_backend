"use client"

import Link from 'next/link';
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className='min-h-screen px-4 w-screen flex flex-col h-full'>
      <header className='py-8 flex flex-col gap-4'>
        <h1 className='text-2xl text-center font-bold'>Admin Panel</h1>
        <nav className='flex gap-8 justify-center'>
          <Link href={"/admin/dashboard"} className={`hover:underline ${pathname === "/admin/dashboard" ? "underline" : ""}`}>Dashboard</Link>
          <Link href={"/admin/users"} className={`hover:underline ${pathname === "/admin/users" ? "underline" : ""}`}>Users</Link>
          <Link href={"/admin/products"} className={`hover:underline ${pathname === "/admin/products" ? "underline" : ""}`}>Products</Link>
          <Link href={"/admin/orders"} className={`hover:underline ${pathname === "/admin/orders" ? "underline" : ""}`}>Orders</Link>
        </nav>
      </header>
      <main className='flex-1 border-t border-b overflow-y-auto'>
        {children}
      </main>
      <footer className='p-4'>
        <p>&copy; 2024 Admin Panel</p>
      </footer>
    </div>
  )
}

export default AdminLayout;