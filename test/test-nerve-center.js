/* global __karma__ */
var NerveCenter = require( 'nerve-center' );

describe( 'NerveCenter', function () {

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
