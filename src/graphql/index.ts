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







export type CreateDayInput = {
  date: Scalars['Date'];
  period: Scalars['ID'];
};

export type CreatePeriodInput = {
  lunchDurationMinutes: Scalars['Int'];
  worktimePercentage: Scalars['Float'];
};

export type CreateTimeslotInput = {
  start: Scalars['Time'];
  end: Scalars['Time'];
  day: Scalars['ID'];
  activity: Scalars['String'];
};

/** 'Day' input values */
export type DayInput = {
  period?: Maybe<DayPeriodRelation>;
  timeslots?: Maybe<DayTimeslotsRelation>;
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

/** Allow manipulating the relationship between the types 'Day' and 'Period' using the field 'Day.period'. */
export type DayPeriodRelation = {
  /** Create a document of type 'Period' and associate it with the current document. */
  create?: Maybe<PeriodInput>;
  /** Connect a document of type 'Period' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
};

/** Allow manipulating the relationship between the types 'Day' and 'Timeslot'. */
export type DayTimeslotsRelation = {
  /** Create one or more documents of type 'Timeslot' and associate them with the current document. */
  create?: Maybe<Array<Maybe<TimeslotInput>>>;
  /** Connect one or more documents of type 'Timeslot' with the current document using their IDs. */
  connect?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Disconnect the given documents of type 'Timeslot' from the current document using their IDs. */
  disconnect?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateUser?: Maybe<User>;
  /** Create a new document in the collection of 'User' */
  createUser: User;
  /** Delete an existing document in the collection of 'Day' */
  deleteDay?: Maybe<Day>;
  /** Update an existing document in the collection of 'Timeslot' */
  updateTimeslot?: Maybe<Timeslot>;
  createDay: Day;
  /** Delete an existing document in the collection of 'Timeslot' */
  deleteTimeslot?: Maybe<Timeslot>;
  createPeriod: Period;
  /** Delete an existing document in the collection of 'Period' */
  deletePeriod?: Maybe<Period>;
  createTimeslot: Timeslot;
  /** Delete an existing document in the collection of 'User' */
  deleteUser?: Maybe<User>;
  /** Update an existing document in the collection of 'Day' */
  updateDay?: Maybe<Day>;
  /** Update an existing document in the collection of 'Period' */
  updatePeriod?: Maybe<Period>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  data?: Maybe<UpdateUserInput>;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationDeleteDayArgs = {
  id: Scalars['ID'];
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


export type MutationCreatePeriodArgs = {
  data?: Maybe<CreatePeriodInput>;
};


export type MutationDeletePeriodArgs = {
  id: Scalars['ID'];
};


export type MutationCreateTimeslotArgs = {
  data: CreateTimeslotInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateDayArgs = {
  id: Scalars['ID'];
  data: DayInput;
};


export type MutationUpdatePeriodArgs = {
  id: Scalars['ID'];
  data: PeriodInput;
};

/** Allow manipulating the relationship between the types 'Period' and 'Day'. */
export type PeriodDaysRelation = {
  /** Create one or more documents of type 'Day' and associate them with the current document. */
  create?: Maybe<Array<Maybe<DayInput>>>;
  /** Connect one or more documents of type 'Day' with the current document using their IDs. */
  connect?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Disconnect the given documents of type 'Day' from the current document using their IDs. */
  disconnect?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** 'Period' input values */
export type PeriodInput = {
  days?: Maybe<PeriodDaysRelation>;
  settings: SettingsInput;
  owner?: Maybe<PeriodOwnerRelation>;
};

/** Allow manipulating the relationship between the types 'Period' and 'User' using the field 'Period.owner'. */
export type PeriodOwnerRelation = {
  /** Create a document of type 'User' and associate it with the current document. */
  create?: Maybe<UserInput>;
  /** Connect a document of type 'User' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
};

/** 'Settings' input values */
export type SettingsInput = {
  worktimePercentage: Scalars['Float'];
  lunchDurationMinutes: Scalars['Int'];
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
  day?: Maybe<TimeslotDayRelation>;
  start: Scalars['Time'];
  end: Scalars['Time'];
  activity: Scalars['String'];
  owner?: Maybe<TimeslotOwnerRelation>;
};

/** Allow manipulating the relationship between the types 'Timeslot' and 'User' using the field 'Timeslot.owner'. */
export type TimeslotOwnerRelation = {
  /** Create a document of type 'User' and associate it with the current document. */
  create?: Maybe<UserInput>;
  /** Connect a document of type 'User' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
};

export type UpdateUserInput = {
  worktimePercentage: Scalars['Float'];
  lunchDurationMinutes: Scalars['Int'];
};

/** 'User' input values */
export type UserInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  defaultSettings?: Maybe<SettingsInput>;
};


export type Day = {
  __typename?: 'Day';
  /** The document's ID. */
  _id: Scalars['ID'];
  date: Scalars['Date'];
  owner: User;
  timeslots: TimeslotPage;
  period: Period;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};


export type DayTimeslotsArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
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

export type Period = {
  __typename?: 'Period';
  /** The document's ID. */
  _id: Scalars['ID'];
  owner: User;
  settings: Settings;
  days: DayPage;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};


export type PeriodDaysArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};

/** The pagination object for elements of type 'Period'. */
export type PeriodPage = {
  __typename?: 'PeriodPage';
  /** The elements of type 'Period' in this page. */
  data: Array<Maybe<Period>>;
  /** A cursor for elements coming after the current page. */
  after?: Maybe<Scalars['String']>;
  /** A cursor for elements coming before the current page. */
  before?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getAllPeriods: PeriodPage;
  /** Find a document from the collection of 'Day' by its id. */
  findDayByID?: Maybe<Day>;
  /** Find a document from the collection of 'User' by its id. */
  findUserByID?: Maybe<User>;
  /** Find a document from the collection of 'Period' by its id. */
  findPeriodByID?: Maybe<Period>;
  /** Find a document from the collection of 'Timeslot' by its id. */
  findTimeslotByID?: Maybe<Timeslot>;
};


export type QueryGetAllPeriodsArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};


export type QueryFindDayByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindUserByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindPeriodByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindTimeslotByIdArgs = {
  id: Scalars['ID'];
};

export type Settings = {
  __typename?: 'Settings';
  worktimePercentage: Scalars['Float'];
  lunchDurationMinutes: Scalars['Int'];
};


export type Timeslot = {
  __typename?: 'Timeslot';
  /** The document's ID. */
  _id: Scalars['ID'];
  end: Scalars['Time'];
  owner: User;
  start: Scalars['Time'];
  activity: Scalars['String'];
  day: Day;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};

/** The pagination object for elements of type 'Timeslot'. */
export type TimeslotPage = {
  __typename?: 'TimeslotPage';
  /** The elements of type 'Timeslot' in this page. */
  data: Array<Maybe<Timeslot>>;
  /** A cursor for elements coming after the current page. */
  after?: Maybe<Scalars['String']>;
  /** A cursor for elements coming before the current page. */
  before?: Maybe<Scalars['String']>;
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
  defaultSettings?: Maybe<Settings>;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};


export type AddTimeslotMutationVariables = Exact<{
  day: Scalars['ID'];
  start: Scalars['Time'];
  end: Scalars['Time'];
  activity: Scalars['String'];
}>;


export type AddTimeslotMutation = (
  { __typename?: 'Mutation' }
  & { createTimeslot: (
    { __typename?: 'Timeslot' }
    & Pick<Timeslot, '_id' | 'start' | 'end' | 'activity'>
  ) }
);

export type DeleteTimeslotMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTimeslotMutation = (
  { __typename?: 'Mutation' }
  & { deleteTimeslot?: Maybe<(
    { __typename?: 'Timeslot' }
    & Pick<Timeslot, '_id'>
  )> }
);

export type EditTimeslotMutationVariables = Exact<{
  id: Scalars['ID'];
  start: Scalars['Time'];
  end: Scalars['Time'];
  activity: Scalars['String'];
}>;


export type EditTimeslotMutation = (
  { __typename?: 'Mutation' }
  & { updateTimeslot?: Maybe<(
    { __typename?: 'Timeslot' }
    & Pick<Timeslot, '_id' | 'start' | 'end' | 'activity'>
  )> }
);

export type AllPeriodsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPeriodsQuery = (
  { __typename?: 'Query' }
  & { getAllPeriods: (
    { __typename?: 'PeriodPage' }
    & { data: Array<Maybe<(
      { __typename?: 'Period' }
      & Pick<Period, '_id'>
      & { days: (
        { __typename?: 'DayPage' }
        & { data: Array<Maybe<(
          { __typename?: 'Day' }
          & Pick<Day, '_id' | 'date'>
        )>> }
      ) }
    )>> }
  ) }
);

export type GetPeriodQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPeriodQuery = (
  { __typename?: 'Query' }
  & { findPeriodByID?: Maybe<(
    { __typename?: 'Period' }
    & Pick<Period, '_id'>
    & { settings: (
      { __typename?: 'Settings' }
      & Pick<Settings, 'worktimePercentage' | 'lunchDurationMinutes'>
    ), days: (
      { __typename?: 'DayPage' }
      & { data: Array<Maybe<(
        { __typename?: 'Day' }
        & Pick<Day, '_id' | 'date'>
        & { timeslots: (
          { __typename?: 'TimeslotPage' }
          & { data: Array<Maybe<(
            { __typename?: 'Timeslot' }
            & Pick<Timeslot, '_id' | 'start' | 'end' | 'activity'>
          )>> }
        ) }
      )>> }
    ) }
  )> }
);

export type UpdateSettingsMutationVariables = Exact<{
  id: Scalars['ID'];
  worktimePercentage: Scalars['Float'];
  lunchDurationMinutes: Scalars['Int'];
}>;


export type UpdateSettingsMutation = (
  { __typename?: 'Mutation' }
  & { updatePeriod?: Maybe<(
    { __typename?: 'Period' }
    & { settings: (
      { __typename?: 'Settings' }
      & Pick<Settings, 'worktimePercentage' | 'lunchDurationMinutes'>
    ) }
  )> }
);


export const AddTimeslotDocument: DocumentNode<AddTimeslotMutation, AddTimeslotMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddTimeslot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"day"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Time"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Time"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTimeslot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"day"},"value":{"kind":"Variable","name":{"kind":"Name","value":"day"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"activity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activity"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}}]}}]}}]};
export const DeleteTimeslotDocument: DocumentNode<DeleteTimeslotMutation, DeleteTimeslotMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTimeslot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTimeslot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]};
export const EditTimeslotDocument: DocumentNode<EditTimeslotMutation, EditTimeslotMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditTimeslot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Time"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Time"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTimeslot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"activity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activity"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}}]}}]}}]};
export const AllPeriodsDocument: DocumentNode<AllPeriodsQuery, AllPeriodsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllPeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]}}]}}]};
export const GetPeriodDocument: DocumentNode<GetPeriodQuery, GetPeriodQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPeriod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findPeriodByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worktimePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"lunchDurationMinutes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"timeslots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}}]}}]}}]}}]}}]}}]}}]};
export const UpdateSettingsDocument: DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"worktimePercentage"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lunchDurationMinutes"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePeriod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"settings"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"worktimePercentage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"worktimePercentage"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lunchDurationMinutes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lunchDurationMinutes"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worktimePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"lunchDurationMinutes"}}]}}]}}]}}]};