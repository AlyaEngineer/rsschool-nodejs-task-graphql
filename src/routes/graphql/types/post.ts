import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { GqlPost } from "../gqlTypes.js";

export const PostType = new GraphQLObjectType<GqlPost>({
  name: "Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
