/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { generateCodeChallenge, generateCodeVerifier, generateRandomString } from './utils'
import Store from './store'
import { OpenIDConfiguration } from './open_id_configuration';

const nonce = generateRandomString(16)
const state = generateRandomString(7)
const codeVerifier = generateCodeVerifier(64)
const codeChallenge = generateCodeChallenge(codeVerifier)
const codeChallengeMethod = 'S256'

export class AuthorizationRequestHandler {
  performAuthorizationRequest (configuration: OpenIDConfiguration, request: AuthorizationRequest): void {
    let loginReturnUri = window.location.href
    if (request.loginReturnUri !== undefined) {
      loginReturnUri = request.loginReturnUri
    }
    Store.setItem('login_return_uri', loginReturnUri)
    Store.setItem('nonce', nonce)
    Store.setItem('state', state)
    Store.setItem('code_verifier', codeVerifier)

    let requestMap: any = {
      client_id: request.clientId,
      scope: request.scope,
      response_type: request.responseType,
      redirect_uri: request.redirectUri,
      nonce: nonce,
      state: state,
      code_challenge_method: codeChallengeMethod,
      code_challenge: codeChallenge,
      acr_values: request.acrValues,
      id_token_hint: request.id_token_hint,
    }

    if (request.request) {
      requestMap.request = request.request;
    }

    let baseUrl = configuration.authorizationEndpoint
    let params = Object.keys(requestMap).map(key => `${key}=${requestMap[key]}`).join('&')

    let url = `${baseUrl}?${params}`

    window.location.assign(url)
  }
}

/*
Defines parameters needed to make an authorization request
clientId: The Grab Client ID issued to the app developer by Grab.
redirectUri: The uri that the browser should redirect to after completing authorization. This must be one of the uris registered with Grab and is associated with your Client ID.
scope: A comma separated list of scopes for which your application is requesting permission.
responseType: The type of authorization expected in the response. Can be either a token or an access code
acrValues: Authentication Context Class Reference Values. This provides the context for your request, and the appropriate values will vary based on your use case.
loginReturnUri: Optional parameter - if provided, will store the provided value in local storage as the login return URI. If absent, window.location.href will be stored as the login return uri
*/
export class AuthorizationRequest {
  static RESPONSE_TYPE_CODE = 'code'
  static RESPONSE_TYPE_TOKEN = 'token'

  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
  acrValues: string;
  loginReturnUri: string;
  id_token_hint: string;
  request: string;

  constructor (
    clientId: string,
    redirectUri: string,
    scope: string,
    responseType: string,
    acrValues: string,
    loginReturnUri: string,
    id_token_hint?: string,
    request?: string
  ) {
    this.clientId = clientId
    this.redirectUri = redirectUri
    this.scope = scope
    this.responseType = responseType
    this.acrValues = acrValues
    this.loginReturnUri = loginReturnUri
    this.id_token_hint = id_token_hint
    this.request = request
  }
}
