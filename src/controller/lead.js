const getAllLead = (req,res) => {
    res.json({
        message : 'Get lead success'
    })
}

const insertLead = (req,res) => {
    console.log(req.body)
    res.json({
        message: "create lead berhasil",
        data: req.body
    })
}
module.exports = {
    getAllLead,
    insertLead
}