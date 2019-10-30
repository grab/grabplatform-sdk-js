# GrabID OAuth2 Javascript library

Client side Javascript SDK for communicating with GrabID OAuth2.0.

## Install

#### NPM

Public release

`npm i @grab-id/grab-id-client`

#### CDN

`https://unpkg.com/@grab-id/grab-id-client/dist/bundle.js`

## Getting Started - Instantiating the Grab ID Client

```javascript
const openIdUrl = GrabID.GrabPartnerUrls.PRODUCTION;

let appConfig = {
  clientId: '08044981144746ec80a870c605fe705b',
  redirectUri: 'https://public.grab.com/app/redirect.html',
  scope: ['openid', 'gid_test_scope_1', 'gid_test_scope_2', 'gid_test_scope_3'].join(' '),
  acrValues: {
    service: 'PASSENGER',
    consentContext: {
      countryCode: 'SG'
    }
  },
}

let grabIdClient = new GrabID(openIdUrl, appConfig)
```
Required Parameters: openIdUrl, appConfig

openIdUrl: The URL used to fetch authorization configuration. Most of the time, you will use either STAGING or PRODUCTION from the GrabPartnerUrls constants imported with GrabID.

appConfig: Defines parameters needed to make an authorization request

- clientId: The Grab Client ID issued to the app developer by Grab.
- redirectUri: The uri that the browser should redirect to after completing authorization. This must be one of the uris registered with Grab and is associated with your Client ID.
- scope: A comma separated list of scopes for which your application is requesting permission.
- request: A string that can be passed in to provide additional claims for your request. For the purposes of this SDK, it is an opaque string, but you are responsible for constructing your claims appropriately and stringifying it. For a full explanation of the request parameter, you can refer to the [official RFC](https://openid.net/specs/openid-connect-core-1_0.html#RequestObject). For many users who are implementing GrabPay flows, this parameter will take in the JWT that you get back from GrabPay APIs. Documentation for those APIs can be found here: [One Time Payment](https://developer.grab.com/assets/docs/grab-pay/GrabPay_One_time_Payments_Integration_Guide.pdf) and [Tokenised Payments Integration Guide](https://developer.grab.com/assets/docs/grab-pay/GrabPay_Tokenised_Payments_Integration_Guide.pdf).
- login_hint: A string that can be passed in to modify the login flow by pre-filling certain information for the user (if the user is known to Grab). This string will be provided to you through a separate API if it is appropriate for your scenario.
- ui_locales: A string that can be passed in to override the language shown during authentication flows. ui_locales can be any of the languages currently supported by Grab (currently en (English), id (Indonesian), km (Khmer/Cambodian), ms (Malaysian), my (Burmese), th (Thai) , vi (Vietnamese), or zh (Simplified Chinese)).
- acrValues: Authentication Context Class Reference Values. This provides the context for your request, and the appropriate values will vary based on your use case. Can be either a space separated string of values or an AcrValues object:

```javascript
interface AcrValues {
  service?: string,
  consentContext?: {
    countryCode?: string,
    currency?: string,
    [x: string]: string,
  },
  additionalValues?: {
    [x: string]: string
  }
}
```

## Authentication Flows

Full example please refer [here](./app/index.html)

###  Authorization Code Flow

#### Step 1 - Make Authorization Request

This code should be triggered when the user wants to log in using their grab credentials. Note that you are not collecting any information from the user - Grab will take care of authorizing the user and consent to any permissions you specify.

```javascript
grabIdClient.makeAuthorizationRequest()
```
makeAuthorizationRequest
Required Parameters: None
Optional Parameters: loginReturnUri, id_token_hint

loginReturnUri: After the Grab authorization endpoint successfully authenticates the request, this value can be fetched on your redirect page via GrabID.getLoginReturnURI. If not provided, loginReturnUri defaults to the page the login request originated from.

id_token_hint: You can pass in an ID token here if one has been provided to you.

#### Step 2 - Receive and process results of Authorization Request

Once the authorization request has successfully completed, the user will be redirected to the redirectUri you specified when instantiating the GrabID client. This should be a dedicated [redirect page](./app/redirect.html). There are a couple important things you need to do here:

```javascript
let returnUri = GrabID.getLoginReturnURI();
GrabID.handleAuthorizationCodeFlowResponse()
window.location.assign(returnUri)
```

First, you need to make sure that the authorization was successful. GrabID.handleAuthorizationCodeFlowResponse will process all of the values that came back from the authorization request and ensure that the user is logged in and has provided the appropriate consent.

Next, you need to redirect the user to the appropriate page/route on your site. GrabID.getLoginReturnURI will provide the value, and then you need to route the user appropriately. In the case of our example, we use a simple window.location.assign to redirect the user manually.

## IMPORTANT

Make sure you handle the negative case, too! If the user failed to authenticate or failed to provide consent, you will need to handle that here. Refer to the sample [redirect page](./app/redirect.html) to see an example of how to handle failed authentication requests.

#### Step 4 - Perform Authorized Operations

Now that the user has been authorized, you can fetch an access token and use it to make requests against endpoints that require authorization. There are two tools we'll need to use here: makeTokenRequest and GrabID.getResult.

Make Token Request

```javascript
grabIdClient.makeTokenRequest()
  .then(() => {prettyPrint(GrabID.getResult())})
  .catch(error => alert(error.toString()))
```
makeTokenRequest - This will make a request to the Grab ID endpoint to retrieve an access token that you can use to make authorized requests. Note that this call doesn't return anything you can act on directly. To actually get your token, you'll need to call:

GrabID.getResult - This returns all of the information you need to make authorized requests against an endpoint, as well as the information needed to confirm a user's identity with Grab ID servers. Returns a response with the following information:

- accessToken: This token is what you'll use to make requests against endpoints that require authorization. If this is undefined or null, you need to call makeTokenRequest!
- codeVerifier: Used when making token requests
- idToken: Token that can be used to verify the identity of the user
- nonce: Number used once. A unique, random string used to uniquely identify the request
- state: Unique string used to verify that the session originating the request and the session receiving the authorization are the same

The only one you'll need to make a request is the accessToken.

Example of accessing an authorized endpoint (in this case the Grab ID endpoint to get user information):

```javascript
this.grabClient.makeTokenRequest()
  .then(() => {
    let tokenResult = GrabID.getResult();
    window.fetch("https://grab.api.com/grabid/v1/oauth2/userinfo", {
      method: 'GET',
      headers: {
        'Accept-Content': 'application/json; charset=utf-8',
        Authorization: "Bearer " + tokenResult.accessToken,
      },
      mode: 'cors',
    })
    .then((response) => { 
      response.json().then((userInfo) => {
        this.setState({
          userName: userInfo.name,
          userEmail: userInfo.email,
        });
      });
    })
  })
```

### Implicit Flow

#### Step 1 - Make Implicit Authorization Request

This code should be triggered when the user wants to log in using their grab credentials. Note that you are not collecting any information from the user - Grab will take care of authorizing the user and consent to any permissions you specify.

```javascript
grabIdClient.makeImplicitAuthorizationRequest()
```
makeImplicitAuthorizationRequest
Required Parameters: None
Optional Parameters: loginReturnUri, id_token_hint

loginReturnUri: After the Grab authorization endpoint successfully authenticates the request, this value can be fetched on your redirect page via GrabID.getLoginReturnURI. If not provided, loginReturnUri defaults to the page the login request originated from.

id_token_hint: You can pass in an ID token here if one has been provided to you.

#### Step 2 - Receive and process results of authorization request

Once the authorization request has successfully completed, the user will be redirected to the redirectUri you specified when instantiating the GrabID client. This should be a dedicated [redirect page](./app/redirect.html). There are a couple important things you need to do here:

```javascript
let returnUri = GrabID.getLoginReturnURI();
GrabID.handleImplicitFlowResponse()
window.location.assign(returnUri)
```

First, you need to make sure that the authorization was successful. GrabID.handleImplicitFlowResponse will process all of the values that came back from the authorization request and ensure that the user is logged in and has provided the appropriate consent.

Next, you need to redirect the user to the appropriate page/route on your site. GrabID.getLoginReturnURI will provide the value, and then you need to route the user appropriately. In the case of our example, we use a simple window.location.assign to redirect the user manually.

## IMPORTANT

Make sure you handle the negative case, too! If the user failed to authenticate or failed to provide consent, you will need to handle that here. Refer to the sample [redirect page](./app/redirect.html) to see an example of how to handle failed authentication requests.

#### Step 3 - Perform authorized operations

In the implicit flow, there's a little less work needed to make calls to an endpoint that requires authorization.

```javascript
let tokenResult = GrabID.getResult();
window.fetch("https://grab.api.com/grabid/v1/oauth2/userinfo", {
  method: 'GET',
  headers: {
    'Accept-Content': 'application/json; charset=utf-8',
    Authorization: "Bearer " + tokenResult.accessToken,
  },
  mode: 'cors',
})
.then((response) => { 
  response.json().then((userInfo) => {
    this.setState({
      userName: userInfo.name,
      userEmail: userInfo.email,
    });
  });
})
```

Note that this is very similar to the auhorization flow, but we did not have to make an additional call to get a token. That's because the implicit flow directly returns a token that you can use to make requests instead of an access code that you exchange for a token.

## Which to use - Authorization Code Flow or Implicit Flow?

Unless you have a specific use case that requires you to use the Implicit flow, we highly recommend using the Authorization code flow. It does require a little more code to function, but it is also much more secure. Because the user must exchange an authorization code for an access token, it gives another layer of security.

## License

[MIT licensed](./LICENSE)