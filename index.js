var request = require('request');
var _ = require('underscore');
_.mixin( require('underscore.deferred') );
var Twit = require('twit');
var T = new Twit(require('./config.js'));
var wordfilter = require('wordfilter');
var ent = require('ent');
var wordnikKey = require('./permissions.js').key;

var getNounUrl = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&excludePartOfSpeech=noun-plural,noun-posessive,proper-noun,proper-noun-plural,proper-noun-posessive&minCorpusCount=100&minDictionaryCount=13&minLength=3&maxLength=8&api_key=' + wordnikKey;

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

fruits = ['berries', 'fruit'];

function tweetWord(word) {
    T.post('statuses/update', { status: word }, function(err, reply) {
        if (err) {
            console.log('error:', err);
        } else {
            console.log('tweet:', reply);
        }
    });
}

function tweetSnozz() {
    var noun = '',
        tweet = 'The ',
        fruitstring;
    //let's get some adjectives!
    request(getNounUrl, function(error, response, data) {
        // let's make sure we're dealing with JSON
        var nounData = JSON.parse(data);
        console.log(nounData);
        if (!error) {
            noun = nounData.word;
            // if we got back some data from the API and it didn't error
            if (!wordfilter.blacklisted(noun)){
                console.log(noun);
                fruitstring = noun + fruits.pick();
                tweet += fruitstring + ' taste like ' + fruitstring +'!';
                console.log(tweet);
                tweetWord(tweet);
                return;
            } else {
                tweetSnozz();
            }
        }
    });
}

// // Tweet every 30 minutes
// setInterval(function () {
//     try {
//         tweetLegend();
//     }
//     catch (e) {
//         console.log(e);
//     }
// }, 1000 * 60 * 30);

// Tweet once on initialization
tweetSnozz();
