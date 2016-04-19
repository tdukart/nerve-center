module.exports = function ( grunt ) {

	// Project configuration.
	grunt.initConfig( {
		pkg       : grunt.file.readJSON( 'package.json' ),
		uglify    : {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build  : {
				src : 'build/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		browserify: {
			options: {
				banner    : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				debug     : true,
				extensions: [ '.jsx' ]
			},
			build  : {
				dest  : 'build',
				src   : [ '**/*.js', '**/*.jsx' ],
				cwd   : 'src',
				expand: true,
				filter: 'isFile'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-browserify' );
	// grunt.loadNpmTasks('grunt-reactify');

	// Default task(s).
	grunt.registerTask( 'default', [ 'compile' ] );

	grunt.registerTask( 'compile', [ 'browserify' ] );
	grunt.registerTask( 'dist', [ 'compile', 'uglify' ] );

};
