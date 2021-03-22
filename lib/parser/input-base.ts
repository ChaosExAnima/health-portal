import type { Claim, Provider } from 'lib/db/entities';
import { slugify } from 'lib/strings';
import type { DeepPartial } from 'typeorm';
import type { RawClaim } from '.';

export type ClaimInsertData = Omit< DeepPartial< Claim >, 'slug' | 'provider' >;
export type ClaimPartial = ClaimInsertData & {
	provider?: string;
};
export type { RawClaim };

export default abstract class InputBase< T extends RawClaim > {
	protected currentClaim?: ClaimPartial;
	protected providers: Provider[] = [];

	public abstract validate( input: RawClaim ): input is T;

	public abstract convert( input: T ): ClaimInsertData;

	public process( input: RawClaim ): ClaimInsertData | false {
		if ( this.validate( input ) ) {
			this.currentClaim = input;
			return this.convert( input );
		}
		return false;
	}

	public loadProviders( providers: Provider[] ): void {
		this.providers = providers;
	}

	public getProviderOrThrow(): Provider {
		const currentClaim = this.currentClaim;
		if ( ! currentClaim ) {
			throw new Error( 'No claim set' );
		}
		const currentProvider = currentClaim.provider;
		if ( ! currentProvider ) {
			throw new Error( 'No provider' );
		}
		const provider = this.providers.find(
			( { slug } ) => slug === slugify( currentProvider )
		);
		if ( ! provider ) {
			throw new Error( 'Unknown provider' );
		}
		return provider;
	}
}
