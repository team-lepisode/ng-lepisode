import { Injectable, signal } from '@angular/core';
import { Editor, Extension } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TableKit } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { Focus } from '@tiptap/extensions';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import Suggestion from '@tiptap/suggestion';

export interface EditorConfig {
  onUpdate?: (html: string) => void;
  onSlashCommand?: (props: any) => boolean | void;
}

const SlashCommand = Extension.create({
  name: 'slashCommand',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

@Injectable()
export class EditorService {
  private _editor = signal<Editor | null>(null);

  readonly isCurrentNodeTable = signal<boolean>(false);

  get editor(): Editor | null {
    return this._editor();
  }

  /**
   * 에디터 인스턴스 생성
   */
  createEditor(config?: EditorConfig): Editor {
    this._editor.set(
      new Editor({
        extensions: [
          Markdown,
          StarterKit.configure({
            // 사용하는 Extension 설정
            link: {
              openOnClick: false,
              autolink: true,
              defaultProtocol: 'https',
              protocols: ['http', 'https'],
            },

            codeBlock: {
              HTMLAttributes: {
                class: 'editor-code-block',
              },
            },
            blockquote: {
              HTMLAttributes: {
                class: 'editor-blockquote',
              },
            },
            horizontalRule: {
              HTMLAttributes: {
                class: 'editor-horizontal-rule',
              },
            },
            paragraph: {
              HTMLAttributes: {
                class: 'editor-paragraph',
              },
            },
            heading: {
              HTMLAttributes: {
                class: 'editor-heading',
              },
            },
            bulletList: {
              HTMLAttributes: {
                class: 'editor-bullet-list',
              },
            },
            orderedList: {
              HTMLAttributes: {
                class: 'editor-ordered-list',
              },
            },
          }),
          // Link extension (separate from StarterKit)
          Image.configure({ allowBase64: true, inline: true }),
          Highlight.configure({
            multicolor: true,
          }),
          TextAlign.configure({
            types: ['paragraph', 'heading'],
          }),
          Superscript,
          Subscript,
          TextStyleKit,
          TableKit.configure({
            table: {
              resizable: true,
            },
          }),
          SlashCommand.configure({
            suggestion: {
              render: () => {
                return {
                  onStart: (props: any) => {
                    config?.onSlashCommand?.({ ...props, active: true });
                  },
                  onUpdate: (props: any) => {
                    config?.onSlashCommand?.({ ...props, active: true });
                  },
                  onKeyDown: (props: any) => {
                    if (props.event.key === 'Escape') {
                      config?.onSlashCommand?.({ active: false });
                      return true;
                    }
                    return (
                      config?.onSlashCommand?.({ ...props, type: 'keydown' }) ??
                      false
                    );
                  },
                  onExit: () => {
                    config?.onSlashCommand?.({ active: false });
                  },
                };
              },
            },
          }),
          Focus.configure({
            className: 'has-focus',
            mode: 'all',
          }),
        ],
        onUpdate: ({ editor }) => {
          config?.onUpdate?.(editor.getHTML());
        },
      })
    );

    return this.editor!;
  }

  /**
   * 에디터 인스턴스 제거
   */
  destroyEditor(): void {
    this.editor?.destroy();
    this._editor.set(null);
  }

  // ========== Heading Methods ==========
  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6): void {
    this._editor()?.chain().focus().setHeading({ level }).run();
  }

  setParagraph(): void {
    this._editor()?.chain().focus().setParagraph().run();
  }

  getCurrentHeading() {
    if (this._editor()?.isActive('heading', { level: 1 }))
      return { label: '제목 1', icon: 'icon-[mdi--format-header-1]' };
    if (this._editor()?.isActive('heading', { level: 2 }))
      return { label: '제목 2', icon: 'icon-[mdi--format-header-2]' };
    if (this._editor()?.isActive('heading', { level: 3 }))
      return { label: '제목 3', icon: 'icon-[mdi--format-header-3]' };
    if (this._editor()?.isActive('heading', { level: 4 }))
      return { label: '제목 4', icon: 'icon-[mdi--format-header-4]' };
    return { label: '본문', icon: 'icon-[mdi--format-paragraph]' };
  }

  // ========== Text Formatting Methods ==========
  toggleBold(): void {
    this._editor()?.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this._editor()?.chain().focus().toggleItalic().run();
  }

  toggleUnderline(): void {
    this._editor()?.chain().focus().toggleUnderline().run();
  }

  toggleStrike(): void {
    this._editor()?.chain().focus().toggleStrike().run();
  }

  // ========== Color Methods ==========
  setColor(color: string): void {
    this._editor()?.chain().focus().setColor(color).run();
  }

  getTextColor(): string {
    return this._editor()?.getAttributes('textStyle')['color'] ?? 'white';
  }

  setTextColor(color: string): void {
    this._editor()?.chain().focus().setColor(color).run();
  }

  toggleHighlight(): void {
    this._editor()?.chain().focus().toggleHighlight().run();
  }

  setHighlightColor(color: string): void {
    this._editor()?.chain().focus().setHighlight({ color }).run();
  }

  getHighlightColor(): string {
    return this._editor()?.getAttributes('highlight')['color'] ?? 'white';
  }

  // ========== Text Align Methods ==========
  setTextAlign(align: 'left' | 'center' | 'right' | 'justify'): void {
    this._editor()?.chain().focus().setTextAlign(align).run();
  }

  // ========== List Methods ==========
  toggleBulletList(): void {
    this._editor()?.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList(): void {
    this._editor()?.chain().focus().toggleOrderedList().run();
  }

  // ========== Block Methods ==========
  toggleCodeBlock(): void {
    this._editor()?.chain().focus().toggleCodeBlock().run();
  }

  toggleBlockquote(): void {
    this._editor()?.chain().focus().toggleBlockquote().run();
  }

  insertHorizontalRule(): void {
    this._editor()?.chain().focus().setHorizontalRule().run();
  }

  // ========== Sub/Superscript Methods ==========
  toggleSuperscript(): void {
    this._editor()?.chain().focus().toggleSuperscript().run();
  }

  toggleSubscript(): void {
    this._editor()?.chain().focus().toggleSubscript().run();
  }

  // ========== Table Methods ==========
  addColumnBefore(): void {
    this._editor()?.chain().focus().addColumnBefore().run();
  }

  addColumnAfter(): void {
    this._editor()?.chain().focus().addColumnAfter().run();
  }

  deleteColumn(): void {
    this._editor()?.chain().focus().deleteColumn().run();
  }

  addRowBefore(): void {
    this._editor()?.chain().focus().addRowBefore().run();
  }

  addRowAfter(): void {
    this._editor()?.chain().focus().addRowAfter().run();
  }

  deleteRow(): void {
    this._editor()?.chain().focus().deleteRow().run();
  }

  mergeCells(): void {
    this._editor()?.chain().focus().mergeCells().run();
  }

  splitCell(): void {
    this._editor()?.chain().focus().splitCell().run();
  }

  deleteTable(): void {
    this._editor()?.chain().focus().deleteTable().run();
  }

  insertTable(rows = 3, cols = 3, withHeaderRow = false): void {
    this._editor()
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow })
      .run();
  }

  toggleHeaderRow(): void {
    this._editor()?.chain().focus().toggleHeaderRow().run();
  }

  isHeaderRowActive(): boolean {
    const editor = this._editor();
    if (!editor) return false;
    return editor.isActive('tableHeader');
  }

  setCellBackground(color: string): void {
    this._editor()
      ?.chain()
      .focus()
      .setCellAttribute('backgroundColor', color)
      .run();
  }

  isTableActive(): boolean {
    return this._editor()?.isActive('table') ?? false;
  }

  // ========== Link Methods ==========
  setLink(url: string): void {
    if (!url) {
      this.unsetLink();
      return;
    }
    this._editor()
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank' })
      .run();
  }

  unsetLink(): void {
    this._editor()?.chain().focus().unsetLink().run();
  }

  getLinkHref(): string {
    return this._editor()?.getAttributes('link')['href'] ?? '';
  }

  insertLink(url: string): void {
    this._editor()
      ?.chain()
      .focus()
      .insertContent(url)
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank' })
      .run();
  }

  // ========== Undo/Redo Methods ==========
  undo(): void {
    this._editor()?.chain().focus().undo().run();
  }

  redo(): void {
    this._editor()?.chain().focus().redo().run();
  }

  canUndo(): boolean {
    return this._editor()?.can().undo() ?? false;
  }

  canRedo(): boolean {
    return this._editor()?.can().redo() ?? false;
  }

  canMergeCells(): boolean {
    return this._editor()?.can().mergeCells() ?? false;
  }

  canSplitCell(): boolean {
    return this._editor()?.can().splitCell() ?? false;
  }

  // ========== Image Methods ==========
  setImage(src: string): void {
    this._editor()?.commands.setImage({ src });
  }

  // ========== Focus Methods ==========
  focus(): void {
    this._editor()?.commands.focus();
  }

  // ========== State Check Methods ==========
  isActive(name: string, attributes?: Record<string, any>): boolean {
    return this._editor()?.isActive(name, attributes) ?? false;
  }
}
