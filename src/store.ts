/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const namespace = 'grabid'

export default class Store {
  static getKey (key: string): string {
    return `${namespace}:${key}`
  }

  static getItem (key:string): any {
    return window.localStorage.getItem(this.getKey(key))
  }

  static setItem (key: string, value: any) {
    window.localStorage.setItem(this.getKey(key), value)
  }

  static removeItem (key: string) {
    window.localStorage.removeItem(this.getKey(key))
  }

  static clear () {
    window.localStorage.clear()
  }
}
