# Task Management API

This repository contains the code for a Task Management API. The API allows users to register, log in, and manage their tasks with features like prioritization, search, filtering, and pagination. Each task is tied to a user and includes various attributes like status, priority, and due date.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [User Authentication](#user-authentication)
  - [Task Management](#task-management)
- [Testing](#testing)
- [Development](#development)
- [License](#license)

## Features

- **User Authentication**: Register and log in to manage tasks.
- **Task Management**: Create, read, update, and delete tasks.
- **Task Prioritization**: Set task priority as low, medium, or high.
- **Task Filtering**: Filter tasks by status and priority.
- **Task Search**: Search tasks by title.
- **Pagination**: Retrieve tasks with pagination.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Installation

#### Install dependencies
- `yarn install`

#### Run tests
- `yarn test`

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mohamedgamalali/task-management-api.git
   cd task-management-api
