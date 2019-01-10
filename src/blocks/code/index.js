/**
 * WordPress dependencies
 */
import { SVG, Path, PanelBody, SelectControl } from '@wordpress/components';
import { createBlock, registerBlockType } from '@wordpress/blocks';

import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
} from '@wordpress/editor';
/**
 * Internal dependencies
 */
import CodeEditor from '../../components/code-editor';

const name = 'code-editor-blocks/code';

const settings = {
	title: __( 'Code (Code Editor Blocks)', 'code-editor-blocks' ),

	description: __( 'Display code snippets that respect your spacing and tabs.', 'code-editor-blocks' ),

	icon: <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path d="M0,0h24v24H0V0z" fill="none" /><Path
		d="M9.4,16.6L4.8,12l4.6-4.6L8,6l-6,6l6,6L9.4,16.6z M14.6,16.6l4.6-4.6l-4.6-4.6L16,6l6,6l-6,6L14.6,16.6z" /></SVG>,

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
		mode: {
			type: 'string',
			source: 'attribute',
			selector: 'pre',
			attribute: 'data-lang',
			default: 'htmlmixed',
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
		const title = sprintf( __( '%s Block Seetting', 'code-editor-blocks' ) );

		const ModeControls = (
			<SelectControl
				label="Mode"
				value={ attributes.mode }
				options={ [
					{ value: 'htmlmixed', label: 'HTML' },
					{ value: 'text/css', label: 'CSS' },
					{ value: 'javascript', label: 'JavaScript' },
				] }
				onChange={ ( value ) => {
					setAttributes( { mode: value ? value : undefined } );
				} }
			/>
		);
		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ title }>
					{ ModeControls }
				</PanelBody>
			</InspectorControls>
		);

		return (
			<div className={ `wp-block-code code-editor-blocks-code ${ className }` }>
				{ inspectorControls }
				<CodeEditor
					mode={ attributes.mode }
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
			<div
				className={ `wp-block-code code-editor-blocks-code ${ className }` }>
				<pre data-lang={ attributes.mode }><code>{ attributes.content }</code></pre>
			</div>
		);
	},
};

registerBlockType( name, settings );
