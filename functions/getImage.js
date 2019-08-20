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

var getImages = function(keywords) {
    var unsplashRequests = [];

    for (let keyword of keywords) {
        unsplashRequests.push(new Promise(function(res, rej) {
            https.get(`https://api.unsplash.com/search/photos?client_id=${access_key}&query=${keyword}`, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                res(data);
            });

            }).on("error", (err) => {
                rej("Error: " + err.message);
            });
        }));
    }

    return unsplashRequests;
};


exports.handler = function(event, context, callback) {
    const {yatesism} = JSON.parse(event.body);
    var keywords = getKeywords(yatesism);
    var unsplash = getImages(keywords);

    Promise.all(unsplash).then(function(group) {
        var images = [];

        
        
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({msg: images})
        });
    });
};