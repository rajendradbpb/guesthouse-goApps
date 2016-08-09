/*
 * The file will take care of the database connectivity
 */
var connectionFactory = require("./server/factory/connectionFactory");
connectionFactory.getConnection();
