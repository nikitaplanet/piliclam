import {type SchemaTypeDefinition} from 'sanity';
import {homePageType} from './homePageType';
import {postType} from './postType';

export const schema: {types: SchemaTypeDefinition[]} = {
	types: [homePageType, postType],
};
