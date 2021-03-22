import InputBase, { ClaimInsertData, RawClaim } from './input-base';

type TestClaim = {
	number: string;
	status: string;
	type: string;
	serviceDate: string;
	billed: string;
	cost: string;
};

export default class InputTest extends InputBase< TestClaim > {
	public convert( input: RawClaim ): ClaimInsertData {
		return {
			...input,
			serviceDate: new Date( input.serviceDate ),
			billed: Number.parseFloat( input.billed ),
			cost: Number.parseFloat( input.cost ),
		};
	}

	public validate( input: RawClaim ): input is TestClaim {
		return (
			'number' in input &&
			'status' in input &&
			'serviceDate' in input &&
			'type' in input &&
			'billed' in input &&
			'cost' in input
		);
	}
}
