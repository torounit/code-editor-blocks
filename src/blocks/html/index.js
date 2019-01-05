/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Disabled, SVG, Polygon, Rect } from '@wordpress/components';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import { BlockControls } from '@wordpress/editor';
import { compose, withState } from '@wordpress/compose';
import CodeEditor from './code-editor';

const name = 'code-editor-blocks/html';

const settings = {
	title: __( 'Custom HTML', 'code-editor-blocks' ),

	description: __( 'Add custom HTML code and preview it as you edit.', 'code-editor-blocks' ),

	icon: <SVG xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><Polygon points="66.12 66.12 61.88 61.88 75.76 48 61.88 34.12 66.12 29.88 84.24 48 66.12 66.12" /><Polygon points="29.88 66.12 11.76 48 29.88 29.88 34.12 34.12 20.24 48 34.12 61.88 29.88 66.12" /><Rect x="15.02" y="45" width="65.97" height="6" transform="translate(-10.21 82.93) rotate(-75.97)" /></SVG>,

	category: 'formatting',

	keywords: [ __( 'embed' ), __( 'html' ) ],

	supports: {
		align: [ 'wide', 'full' ],
		customClassName: false,
		className: false,
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

	edit: compose( [
		withState( { isPreview: false } ),
	] )( ( { attributes, setAttributes, setState, isPreview, clientId, className } ) => {
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
		return (
			<div className="wp-block-html">
				{ blockControls }
				<Disabled.Consumer>
					{ ( isDisabled ) => (
						( isPreview || isDisabled ) ? (
							<RawHTML className={ className }>{ attributes.content }</RawHTML>
						) : (
							<CodeEditor
								id={ `editor-${ clientId }` }
								value={ attributes.content }
								onChange={ ( content ) => setAttributes( { content } ) }
								placeholder={ __( 'Write HTML…' ) }
								aria-label={ __( 'HTML' ) }
							/>
						)
					) }
				</Disabled.Consumer>

			</div>
		);
	} ),
	save: ( { attributes, className } ) => (
		<RawHTML className={ className }>{ attributes.content }</RawHTML>

	),
};

registerBlockType( name, settings );
