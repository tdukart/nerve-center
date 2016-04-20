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

	it( 'enforces data point types', function () {

		var nc = new NerveCenter();

		nc.initializeDataPoint( 'shouldBeAString', 'string' );

		expect( function () {
			nc.setDataPoint( 'shouldBeAString', { thisIs: 'not a string' } );
		} ).toThrowError( TypeError );

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

} );
