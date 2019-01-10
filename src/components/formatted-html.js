/**
 * External dependencies
 */
import xss from 'xss';
import { curryRight } from 'lodash';

/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';
import { compose } from '@wordpress/compose';

/**
 * Format and Filter HTML String.
 *
 * @return {function(string): string} format function.
 */
const format = ( () => {
	const el = document.createElement( 'div' );
	return ( string ) => {
		el.innerHTML = string;
		return el.innerHTML;
	};
} )();

const globalAllowedAttributes = [ 'id', 'class' ];

/**
 * XSS Filter.
 *
 * @return {function(string): string} format function.
 */
const xssFilter = curryRight( xss )( {
	whiteList: Object.entries( xss.whiteList ).reduce( ( acc, [ tag, ...attributes ] ) => {
		acc[ tag ] = [
			...globalAllowedAttributes,
			...attributes,
		];
		return acc;
	}, {} ),
	stripIgnoreTag: true,
	stripIgnoreTagBody: [ 'script' ],
	allowCommentTag: false,
	onIgnoreTagAttr: ( tag, name, value ) => {
		if ( name.substr( 0, 5 ) === 'data-' ) {
			return `${ name }="${ xss.escapeAttrValue( value ) }"`;
		}
	},
} );

const FormattedHTML = ( { children, unfiltered = false, ...props } ) => {
	const filters = [ format ];
	if ( ! unfiltered ) {
		filters.unshift( xssFilter );
	}
	return (
		<RawHTML { ...props }>
			{ compose( filters )( children ) }
		</RawHTML>
	);
};

export default FormattedHTML;
