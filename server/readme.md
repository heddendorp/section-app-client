# TUMi server

The backend to the TUMi webservices, handles data access, authentication and webhooks for the TUMi apps except Party Animals.

## Run Locally

Clone the project

```bash
  git clone https://github.com/heddendorp/tumi.git
```

Go to the project directory

```bash
  cd tumi/server
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```

Ther server needs a couple of third party services and environment configuration.
To make things easier, a `docker-compose.yml` is provided that helps you.
You can find the environment config that goes with it in `.env.development`.

### Database

The docker compose file has a postgres set up. You can reset the db in case there are any issues after starting the docker setup.

```bash
  yarn prisma:reset-dev
  yarn prisma:seed-dev
```

These commands bring the db into sync with the schema and seed it.

### issues

Currently the local azure blob storage solution does not work, help is appreciated.

## Documentation

Relevant documentation for this project is listed below to give you a starting point.

- [Prisma](https://www.prisma.io/docs/)
  For database access
- [nexus prisma](https://nexus.prisma.io/)
  To generate GraphQL types from prisma
- [nexus](https://nexusjs.org/docs/)
  Code first GraphQL schema library

## Roadmap

- Replace nexus and nexus prisma with [pothos](https://pothos-graphql.dev/)
