module.exports = function ( grunt ) {

	// Project configuration.
	grunt.initConfig( {
		pkg       : grunt.file.readJSON( 'package.json' ),
		uglify    : {
			options: {
				banner: '/*! nerveCenter\n' +
				' * (c) 2016 Todd Dukart\n' +
				' * https://opensource.org/licenses/BSD-3-Clause\n' +
				' */\n'
			},
			build  : {
				src : 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		jsdoc     : {
			dist: {
				src    : [ 'src/*.js', 'test/*.js' ],
				options: {
					destination: 'doc'
				}
			}
		},
		browserify: {
			options: {
				banner: '/*! nerveCenter\n' +
				' * (c) 2016 Todd Dukart\n' +
				' * https://opensource.org/licenses/BSD-3-Clause\n' +
				' */\n',
			},
			build  : {
				dest  : 'dist',
				src   : [ '**/*.js', '**/*.jsx' ],
				cwd   : 'src',
				expand: true,
				filter: 'isFile'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-jsdoc' );

	// Default task(s).
	grunt.registerTask( 'default', [ 'compile' ] );

	grunt.registerTask( 'compile', [ 'browserify' ] );
	grunt.registerTask( 'dist', [ 'compile', 'uglify', 'jsdoc' ] );

};
