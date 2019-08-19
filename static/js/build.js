const fs = require('fs');
const yatesisms = JSON.parse(fs.readFileSync('./data/yatesisms.json', 'utf8'));


var getContent = function(yatesism) {
return `---
title: "Yatesism #${yatesism}"
date: ${new Date(yatesisms[yatesism].date * 1000)},
contributor: ${yatesisms[yatesism].contributor}
draft: true
---
# ${yatesisms[yatesism].yatesism}
`
};

var getKeyWords = function(yatesism) {

};

for (yatesism in yatesisms) {
    var content = getContent(yatesism);

    fs.writeFile(`./content/yatesism/${yatesism}.md`, content, function() {
        console.log('done');
    });
}

/*
Dan Barbour
Tom Estlack
Nick Ziemba
Tanner Woodworth
Tessa Watkins
Mike Perri
Krystal Clark
Baylee Zimmerman
*/