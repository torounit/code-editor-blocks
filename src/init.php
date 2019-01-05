<?php
/**
 * Initialize.
 *
 * @package Code_Editor_Blocks
 */

namespace Code_Editor_Blocks;

add_action(
	'enqueue_block_editor_assets',
	function () {
		wp_enqueue_code_editor( [ 'type' => 'text/html' ] );
		wp_add_inline_style( 'code-editor', '.CodeMirror { font-size: 14px }' );
		wp_enqueue_script(
			'code-editor-blocks',
			plugins_url( 'dist/main.js', PLUGIN_FILE ),
			[
				'wp-blocks',
				'wp-components',
				'wp-data',
				'wp-element',
				'wp-editor',
				'wp-edit-post',
				'wp-i18n',
				'code-editor',
			],
			get_plugin_data()['Version'],
			true
		);
	}
);
