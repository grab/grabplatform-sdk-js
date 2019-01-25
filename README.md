# GrabID OAuth2 Javascript library

Client side Javascript SDK for communicating with GrabID OAuth2.0.

### Install

##### NPM

Public release

`npm i @grab-id/grab-id-client`

##### CDN

`https://unpkg.com/@grab-id/grab-id-client/dist/bundle.js`

### Authentication Flows

Full example please refer [here](./app/index.html)

#####  Authorization Code Flow

Make Authorization Request

```javascript
application.getOpenIdConfiguration()
  .then(() => {
    application.makeAuthorizationRequest()
  })
  .catch(error => alert(error.toString()))
```

Make Token Request

```javascript
application.getOpenIdConfiguration()
  .then(() => {
    application.makeTokenRequest()
      .then(() => {prettyPrint(GrabID.getResult())})
      .catch(error => alert(error.toString()))
  })
  .catch(error => alert(error.toString()))
```

##### Implicit Flow

Make Implicit Authorization Request

```javascript
application.getOpenIdConfiguration()
  .then(() => {
    application.makeImplicitAuthorizationRequest()
  })
  .catch(error => alert(error.toString()))
```

### License

[MIT licensed](./LICENSE)