/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SVG, Polygon, Rect } from '@wordpress/components';
import { createBlock, registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import CodeEditor from '../../components/code-editor';

const name = 'code-editor-blocks/code';

const settings = {
	title: __( 'Code (Code Editor Blocks)', 'code-editor-blocks' ),

	description: __( 'Add custom HTML code and preview it as you edit.', 'code-editor-blocks' ),

	icon: (
		<SVG xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
			<Polygon points="70.8,66.8 65.2,61.2 78.3,48 65.2,34.8 70.8,29.2 89.7,48 " />
			<Polygon points="25.2,66.8 6.3,48 25.2,29.2 30.8,34.8 17.7,48 30.8,61.2 " />
			<Rect x="23.3" y="44" transform="matrix(0.2424 -0.9702 0.9702 0.2424 -10.2054 82.9303)" width="49.5" height="8" />
		</SVG>
	),

	category: 'formatting',

	keywords: [ __( 'embed' ), __( 'html' ) ],

	supports: {
		html: false,
	},

	attributes: {
		content: {
			type: 'string',
			source: 'text',
			selector: 'code',
		},
	},

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/code' ],
				transform: ( { content } ) => createBlock( name, { content } ),
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/code' ],
				transform: ( { content } ) => createBlock( 'core/code', { content } ),
			},
		],
	},

	edit: ( { attributes, setAttributes, clientId, className } ) => {
		return (
			<div className={ `wp-block-code code-editor-blocks-code ${ className }` }>
				<CodeEditor
					mode="javascript"
					id={ `editor-${ clientId }` }
					value={ attributes.content }
					onChange={ ( content ) => setAttributes( { content } ) }
					placeholder={ __( 'Write Code…' ) }
					aria-label={ __( 'Code' ) }
				/>
			</div>
		);
	},
	save: ( { attributes, className } ) => {
		return (
			<div className={ `wp-block-code code-editor-blocks-code ${ className }` }>
				<pre><code>{ attributes.content }</code></pre>
			</div>
		);
	},
};

registerBlockType( name, settings );
