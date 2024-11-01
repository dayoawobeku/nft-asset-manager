# NFT Asset Manager

## Overview

NFT Asset Manager is a web application that allows users to manage, transfer,
and track the history of their NFT assets. Built with Next.js, tRPC, and
Supabase, this project provides a robust and scalable solution for NFT
management.

## Features

- User authentication
- NFT asset creation and management
- Asset transfer between users
- Transaction history tracking
- Search and filter functionality for assets

## Tech Stack

- Frontend: Next.js 14, React, Tailwind CSS, shadcn/ui
- Backend: fastify, tRPC, Supabase
- Database: PostgreSQL (via Supabase)
- Authentication: Supabase Auth

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- Supabase CLI
- Git

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nft-asset-manager.git
cd nft-asset-manager
```

### 2. Install all dependencies

To install all dependencies across the root, frontend, and backend folders, run
the following command:

```bash
npm install-all
```

### 3. Set up Supabase

a. Install Supabase CLI (if not already installed):

```bash
npm install -g supabase
```

b. Initialize Supabase project:

```bash
supabase init
```

c. Start local Supabase instance:

```bash
supabase start
```

d. Apply database migrations:

```bash
supabase db reset
```

### 4. Environment Variables

Both [frontend](./frontend/.env.example) and [backend](./backend/.env.example)
have their own .env.example files. Navigate to each and create a .env.local with
the necessary values.

Copy the `.env.example` file to `.env.local` and fill in the necessary values:

```bash
cp .env.example .env.local
```

Update both `.env` files with your Supabase project's URL and anon key. Update
the backend env file with your cloudinary details (this is necessary for
creating an asset).

### 5. Run the development server

To start both the frontend and backend servers, run the following command in the
root:

```bash
npm run start
```

The frontend application should now be running on `http://localhost:3000` and
the backend application should now be running on `http://localhost:3001`

## Database Migrations and Functions

All database migrations and functions are stored in the `supabase/migrations`
folder. To apply these migrations to your local Supabase instance, run:

```bash
supabase db reset
```

This command will reset your local database and apply all migrations in the
correct order.

## SQL Queries

For better organization and version control of SQL queries, we've created a
dedicated folder:

`backend / db / sql`

These SQL files contain the queries used in the application, including table
creation, function definitions, and complex queries. To use these in your local
Supabase instance, you can copy and paste the contents into the Supabase SQL
editor or include them in your migration files.
