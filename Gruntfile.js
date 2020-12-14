
'use strict';
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            dist: "dist/**"
        },
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ["src/fonts/*"],
                        dest: "dist/fonts",
                        filter: "isFile"
                    }
                ]
            }
        },
        less: {
            dist : {
                options: {
                    compress: true,
                },
                files: {
                    'dist/css/<%= pkg.name %>.css': 'src/less/index.less'
                }
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require("pixrem")(), // add fallbacks for rem units
                    require("autoprefixer")({ overrideBrowserslist: "last 2 versions" }), // add vendor prefixes
                    require("cssnano")() // minify the result
                ]
            },
            dist: {
                src: "dist/css/*.css"
            }
        },
        uglify: {
            options: {
                banner:
                    "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */',
                report: "gzip",
                compress: true,
                sourceMap: true,
                exportAll: true,
            },
            main: {
                files: [
                    {
                        'dist/js/<%= pkg.name %>.js': ['src/js/index.js']
                    },
                ],
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');

    grunt.registerTask('default', ['clean', 'copy', 'less', 'uglify']);
};