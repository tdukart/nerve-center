/**
 * Creates a new NerveCenter.
 * @returns {NerveCenter}
 * @constructor
 */
var NerveCenter = function () {
	this._subscriptions = {};
	this._dataFormats = {};
	this._data = {};

	return this;
};

/**
 * Splits a channel name.
 * @param {string} channelName
 * @returns {{ns: string, name:string}}
 * @private
 * @ignore
 */
var splitChannelName = function ( channelName ) {
	var subscriptionSplit = /(?:([a-z0-9-_]*)\.)?([a-z0-9-_]*)/i.exec( channelName );

	if ( subscriptionSplit[ 0 ] !== channelName ) {
		throw new Error( 'Invalid channel name' );
	}

	return {
		ns  : subscriptionSplit[ 1 ],
		name: subscriptionSplit[ 2 ]
	};
};

/**
 * Subscribe to a channel.
 *
 * Call this method with a channel name, which can be namespaced. (It's recommended that all subscriptions be
 * namespaced.) When a message is broadcast, the handler will be called with the channel name and message.
 *
 * @param {string} channelName Channel name. Can be namespaced as such: "namespace.channelName"
 * @param {function(string, {})} handler Handler.
 */
NerveCenter.prototype.subscribe = function ( channelName, handler ) {
	var subscription = splitChannelName( channelName );

	this._subscriptions[ subscription.name ] = this._subscriptions[ subscription.name ] || {};
	this._subscriptions[ subscription.name ][ subscription.ns ] =
		this._subscriptions[ subscription.name ][ subscription.ns ] || [];
	this._subscriptions[ subscription.name ][ subscription.ns ].push( handler );
};

/**
 * Unsubscribe from a channel.
 *
 * Call this method with a channel name, which can be namespaced. If you namespaced the channel while subscribing, it's
 * recommended that you use the same namespace here, to avoid unsubscribing other listeners. You may also pass the
 * handler to unsubscribe, in which case only that handler will be unsubscribed.
 *
 * @param {string} channelName Channel name. Can be namespaced as such: "namespace.channelName"
 * @param {function(string, {})} [handler] Handler.
 */
NerveCenter.prototype.unsubscribe = function ( channelName, handler ) {
	var subscription = splitChannelName( channelName );

	if ( this._subscriptions[ subscription.name ] ) {
		if ( subscription.ns ) {
			if ( undefined !== handler ) {
				// We have a namespace and a handler. Remove any listeners within the namespace with the matching
				// handler.
				this._subscriptions[ subscription.name ][ subscription.ns ] =
					this._subscriptions[ subscription.name ][ subscription.ns ].filter( function ( handlerA ) {
						return handlerA !== handler;
					} );
			} else {
				// We have a namespace, but no handler. Remove all listeners within the namespace.
				this._subscriptions[ subscription.name ][ subscription.ns ] = [];
			}
		} else {
			if ( undefined !== handler ) {
				// We have no namespace, but we do have a handler. Remove any listeners in any namespace with the
				// matching handler.
				Object.keys( this._subscriptions[ subscription.name ] ).forEach( function ( namespace ) {
					this._subscriptions[ subscription.name ][ namespace ] =
						this._subscriptions[ subscription.name ][ namespace ].filter( function ( handlerA ) {
							return handlerA !== handler;
						} );
				}, this );
			} else {
				// We have no handler or namespace. Remove all listeners.
				this._subscriptions[ subscription.name ] = {};
			}
		}
	}
};

/**
 * Broadcast a message to all subscribers on a given channel.
 * @param {string} channelName Channel name. Don't namespace.
 * @param {{}} message
 */
NerveCenter.prototype.broadcast = function ( channelName, message ) {
	var handlers = [], nestedSubscriptions;

	if ( undefined !== this._subscriptions[ channelName ] ) {
		nestedSubscriptions = this._subscriptions[ channelName ];
		Object.keys( nestedSubscriptions ).forEach( function ( namespace ) {
			handlers = handlers.concat( nestedSubscriptions[ namespace ] );
		} );
	}

	handlers.forEach( function ( handler ) {
		if ( 'function' === typeof handler ) {
			handler.call( this, channelName, message );
		}
	} );
};

var supportedTypes = [ 'object', 'boolean', 'number', 'string', 'any' ];

/**
 * Initialize a data point, possibly with a type and an initial value.
 * @param {string} key
 * @param {string} [type]
 * @param {*} [initialValue]
 */
NerveCenter.prototype.initializeDataPoint = function ( key, type, initialValue ) {
	type = type || 'any';
	if ( -1 === supportedTypes.indexOf( type ) ) {
		throw new Error( 'Invalid data point type' );
	}

	if ( undefined !== this._dataFormats[ key ] ) {
		throw new Error( 'Data point already defined' );
	}

	this._dataFormats[ key ] = type;

	this.setDataPoint( key, initialValue );
};

/**
 * Set the value of a data point.
 * @param {string} key
 * @param {*} value
 * @throws {TypeError} Thrown when the type of value is not allowed under the way the point was initialized.
 */
NerveCenter.prototype.setDataPoint = function ( key, value ) {
	if ( undefined === this._dataFormats[ key ] ) {
		this.initializeDataPoint( key, 'any', value );
	} else {
		// Allow nulls
		if ( undefined === value ) {
			value = null;
		}
		if ( 'any' !== this._dataFormats[ key ] && null !== value && typeof value !== this._dataFormats[ key ] ) {
			throw new TypeError( 'Unexpected data type' );
		}
		var oldValue = this._data[ key ];
		this._data[ key ] = value;
		this.broadcast( 'data-' + key, {
			key     : key,
			oldValue: oldValue,
			newValue: value
		} );
	}
};

/**
 * Gets the value of a data point.
 * @param {string} key
 * @returns {*}
 */
NerveCenter.prototype.getDataPoint = function ( key ) {
	return this._data[ key ];
};

var formatDataKey = function ( key ) {
	var splitKey = splitChannelName( key ),
		channel = '';
	if ( '' !== splitKey.ns ) {
		channel = splitKey.ns + '.';
	}

	channel += 'data-' + splitKey.name;

	return channel;
};

/**
 * Subscribes to changes in a data point.
 * @param {string} key
 * @param {function(*)} handler
 */
NerveCenter.prototype.subscribeToDataPoint = function ( key, handler ) {
	var channel = formatDataKey( key );

	var wrappedHandler = function ( channelName, message ) {
		handler( message );
	};

	this.subscribe( channel, wrappedHandler );
};

NerveCenter.prototype.unsubscribeFromDataPoint = function ( key, handler ) {
	var channel = formatDataKey( key );

	var wrappedHandler;
	if ( undefined !== handler ) {
		wrappedHandler = function ( channelName, message ) {
			handler( message );
		};
	}

	this.unsubscribe( channel, wrappedHandler );
};

module.exports = NerveCenter;
