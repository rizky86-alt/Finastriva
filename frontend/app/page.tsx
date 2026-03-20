"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    // Memanggil API dari Backend Golang
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.json())
      .then((val) => setData(val.message))
      .catch((err) => console.error("Error nembak API:", err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Finastriva App</h1>
      <p className="mt-4 text-xl text-green-400">
        Status: {data || "Lagi konek ke backend..."}
      </p>
    </main>
  );
}