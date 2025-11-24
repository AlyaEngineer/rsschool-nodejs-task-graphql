import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";
import { GraphQLContext } from "./context.js";
import { GqlUser } from "../gqlTypes.js";

export const UserType = new GraphQLObjectType<GqlUser, GraphQLContext>({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (parent, _args, context) => {
        if (!parent?.id) return null;
        return context.prisma.profile.findUnique({
          where: { userId: parent.id },
          include: { memberType: true },
        }) ?? null;
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (parent, _args, context) => {
        return (await context.prisma.post.findMany({ where: { authorId: parent.id } })) ?? [];
      },
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, _args, context) => {
        const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: parent.id },
          include: { author: true },
        });
        return subscriptions.map((s) => s.author);
      },
    },
    
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, _args, context) => {
        const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
          where: { authorId: parent.id },
          include: { subscriber: true },
        });
        return subscriptions.map((s) => s.subscriber);
      },
    },
  }),
});
