# datagouv-dashboard-moderation

This VueJS project is a boilerplate for a generic independant SPA, in front of an API server serving its specs via swagger json, and authenticating on this API server via an OAuth2 server.

The underneath goal is to simplify the development of client interactions with an API server (here uData/datagouv), and focus on the features and UX instead of constant back-and-forth between frontend/API backend/oauth backend...

This boilerplate is mainly a POC of how to implement two generic packages developped towards that goal : `swag-wrap` and `oauth2-connect`, both compatible as VueJS plugins. Datagouv/uData is used here as an example...

- [`swag-wrap`](https://github.com/co-demos/swag-wrap) allows you to request a whole API server given its swagger documentation (aka tthe swagger JSON url).

- [`oauth2-connect`](https://github.com/co-demos/oauth2-connect) allows you to retrieve an user oauth credentials / token given the specs of an Oauth server.

---

## Needs and constraints 

The list of needs this project aims to answer to is detailled in the [following pad](https://pad.incubateur.net/NFTUu7o-SO-162K7OHthWw#).

---

## Project setup

```bash
cd frontend
# install dependencies
npm install

# copy the dummy env file
cp .envExample .env

# edit your .env file to add your own keys
nano .env
```

_Note_ : you need to have registred your app on the OAuth server **beforehand**, so you could provide your `datagouv-dashboard-moderation` app's `clientId` and other specs to `oauth2-connect` from your `.env` file

---

### Compiles and hot-reloads for development

```bash
cd frontend
npm run serve
```

---

### Compiles and minifies for production

```bash
cd frontend
npm run build
```

### Lints and fixes files

```bash
cd frontend
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
