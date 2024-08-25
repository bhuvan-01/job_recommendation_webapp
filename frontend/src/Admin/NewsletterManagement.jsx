import React, { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch subscribers from the backend
  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/subscribers")
      .then((response) => {
        setSubscribers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching subscribers:", err);
        setLoading(false);
      });
  }, []);

  // Function to delete a subscriber
  const deleteSubscriber = (id) => {
    apiClient
      .delete(`/subscriber/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setSubscribers(
            subscribers.filter((subscriber) => subscriber._id !== id)
          );
        } else {
          alert("Failed to delete the subscriber");
        }
      })
      .catch((err) => {
        console.error("Error deleting subscriber:", err);
      });
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">Newsletter Subscribers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {subscribers.map((subscriber) => (
            <li
              key={subscriber._id}
              className="flex justify-between items-center "
            >
              <span>{subscriber.email}</span>
              <button
                onClick={() => deleteSubscriber(subscriber._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscriberList;
