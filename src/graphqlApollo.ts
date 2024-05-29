import {GraphQLClient} from "graphql-request";

const client = new GraphQLClient('http://image-ia:3001/graphql');
export default client;