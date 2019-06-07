
## Cenit Admin

This is a React application for the administration of a Cenit Platform istance. The current state is very early.
Fallow these instructions to configure a local instance of Cenit and connect it as a backend for the app.

### Configuring the Backed

1. By default the Admin App runs listening the port `3000` therefore the local instance of Cenit should runs listening a different one.
By default the App expect Cenit is listening the port `3001`, so launch Cenit listening the port `3001`.

2. The React Admin App has a backend app in Cenit that should be configure. To do that just import the `adminCollection.json`
file content as a **collection** by using the **pull import** action.

3. Once the Admin Collection is successfully pulled into a Cenit tenant go to the **Application** model and make sure to configure
the backend app (**Admin | App**) as fallows.

    - Execute the **Configure** action for the app and add the React Admin App URI `http://localhost:3000` in the `redirect_uris`.
    This configuration is also included in the `adminCollection.json` file but make sure it's configured properly.
    
    - Execute the **Regist** action for the app and assign it the slug `admin`. The values for the rest of the fields are not important
    but the default configuration of the React Admin App expect the slug of the backed app to be `admin`.   

And that's all!

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**DO NOT DO THAT**
