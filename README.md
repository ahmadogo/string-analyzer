🧠 String Analyzer API (HNG Stage 1 – Backend Wizards)

A RESTful API built with NestJS + TypeORM + PostgreSQL that analyzes strings and stores their computed properties.

## Features

Analyze any string and compute:

    length
    is_palindrome
    unique_characters
    word_count
    sha256_hash
    character_frequency_map
    Fetch all analyzed strings with filters
    Natural-language search (e.g., “strings longer than 10 characters”)
    Retrieve or delete specific strings

---

## Tech Stack

---

** Backend: NestJS (TypeScript)
** Database: PostgreSQL (TypeORM)
** Environment: Node.js 18+
** Hashing: crypto (SHA-256)

## Setup Instructions

1️⃣ Clone Repository
git clone https://github.com/<your-username>/string-analyzer.git
cd string-analyzer

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file in the root directory:

DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
PORT=3000

4️⃣ Run Migrations (Optional)
npm run build
npm run typeorm migration:run

5️⃣ Start Server
npm run start:dev

Server runs at → http://localhost:3000

## Endpoints

1. Analyze String

POST /strings
Content-Type: application/json
{
"value": "this is a longer test string"
}

Response 201:
{
"id": "sha256_hash",
"value": "madam",
"properties": {
"length": 5,
"is_palindrome": true,
"unique_characters": 3,
"word_count": 1,
"sha256_hash": "...",
"character_frequency_map": { "m":2, "a":2, "d":1 }
},
"created_at": "2025-10-21T12:00:00Z"
}

2. Get Specific String
   GET /strings/{value}

3. Get All Strings (with filters)
   GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=1&contains_character=a

4. Natural-Language Filtering
   GET /strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters

5. Delete String
   DELETE /strings/{value}

## Example Natural Language Queries

Query Parsed Filters
all single word palindromic strings { word_count: 1, is_palindrome: true }
strings longer than 10 characters { min_length: 11 }
strings containing the letter z { contains_character: "z" }
palindromic strings that contain the first vowel { is_palindrome: true, contains_character: "a" }
🛠️ Developer Notes

    -- Each string’s hash is its unique ID.
    -- Duplicate strings return 409 Conflict.
    -- Invalid or missing fields return 400 / 422.
    -- Uses @CreateDateColumn for UTC timestamps.

## Deployment (Recommended)

You can deploy on Railway or Render (PostgreSQL add-on).
After deployment, ensure /strings and /strings/filter-by-natural-language are publicly accessible.

## Author

Ahmad Abdulkareem
abdulkareemahmad@gmail.com

🧱 Stack: NestJS / TypeScript / PostgreSQL
