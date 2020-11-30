const fs = require('fs');

const deleteFlie = (filePath) => {
    fs.unlink(filePath, err => {
        if(err) {
            throw err;
        }
    });
}

exports.deleteFlie = deleteFlie;