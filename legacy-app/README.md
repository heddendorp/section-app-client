
# ESN (TUMi) App

A modern PWA to manage the events and members of an ESN secion

## Demo

https://tumi.esn.world/events is the running and used instance of this project for the events organized by the ESN TUMi e.V.


## Contributing

Contributions are always welcome!

You can reach me at president@esn-tumi.de if you want to know more about TUMi, this project or what could be done.
Contributions in forms of issues opened here are also very welcome to improve the project.


## Run Locally

Clone the project

```bash
  git clone https://github.com/heddendorp/tumi-app.git
```

Go to the project directory

```bash
  cd tumi-app
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn run start:app
  yarn run start:api
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BLOB_SAS_TOKEN`

`PRODUCT_SAS_TOKEN`

`STORAGE_CONNECTION_STRING`

`STRIPE_WH_SECRET`

`DATABASE_URL`

`STRIPE_KEY`

Of course these can't be published, but if they are needed for development, sandbox keys will do.

