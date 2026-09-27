"use client";

import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please fill all the fields");
      setIsLoading(false);
      return;
    }

    const data = { email: email.trim(), password: password };

    let response;
    let result;

    try {
      response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      result = await response.json();
    } catch {
      setError("Cant connect to server");
      setIsLoading(false);
      return;
    }

    if (!response.ok) {
      setError(result.error || "Something went wrong");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    window.location.href = "/conversations";
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 mb-1">
          Chat App
        </h1>
        <h2 className="text-sm text-zinc-600">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-zinc-200 rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(eve) => {
                  setEmail(eve.target.value);
                }}
                className="w-full px-3.5 py-2 text-zinc-900 bg-white border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-950 transition-colors"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(eve) => {
                  setPassword(eve.target.value);
                }}
                className="w-full px-3.5 py-2 text-zinc-900 bg-white border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-950 transition-colors"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isLoading ? "Signing in..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}