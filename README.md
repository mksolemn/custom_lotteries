Widget options:

        $('.dum-lotto').dumLottoModule({

            lotteryFilter: [2, 5, 7, 8, 21, 22, 23, 26],
            dataUrl: 'https://jsonblob.com/api/jsonBlob/f602cb33-b63c-11e6-871b-315e230c0a7c',
            handlebarsTemplate: '#lotto-template3',
            columns: 3, // items per row
            showSeconds: false, // boolean
            logoType: '', // "long", "square", empty

        });
		
lotteryFilter: array of lottery indexes, filters out the selected lotteries;
handlebarsTemplate: choose between 3 preset handebarsjs templates: '#lotto-template1', '#lotto-template2', '#lotto-template3';
columns: integer for number of columns;
showSeconds: boolean - show/hide seconds;
logoType: select display type for logos: "long", "square", empty;

Widget main files:

/js/main.js
index.html

To test functionality run local server first;
