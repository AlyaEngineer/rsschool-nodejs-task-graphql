import {
  User as PrismaUser,
  Profile as PrismaProfile,
  Post as PrismaPost,
  MemberType as PrismaMemberType,
} from "@prisma/client";


export type GqlMemberType = PrismaMemberType;

export type GqlPost = Omit<PrismaPost, "authorId">;

export type GqlProfile = Omit<PrismaProfile, "userId" | "memberTypeId"> & {
  memberType: GqlMemberType;
};

export type GqlUser = Omit<PrismaUser, ""> & {
  profile?: GqlProfile | null;
  posts: GqlPost[];
  userSubscribedTo: GqlUser[];
  subscribedToUser: GqlUser[];
};

export interface RootQueryReturn {
  users: GqlUser[];
  user: GqlUser | null;
  profiles: GqlProfile[];
  profile: GqlProfile | null;
  posts: GqlPost[];
  post: GqlPost | null;
  memberTypes: GqlMemberType[];
  memberType: GqlMemberType | null;
}
