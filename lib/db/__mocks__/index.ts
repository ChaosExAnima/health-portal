console.log( 'Mock loaded!' );

const getDB = jest.createMockFromModule( 'lib/db' );

export default getDB;
