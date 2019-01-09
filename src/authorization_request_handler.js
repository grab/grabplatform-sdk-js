/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { generateCodeChallenge, generateCodeVerifier, generateRandomString } from './utils'
import Store from './store'

const nonce = generateRandomString(16)
const state = generateRandomString(7)
const codeVerifier = generateCodeVerifier(64)
const codeChallenge = generateCodeChallenge(codeVerifier)
const codeChallengeMethod = 'S256'

export class AuthorizationRequestHandler {
  performAuthorizationRequest (configuration, request) {
    Store.setItem('login_return_uri', window.location.href)
    Store.setItem('nonce', nonce)
    Store.setItem('state', state)
    Store.setItem('code_verifier', codeVerifier)

    let requestMap = {
      client_id: request.clientId,
      scope: request.scope,
      response_type: request.responseType,
      redirect_uri: request.redirectUri,
      nonce: nonce,
      state: state,
      code_challenge_method: codeChallengeMethod,
      code_challenge: codeChallenge,
      acr_values: request.acrValues
    }

    let baseUrl = configuration.authorizationEndpoint
    let params = Object.entries(requestMap).map(([key, val]) => `${key}=${val}`).join('&')

    let url = `${baseUrl}?${params}`

    window.location.assign(url)
  }
}

export class AuthorizationRequest {
  static RESPONSE_TYPE_CODE = 'code'
  static RESPONSE_TYPE_TOKEN = 'token'

  constructor (
    clientId,
    redirectUri,
    scope,
    responseType,
    acrValues
  ) {
    this.clientId = clientId
    this.redirectUri = redirectUri
    this.scope = scope
    this.responseType = responseType
    this.acrValues = acrValues
  }
}
