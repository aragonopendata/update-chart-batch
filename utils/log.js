const log4js = require("log4js");

log4js.configure({
    appenders: { update: { type: "dateFile", filename: "update.log", pattern: '.yyyy-MM-dd-hh', daysToKeep: 3  } },
    categories: { default: { appenders: ["update"], level: "error" } }, 
    });
const logger = log4js.getLogger("update");

module.exports = {
    error: function(message){
        if(Array.isArray(message)){
            message.forEach(error => {
                logger.error(error);
            });
        }else{
            logger.error(message);
        }
        //Separator
        logger.error("\n\n\n");
    }
}