"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const client = new graphql_request_1.GraphQLClient('http://image-ia:3001/graphql');
exports.default = client;
//# sourceMappingURL=graphqlApollo.js.map