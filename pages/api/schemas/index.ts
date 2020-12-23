import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
union EventLink = Claim | Dispute | Call

scalar Date
scalar DateTime
scalar Slug

enum ClaimType {
	DENTAL
	OUTOFNETWORK
	INNETWORK
	PHARMACY
}

enum ClaimStatus {
	PENDING
	APPROVED
	DENIED
	DELETED
}

enum EventType {
	PAYMENT
	CALL
	APPEAL
	UPDATE
	NOTE
}

type Provider {
	id: ID!
	name: String!
	slug: Slug!
	location: String
	history: [Event!]
}

type Claim {
	id: ID!
	claim: String!
	slug: Slug!
	date: Date!
	provider: Provider!
	type: ClaimType
	billed: Float
	cost: Float
	owed: Float
	status: ClaimStatus!
	history: [Event!]
}

type Call {
	id: ID!
	slug: Slug!
	provider: Provider!
	rep: String
	callId: String
	date: DateTime!
	reason: String
	notes: String
}

type Dispute {
	id: ID!
	slug: Slug!
	provider: Provider!
	claims: [Claim!]
	date: Date!
	history: [Event!]
}

type Event {
	id: ID!
	type: EventType!
	date: Date!
	description: String
	link: EventLink
}

type ClaimResponse {
	claims: [Claim]!
	totalCount: Int!
	offset: Int!
	limit: Int!
}

type Query {
	getClaims(offset: Int, limit: Int): ClaimResponse!
	claim(claim: String!): Claim!
}`;
