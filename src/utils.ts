/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import { WordArray } from 'crypto-js';

export function generateRandomString (length: number): string {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export function base64URLEncode (str: string | WordArray): string {
  return str.toString(Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function generateCodeVerifier (len: number): string {
  return base64URLEncode(generateRandomString(len))
}

export function generateCodeChallenge (codeVerifier: string): string {
  return base64URLEncode(sha256(codeVerifier))
}

export function getParams (query = window.location.search) {
  return query.replace(/^\?|#/, '').split('&').reduce((json, item) => {
    if (item) {
      const splitItem = item.split('=').map((value) => decodeURIComponent(value))
      json[splitItem[0]] = splitItem[1]
    }
    return json
  }, {})
}

export function htmlEncode (html: string) {
  if (!html) {
    return undefined
  }
  var anchorNode = document.createElement('a')
  anchorNode.appendChild(document.createTextNode(html))
  return anchorNode.innerHTML
}
