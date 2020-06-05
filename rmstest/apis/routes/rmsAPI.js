var express = require('express');
var router = express.Router();
var fs = require('fs');
var CSVToJSON = require('csvjson');



router.get('*', function (req, res, next) {
    // read the file
    const toObject = CSVToJSON.stream.toObject();
    var stringify = CSVToJSON.stream.stringify();
    fs.createReadStream('./metering_data.csv', 'utf-8')
        .pipe(toObject)
        .pipe(stringify)
        .pipe(fs.createWriteStream('./rms.json'));
    console.log(res);
   
}, function (err, result) {
    if (err) {
        return res.json({ error_code: 1, err_desc: err, data: null });
    }
    res.json({ error_code: 0, err_desc: null, data: result });
});
module.exports = router;
