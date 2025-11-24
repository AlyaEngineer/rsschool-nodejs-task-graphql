import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLList,
  } from "graphql";
import { UserType } from "./user.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";
import { MemberTypeType } from "./memberType.js";
import { GraphQLContext } from "./context.js";
import { UUIDType } from "./uuid.js";

type IdArg = { id: string };

export const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
    fields: () => ({
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType as unknown as GraphQLObjectType))),
        resolve: async (_parent, _args, context: GraphQLContext) => {
          return context.prisma.user.findMany({
            include: {
              profile: { include: { memberType: true } },
              posts: true,
              userSubscribedTo: true,
              subscribedToUser: true,
            },
          });
        },
      },

    user: {
      type: (UserType as unknown as GraphQLObjectType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: IdArg, context: GraphQLContext) => {
        return (
          (await context.prisma.user.findUnique({
            where: { id: args.id },
            include: { profile: { include: { memberType: true } }, posts: true, userSubscribedTo: true, subscribedToUser: true },
          })) ?? null
        );
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType as unknown as GraphQLObjectType))),
      resolve: async (_parent, _args, context: GraphQLContext) => {
        return context.prisma.post.findMany();
      },
    },

    post: {
      type: (PostType as unknown as GraphQLObjectType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: IdArg, context: GraphQLContext) => {
        return (await context.prisma.post.findUnique({ where: { id: args.id } })) ?? null;
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType as unknown as GraphQLObjectType))),
      resolve: async (_parent, _args, context: GraphQLContext) => {
        return context.prisma.profile.findMany({ include: { memberType: true } });
      },
    },

    profile: {
      type: (ProfileType as unknown as GraphQLObjectType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: IdArg, context: GraphQLContext) => {
        return (
          (await context.prisma.profile.findUnique({
            where: { id: args.id },
            include: { memberType: true },
          })) ?? null
        );
      },
    },

    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType as unknown as GraphQLObjectType))),
      resolve: async (_parent, _args, context: GraphQLContext) => {
        return context.prisma.memberType.findMany();
      },
    },

    memberType: {
      type: (MemberTypeType as unknown as GraphQLObjectType),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: IdArg, context: GraphQLContext) => {
        return context.prisma.memberType.findUnique({ where: { id: args.id } });
      },
    },
  }),
});
