# TUMi app _legacy-app_

This is the third version of the TUMi app you know and love, currently the active client at tumi.esn.world.

## Run Locally

Clone the project

```bash
  git clone https://github.com/heddendorp/tumi.git
```

Go to the project directory

```bash
  cd tumi/legacy-app
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn start
```

After this, you are able to work on the app.  
To fetch data you need to have the [server](../server) running on localhost as well.

## Documentation

Relevant documentation for this project is listed below to give you a starting point.

- [Angular docs](https://angular.io/docs)
- [Angular material docs](https://material.angular.io/components/categories)  
  For things like the formfields and some buttons, this is the UI library.
  It would be nice to move further to Tailwind and reduce reliance on this library.
- [Apollo Angular](https://apollo-angular.com/docs/)  
  For data loading and most server commnication.
- [TailwindCSS](https://tailwindcss.com/docs/utility-first)  
  For general styling in the app instead of custom CSS.
