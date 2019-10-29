import * as React from 'react';

import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';
import Editor from 'draft-js-plugins-editor';

import Prism from 'prismjs';
import createPrismPlugin from 'draft-js-prism-plugin';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';

import './CortoEditor.scss';
import createInlineCodePlugin from './plugins/inlineCodePlugin';
import createMarkdownHeadersPlugin from './plugins/MarkDownHeaders';
import createCodeBlockPlugin from './plugins/CodeBlockPlugin';
import { createInlineBreakoutPlugin } from './plugins/inlineBreakoutPlugin';
import { createMarkDownListItemsPlugin } from './plugins/MarkdownListitems';

const emojiPlugin = createEmojiPlugin();
const inlineCodePlugin = createInlineCodePlugin();
const markdownHeader = createMarkdownHeadersPlugin();
const codeBlockPlugin = createCodeBlockPlugin();

const markdownLists = createMarkDownListItemsPlugin();
// loadLanguages(["javascript", "python"])
const prismPlugin = createPrismPlugin({
  // It's required to provide your own instance of Prism
  prism: Prism,
});

const inlineBreakoutPlugin = createInlineBreakoutPlugin();

const { EmojiSuggestions } = emojiPlugin;

export class CortoDraftEditor extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const data = localStorage.getItem('_current_json_');
    let state;
    if (data) {
      const json = JSON.parse(data);
      state = EditorState.createWithContent(convertFromRaw(json));
    } else {
      state = EditorState.createEmpty();
    }
    this.state = {
      editorState: state,
    };
  }
  onChange = (editorState: EditorState) => {
    const content = editorState.getCurrentContent();
    const json = convertToRaw(content);

    localStorage.setItem('_current_json_', JSON.stringify(json));

    this.setState({
      editorState,
    });
  };
  render() {
    const state: any = this.state.editorState as any;
    const props: any = {
      editorState: state,
      onChange: this.onChange,
      plugins: [
        //emojiPlugin,
        inlineBreakoutPlugin,
        markdownLists,
        inlineCodePlugin,
        markdownHeader,
        prismPlugin,
        codeBlockPlugin,
      ],
    };
    return (
      <div className="CortoEditor">
        <Editor {...props} />
        <EmojiSuggestions />
      </div>
    );
  }
}
