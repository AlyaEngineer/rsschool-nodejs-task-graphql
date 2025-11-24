import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLInputObjectType
  } from "graphql";
import { UserType } from "./user.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";
import { GraphQLContext } from "./context.js";
import { UUIDType } from "./uuid.js";
import { MemberTypeIdEnum } from "./memberType.js";

const CreateUserInput = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: "ChangeUserInput",
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: "ChangeProfileInput",
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

const CreatePostInput = new GraphQLInputObjectType({
  name: "CreatePostInput",
  fields: {
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: "ChangePostInput",
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

type CreateUserArgs = { dto: { name: string; balance: number } };
type ChangeUserArgs = { id: string; dto: { name?: string; balance?: number } };
type CreateProfileArgs = { dto: { userId: string; isMale: boolean; yearOfBirth: number; memberTypeId: string } };
type ChangeProfileArgs = { id: string; dto: { isMale?: boolean; yearOfBirth?: number; memberTypeId?: string } };
type CreatePostArgs = { dto: { authorId: string; title: string; content: string } };
type ChangePostArgs = { id: string; dto: { title?: string; content?: string } };
type SubscribeArgs = { userId: string; authorId: string };

export const Mutations = new GraphQLObjectType({
  name: "Mutations",
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (_parent, args: CreateUserArgs, context: GraphQLContext) => {
      return context.prisma.user.create({ data: args.dto });
    },
  },

    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangeUserInput) } },
      resolve: async (_parent, args: ChangeUserArgs, context: GraphQLContext) => {
        return context.prisma.user.update({ where: { id: args.id }, data: args.dto });
      },
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.user.delete({ where: { id: args.id } });
        return "User deleted";
      },
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (_parent, args: CreateProfileArgs, context: GraphQLContext) => {
        return context.prisma.profile.create({ data: args.dto, include: { memberType: true } });
      },
    },

    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangeProfileInput) } },
      resolve: async (_parent, args: ChangeProfileArgs, context: GraphQLContext) => {
        return context.prisma.profile.update({ where: { id: args.id }, data: args.dto, include: { memberType: true } });
      },
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.profile.delete({ where: { id: args.id } });
        return "Profile deleted";
      },
    },

    createPost: {
      type: new GraphQLNonNull(PostType),
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (_parent, args: CreatePostArgs, context: GraphQLContext) => {
        return context.prisma.post.create({ data: args.dto });
      },
    },

    changePost: {
      type: new GraphQLNonNull(PostType),
      args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: new GraphQLNonNull(ChangePostInput) } },
      resolve: async (_parent, args: ChangePostArgs, context: GraphQLContext) => {
        return context.prisma.post.update({ where: { id: args.id }, data: args.dto });
      },
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
        await context.prisma.post.delete({ where: { id: args.id } });
        return "Post deleted";
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: { userId: { type: new GraphQLNonNull(UUIDType) }, authorId: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: SubscribeArgs, context: GraphQLContext) => {
        await context.prisma.subscribersOnAuthors.create({ data: { subscriberId: args.userId, authorId: args.authorId } });
        return "Subscribed";
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: { userId: { type: new GraphQLNonNull(UUIDType) }, authorId: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, args: SubscribeArgs, context: GraphQLContext) => {
        await context.prisma.subscribersOnAuthors.delete({ where: { subscriberId_authorId: { subscriberId: args.userId, authorId: args.authorId } } });
        return "Unsubscribed";
      },
    },
  }),
});
