var fs = require('fs');
var yatesisms = JSON.parse(fs.readFileSync('./data/yatesisms.json', 'utf8'));

for (yatesism in yatesisms) {
    var content = `
    ---
    title: ${yatesism}
    date: ${yatesisms[yatesism].date}
    draft: true
    ---
    #${yatesisms[yatesism].yatesism}
    `

    fs.writeFile(`./content/yatesism/${yatesism}.md`, content, function() {
        console.log('done');
    });
}