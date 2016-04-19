/**
 * Creates a new NerveCenter.
 * @returns {NerveCenter}
 * @constructor
 */
var NerveCenter = function () {
	this._events = {};

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
	var subscriptionSplit = /(?:([a-z0-9-_]*)\.)?([a-z0-9-_]*)/.exec( channelName );

	if ( subscriptionSplit[ 0 ] !== channelName ) {
		throw new Error( 'Invalid event name' );
	}

	return {
		ns  : subscriptionSplit[ 1 ],
		name: subscriptionSplit[ 2 ]
	};
};

/**
 * Subscribe to an event.
 *
 * Call this method with a channel name, which can be namespaced. (It's recommended that all subscriptions be
 * namespaced.) When a message is broadcast, the handler will be called with the channel name and message.
 *
 * @param {string} channelName Channel name. Can be namespaced as such: "namespace.channelName"
 * @param {function(string, {})} handler Handler.
 */
NerveCenter.prototype.subscribe = function ( channelName, handler ) {
	var subscription = splitChannelName( channelName );

	this._events[ subscription.name ] = this._events[ subscription.name ] || {};
	this._events[ subscription.name ][ subscription.ns ] = this._events[ subscription.name ][ subscription.ns ] || [];
	this._events[ subscription.name ][ subscription.ns ].push( handler );
};

/**
 * Unsubscribe from an event.
 *
 * Call this method with a channel name, which can be namespaced. If you namespaced the event while subscribing, it's
 * recommended that you use the same namespace here, to avoid unsubscribing other listeners. You may also pass the
 * handler to unsubscribe, in which case only that handler will be unsubscribed.
 *
 * @param {string} channelName Channel name. Can be namespaced as such: "namespace.channelName"
 * @param {function(string, {})} [handler] Handler.
 */
NerveCenter.prototype.unsubscribe = function ( channelName, handler ) {
	var subscription = splitChannelName( channelName );

	if ( this._events[ subscription.name ] ) {
		if ( subscription.ns ) {
			if ( undefined !== handler ) {
				// We have a namespace and a handler. Remove any listeners within the namespace with the matching
				// handler.
				this._events[ subscription.name ][ subscription.ns ] =
					this._events[ subscription.name ][ subscription.ns ].filter( function ( handlerA ) {
						return handlerA !== handler;
					} );
			} else {
				// We have a namespace, but no handler. Remove all listeners within the namespace.
				this._events[ subscription.name ][ subscription.ns ] = [];
			}
		} else {
			if ( undefined !== handler ) {
				// We have no namespace, but we do have a handler. Remove any listeners in any namespace with the
				// matching handler.
				Object.keys( this._events[ subscription.name ] ).forEach( function ( namespace ) {
					this._events[ subscription.name ][ namespace ] =
						this._events[ subscription.name ][ namespace ].filter( function ( handlerA ) {
							return handlerA !== handler;
						} );
				}, this );
			} else {
				// We have no handler or namespace. Remove all listeners.
				this._events[ subscription.name ] = {};
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
	var handlers = [], nestedEvents;

	if ( this._events[ channelName ] ) {
		nestedEvents = this._events[ channelName ];
		Object.keys( nestedEvents[ channelName ] ).forEach( function ( namespace ) {
			handlers = handlers.concat( nestedEvents[ namespace ] );
		} );
	}

	handlers.forEach( function ( handler ) {
		if ( 'function' === typeof handler ) {
			handler.call( this, channelName, message );
		}
	} );
};

module.exports = NerveCenter;
