[![Build Docker for the legacy app](https://github.com/heddendorp/tumi/actions/workflows/publish-legacy-app.yml/badge.svg)](https://github.com/heddendorp/tumi/actions/workflows/publish-legacy-app.yml) [![Deploy preview of legacy app](https://github.com/heddendorp/tumi/actions/workflows/preview-legacy-app.yml/badge.svg)](https://github.com/heddendorp/tumi/actions/workflows/preview-legacy-app.yml) [![Build Docker for Server](https://github.com/heddendorp/tumi/actions/workflows/publish-server.yml/badge.svg)](https://github.com/heddendorp/tumi/actions/workflows/publish-server.yml)

# ESN TUMi

The main repository of the webservice that make TUMi work the way it does.
The main code for the TUMi app can be found here together with some other projects like the website for Party Animals.
Additionally, there is a new serverside rendered version of the TUMi app and a small projects for experiments.

## Contributing

To find something to work on it's recommended to check the [issues](https://github.com/heddendorp/tumi/issues) and look
at the **Good first issue** tag.

### Commits

This repository follows the [conventional commits](https://conventionalcommits.org/). Please make sure to work you commit
messages according to the guidelines.

## Projects

As this repo is based on yarn workspaces you can find additional information in the folders for the specific projects.

### What's on `tumi.esn.world`

#### [Legacy App](./legacy-app/README.md)

Check this out for the frontend application that is currently the _TUMi app_. You can also learn more about the features and usage here.

#### [Server](./server/README.md)

The server used by all projects but Party Animals for data access

### [Events App](./events)

### [Experiments](./experiments)

### [Party Animals](./party-animals)

## Tech Stack

### TUMi Apps (Legacy app + events)

**Client:** Angular, Apollo Angular, Angular Material, TailwindCSS

### Server

**Server:** Node, Express, Graphql Yoga, Prisma, Nexus

### Party Animals

Here there is no specific difference betweeen server and client,
it is built on remix which is based on react.
Also in play is prisma for db connection.

### Experiments

**Client:** Angular, Apollo Angular, TailwindCSS

### Authentication

All the authentication is done with [Auth0](https://auth0.com/docs).
