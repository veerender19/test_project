module.exports = {
    sendResponse: (msg, res, statusCode, data = null)=>{
        let finalData = {
            message: msg,
            result: data == null ? {} : (data),
          }
        return res.status(statusCode).json(finalData);
    } 
}