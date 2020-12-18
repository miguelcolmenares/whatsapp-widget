
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
                    paths: ['dist/css'],
                    plugins: [
                        new (require('less-plugin-autoprefix'))({ browsers: ["last 2 versions"] })
                    ]
                },
                files: {
                    'dist/css/<%= pkg.name %>.css': 'src/less/index.less'
                }
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
    grunt.loadNpmTasks('grunt-contrib-uglify-es');

    grunt.registerTask('default', ['clean', 'copy', 'less', 'uglify']);
};