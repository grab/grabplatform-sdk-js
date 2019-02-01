(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.GrabID = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */
  var OpenIDConfiguration =
  /*#__PURE__*/
  function () {
    function OpenIDConfiguration(authorizationEndpoint, tokenEndpoint, idTokenVerificationEndpoint) {
      _classCallCheck(this, OpenIDConfiguration);

      this.authorizationEndpoint = authorizationEndpoint;
      this.tokenEndpoint = tokenEndpoint;
      this.idTokenVerificationEndpoint = idTokenVerificationEndpoint;
    }

    _createClass(OpenIDConfiguration, null, [{
      key: "fromJSON",
      value: function fromJSON(responseJSON) {
        return new OpenIDConfiguration(responseJSON['authorization_endpoint'], responseJSON['token_endpoint'], responseJSON['id_token_verification_endpoint']);
      }
    }, {
      key: "fetchConfig",
      value: function fetchConfig(openIdUrl) {
        var uri = "".concat(openIdUrl, "/.well-known/openid-configuration");
        var options = {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        };
        return fetch(uri, options).then(function (response) {
          return response.json();
        }).then(function (config) {
          return OpenIDConfiguration.fromJSON(config);
        }).catch(function (error) {
          return console.error('failed to fetch openid configuration from issuer', error);
        });
      }
    }]);

    return OpenIDConfiguration;
  }();

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var core = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory();
  	}
  }(commonjsGlobal, function () {

  	/**
  	 * CryptoJS core components.
  	 */
  	var CryptoJS = CryptoJS || (function (Math, undefined) {
  	    /*
  	     * Local polyfil of Object.create
  	     */
  	    var create = Object.create || (function () {
  	        function F() {}
  	        return function (obj) {
  	            var subtype;

  	            F.prototype = obj;

  	            subtype = new F();

  	            F.prototype = null;

  	            return subtype;
  	        };
  	    }());

  	    /**
  	     * CryptoJS namespace.
  	     */
  	    var C = {};

  	    /**
  	     * Library namespace.
  	     */
  	    var C_lib = C.lib = {};

  	    /**
  	     * Base object for prototypal inheritance.
  	     */
  	    var Base = C_lib.Base = (function () {


  	        return {
  	            /**
  	             * Creates a new object that inherits from this object.
  	             *
  	             * @param {Object} overrides Properties to copy into the new object.
  	             *
  	             * @return {Object} The new object.
  	             *
  	             * @static
  	             *
  	             * @example
  	             *
  	             *     var MyType = CryptoJS.lib.Base.extend({
  	             *         field: 'value',
  	             *
  	             *         method: function () {
  	             *         }
  	             *     });
  	             */
  	            extend: function (overrides) {
  	                // Spawn
  	                var subtype = create(this);

  	                // Augment
  	                if (overrides) {
  	                    subtype.mixIn(overrides);
  	                }

  	                // Create default initializer
  	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
  	                    subtype.init = function () {
  	                        subtype.$super.init.apply(this, arguments);
  	                    };
  	                }

  	                // Initializer's prototype is the subtype object
  	                subtype.init.prototype = subtype;

  	                // Reference supertype
  	                subtype.$super = this;

  	                return subtype;
  	            },

  	            /**
  	             * Extends this object and runs the init method.
  	             * Arguments to create() will be passed to init().
  	             *
  	             * @return {Object} The new object.
  	             *
  	             * @static
  	             *
  	             * @example
  	             *
  	             *     var instance = MyType.create();
  	             */
  	            create: function () {
  	                var instance = this.extend();
  	                instance.init.apply(instance, arguments);

  	                return instance;
  	            },

  	            /**
  	             * Initializes a newly created object.
  	             * Override this method to add some logic when your objects are created.
  	             *
  	             * @example
  	             *
  	             *     var MyType = CryptoJS.lib.Base.extend({
  	             *         init: function () {
  	             *             // ...
  	             *         }
  	             *     });
  	             */
  	            init: function () {
  	            },

  	            /**
  	             * Copies properties into this object.
  	             *
  	             * @param {Object} properties The properties to mix in.
  	             *
  	             * @example
  	             *
  	             *     MyType.mixIn({
  	             *         field: 'value'
  	             *     });
  	             */
  	            mixIn: function (properties) {
  	                for (var propertyName in properties) {
  	                    if (properties.hasOwnProperty(propertyName)) {
  	                        this[propertyName] = properties[propertyName];
  	                    }
  	                }

  	                // IE won't copy toString using the loop above
  	                if (properties.hasOwnProperty('toString')) {
  	                    this.toString = properties.toString;
  	                }
  	            },

  	            /**
  	             * Creates a copy of this object.
  	             *
  	             * @return {Object} The clone.
  	             *
  	             * @example
  	             *
  	             *     var clone = instance.clone();
  	             */
  	            clone: function () {
  	                return this.init.prototype.extend(this);
  	            }
  	        };
  	    }());

  	    /**
  	     * An array of 32-bit words.
  	     *
  	     * @property {Array} words The array of 32-bit words.
  	     * @property {number} sigBytes The number of significant bytes in this word array.
  	     */
  	    var WordArray = C_lib.WordArray = Base.extend({
  	        /**
  	         * Initializes a newly created word array.
  	         *
  	         * @param {Array} words (Optional) An array of 32-bit words.
  	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.lib.WordArray.create();
  	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
  	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
  	         */
  	        init: function (words, sigBytes) {
  	            words = this.words = words || [];

  	            if (sigBytes != undefined) {
  	                this.sigBytes = sigBytes;
  	            } else {
  	                this.sigBytes = words.length * 4;
  	            }
  	        },

  	        /**
  	         * Converts this word array to a string.
  	         *
  	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
  	         *
  	         * @return {string} The stringified word array.
  	         *
  	         * @example
  	         *
  	         *     var string = wordArray + '';
  	         *     var string = wordArray.toString();
  	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
  	         */
  	        toString: function (encoder) {
  	            return (encoder || Hex).stringify(this);
  	        },

  	        /**
  	         * Concatenates a word array to this word array.
  	         *
  	         * @param {WordArray} wordArray The word array to append.
  	         *
  	         * @return {WordArray} This word array.
  	         *
  	         * @example
  	         *
  	         *     wordArray1.concat(wordArray2);
  	         */
  	        concat: function (wordArray) {
  	            // Shortcuts
  	            var thisWords = this.words;
  	            var thatWords = wordArray.words;
  	            var thisSigBytes = this.sigBytes;
  	            var thatSigBytes = wordArray.sigBytes;

  	            // Clamp excess bits
  	            this.clamp();

  	            // Concat
  	            if (thisSigBytes % 4) {
  	                // Copy one byte at a time
  	                for (var i = 0; i < thatSigBytes; i++) {
  	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
  	                }
  	            } else {
  	                // Copy one word at a time
  	                for (var i = 0; i < thatSigBytes; i += 4) {
  	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
  	                }
  	            }
  	            this.sigBytes += thatSigBytes;

  	            // Chainable
  	            return this;
  	        },

  	        /**
  	         * Removes insignificant bits.
  	         *
  	         * @example
  	         *
  	         *     wordArray.clamp();
  	         */
  	        clamp: function () {
  	            // Shortcuts
  	            var words = this.words;
  	            var sigBytes = this.sigBytes;

  	            // Clamp
  	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
  	            words.length = Math.ceil(sigBytes / 4);
  	        },

  	        /**
  	         * Creates a copy of this word array.
  	         *
  	         * @return {WordArray} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = wordArray.clone();
  	         */
  	        clone: function () {
  	            var clone = Base.clone.call(this);
  	            clone.words = this.words.slice(0);

  	            return clone;
  	        },

  	        /**
  	         * Creates a word array filled with random bytes.
  	         *
  	         * @param {number} nBytes The number of random bytes to generate.
  	         *
  	         * @return {WordArray} The random word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
  	         */
  	        random: function (nBytes) {
  	            var words = [];

  	            var r = (function (m_w) {
  	                var m_w = m_w;
  	                var m_z = 0x3ade68b1;
  	                var mask = 0xffffffff;

  	                return function () {
  	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
  	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
  	                    var result = ((m_z << 0x10) + m_w) & mask;
  	                    result /= 0x100000000;
  	                    result += 0.5;
  	                    return result * (Math.random() > .5 ? 1 : -1);
  	                }
  	            });

  	            for (var i = 0, rcache; i < nBytes; i += 4) {
  	                var _r = r((rcache || Math.random()) * 0x100000000);

  	                rcache = _r() * 0x3ade67b7;
  	                words.push((_r() * 0x100000000) | 0);
  	            }

  	            return new WordArray.init(words, nBytes);
  	        }
  	    });

  	    /**
  	     * Encoder namespace.
  	     */
  	    var C_enc = C.enc = {};

  	    /**
  	     * Hex encoding strategy.
  	     */
  	    var Hex = C_enc.Hex = {
  	        /**
  	         * Converts a word array to a hex string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The hex string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;

  	            // Convert
  	            var hexChars = [];
  	            for (var i = 0; i < sigBytes; i++) {
  	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                hexChars.push((bite >>> 4).toString(16));
  	                hexChars.push((bite & 0x0f).toString(16));
  	            }

  	            return hexChars.join('');
  	        },

  	        /**
  	         * Converts a hex string to a word array.
  	         *
  	         * @param {string} hexStr The hex string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
  	         */
  	        parse: function (hexStr) {
  	            // Shortcut
  	            var hexStrLength = hexStr.length;

  	            // Convert
  	            var words = [];
  	            for (var i = 0; i < hexStrLength; i += 2) {
  	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
  	            }

  	            return new WordArray.init(words, hexStrLength / 2);
  	        }
  	    };

  	    /**
  	     * Latin1 encoding strategy.
  	     */
  	    var Latin1 = C_enc.Latin1 = {
  	        /**
  	         * Converts a word array to a Latin1 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The Latin1 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;

  	            // Convert
  	            var latin1Chars = [];
  	            for (var i = 0; i < sigBytes; i++) {
  	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                latin1Chars.push(String.fromCharCode(bite));
  	            }

  	            return latin1Chars.join('');
  	        },

  	        /**
  	         * Converts a Latin1 string to a word array.
  	         *
  	         * @param {string} latin1Str The Latin1 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
  	         */
  	        parse: function (latin1Str) {
  	            // Shortcut
  	            var latin1StrLength = latin1Str.length;

  	            // Convert
  	            var words = [];
  	            for (var i = 0; i < latin1StrLength; i++) {
  	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  	            }

  	            return new WordArray.init(words, latin1StrLength);
  	        }
  	    };

  	    /**
  	     * UTF-8 encoding strategy.
  	     */
  	    var Utf8 = C_enc.Utf8 = {
  	        /**
  	         * Converts a word array to a UTF-8 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The UTF-8 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            try {
  	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
  	            } catch (e) {
  	                throw new Error('Malformed UTF-8 data');
  	            }
  	        },

  	        /**
  	         * Converts a UTF-8 string to a word array.
  	         *
  	         * @param {string} utf8Str The UTF-8 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
  	         */
  	        parse: function (utf8Str) {
  	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  	        }
  	    };

  	    /**
  	     * Abstract buffered block algorithm template.
  	     *
  	     * The property blockSize must be implemented in a concrete subtype.
  	     *
  	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
  	     */
  	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
  	        /**
  	         * Resets this block algorithm's data buffer to its initial state.
  	         *
  	         * @example
  	         *
  	         *     bufferedBlockAlgorithm.reset();
  	         */
  	        reset: function () {
  	            // Initial values
  	            this._data = new WordArray.init();
  	            this._nDataBytes = 0;
  	        },

  	        /**
  	         * Adds new data to this block algorithm's buffer.
  	         *
  	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
  	         *
  	         * @example
  	         *
  	         *     bufferedBlockAlgorithm._append('data');
  	         *     bufferedBlockAlgorithm._append(wordArray);
  	         */
  	        _append: function (data) {
  	            // Convert string to WordArray, else assume WordArray already
  	            if (typeof data == 'string') {
  	                data = Utf8.parse(data);
  	            }

  	            // Append
  	            this._data.concat(data);
  	            this._nDataBytes += data.sigBytes;
  	        },

  	        /**
  	         * Processes available data blocks.
  	         *
  	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
  	         *
  	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
  	         *
  	         * @return {WordArray} The processed data.
  	         *
  	         * @example
  	         *
  	         *     var processedData = bufferedBlockAlgorithm._process();
  	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
  	         */
  	        _process: function (doFlush) {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;
  	            var dataSigBytes = data.sigBytes;
  	            var blockSize = this.blockSize;
  	            var blockSizeBytes = blockSize * 4;

  	            // Count blocks ready
  	            var nBlocksReady = dataSigBytes / blockSizeBytes;
  	            if (doFlush) {
  	                // Round up to include partial blocks
  	                nBlocksReady = Math.ceil(nBlocksReady);
  	            } else {
  	                // Round down to include only full blocks,
  	                // less the number of blocks that must remain in the buffer
  	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
  	            }

  	            // Count words ready
  	            var nWordsReady = nBlocksReady * blockSize;

  	            // Count bytes ready
  	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

  	            // Process blocks
  	            if (nWordsReady) {
  	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
  	                    // Perform concrete-algorithm logic
  	                    this._doProcessBlock(dataWords, offset);
  	                }

  	                // Remove processed words
  	                var processedWords = dataWords.splice(0, nWordsReady);
  	                data.sigBytes -= nBytesReady;
  	            }

  	            // Return processed words
  	            return new WordArray.init(processedWords, nBytesReady);
  	        },

  	        /**
  	         * Creates a copy of this object.
  	         *
  	         * @return {Object} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = bufferedBlockAlgorithm.clone();
  	         */
  	        clone: function () {
  	            var clone = Base.clone.call(this);
  	            clone._data = this._data.clone();

  	            return clone;
  	        },

  	        _minBufferSize: 0
  	    });

  	    /**
  	     * Abstract hasher template.
  	     *
  	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
  	     */
  	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
  	        /**
  	         * Configuration options.
  	         */
  	        cfg: Base.extend(),

  	        /**
  	         * Initializes a newly created hasher.
  	         *
  	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
  	         *
  	         * @example
  	         *
  	         *     var hasher = CryptoJS.algo.SHA256.create();
  	         */
  	        init: function (cfg) {
  	            // Apply config defaults
  	            this.cfg = this.cfg.extend(cfg);

  	            // Set initial values
  	            this.reset();
  	        },

  	        /**
  	         * Resets this hasher to its initial state.
  	         *
  	         * @example
  	         *
  	         *     hasher.reset();
  	         */
  	        reset: function () {
  	            // Reset data buffer
  	            BufferedBlockAlgorithm.reset.call(this);

  	            // Perform concrete-hasher logic
  	            this._doReset();
  	        },

  	        /**
  	         * Updates this hasher with a message.
  	         *
  	         * @param {WordArray|string} messageUpdate The message to append.
  	         *
  	         * @return {Hasher} This hasher.
  	         *
  	         * @example
  	         *
  	         *     hasher.update('message');
  	         *     hasher.update(wordArray);
  	         */
  	        update: function (messageUpdate) {
  	            // Append
  	            this._append(messageUpdate);

  	            // Update the hash
  	            this._process();

  	            // Chainable
  	            return this;
  	        },

  	        /**
  	         * Finalizes the hash computation.
  	         * Note that the finalize operation is effectively a destructive, read-once operation.
  	         *
  	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
  	         *
  	         * @return {WordArray} The hash.
  	         *
  	         * @example
  	         *
  	         *     var hash = hasher.finalize();
  	         *     var hash = hasher.finalize('message');
  	         *     var hash = hasher.finalize(wordArray);
  	         */
  	        finalize: function (messageUpdate) {
  	            // Final message update
  	            if (messageUpdate) {
  	                this._append(messageUpdate);
  	            }

  	            // Perform concrete-hasher logic
  	            var hash = this._doFinalize();

  	            return hash;
  	        },

  	        blockSize: 512/32,

  	        /**
  	         * Creates a shortcut function to a hasher's object interface.
  	         *
  	         * @param {Hasher} hasher The hasher to create a helper for.
  	         *
  	         * @return {Function} The shortcut function.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
  	         */
  	        _createHelper: function (hasher) {
  	            return function (message, cfg) {
  	                return new hasher.init(cfg).finalize(message);
  	            };
  	        },

  	        /**
  	         * Creates a shortcut function to the HMAC's object interface.
  	         *
  	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
  	         *
  	         * @return {Function} The shortcut function.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
  	         */
  	        _createHmacHelper: function (hasher) {
  	            return function (message, key) {
  	                return new C_algo.HMAC.init(hasher, key).finalize(message);
  	            };
  	        }
  	    });

  	    /**
  	     * Algorithm namespace.
  	     */
  	    var C_algo = C.algo = {};

  	    return C;
  	}(Math));


  	return CryptoJS;

  }));
  });

  var sha256 = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function (Math) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var Hasher = C_lib.Hasher;
  	    var C_algo = C.algo;

  	    // Initialization and round constants tables
  	    var H = [];
  	    var K = [];

  	    // Compute constants
  	    (function () {
  	        function isPrime(n) {
  	            var sqrtN = Math.sqrt(n);
  	            for (var factor = 2; factor <= sqrtN; factor++) {
  	                if (!(n % factor)) {
  	                    return false;
  	                }
  	            }

  	            return true;
  	        }

  	        function getFractionalBits(n) {
  	            return ((n - (n | 0)) * 0x100000000) | 0;
  	        }

  	        var n = 2;
  	        var nPrime = 0;
  	        while (nPrime < 64) {
  	            if (isPrime(n)) {
  	                if (nPrime < 8) {
  	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
  	                }
  	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

  	                nPrime++;
  	            }

  	            n++;
  	        }
  	    }());

  	    // Reusable object
  	    var W = [];

  	    /**
  	     * SHA-256 hash algorithm.
  	     */
  	    var SHA256 = C_algo.SHA256 = Hasher.extend({
  	        _doReset: function () {
  	            this._hash = new WordArray.init(H.slice(0));
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Shortcut
  	            var H = this._hash.words;

  	            // Working variables
  	            var a = H[0];
  	            var b = H[1];
  	            var c = H[2];
  	            var d = H[3];
  	            var e = H[4];
  	            var f = H[5];
  	            var g = H[6];
  	            var h = H[7];

  	            // Computation
  	            for (var i = 0; i < 64; i++) {
  	                if (i < 16) {
  	                    W[i] = M[offset + i] | 0;
  	                } else {
  	                    var gamma0x = W[i - 15];
  	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
  	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
  	                                   (gamma0x >>> 3);

  	                    var gamma1x = W[i - 2];
  	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
  	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
  	                                   (gamma1x >>> 10);

  	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
  	                }

  	                var ch  = (e & f) ^ (~e & g);
  	                var maj = (a & b) ^ (a & c) ^ (b & c);

  	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
  	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

  	                var t1 = h + sigma1 + ch + K[i] + W[i];
  	                var t2 = sigma0 + maj;

  	                h = g;
  	                g = f;
  	                f = e;
  	                e = (d + t1) | 0;
  	                d = c;
  	                c = b;
  	                b = a;
  	                a = (t1 + t2) | 0;
  	            }

  	            // Intermediate hash value
  	            H[0] = (H[0] + a) | 0;
  	            H[1] = (H[1] + b) | 0;
  	            H[2] = (H[2] + c) | 0;
  	            H[3] = (H[3] + d) | 0;
  	            H[4] = (H[4] + e) | 0;
  	            H[5] = (H[5] + f) | 0;
  	            H[6] = (H[6] + g) | 0;
  	            H[7] = (H[7] + h) | 0;
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;

  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
  	            data.sigBytes = dataWords.length * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Return final computed hash
  	            return this._hash;
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);
  	            clone._hash = this._hash.clone();

  	            return clone;
  	        }
  	    });

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.SHA256('message');
  	     *     var hash = CryptoJS.SHA256(wordArray);
  	     */
  	    C.SHA256 = Hasher._createHelper(SHA256);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacSHA256(message, key);
  	     */
  	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
  	}(Math));


  	return CryptoJS.SHA256;

  }));
  });

  var encBase64 = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var C_enc = C.enc;

  	    /**
  	     * Base64 encoding strategy.
  	     */
  	    var Base64 = C_enc.Base64 = {
  	        /**
  	         * Converts a word array to a Base64 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The Base64 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;
  	            var map = this._map;

  	            // Clamp excess bits
  	            wordArray.clamp();

  	            // Convert
  	            var base64Chars = [];
  	            for (var i = 0; i < sigBytes; i += 3) {
  	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
  	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
  	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

  	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

  	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
  	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
  	                }
  	            }

  	            // Add padding
  	            var paddingChar = map.charAt(64);
  	            if (paddingChar) {
  	                while (base64Chars.length % 4) {
  	                    base64Chars.push(paddingChar);
  	                }
  	            }

  	            return base64Chars.join('');
  	        },

  	        /**
  	         * Converts a Base64 string to a word array.
  	         *
  	         * @param {string} base64Str The Base64 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
  	         */
  	        parse: function (base64Str) {
  	            // Shortcuts
  	            var base64StrLength = base64Str.length;
  	            var map = this._map;
  	            var reverseMap = this._reverseMap;

  	            if (!reverseMap) {
  	                    reverseMap = this._reverseMap = [];
  	                    for (var j = 0; j < map.length; j++) {
  	                        reverseMap[map.charCodeAt(j)] = j;
  	                    }
  	            }

  	            // Ignore padding
  	            var paddingChar = map.charAt(64);
  	            if (paddingChar) {
  	                var paddingIndex = base64Str.indexOf(paddingChar);
  	                if (paddingIndex !== -1) {
  	                    base64StrLength = paddingIndex;
  	                }
  	            }

  	            // Convert
  	            return parseLoop(base64Str, base64StrLength, reverseMap);

  	        },

  	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  	    };

  	    function parseLoop(base64Str, base64StrLength, reverseMap) {
  	      var words = [];
  	      var nBytes = 0;
  	      for (var i = 0; i < base64StrLength; i++) {
  	          if (i % 4) {
  	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
  	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
  	              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
  	              nBytes++;
  	          }
  	      }
  	      return WordArray.create(words, nBytes);
  	    }
  	}());


  	return CryptoJS.enc.Base64;

  }));
  });

  /**
   * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */
  function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
  function base64URLEncode(str) {
    return str.toString(encBase64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
  function generateCodeVerifier(len) {
    return base64URLEncode(generateRandomString(len));
  }
  function generateCodeChallenge(codeVerifier) {
    return base64URLEncode(sha256(codeVerifier));
  }
  function getParams() {
    var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.search;
    return query.replace(/^\?|#/, '').split('&').reduce(function (json, item) {
      if (item) {
        item = item.split('=').map(function (value) {
          return decodeURIComponent(value);
        });
        json[item[0]] = item[1];
      }

      return json;
    }, {});
  }
  function htmlEncode(html) {
    if (!html) {
      return undefined;
    }

    var anchorNode = document.createElement('a');
    anchorNode.appendChild(document.createTextNode(html));
    return anchorNode.innerHTML;
  }

  /**
   * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */
  var namespace = 'grabid';

  var Store =
  /*#__PURE__*/
  function () {
    function Store() {
      _classCallCheck(this, Store);
    }

    _createClass(Store, null, [{
      key: "getKey",
      value: function getKey(key) {
        return "".concat(namespace, ":").concat(key);
      }
    }, {
      key: "getItem",
      value: function getItem(key) {
        return window.localStorage.getItem(this.getKey(key));
      }
    }, {
      key: "setItem",
      value: function setItem(key, value) {
        window.localStorage.setItem(this.getKey(key), value);
      }
    }, {
      key: "removeItem",
      value: function removeItem(key) {
        window.localStorage.removeItem(this.getKey(key));
      }
    }, {
      key: "clear",
      value: function clear() {
        window.localStorage.clear();
      }
    }]);

    return Store;
  }();

  var nonce = generateRandomString(16);
  var state = generateRandomString(7);
  var codeVerifier = generateCodeVerifier(64);
  var codeChallenge = generateCodeChallenge(codeVerifier);
  var codeChallengeMethod = 'S256';
  var AuthorizationRequestHandler =
  /*#__PURE__*/
  function () {
    function AuthorizationRequestHandler() {
      _classCallCheck(this, AuthorizationRequestHandler);
    }

    _createClass(AuthorizationRequestHandler, [{
      key: "performAuthorizationRequest",
      value: function performAuthorizationRequest(configuration, request) {
        var loginReturnUri = window.location.href;

        if (request.loginReturnUri !== undefined) {
          loginReturnUri = request.loginReturnUri;
        }

        Store.setItem('login_return_uri', loginReturnUri);
        Store.setItem('nonce', nonce);
        Store.setItem('state', state);
        Store.setItem('code_verifier', codeVerifier);
        var requestMap = {
          client_id: request.clientId,
          scope: request.scope,
          response_type: request.responseType,
          redirect_uri: request.redirectUri,
          nonce: nonce,
          state: state,
          code_challenge_method: codeChallengeMethod,
          code_challenge: codeChallenge,
          acr_values: request.acrValues
        };
        var baseUrl = configuration.authorizationEndpoint;
        var params = Object.entries(requestMap).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              val = _ref2[1];

          return "".concat(key, "=").concat(val);
        }).join('&');
        var url = "".concat(baseUrl, "?").concat(params);
        window.location.assign(url);
      }
    }]);

    return AuthorizationRequestHandler;
  }();
  /*
  Defines parameters needed to make an authorization request
  clientId: The Grab Client ID issued to the app developer by Grab.
  redirectUri: The uri that the browser should redirect to after completing authorization. This must be one of the uris registered with Grab and is associated with your Client ID.
  scope: A comma separated list of scopes for which your application is requesting permission.
  responseType: The type of authorization expected in the response. Can be either a token or an access code
  acrValues: Authentication Context Class Reference Values. This provides the context for your request, and the appropriate values will vary based on your use case.
  loginReturnUri: Optional parameter - if provided, will store the provided value in local storage as the login return URI. If absent, window.location.href will be stored as the login return uri
  */

  var AuthorizationRequest = function AuthorizationRequest(clientId, redirectUri, scope, responseType, acrValues, loginReturnUri) {
    _classCallCheck(this, AuthorizationRequest);

    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.scope = scope;
    this.responseType = responseType;
    this.acrValues = acrValues;
    this.loginReturnUri = loginReturnUri;
  };
  Object.defineProperty(AuthorizationRequest, "RESPONSE_TYPE_CODE", {
    enumerable: true,
    writable: true,
    value: 'code'
  });
  Object.defineProperty(AuthorizationRequest, "RESPONSE_TYPE_TOKEN", {
    enumerable: true,
    writable: true,
    value: 'token'
  });

  /**
   * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */
  var TokenRequestHandler =
  /*#__PURE__*/
  function () {
    function TokenRequestHandler() {
      _classCallCheck(this, TokenRequestHandler);
    }

    _createClass(TokenRequestHandler, [{
      key: "performTokenRequest",
      value: function performTokenRequest(configuration, request) {
        var options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(request)
        };
        return fetch(configuration.tokenEndpoint, options).then(function (response) {
          return response.json();
        }).catch(function (error) {
          return console.error('failed to POST token request', error);
        });
      }
    }]);

    return TokenRequestHandler;
  }();
  var TokenRequest =
  /*#__PURE__*/
  function () {
    function TokenRequest(clientId, codeVerifier, grantType, redirectUri, code) {
      _classCallCheck(this, TokenRequest);

      this.clientId = clientId;
      this.codeVerifier = codeVerifier;
      this.grantType = grantType;
      this.redirectUri = redirectUri;
      this.code = code;
    }

    _createClass(TokenRequest, [{
      key: "toJSON",
      value: function toJSON() {
        return {
          client_id: this.clientId,
          code_verifier: this.codeVerifier,
          grant_type: this.grantType,
          redirect_uri: this.redirectUri,
          code: this.code
        };
      }
    }]);

    return TokenRequest;
  }();
  Object.defineProperty(TokenRequest, "GRANT_TYPE_AUTHORIZATION_CODE", {
    enumerable: true,
    writable: true,
    value: 'authorization_code'
  });
  var TokenResponse =
  /*#__PURE__*/
  function () {
    function TokenResponse(accessToken, idToken, tokenType, expiresIn) {
      _classCallCheck(this, TokenResponse);

      this.accessToken = accessToken;
      this.idToken = idToken;
      this.tokenType = tokenType;
      this.expiresIn = expiresIn;
    }

    _createClass(TokenResponse, null, [{
      key: "fromJSON",
      value: function fromJSON(responseJSON) {
        return new TokenResponse(responseJSON['access_token'], responseJSON['id_token'], responseJSON['token_type'], responseJSON['expires_in']);
      }
    }]);

    return TokenResponse;
  }();

  var App =
  /*#__PURE__*/
  function () {
    function App(openIdUrl, appConfig) {
      _classCallCheck(this, App);

      this.openIdUrl = openIdUrl;
      this.clientId = appConfig.clientId;
      this.redirectUri = appConfig.redirectUri;
      this.scope = appConfig.scope;
      this.acrValues = appConfig.acrValues;
      this.authorizationRequestHandler = new AuthorizationRequestHandler();
      this.tokenRequestHandler = new TokenRequestHandler();
      this.openIDConfiguration = undefined;
    }

    _createClass(App, [{
      key: "getOpenIdConfiguration",
      value: function getOpenIdConfiguration() {
        var _this = this;

        return OpenIDConfiguration.fetchConfig(this.openIdUrl).then(function (response) {
          _this.openIDConfiguration = response;
        }).catch(function (error) {
          return console.error('fail to get open id config', error);
        });
      }
    }, {
      key: "makeAuthorizationRequest",
      value: function makeAuthorizationRequest(loginReturnUrl) {
        if (!this.openIDConfiguration) {
          throw new Error('Please fetch OpenID configuration first');
        }

        var authorizationRequest = new AuthorizationRequest(this.clientId, this.redirectUri, this.scope, AuthorizationRequest.RESPONSE_TYPE_CODE, this.acrValues, loginReturnUrl);
        this.authorizationRequestHandler.performAuthorizationRequest(this.openIDConfiguration, authorizationRequest);
      }
    }, {
      key: "makeImplicitAuthorizationRequest",
      value: function makeImplicitAuthorizationRequest(loginReturnUrl) {
        if (!this.openIDConfiguration) {
          throw new Error('Please fetch OpenID configuration first');
        }

        var authorizationRequest = new AuthorizationRequest(this.clientId, this.redirectUri, this.scope, AuthorizationRequest.RESPONSE_TYPE_TOKEN, this.acrValues, loginReturnUrl);
        this.authorizationRequestHandler.performAuthorizationRequest(this.openIDConfiguration, authorizationRequest);
      }
    }, {
      key: "makeTokenRequest",
      value: function makeTokenRequest() {
        if (!this.openIDConfiguration) {
          throw new Error('Please fetch OpenID configuration first');
        }

        var codeVerifier = Store.getItem('code_verifier');
        var code = Store.getItem('code');

        if (!codeVerifier || !code) {
          throw new Error('Please get authorization code first');
        }

        var tokenRequest = new TokenRequest(this.clientId, codeVerifier, TokenRequest.GRANT_TYPE_AUTHORIZATION_CODE, this.redirectUri, code);
        return this.tokenRequestHandler.performTokenRequest(this.openIDConfiguration, tokenRequest).then(function (response) {
          var tokenResponse = TokenResponse.fromJSON(response);
          Store.setItem('access_token', tokenResponse.accessToken);
          Store.setItem('id_token', tokenResponse.idToken);
        });
      }
    }, {
      key: "makeTestEndpointRequest",
      value: function makeTestEndpointRequest() {
        var accessToken = Store.getItem('access_token');
        var uri = 'https://api.stg-myteksi.com/grabid/v1/oauth2/test_res';
        var options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + accessToken
          }
        };
        return fetch(uri, options).then(function (response) {
          return response.json();
        }).catch(function (error) {
          return console.error('failed to make test request', error);
        });
      }
    }], [{
      key: "getLoginReturnURI",
      value: function getLoginReturnURI() {
        return Store.getItem('login_return_uri');
      }
    }, {
      key: "handleAuthorizationCodeFlowResponse",
      value: function handleAuthorizationCodeFlowResponse() {
        var state = Store.getItem('state');
        var params = getParams(window.location.search);

        if (params === null || state !== params['state']) {
          var errorMsg = {
            name: 'code mismatch',
            message: 'This could be caused by multiple browser windows attempting to authenticate to GrabId at the same time'
          };
          throw new Error(JSON.stringify(errorMsg));
        } else if (params['error']) {
          var _errorMsg = {
            name: htmlEncode(params['error']),
            message: htmlEncode(params['error_description'])
          };
          throw new Error(JSON.stringify(_errorMsg));
        } else {
          var code = params['code'];

          if (code) {
            Store.setItem('code', code);
          }
        }
      }
    }, {
      key: "handleImplicitFlowResponse",
      value: function handleImplicitFlowResponse() {
        var state = Store.getItem('state');
        var params = getParams(window.location.hash);

        if (params === null || state !== params['state']) {
          var errorMsg = {
            name: 'code mismatch',
            message: 'This could be caused by multiple browser windows attempting to authenticate to GrabId at the same time'
          };
          throw new Error(JSON.stringify(errorMsg));
        } else if (params['error']) {
          var _errorMsg2 = {
            name: htmlEncode(params['error']),
            message: htmlEncode(params['error_description'])
          };
          throw new Error(JSON.stringify(_errorMsg2));
        } else {
          var accessToken = params['access_token'];

          if (accessToken) {
            Store.setItem('access_token', accessToken);
          }

          var idToken = params['id_token'];

          if (idToken) {
            Store.setItem('id_token', idToken);
          }
        }

        return App.getResult();
      }
    }, {
      key: "getResult",
      value: function getResult() {
        return {
          accessToken: Store.getItem('access_token'),
          codeVerifier: Store.getItem('code_verifier'),
          idToken: Store.getItem('id_token'),
          nonce: Store.getItem('nonce'),
          state: Store.getItem('state')
        };
      }
    }, {
      key: "getGrabUrls",
      value: function getGrabUrls() {
        return {
          STAGING: 'https://api.stg-myteksi.com/grabid/v1/oauth2',
          PRODUCTION: 'https://api.grab.com/grabid/v1/oauth2'
        };
      }
    }]);

    return App;
  }();

  return App;

})));
//# sourceMappingURL=bundle.js.map
