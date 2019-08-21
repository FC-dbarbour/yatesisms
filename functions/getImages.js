const https = require('https');
const keyword_extractor = require("keyword-extractor");
const access_key = '087d36b85bea07c5e57e9ee36f4f874d36d6200946435151a4d9327c41f62424';

var getKeywords = function(yatesism) {
    return keyword_extractor.extract(yatesism, {
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true
    });
};

var getImageDataFromUnsplash = function(keyword) {
    return new Promise(function(res, rej) {
        https.get(querystring.stringify(`https://api.unsplash.com/search/photos?client_id=${access_key}&query=${keyword}`), (resp) => {
            let data = '';
    
            resp.on('data', (chunk) => {
                data += chunk;
            });
    
            resp.on('end', () => {
                res({[keyword]: JSON.parse(data)});
            });

        }).on("error", (err) => {
            rej("Error: " + err.message);
        });
    });
};

var getImageData = function(keywords) {
    var unsplashResults = [];

    for (var keyword of keywords) {
        unsplashResults.push(getImageDataFromUnsplash(keyword));
    }

    return unsplashResults;
};

var unpackObject = function(obj) {
    var imageData = {};
    for (var result of obj) {
        for (var key in result) {
            imageData[key] = result[key];
        }
    }

    return imageData;
};

exports.handler = function(event, context, callback) {
    const {yatesism} = JSON.parse(event.body);
    var keywords = getKeywords(yatesism);
    var imageData = getImageData(keywords);


    Promise.all(imageData).then(function(data) {
        var unpackedData = unpackObject(data);
        callback(null, {
            statusCode: 200, 
            body: JSON.stringify({data: unpackedData})
        });
    });
    
};