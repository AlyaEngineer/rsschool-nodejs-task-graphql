import { GraphQLSchema } from "graphql";
import { RootQueryType } from "./query.js";
import { Mutations } from "./mutations.js";

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});
