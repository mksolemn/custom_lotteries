(function($) {

    $(document).ready(function() {

        $.fn.dumLottoModule = function(options) {

            // get base url
            var getUrl = window.location;
            var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
            var filteredData = [];
            var handlebarsPlaceholder = $(this); // set handlebars template
            var retrievedData = new Object();
            var _this = this;

            var settings = $.extend({

                lotteryFilter: [], // lottery ids
                handlebarsTemplate: '', // handlebars template
                singleElement: '.dum-item', // single lottery selector
                dataUrl: '', // lotto data object
                columns: 6, // lotto columns
                showLogo: true, // boolean
                showName: true, // boolean
                showDate: true, // boolean
                showPot: true, // boolean
                showSeconds: true, // boolean
                logoType: '', // select logo type: default, "long", "square"
                slotMachine: false //boolean

            }, options);

            // handlebars settings
            var theTemplateScript = $(settings.handlebarsTemplate).html();
            var theTemplate = Handlebars.compile(theTemplateScript);

            // get json data
            var getData = function(dataUrl) {
                $.getJSON({
                        url: dataUrl
                    })
                    .done(function(data) {
                        retrievedData = data;
                        dataToDom(data);
                    })
                    .fail(function() {
                        $('.dum-lotto').append('<p>Unable to load lotteries.</p>');
                    })
            };

            // push data to DOM
            var dataToDom = function(data) {

                var theCompiledHtml = theTemplate(filterData(data)); // use data filter, before pushing to DOM
                handlebarsPlaceholder.html(theCompiledHtml);

            }

            // filter data based on filter array
            var filterData = function(gotData) {

                var dataShort = gotData.data.lotteries; // should be replaced with more universal data path
                var updatedFilter; // array to store filter after filter value is removed
                var arrayLength = dataShort.length; // fetch length of array only once

                // sort filter biggest to smallest to not fuck up the indexing
                // if you remove lower numbers first the index will shift andd will be incorect for the rest of the array
                var sortedFilter = settings.lotteryFilter.sort(function(a, b) { return b - a });

                // filter out array with values from another array
                for (var i = arrayLength - 1; arrayLength != arrayLength - sortedFilter.length; i -= 1) {
                    // loop through filter array values
                    for (var x = 0; settings.lotteryFilter.length > x; x += 1) {
                        if (dataShort[i].id == sortedFilter[x]) {
                            filteredData = dataShort.splice(i, 1); // create new array from without filtered values
                            updatedFilter = sortedFilter.splice(x, 1); // remove filtered value
                        }
                    }
                    arrayLength -= 1; // update array length
                }

                return gotData;

            };

            // var select logo type
            Handlebars.registerHelper('switchLogo', function(setOptions) {
                var type = this.logo_lg;
                console.log(type);

                switch (settings.logoType) {
                    case 'long':
                        type = this.logo_lg;
                        break;
                    case 'square':
                        type = this.logo_sq;
                        break;
                    default:
                        type = this.logo;
                }

                //var path = '/images/lottery-logos/';

                return type;
            });

            //handlebars helpers

            Handlebars.registerHelper('numToText', function(options) {
                var unconverted = new Handlebars.SafeString(options.fn(this));

                var converted = function() {
                    var numToWord;

                    if (unconverted.string >= 1000000000) {
                        numToWord = Math.round(unconverted.string / 1000000000) + ' Billion';
                    } else if (1000000 < unconverted.string.length < 1000000000) {
                        numToWord = Math.round(unconverted.string / 1000000) + ' Million';
                    }

                    return numToWord;
                }

                return converted();
            });

            Handlebars.registerHelper('formatTime', function(options) {
                var unformatted = new Handlebars.SafeString(options.fn(this));

                var d = new Date();
                var timeLeft;
                var randomTime = 2160000 + Math.floor(Math.random() * 604800000);
                var seconds = Math.round((randomTime / 1000) % 60);
                var minutes = Math.round((randomTime / (1000 * 60)) % 60);
                var hours = Math.round((randomTime / (1000 * 60 * 60)) % 24);
                var days = Math.round((randomTime / (1000 * 60 * 60 * 24)));

                var format = function() {

                    // add trailing zero
                    if (minutes < 10) {
                        minutes = '0' + minutes;
                    }
                    if (seconds < 10) {
                        seconds = '0' + seconds
                    }

                    // days
                    if (days == 1) {
                        days = days + ' day'
                    } else if (days == 0) {
                        days = ''
                    } else { days = days + ' days' }

                    // show seconds
                    if (settings.showSeconds) {
                        return days + ' ' + hours + ':' + minutes + ':' + seconds;
                    } else {
                        return days + ' ' + hours + ':' + minutes;
                    }
                }

                return format();
            })

            // add columns based on input

            var columnize = function(cols, element) {
                console.log('columnize RUNS');
                var colWidth = (100 / cols).toFixed(2) + '%';
                $(element).each(function() {
                    $(this).css({ 'flex-basis': colWidth });
                })
            }

            // slot machine module
            var slotMachineInit = function() {;

                $(_this).css('height', $(settings.singleElement).outerHeight());
            }

            // function runtime
            getData(settings.dataUrl);
            slotMachineInit();

            // after ajax
            $(document).ajaxComplete(function() {
                console.log('ajax completed');
                columnize(settings.columns, settings.singleElement);
            });


            return this;

        }

        $('.dum-lotto').dumLottoModule({

            lotteryFilter: [2, 5, 7, 8, 21, 22, 23, 26],
            dataUrl: 'https://jsonblob.com/api/jsonBlob/f602cb33-b63c-11e6-871b-315e230c0a7c',
            handlebarsTemplate: '#lotto-template3',
            columns: 3, // items per row
            showSeconds: false, // boolean
            logoType: '', // "long", "square", empty
            slotMachine: true // boolean

        });

    });

})(jQuery);