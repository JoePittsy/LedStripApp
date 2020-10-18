'use strict';
const readline = require('readline');
const fs = require('fs');
var iothub = require('azure-iothub');

var registry;
const readInterface = readline.createInterface({
    input: fs.createReadStream('key.txt'),
    output: process.stdout,
    console: false
});

readInterface.on('line', function(line) {
    registry = iothub.Registry.fromConnectionString(line);
    console.log(line)
    updateTwin();
});


function updateTwin(){

    registry.getTwin('JoesMXChip', function(err, twin){
        if (err) {
            console.error(err.constructor.name + ': ' + err.message);
        } else {
            var patch = {
                properties: {
                    desired: {
                      rgbLEDR: 200,
                      rgbLEDG: 0,
                      rgbLEDB: 0,
                      rgbDither: 0,
                      rgbBrightness: 100
                }
                }
            };
    
            twin.update(patch, function(err) {
              if (err) {
                console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
              } else {
                console.log(twin.deviceId + ' twin updated successfully');
              }
            });
        }
    });
    
    
}


