/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export class TokenRequestHandler {
  performTokenRequest (configuration, request) {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(request)
    }

    return fetch(configuration.tokenEndpoint, options)
      .then(response => response.json())
      .catch(error => console.error('failed to POST token request', error))
  }
}

export class TokenRequest {
    static GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';

    constructor (
      clientId,
      codeVerifier,
      grantType,
      redirectUri,
      code
    ) {
      this.clientId = clientId
      this.codeVerifier = codeVerifier
      this.grantType = grantType
      this.redirectUri = redirectUri
      this.code = code
    }

    toJSON () {
      return {
        client_id: this.clientId,
        code_verifier: this.codeVerifier,
        grant_type: this.grantType,
        redirect_uri: this.redirectUri,
        code: this.code
      }
    }
}

export class TokenResponse {
  constructor (accessToken, idToken, tokenType, expiresIn) {
    this.accessToken = accessToken
    this.idToken = idToken
    this.tokenType = tokenType
    this.expiresIn = expiresIn
  }

  static fromJSON (responseJSON) {
    return new TokenResponse(
      responseJSON['access_token'],
      responseJSON['id_token'],
      responseJSON['token_type'],
      responseJSON['expires_in']
    )
  }
}
