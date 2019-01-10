/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { PlainText } from '@wordpress/editor';

/**
 * @typedef {object} wp.codeEditor~CodeEditorInstance
 * @property {object} settings - The code editor settings.
 * @property {CodeMirror} codemirror - The CodeMirror instance.
 */

const { wp } = window;

/**
 * wp.codeEditor
 *
 * @type {CodeEditorInstance}
 */
const { codeEditor } = wp;

export default class CodeEdit extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			value: '',
		};
		this.initialize = this.initialize.bind( this );
		this.updateValue = this.updateValue.bind( this );
	}

	componentDidMount() {
		if ( document.readyState === 'complete' ) {
			this.initialize();
		} else {
			window.addEventListener( 'DOMContentLoaded', this.initialize );
		}
	}

	componentWillUnmount() {
		this.updateValue();
		this.editor.codemirror.toTextArea();
		this.editor.codemirror.off( 'keyHandled' );
		this.editor = null;
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.value !== this.editor.codemirror.doc.getValue() ) {
			this.updateValue();
		}
		if ( prevProps.mode !== this.props.mode ) {
			this.editor.codemirror.setOption( 'mode', this.props.mode );
		}
	}

	updateValue() {
		const { onChange } = this.props;
		if ( this.editor ) {
			this.setState( { value: this.editor.codemirror.doc.getValue() } );
			onChange( this.editor.codemirror.doc.getValue() );
			this.editor.codemirror.save();
		}
	}

	initialize() {
		const mode = this.props.mode || 'htmlmixed';
		const codemirrorSettings = codeEditor.defaultSettings.codemirror;
		this.editor = codeEditor.initialize( this.props.id, {
			codemirror: {
				...codemirrorSettings,
				mode,
			},
		} );
		this.updateValue();
		this.editor.codemirror.on( 'keyHandled', ( cm, name, event ) => event.stopPropagation() );
	}

	render() {
		return <PlainText { ...this.props } />;
	}
}
