var cheerio = require('cheerio');
var fs = require('fs');
var config = require('./config');
var indexedFiles = require('./indexedFiles');

// remove the left column and the nav bar so that it fits dash's usually small
// browser screen
indexedFiles.forEach(function(array, index) {
    //console.log(array);
    var path = __dirname + '/../Contents/Resources/Documents/' + config.name + '/' + array.name + '.html';
    var src = fs.readFileSync(path, 'utf8');
    var $ = cheerio.load(src);

    var headerClasses = config.pageSubHeaders.toString();
    var $headers = $(headerClasses);

    $('#edit-link').remove();

    $headers.each(function(index, elem) {
        var name = $(elem).contents().text();

        // TODO: Change "array.toc to something more relevant on a page-by-page basis in indexedFiles.js"
        $(elem).prepend('<a name="//apple_ref/cpp/' + array.toc + '/' + encodeURIComponent(name) + '" class="dashAnchor"></a>');
        $.html();
    });

    $('.book-summary').remove();
    $('.book-header').remove();
    $('.book-body').attr('style', 'left:0!important;-webkit-transform: none !important;transform: none !important;');
    $('.page-inner section.normal pre').attr('style', 'overflow-x: scroll;');


    fs.writeFileSync(path, $.html(), 'utf8');
});
