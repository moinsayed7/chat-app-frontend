"use client";

import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!username || !email || !password) {
      setError("Please fill all the fields");
      setIsLoading(false);

      return;
    }

    const data = {
      username: username.trim(),
      email: email.trim(),
      password: password,
    };

    let response;
    let result;

    try {
      response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      result = await response.json();
    } catch {
      setError("Cant connect to the server");
      setIsLoading(false);

      return;
    }

    if (!response?.ok) {
      setError(result.error || "Something went wrong");
      setIsLoading(false);

      return;
    }
    setIsLoading(false);

    window.location.href = "/login";
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(eve) => {
                setUsername(eve.target.value);
              }}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(eve) => {
                setEmail(eve.target.value);
              }}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(eve) => {
                setPassword(eve.target.value);
              }}
            />
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <button disabled={isLoading} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
