module.exports = function (grunt) {

    var compiledFileName = "b-tag";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['./dist/*.*']
            }
        },
        jshint: {
            files: ['sources/*.js', "sources/**/*.js"]
        },
        browserify: {
            main: {
                options: {
                    transform: [require('brfs')],
                    browserifyOptions: {
                        debug: true,
                    }
                },
                src: ['sources/' + compiledFileName + '.js'],
                dest: 'dist/' + compiledFileName + '.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: './dist/' + compiledFileName + '.js',
                dest: './dist/' + compiledFileName + '.min.js',
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: './sources/', src: 'b-tag.css', dest: './dist/', filter: 'isFile' }
                ]
            },
        },        
        watch: {
            scripts: {
                files: [
                    'sources/*.*',
                    'sources/**/*.*',
                    'sources/**/**/*.*'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['clean', 'jshint', 'browserify', 'uglify']);
    grunt.registerTask('dev', ['build', 'watch']);
};