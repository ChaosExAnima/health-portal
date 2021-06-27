import React from 'react';
import { Box, Container } from '@material-ui/core';
import dayjs from 'dayjs';

import Form from 'components/form';
import { useCallNewMutation } from 'lib/apollo/queries/calls.graphql';

import type { PageProps } from 'global-types';

const NewCallPage: React.FC< PageProps > = ( { title } ) => {
	const [ newCall, { data, loading, error } ] = useCallNewMutation();
	return (
		<Container maxWidth="md">
			<Box my={ 4 }>
				<Form
					header={ title }
					onSubmit={ ( values ) => {
						const call = {
							date: values.date,
							providers: [],
							results: values.results,
						};
						newCall( { variables: { call } } );
					} }
					fields={ {
						date: {
							type: 'datetime-local',
							label: 'Date',
							initial: dayjs().format( 'YYYY-MM-DDTHH:mm' ),
							required: true,
						},
						providers: {
							label: 'Provider(s)',
							required: true,
						},
						reps: {
							label: 'Rep(s)',
						},
						reason: {
							label: 'Reason',
						},
						ref: {
							label: 'Ref #',
						},
						results: {
							label: 'Results',
							required: true,
							multiline: true,
						},
					} }
				/>
			</Box>
		</Container>
	);
};

export async function getStaticProps(): Promise< { props: PageProps } > {
	return {
		props: {
			title: 'New call',
		},
	};
}

export default NewCallPage;
