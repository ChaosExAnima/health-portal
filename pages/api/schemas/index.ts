import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
type Provider {
	id: ID!
	name: String!
	location: String
}

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

type Claim {
	id: ID!
	claim: String!
	date: String!
	provider: Provider
	type: ClaimType
	billed: Float
	cost: Float
	status: ClaimStatus!
}

type ClaimResponse {
	claims: [Claim]!
	totalCount: Int!
	offset: Int!
	limit: Int!
}

type Query {
	getClaims(offset: Int): ClaimResponse!
}`;
