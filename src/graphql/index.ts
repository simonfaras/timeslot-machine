import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Time: any;
  /** The `Long` scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
};







/** 'Activity' input values */
export type ActivityInput = {
  name: Scalars['String'];
};

export type CreateDayInput = {
  date: Scalars['Date'];
};

export type CreateTimeslotInput = {
  start: Scalars['Time'];
  end: Scalars['Time'];
  day: Scalars['ID'];
  activity: Scalars['String'];
};

/** 'Day' input values */
export type DayInput = {
  timeslots?: Maybe<Array<Maybe<Scalars['ID']>>>;
  date: Scalars['Date'];
  owner?: Maybe<DayOwnerRelation>;
};

/** Allow manipulating the relationship between the types 'Day' and 'User' using the field 'Day.owner'. */
export type DayOwnerRelation = {
  /** Create a document of type 'User' and associate it with the current document. */
  create?: Maybe<UserInput>;
  /** Connect a document of type 'User' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Update an existing document in the collection of 'User' */
  updateUser?: Maybe<User>;
  /** Create a new document in the collection of 'User' */
  createUser: User;
  /** Create a new document in the collection of 'Activity' */
  createActivity: Activity;
  /** Delete an existing document in the collection of 'Day' */
  deleteDay?: Maybe<Day>;
  /** Update an existing document in the collection of 'Setting' */
  updateSetting?: Maybe<Setting>;
  /** Update an existing document in the collection of 'Timeslot' */
  updateTimeslot?: Maybe<Timeslot>;
  createDay: Day;
  /** Delete an existing document in the collection of 'Timeslot' */
  deleteTimeslot?: Maybe<Timeslot>;
  /** Create a new document in the collection of 'Setting' */
  createSetting: Setting;
  /** Delete an existing document in the collection of 'Setting' */
  deleteSetting?: Maybe<Setting>;
  createTimeslot: Timeslot;
  /** Update an existing document in the collection of 'Activity' */
  updateActivity?: Maybe<Activity>;
  /** Delete an existing document in the collection of 'User' */
  deleteUser?: Maybe<User>;
  /** Update an existing document in the collection of 'Day' */
  updateDay?: Maybe<Day>;
  /** Delete an existing document in the collection of 'Activity' */
  deleteActivity?: Maybe<Activity>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  data: UserInput;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationCreateActivityArgs = {
  data: ActivityInput;
};


export type MutationDeleteDayArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateSettingArgs = {
  id: Scalars['ID'];
  data: SettingInput;
};


export type MutationUpdateTimeslotArgs = {
  id: Scalars['ID'];
  data: TimeslotInput;
};


export type MutationCreateDayArgs = {
  data: CreateDayInput;
};


export type MutationDeleteTimeslotArgs = {
  id: Scalars['ID'];
};


export type MutationCreateSettingArgs = {
  data: SettingInput;
};


export type MutationDeleteSettingArgs = {
  id: Scalars['ID'];
};


export type MutationCreateTimeslotArgs = {
  data: CreateTimeslotInput;
};


export type MutationUpdateActivityArgs = {
  id: Scalars['ID'];
  data: ActivityInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateDayArgs = {
  id: Scalars['ID'];
  data: DayInput;
};


export type MutationDeleteActivityArgs = {
  id: Scalars['ID'];
};

/** 'Setting' input values */
export type SettingInput = {
  lunchDuration?: Maybe<Scalars['Int']>;
  worktimePercentage?: Maybe<Scalars['Float']>;
};

/** Allow manipulating the relationship between the types 'Timeslot' and 'Day' using the field 'Timeslot.day'. */
export type TimeslotDayRelation = {
  /** Create a document of type 'Day' and associate it with the current document. */
  create?: Maybe<DayInput>;
  /** Connect a document of type 'Day' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
};

/** 'Timeslot' input values */
export type TimeslotInput = {
  start: Scalars['Time'];
  end: Scalars['Time'];
  day?: Maybe<TimeslotDayRelation>;
  activity: Scalars['String'];
};

/** 'User' input values */
export type UserInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
};

export type Activity = {
  __typename?: 'Activity';
  /** The document's ID. */
  _id: Scalars['ID'];
  /** The document's timestamp. */
  _ts: Scalars['Long'];
  name: Scalars['String'];
};


export type Day = {
  __typename?: 'Day';
  /** The document's ID. */
  _id: Scalars['ID'];
  date: Scalars['Date'];
  owner: User;
  timeslots?: Maybe<Array<Maybe<Timeslot>>>;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};

/** The pagination object for elements of type 'Day'. */
export type DayPage = {
  __typename?: 'DayPage';
  /** The elements of type 'Day' in this page. */
  data: Array<Maybe<Day>>;
  /** A cursor for elements coming after the current page. */
  after?: Maybe<Scalars['String']>;
  /** A cursor for elements coming before the current page. */
  before?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Find a document from the collection of 'Setting' by its id. */
  findSettingByID?: Maybe<Setting>;
  /** Find a document from the collection of 'Day' by its id. */
  findDayByID?: Maybe<Day>;
  allDays: DayPage;
  /** Find a document from the collection of 'Activity' by its id. */
  findActivityByID?: Maybe<Activity>;
  /** Find a document from the collection of 'User' by its id. */
  findUserByID?: Maybe<User>;
  /** Find a document from the collection of 'Timeslot' by its id. */
  findTimeslotByID?: Maybe<Timeslot>;
};


export type QueryFindSettingByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindDayByIdArgs = {
  id: Scalars['ID'];
};


export type QueryAllDaysArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};


export type QueryFindActivityByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindUserByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindTimeslotByIdArgs = {
  id: Scalars['ID'];
};

export type Setting = {
  __typename?: 'Setting';
  /** The document's ID. */
  _id: Scalars['ID'];
  /** The document's timestamp. */
  _ts: Scalars['Long'];
  lunchDuration?: Maybe<Scalars['Int']>;
  worktimePercentage?: Maybe<Scalars['Float']>;
};


export type Timeslot = {
  __typename?: 'Timeslot';
  /** The document's ID. */
  _id: Scalars['ID'];
  end: Scalars['Time'];
  start: Scalars['Time'];
  activity: Scalars['String'];
  day: Day;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};

export type User = {
  __typename?: 'User';
  name: Scalars['String'];
  updatedAt: Scalars['Time'];
  email: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  /** The document's ID. */
  _id: Scalars['ID'];
  createdAt: Scalars['Time'];
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};


export type AllDaysQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDaysQuery = (
  { __typename?: 'Query' }
  & { allDays: (
    { __typename?: 'DayPage' }
    & { data: Array<Maybe<(
      { __typename?: 'Day' }
      & Pick<Day, '_id' | 'date'>
    )>> }
  ) }
);


export const AllDaysDocument: DocumentNode<AllDaysQuery, AllDaysQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllDays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allDays"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]};