### Installation and setup

Create a `.env` file in the project root:

`.env`:

```
FAUNA_DB_URI=https://graphql.fauna.com/graphql
# Fauna db key with server role
FAUNA_SERVER_KEY=

# Google OAuth client id and client secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# JWT secret and private key
JWT_SECRET=
JWT_SIGNING_PRIVATE_KEY=

# See the next-auth documentation for this variable in production
NEXTAUTH_URL=http://localhost:3000
```

### Setup FaunaDB

TODO

### Run local dev environment

#### Install dependencies

```bash
> npm install
```

#### Generate graphQL schema and documents with

```bash
> npm run generate
```

#### Start dev server

```bash
> npm run dev
```

### TODO

-[ ] Cookie-banner / GDPR -[ ] Remove noindex header -[ ] Communicate input errors on timeslots -[ ] Period report view -[ ] Apply user default settings to new periods -[ ] Setup/Migration scripts for faunaDB
