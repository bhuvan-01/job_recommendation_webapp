# API Documentation

## Overview

This documentation provides detailed information on the API endpoints available in the application.

## Table of Contents

- [Authentication](#authentication)
  - [Login](#login)
  - [Signup](#signup)
  - [Forgot Password](#forgot-password)
  - [Reset Password](#reset-password)
  - [Get Logged-in User](#get-logged-in-user)
- [Profile](#profile)
  - [Update Profile](#update-profile)
  - [Upload Resume](#upload-resume)
- [Jobs](#jobs)
  - [Create Job](#create-job)
  - [Update Job](#update-job)
  - [Delete Job](#delete-job)
  - [Get Jobs](#get-jobs)
  - [Get Employer Jobs](#get-employer-jobs)
- [Users](#users)
  - [Get User By ID](#get-user-by-id)
  - [Get All Users](#get-all-users)
  - [Update User](#update-user)
  - [Upload User Photo](#upload-user-photo)
  - [Upload User Resume](#upload-user-resume)
- [Company](#company)
  - [Create Company](#create-company)

## Authentication

### Login

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** User login with email and password.
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

- **Response:**

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "User Full Name"
  }
}
```

### Signup

- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Description:** User signup with email, password, and other details.
- **Request Body:**

```json
{
  "fullName": "User Full Name",
  "email": "user@example.com",
  "password": "userpassword"
}
```

- **Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "User Full Name"
  }
}
```

### Forgot Password

- **URL:** `/api/auth/forget-password`
- **Method:** `POST`
- **Description:** Initiate forgot password process.
- **Request Body:**

```json
{
  "email": "user@example.com"
}
```

- **Response:**

  ```json
  {
    "message": "Password reset link sent to email"
  }
  ```

### Reset Password

- **URL:** `/api/auth/reset-password`
- **Method:** `POST`
- **Description:** Reset password using token.
- **Request Body:**

  ```json
  {
    "token": "reset_token",
    "newPassword": "newpassword"
  }
  ```

- **Response:**

  ```json
  {
    "message": "Password reset successfully"
  }
  ```

### Get Logged-in User

- **URL:** `/api/auth/user`
- **Method:** `GET`
- **Description:** Get details of the logged-in user.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Response:**

  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "User Full Name"
  }
  ```

## Profile

### Update Profile

- **URL:** `/api/profile/update`
- **Method:** `PUT`
- **Description:** Update user profile details.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Request Body:**

  ```json
  {
    "fullName": "Updated Full Name",
    "bio": "Updated Bio"
  }
  ```

- **Response:**

  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "Updated Full Name",
      "bio": "Updated Bio"
    }
  }
  ```

### Upload Resume

- **URL:** `/api/profile/resume`
- **Method:** `POST`
- **Description:** Upload user resume.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Request Body:**
  - `form-data` with `resume` file.
- **Response:**

  ```json
  {
    "message": "Resume uploaded successfully",
    "resumeUrl": "url_to_resume"
  }
  ```

## Jobs

### Create Job

- **URL:** `/api/jobs`
- **Method:** `POST`
- **Description:** Create a new job posting.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Request Body:**

  ```json
  {
    "title": "Job Title",
    "description": "Job Description",
    "location": "Job Location",
    "requirements": "Job Requirements"
  }
  ```

- **Response:**

  ```json
  {
    "message": "Job created successfully",
    "job": {
      "id": "job_id",
      "title": "Job Title",
      "description": "Job Description",
      "location": "Job Location",
      "requirements": "Job Requirements"
    }
  }
  ```

### Update Job

- **URL:** `/api/jobs/:id`
- **Method:** `PUT`
- **Description:** Update an existing job posting.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Request Body:**

  ```json
  {
    "title": "Updated Job Title",
    "description": "Updated Job Description",
    "location": "Updated Job Location",
    "requirements": "Updated Job Requirements"
  }
  ```

- **Response:**

  ```json
  {
    "message": "Job updated successfully",
    "job": {
      "id": "job_id",
      "title": "Updated Job Title",
      "description": "Updated Job Description",
      "location": "Updated Job Location",
      "requirements": "Updated Job Requirements"
    }
  }
  ```

### Delete Job

- **URL:** `/api/jobs/:id`
- **Method:** `DELETE`
- **Description:** Delete a job posting.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Response:**

  ```json
  {
    "message": "Job deleted successfully"
  }
  ```

### Get Jobs

- **URL:** `/api/jobs`
- **Method:** `GET`
- **Description:** Get all job postings.
- **Response:**

  ```json
  {
    "jobs": [
      {
        "id": "job_id",
        "title": "Job Title",
        "description": "Job Description",
        "location": "Job Location",
        "requirements": "Job Requirements"
      }
      // more job objects
    ]
  }
  ```

### Get Employer Jobs

- **URL:** `/api/jobs/employer/:id`
- **Method:** `GET`
- **Description:** Get jobs posted by a specific employer.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Response:**

  ```json
  {
    "jobs": [
      {
        "id": "job_id",
        "title": "Job Title",
        "description": "Job Description",
        "location": "Job Location",
        "requirements": "Job Requirements"
      }
      // more job objects
    ]
  }
  ```

## Users

### Get User By ID

- **URL:** `/api/users/:id`
- **Method:** `GET`
- **Description:** Get user details by user ID.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Response:**

  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "User Full Name"
  }
  ```

### Get All Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Description:** Get details of all users.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Response:**

  ```json
  {
    "users": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "fullName": "User Full Name"
      }
      // more user objects
    ]
  }
  ```

### Update User

- **URL:** `/api/users/:id`
- **Method:** `PUT`
- **Description:** Update user details by user ID.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Request Body:**

```json
{
  "fullName": "Updated Full Name",
  "email": "updated@example.com"
}
```

- **Response:**

```json
{
  "message": "User updated successfully",
  "user": {
    "id": "user_id",
    "email": "updated@example.com",
    "fullName": "Updated Full Name"
  }
}
```

### Upload User Photo

- **URL:** `/api/users/photo`
- **Method:** `POST`
- **Description:** Upload user photo.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Request Body:**
  - `form-data` with `photo` file.
- **Response:**

  ```json
  {
    "message": "Photo uploaded successfully",
    "photoUrl": "url_to_photo"
  }
  ```

### Upload User Resume

- **URL:** `/api/users/resume`
- **Method:** `POST`
- **Description:** Upload user resume.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Request Body:**
  - `form-data` with `resume` file.
- **Response:**

  ```json
  {
    "message": "Resume uploaded successfully",
    "resumeUrl": "url_to_resume"
  }
  ```

## Company

### Create Company

- **URL:** `/api/company`
- **Method:** `POST`
- **Description:** Create a new company.
- **Headers:**

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

- **Request Body:**

  ```json
  {
    "name": "Company Name",
    "description": "Company Description",
    "location": "Company Location"
  }
  ```

- **Response:**

  ```json
  {
    "message": "Company created successfully",
    "company": {
      "id": "company_id",
      "name": "Company Name",
      "description": "Company Description",
      "location": "Company Location"
    }
  }
  ```
