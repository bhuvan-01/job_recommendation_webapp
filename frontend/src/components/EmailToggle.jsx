import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";

function EmailNotificationToggle({ userId }) {
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Fetch the initial state from the API
  useEffect(() => {
    apiClient
      .get(`/users/${userId}`)
      .then((response) => {
        console.log("Initial fetch response:", response.data);

        setEmailNotifications(!!response.data.user.emailNotifications);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [userId]);

  const handleToggle = () => {
    const newEmailNotifications = !emailNotifications;

    setEmailNotifications(newEmailNotifications);

    apiClient
      .put(`/users/${userId}`, {
        emailNotifications: newEmailNotifications,
      })
      .then((response) => {
        console.log("PUT request response:", response.data);

        setEmailNotifications(response.data.user.emailNotifications);
        console.log("Email notifications updated successfully!");
      })
      .catch((error) => {
        setEmailNotifications(!newEmailNotifications);
        console.error("Error updating email notifications:", error);
      });
  };

  return (
    <div className="p-6 bg-white rounded-lg border w-100 mt-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-medium">Email Notifications</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
}

export default EmailNotificationToggle;
