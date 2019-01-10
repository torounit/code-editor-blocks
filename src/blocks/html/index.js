/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled, SVG, Polygon, Rect, Placeholder } from '@wordpress/components';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import { BlockControls } from '@wordpress/editor';
import { compose, withState } from '@wordpress/compose';
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CodeEditor from '../../components/code-editor';
import FormattedHTML from '../../components/formatted-html';

const name = 'code-editor-blocks/html';

const settings = {
	title: __( 'Custom HTML (Code Editor Blocks)', 'code-editor-blocks' ),

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
		align: [ 'full' ],
		//customClassName: false,
		//className: false,
		html: false,
	},

	attributes: {
		content: {
			type: 'string',
			source: 'html',
			selector: 'div',
		},
	},

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/html' ],
				transform: ( { content } ) => createBlock( name, { content } ),
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/html' ],
				transform: ( { content } ) => createBlock( 'core/html', { content } ),
			},
		],
	},

	edit: compose(
		withState( { isPreview: false } )
	)( ( { attributes, setAttributes, setState, isPreview, clientId, className } ) => {
		const blockControls = (
			<BlockControls>
				<div className="components-toolbar">
					<button
						className={ `components-tab-button ${ ! isPreview ? 'is-active' : '' }` }
						onClick={ () => setState( { isPreview: false } ) }
					>
						<span>HTML</span>
					</button>
					<button
						className={ `components-tab-button ${ isPreview ? 'is-active' : '' }` }
						onClick={ () => setState( { isPreview: true } ) }
					>
						<span>{ __( 'Preview' ) }</span>
					</button>
				</div>
			</BlockControls>
		);

		const Content = ( attributes.content ) ? (
			<FormattedHTML className={ className }>
				{ attributes.content }
			</FormattedHTML>
		) : (
			<Placeholder >
				{ __( 'No Content', 'code-editor-blocks' ) }
			</Placeholder>
		);

		const Editor = (
			<CodeEditor
				id={ `editor-${ clientId }` }
				value={ attributes.content }
				onChange={ ( content ) => setAttributes( { content } ) }
				placeholder={ __( 'Write HTML…' ) }
				aria-label={ __( 'HTML' ) }
			/>
		);

		return (
			<div className="wp-block-html code-editor-blocks-html">
				{ blockControls }
				<Disabled.Consumer>
					{ ( isDisabled ) => (
						( isPreview || isDisabled ) ? Content : Editor
					) }
				</Disabled.Consumer>

			</div>
		);
	} ),
	save: ( { attributes, className } ) => {
		return (
			<FormattedHTML className={ className }>
				{ attributes.content }
			</FormattedHTML>

		);
	},
};

registerBlockType( name, settings );
