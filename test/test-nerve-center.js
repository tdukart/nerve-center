/* global __karma__ */
var NerveCenter = require( 'nerve-center' );

describe( 'NerveCenter messaging', function () {

	it( 'triggers a callback when a message is broadcast', function () {

		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.subscribe( 'howdy', callback );

		nc.broadcast( 'howdy', { text: 'hello world' } );

		expect( callback ).toHaveBeenCalledWith(
			'howdy',
			jasmine.objectContaining( {
				text: 'hello world'
			} )
		);
	} );

	it( 'allows for uppercase letters in an event', function () {
		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.subscribe( 'camelCasedEvent', callback );

		nc.broadcast( 'camelCasedEvent', { text: 'hello world' } );

		expect( callback ).toHaveBeenCalledWith(
			'camelCasedEvent',
			jasmine.objectContaining( {
				text: 'hello world'
			} )
		);
	} );

	it( 'allows for uppercase letters in a namespaced event', function () {
		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.subscribe( 'myNamespace.camelCasedEvent', callback );

		nc.broadcast( 'camelCasedEvent', { text: 'hello world' } );

		expect( callback ).toHaveBeenCalledWith(
			'camelCasedEvent',
			jasmine.objectContaining( {
				text: 'hello world'
			} )
		);
	} );

	it( 'unbinds all the callbacks', function () {
		var nc = new NerveCenter();

		var callback1 = jasmine.createSpy( 'callback' );
		var callback2 = jasmine.createSpy( 'callback' );

		nc.subscribe( 'howdy', callback1 );
		nc.subscribe( 'howdy', callback2 );

		nc.unsubscribe( 'howdy' );

		nc.broadcast( 'howdy', { text: 'hello world' } );

		expect( callback1 ).not.toHaveBeenCalled();
		expect( callback2 ).not.toHaveBeenCalled();
	} );

	it( 'unbinds a namespaced callback', function () {

		var nc = new NerveCenter();

		var unnamespacedCallback = jasmine.createSpy( 'callback' );
		var namespacedCallback = jasmine.createSpy( 'callback' );

		nc.subscribe( 'howdy', unnamespacedCallback );
		nc.subscribe( 'ns.howdy', namespacedCallback );

		nc.unsubscribe( 'ns.howdy' );

		nc.broadcast( 'howdy', { text: 'hello world' } );

		expect( unnamespacedCallback ).toHaveBeenCalledWith(
			'howdy',
			jasmine.objectContaining( {
				text: 'hello world'
			} )
		);

		expect( namespacedCallback ).not.toHaveBeenCalled();
	} );

	it( 'unbinds a non-namespaced callback', function () {
		var nc = new NerveCenter();

		var helloCallback = jasmine.createSpy( 'callback' );
		var buhbyeCallback = jasmine.createSpy( 'callback' );

		nc.subscribe( 'howdy', helloCallback );
		nc.subscribe( 'howdy', buhbyeCallback );

		nc.unsubscribe( 'howdy', buhbyeCallback );

		nc.broadcast( 'howdy', { text: 'hello world' } );

		expect( helloCallback ).toHaveBeenCalled();
		expect( buhbyeCallback ).not.toHaveBeenCalled();
	} );

	it( 'unbinds a namespaced callback with handler', function () {
		var nc = new NerveCenter();

		var helloCallback = jasmine.createSpy( 'callback' );
		var buhbyeCallback = jasmine.createSpy( 'callback' );

		nc.subscribe( 'ns.howdy', helloCallback );
		nc.subscribe( 'ns.howdy', buhbyeCallback );

		nc.unsubscribe( 'ns.howdy', buhbyeCallback );

		nc.broadcast( 'howdy', { text: 'hello world' } );

		expect( helloCallback ).toHaveBeenCalled();
		expect( buhbyeCallback ).not.toHaveBeenCalled();
	} );

	it( 'calls multiple callbacks', function () {
		var nc = new NerveCenter();

		var callback1 = jasmine.createSpy( 'callback' );
		var callback2 = jasmine.createSpy( 'callback' );
		var callback3 = jasmine.createSpy( 'callback' );
		var callback4 = jasmine.createSpy( 'callback' );
		var callback5 = jasmine.createSpy( 'callback' );

		nc.subscribe( 'howdy', callback1 );
		nc.subscribe( 'howdy', callback2 );
		nc.subscribe( 'howdy', callback3 );
		nc.subscribe( 'howdy', callback4 );
		nc.subscribe( 'howdy', callback5 );

		nc.broadcast( 'howdy', { text: 'hello world' } );

		expect( callback1 ).toHaveBeenCalled();
		expect( callback2 ).toHaveBeenCalled();
		expect( callback3 ).toHaveBeenCalled();
		expect( callback4 ).toHaveBeenCalled();
		expect( callback5 ).toHaveBeenCalled();

	} );

} );

describe( 'NerveCenter data points', function () {

	it( 'allows data to be set and retrieved', function () {

		var nc = new NerveCenter();

		nc.setDataPoint( 'greeting', 'howdy' );
		var returnValue = nc.getDataPoint( 'greeting' );

		expect( returnValue ).toBe( 'howdy' );

	} );

	it( 'allows data to be set in bulk', function () {
		var nc = new NerveCenter();

		nc.setDataPoints( { greeting: 'howdy', parting: 'goodbye' } );
		var greeting = nc.getDataPoint( 'greeting' );
		var parting = nc.getDataPoint( 'parting' );

		expect( greeting ).toBe( 'howdy' );
		expect( parting ).toBe( 'goodbye' );
	} );

	it( 'enforces data point types', function () {

		var nc = new NerveCenter();

		nc.initializeDataPoint( 'shouldBeAString', 'string' );

		expect( function () {
			nc.setDataPoint( 'shouldBeAString', { thisIs: 'not a string' } );
		} ).toThrowError( TypeError );

	} );

	it( 'enforces data point types when setting in bulk', function () {
		var nc = new NerveCenter();
		nc.initializeDataPoint( 'name', 'string' );
		nc.initializeDataPoint( 'age', 'number' );

		expect( function () {
			nc.setDataPoints( {
				name: 'John Hancock',
				age : 'fish'
			} )
		} ).toThrowError();
	} );

	it( 'doesn\'t allow unknown data types', function () {
		var nc = new NerveCenter();
		expect( function () {
			nc.initializeDataPoint( 'myKey', 'hindenberg' );
		} ).toThrowError();
	} );

	it( 'allows data to be initialized in bulk', function () {
		var nc = new NerveCenter();

		nc.initializeDataPoints( { name: 'string', age: 'number' } );
		expect( function () {
			nc.setDataPoint( 'name', 'John Hancock' );
		} ).not.toThrowError();

		expect( function () {
			nc.setDataPoint( 'age', 25 );
		} ).not.toThrowError();

		expect( function () {
			nc.setDataPoint( 'age', 'fish' );
		} ).toThrowError();
	} );

	it( 'allows data subscriptions to be alerted to changes in data', function () {

		var nc = new NerveCenter();

		nc.initializeDataPoint( 'greeting', 'string', 'howdy' );

		var callback = jasmine.createSpy( 'callback' );
		nc.subscribeToDataPoint( 'greeting', callback );

		nc.setDataPoint( 'greeting', 'hola' );

		expect( callback ).toHaveBeenCalledWith( jasmine.objectContaining( {
			oldValue: 'howdy',
			newValue: 'hola'
		} ) );

	} );

	it( 'allows data subscriptions to be bound before data is set', function () {

		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );
		nc.subscribeToDataPoint( 'greeting', callback );

		nc.setDataPoint( 'greeting', 'howdy' );

		expect( callback ).toHaveBeenCalledWith( jasmine.objectContaining( {
			newValue: 'howdy'
		} ) );

	} );

	it( 'allows multiple data subscriptions', function () {

		var nc = new NerveCenter();

		var callback1 = jasmine.createSpy( 'callback' );
		var callback2 = jasmine.createSpy( 'callback' );
		var callback3 = jasmine.createSpy( 'callback' );
		var callback4 = jasmine.createSpy( 'callback' );
		var callback5 = jasmine.createSpy( 'callback' );

		nc.subscribeToDataPoint( 'greeting', callback1 );
		nc.subscribeToDataPoint( 'greeting', callback2 );
		nc.subscribeToDataPoint( 'greeting', callback3 );
		nc.subscribeToDataPoint( 'greeting', callback4 );
		nc.subscribeToDataPoint( 'greeting', callback5 );

		nc.setDataPoint( 'greeting', 'bonjour' );

		expect( callback1 ).toHaveBeenCalled();
		expect( callback2 ).toHaveBeenCalled();
		expect( callback3 ).toHaveBeenCalled();
		expect( callback4 ).toHaveBeenCalled();
		expect( callback5 ).toHaveBeenCalled();

	} );

	it( 'allows namespaced data subscriptions', function () {

		var nc = new NerveCenter();

		var unnamespacedCallback = jasmine.createSpy( 'callback' );
		var namespacedCallback = jasmine.createSpy( 'callback' );

		nc.subscribeToDataPoint( 'greeting', unnamespacedCallback );
		nc.subscribeToDataPoint( 'ns.greeting', namespacedCallback );

		nc.unsubscribeFromDataPoint( 'ns.greeting' );

		nc.setDataPoint( 'greeting', 'aloha' );

		expect( unnamespacedCallback ).toHaveBeenCalled();
		expect( namespacedCallback ).not.toHaveBeenCalled();

	} );

	//This fails because the callback is wrapped.
	//TODO: Make this not fail - #13
	xit( 'unbinds data subscriptions based on a handler', function () {
		var nc = new NerveCenter();

		var helloCallback = jasmine.createSpy( 'callback' );
		var buhbyeCallback = jasmine.createSpy( 'callback' );

		nc.subscribeToDataPoint( 'greeting', helloCallback );
		nc.subscribeToDataPoint( 'greeting', buhbyeCallback );

		nc.unsubscribeFromDataPoint( 'greeting', buhbyeCallback );

		nc.setDataPoint( 'greeting', 'aloha' );

		expect( helloCallback ).toHaveBeenCalled();
		expect( buhbyeCallback ).not.toHaveBeenCalled();
	} );

	it( 'can pop on a dataPoint array', function () {
		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.initializeDataPoint( 'greetings', 'object', [ 'hello', 'hola' ] );

		nc.subscribeToDataPoint( 'greetings', callback );

		var result = nc.popDataPoint( 'greetings' );
		var greetingsArray = nc.getDataPoint( 'greetings' );

		expect( result ).toBe( 'hola' );
		expect( callback ).toHaveBeenCalled();
		expect( greetingsArray ).toEqual( [ 'hello' ] );
	} );

	it( 'can push on a dataPoint array', function () {
		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.initializeDataPoint( 'greetings', 'object', [ 'hello' ] );

		nc.subscribeToDataPoint( 'greetings', callback );

		var result = nc.pushDataPoint( 'greetings', 'hola' );
		var greetingsArray = nc.getDataPoint( 'greetings' );

		expect( result ).toBe( 2 );
		expect( callback ).toHaveBeenCalled();
		expect( greetingsArray ).toEqual( [ 'hello', 'hola' ] );
	} );

	it( 'can push multiple elements on a dataPoint array', function () {
		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.initializeDataPoint( 'greetings', 'object', [ 'hello' ] );

		nc.subscribeToDataPoint( 'greetings', callback );

		var result = nc.pushDataPoint( 'greetings', 'hola', 'howdy' );
		var greetingsArray = nc.getDataPoint( 'greetings' );

		expect( result ).toBe( 3 );
		expect( callback ).toHaveBeenCalled();
		expect( greetingsArray ).toEqual( [ 'hello', 'hola', 'howdy' ] );
	} );

	it( 'can shift on a dataPoint array', function () {
		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.initializeDataPoint( 'greetings', 'object', [ 'hello', 'hola' ] );

		nc.subscribeToDataPoint( 'greetings', callback );

		var result = nc.shiftDataPoint( 'greetings' );
		var greetingsArray = nc.getDataPoint( 'greetings' );

		expect( result ).toBe( 'hello' );
		expect( callback ).toHaveBeenCalled();
		expect( greetingsArray ).toEqual( [ 'hola' ] );
	} );

	it( 'can unshift on a dataPoint array', function () {
		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.initializeDataPoint( 'greetings', 'object', [ 'hello' ] );

		nc.subscribeToDataPoint( 'greetings', callback );

		var result = nc.unshiftDataPoint( 'greetings', 'hola' );
		var greetingsArray = nc.getDataPoint( 'greetings' );

		expect( result ).toBe( 2 );
		expect( callback ).toHaveBeenCalled();
		expect( greetingsArray ).toEqual( [ 'hola', 'hello' ] );
	} );

	it( 'can unshift multiple elements on a dataPoint array', function () {
		var nc = new NerveCenter();

		var callback = jasmine.createSpy( 'callback' );

		nc.initializeDataPoint( 'greetings', 'object', [ 'hello' ] );

		nc.subscribeToDataPoint( 'greetings', callback );

		var result = nc.unshiftDataPoint( 'greetings', 'hola', 'howdy' );
		var greetingsArray = nc.getDataPoint( 'greetings' );

		expect( result ).toBe( 3 );
		expect( callback ).toHaveBeenCalled();
		expect( greetingsArray ).toEqual( [ 'hola', 'howdy', 'hello' ] );
	} );

} );
