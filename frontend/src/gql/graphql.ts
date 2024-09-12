/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AuthInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type CreateQuestionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateSurveyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  userId: Scalars['Float']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createQuestion: Question;
  createSurvey: Survey;
  createUser: User;
  deleteQuestion: Scalars['Boolean']['output'];
  deleteSurvey: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: AuthResponse;
  updateQuestion: Question;
  updateSurvey: Survey;
  updateUser: User;
};


export type MutationCreateQuestionArgs = {
  createQuestionInput: CreateQuestionInput;
};


export type MutationCreateSurveyArgs = {
  createSurveyInput: CreateSurveyInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteQuestionArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteSurveyArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  authInput: AuthInput;
};


export type MutationUpdateQuestionArgs = {
  id: Scalars['Int']['input'];
  updateQuestionInput: UpdateQuestionInput;
};


export type MutationUpdateSurveyArgs = {
  id: Scalars['Int']['input'];
  updateSurveyInput: UpdateSurveyInput;
};


export type MutationUpdateUserArgs = {
  email: Scalars['String']['input'];
  updateUserInput: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  findQuestion: Question;
  findSurvey: Survey;
  findUser: User;
  questions: Array<Question>;
  surveys: Array<Survey>;
  users: Array<User>;
};


export type QueryFindQuestionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindSurveyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindUserArgs = {
  email: Scalars['String']['input'];
};

export type Question = {
  __typename?: 'Question';
  createdAt: Scalars['DateTime']['output'];
  description: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  survey?: Maybe<Array<Question>>;
  title: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Survey = {
  __typename?: 'Survey';
  createdAt: Scalars['DateTime']['output'];
  description: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  questions: Array<Question>;
  title: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<Array<Survey>>;
};

export type UpdateQuestionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type UpdateSurveyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
  surveys?: Maybe<Array<Survey>>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  General = 'GENERAL'
}
