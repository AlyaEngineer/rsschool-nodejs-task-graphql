import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLInt } from "graphql";
import { MemberTypeIdEnum } from "./enums.js";

export const MemberTypeType = new GraphQLObjectType({
  name: "MemberType",
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});
