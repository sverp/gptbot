
function getdata(r){
    const inputd = r.body.entry[0].changes[0].value.messages[0]
    return inputd
}

module.exports = getdata