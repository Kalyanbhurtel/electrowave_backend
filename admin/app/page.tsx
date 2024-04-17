"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const { data, status } = await axios.post("http://localhost:8000/api/auth/login", { email, password }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (status === 200) {
        localStorage.setItem("auth-token", data.data.jwt_token);
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      if (err.response) {
        return alert(err.response.data.message);
      } else {
        return alert(err.message);
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <form className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p className="text-gray-400 mb-4">Login to access admin panel</p>
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-96 p-4 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-96 p-4 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="w-96 p-4 bg-blue-500 text-white rounded-md"
        >
          Login
        </button>
      </form>
    </main>
  );
}
