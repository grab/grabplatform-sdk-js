import { OpenIDConfiguration } from "./open_id_configuration";

/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export class TokenRequestHandler {
  async performTokenRequest (configuration: OpenIDConfiguration, request: TokenRequest): Promise<any> {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(request)
    }

    try {
      const response = await fetch(configuration.tokenEndpoint, options);
      return await response.json();
    }
    catch (error) {
      console.error('failed to POST token request', error);
    }
  }
}

export class TokenRequest {
    static GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';

    clientId: string;
    codeVerifier: string;
    grantType: string;
    redirectUri: string;
    code: string;

    constructor (
      clientId: string,
      codeVerifier: string,
      grantType: string,
      redirectUri: string,
      code: string
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
  accessToken: string;
  idToken: string;
  tokenType: string;
  expiresIn: string;

  constructor (accessToken: string, idToken: string, tokenType: string, expiresIn: string) {
    this.accessToken = accessToken
    this.idToken = idToken
    this.tokenType = tokenType
    this.expiresIn = expiresIn
  }

  static fromJSON (responseJSON: Object) {
    return new TokenResponse(
      responseJSON['access_token'],
      responseJSON['id_token'],
      responseJSON['token_type'],
      responseJSON['expires_in']
    )
  }
}
