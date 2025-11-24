import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberTypeType } from "./memberType.js";
import { GqlProfile } from "../gqlTypes.js";

export const ProfileType = new GraphQLObjectType<GqlProfile>({
  name: "Profile",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: MemberTypeType,
      resolve: (parent) => parent?.memberType ?? null,
    },
  }),
});
