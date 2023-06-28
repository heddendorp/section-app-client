# MESA app (forked from TUMi app)

### OR: the ESN section app

A web application to help ESN sections manage themselves, their events and payments.
Includes loads of features very specific to ESN sections and is open for anyone to be used.
<!--
## Contributing

To find something to work on it's recommended to check the [issues](https://github.com/heddendorp/tumi/issues) and look
at the **Good first issue** tag.

### Commits

This repository follows the [conventional commits](https://conventionalcommits.org/). Please make sure to work you commit
messages according to the guidelines.
-->
## Compose setup (Production)
Using [Docker Compose](https://docs.docker.com/compose/) has worked well so far, because it takes care of dependencies and linking the Database.
Recommended to use Docker Desktop to run it locally.
### Clone the project
```bash
  git clone https://github.com/ESN-MESA/MESAapp
    cd MESAapp
```
### Run the server
```bash
  docker-compose up
```
You can add the `-d` flag to run it in the background.
In that case use `docker-compose stop` to stop it.
Client will be on localhost 4000
When making changes rebuild the image with
```bash
  docker-compose up --build
```
(necessary to make sure changes are applied)
Below is the old setup, which is still useful for development. (Might be outdated)
## Local setup

Follow this guide to get the project up and running on your local machine.

Clone the project
```bash
  git clone https://github.com/ESN-MESA/MESAapp
  cd app
  # Install all dependencies
  yarn install
```

### Run the client

Go to the project directory

```bash
  cd legacy-app
```

#### Without local server (for frontend only)

This uses the server running on `server.esn.world` which is also used by the live version.

```bash
  yarn dev:light
```

If you need changes in the server and don't want to implement them yourself server you can line
out what the API should return for you feature and open an issue.

#### With local server

To fetch data you need to have the **server** running on localhost as well.

```bash
  yarn dev
```

### Run the server

The server requires a running instance of Postgres. You can use docker to run it:

```bash
docker run --name tumi-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

To intialize or reset the database run the following commands:
```bash
cd server
yarn prisma:reset-dev
```
This command will drop the entire database and re-create it with the latest schema and seed data.   
If you want to inspect the data in the database run the following command:
```bash
yarn prisma:studio-dev
```

Then you can run the server with:
```bash
cd server
yarn install
yarn dev
```

### Test accounts
You can sign up with any personal email address. However, if you want to use the test accounts, you can use the following credentials:
#### Admin
email: `test1@esn.world`   
password: `testuser1!`

#### Section member
email: `test2@esn.world`   
password: `testuser2!`

**Watch out**: sometimes it is surprisingly hard to log out of the app, make sure to clear the entire application storage in you dev tools and log out form [tumi.esn.world](https://tumi.esn.world/profile) if your users seems to get stuck.

## Projects

As this repo is based on yarn workspaces you can find additional information in the folders for the specific projects.

### What's on `tumi.esn.world`

#### [Legacy App](./legacy-app/README.md)

Check this out for the frontend application that is currently the _TUMi app_. You can also learn more about the features and usage here.

#### [Server](./server/README.md)

The server used for data access.

## Tech Stack

### TUMi Apps (Legacy app + events)

**Client:** Angular, Apollo Angular, Angular Material, TailwindCSS

### Server

**Server:** Node, Express, Graphql Yoga, Prisma, pothos-graphql

### Authentication

All the authentication is done with [Auth0](https://auth0.com/docs).
