import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
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

export type Answer = {
  __typename?: 'Answer';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  question?: Maybe<Array<Question>>;
  questionId: Scalars['Float']['output'];
  selection?: Maybe<Array<Selection>>;
  selectionId: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAnswer: Answer;
  createQuestion: Question;
  createSelection: Selection;
  createSurvey: Survey;
  createUser: User;
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
};


export type MutationCreateAnswerArgs = {
  questionId: Scalars['Float']['input'];
  selectionId: Scalars['Float']['input'];
};


export type MutationCreateQuestionArgs = {
  question: Scalars['String']['input'];
  surveyId: Scalars['Float']['input'];
};


export type MutationCreateSelectionArgs = {
  option: Scalars['String']['input'];
  questionId: Scalars['Float']['input'];
};


export type MutationCreateSurveyArgs = {
  expiredAt: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  answers: Array<Answer>;
  findCloseSurvey: Array<Survey>;
  findOpenSurvey: Array<Survey>;
  findQuestion: Question;
  findSurvey: Survey;
  questions: Array<Question>;
  selections: Array<Selection>;
  surveys: Array<Survey>;
  user: User;
};


export type QueryFindQuestionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindSurveyArgs = {
  id: Scalars['Int']['input'];
};

export type Question = {
  __typename?: 'Question';
  answers: Array<Answer>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  question: Scalars['String']['output'];
  selections: Array<Selection>;
  survey: Array<Survey>;
  surveyId: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Selection = {
  __typename?: 'Selection';
  answers: Array<Answer>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  option: Array<Scalars['String']['output']>;
  question?: Maybe<Array<Question>>;
  questionId: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Survey = {
  __typename?: 'Survey';
  createdAt: Scalars['DateTime']['output'];
  expiredAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  questions: Array<Question>;
  status: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, name: string, email: string } };

export type FindCloseSurveyQueryVariables = Exact<{ [key: string]: never; }>;


export type FindCloseSurveyQuery = { __typename?: 'Query', findCloseSurvey: Array<{ __typename?: 'Survey', id: string, title: string, status: boolean }> };

export type FindOpenSurveyQueryVariables = Exact<{ [key: string]: never; }>;


export type FindOpenSurveyQuery = { __typename?: 'Query', findOpenSurvey: Array<{ __typename?: 'Survey', id: string, title: string, status: boolean }> };

export type FindSurveyQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type FindSurveyQuery = { __typename?: 'Query', findSurvey: { __typename?: 'Survey', id: string, title: string, expiredAt: string } };

export type GetSurveysQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSurveysQuery = { __typename?: 'Query', surveys: Array<{ __typename?: 'Survey', id: string, title: string, expiredAt: string }> };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', accessToken: string, user: { __typename?: 'User', name: string, email: string } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateQuestionMutationVariables = Exact<{
  question: Scalars['String']['input'];
  surveyId: Scalars['Float']['input'];
}>;


export type CreateQuestionMutation = { __typename?: 'Mutation', createQuestion: { __typename?: 'Question', id: string, question: string, surveyId: number } };

export type CreateSurveyMutationVariables = Exact<{
  title: Scalars['String']['input'];
  expiredAt: Scalars['String']['input'];
}>;


export type CreateSurveyMutation = { __typename?: 'Mutation', createSurvey: { __typename?: 'Survey', id: string, title: string, expiredAt: string } };

export type CreateUserMutationVariables = Exact<{
  createUser: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', name: string, email: string, password: string } };


export const CurrentUserDocument = gql`
    query currentUser {
  user {
    id
    name
    email
  }
}
    `;
export const FindCloseSurveyDocument = gql`
    query findCloseSurvey {
  findCloseSurvey {
    id
    title
    status
  }
}
    `;
export const FindOpenSurveyDocument = gql`
    query findOpenSurvey {
  findOpenSurvey {
    id
    title
    status
  }
}
    `;
export const FindSurveyDocument = gql`
    query findSurvey($id: Int!) {
  findSurvey(id: $id) {
    id
    title
    expiredAt
  }
}
    `;
export const GetSurveysDocument = gql`
    query getSurveys {
  surveys {
    id
    title
    expiredAt
  }
}
    `;
export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      name
      email
    }
    accessToken
  }
}
    `;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export const CreateQuestionDocument = gql`
    mutation createQuestion($question: String!, $surveyId: Float!) {
  createQuestion(question: $question, surveyId: $surveyId) {
    id
    question
    surveyId
  }
}
    `;
export const CreateSurveyDocument = gql`
    mutation createSurvey($title: String!, $expiredAt: String!) {
  createSurvey(title: $title, expiredAt: $expiredAt) {
    id
    title
    expiredAt
  }
}
    `;
export const CreateUserDocument = gql`
    mutation createUser($createUser: CreateUserInput!) {
  createUser(createUserInput: $createUser) {
    name
    email
    password
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    currentUser(variables?: CurrentUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CurrentUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurrentUserQuery>(CurrentUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'currentUser', 'query', variables);
    },
    findCloseSurvey(variables?: FindCloseSurveyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FindCloseSurveyQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindCloseSurveyQuery>(FindCloseSurveyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findCloseSurvey', 'query', variables);
    },
    findOpenSurvey(variables?: FindOpenSurveyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FindOpenSurveyQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindOpenSurveyQuery>(FindOpenSurveyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findOpenSurvey', 'query', variables);
    },
    findSurvey(variables: FindSurveyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FindSurveyQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindSurveyQuery>(FindSurveyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findSurvey', 'query', variables);
    },
    getSurveys(variables?: GetSurveysQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetSurveysQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSurveysQuery>(GetSurveysDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSurveys', 'query', variables);
    },
    login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>(LoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'login', 'mutation', variables);
    },
    logout(variables?: LogoutMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LogoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LogoutMutation>(LogoutDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'logout', 'mutation', variables);
    },
    createQuestion(variables: CreateQuestionMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateQuestionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateQuestionMutation>(CreateQuestionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createQuestion', 'mutation', variables);
    },
    createSurvey(variables: CreateSurveyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateSurveyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateSurveyMutation>(CreateSurveyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createSurvey', 'mutation', variables);
    },
    createUser(variables: CreateUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserMutation>(CreateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createUser', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;