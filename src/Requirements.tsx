import { FC } from "react";
import { requestUsers, requestUsersWithError, User } from "./api";
import React, { useState, useEffect } from "react";

const Requirements: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(4);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * limit;
        const users = await requestUsers({ name, age, limit, offset });
        // Также, если мы хотим вызвать Error user request, то нужно заменить верхнюю строчку на эту:
        // const users = await requestUsersWithError({ name, age, limit, offset });
        if (users.length === 0) {
          setError("Users not found");
        }
        setUsers(users);
      } catch (e: any) {
        setError(e.message);
        alert(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [name, age, page, limit]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
      />
      <input
        type="text"
        placeholder="Age"
        value={age}
        onChange={handleAgeChange}
      />

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name}, {user.age}
            </li>
          ))}
        </ul>
      )}

      <div>
        <label>By page:</label>
        <select value={limit} onChange={handleLimitChange}>
          <option value={4}>4</option>
          <option value={6}>6</option>
          <option value={11}>11</option>
        </select>
        <button onClick={handlePrevPage} disabled={page === 1}>
          prev
        </button>
        <span> page: {page} </span>
        <button onClick={handleNextPage}>next</button>
      </div>
    </div>
  );
};

export default Requirements;
