import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  booleanAttribute,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { Editor } from '@tiptap/core';
import { DragHandle } from '@tiptap/extension-drag-handle';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TableKit } from '@tiptap/extension-table';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize, TextStyleKit } from '@tiptap/extension-text-style';
import { Focus } from '@tiptap/extensions';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import {
  NG_LEPISODE_CONFIG,
  NgLepisodeConfig,
} from '../../libs/provideNgLepisode';

@Component({
  selector: 'lepi-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkMenuModule, TiptapEditorDirective],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements FormValueControl<string> {
  private readonly config = inject<NgLepisodeConfig>(NG_LEPISODE_CONFIG);
  private readonly uploadService = this.config.uploadService;

  highlightRef = viewChild.required<ElementRef<HTMLInputElement>>('highlight');

  format = input<'html' | 'json'>('html');
  image = input<boolean, string | boolean>(true, {
    transform: booleanAttribute,
  });
  viewer = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });

  value = model<string>('');

  editor: Editor | null = null;

  // public editor = new Editor({
  //   editorProps: {
  //     attributes: {
  //       style: 'outline: none',
  //     },
  //   },
  //   extensions: [
  //     StarterKit.configure({
  //       paragraph: {
  //         HTMLAttributes: {
  //           class: 'min-h-6',
  //         },
  //       },
  //       bulletList: {
  //         HTMLAttributes: {
  //           class: 'list-disc ml-5',
  //         },
  //       },
  //       orderedList: {
  //         HTMLAttributes: {
  //           class: 'list-decimal ml-5',
  //         },
  //       },
  //     }),
  //     Underline,
  //     Image.configure({ allowBase64: true }),
  //     TextStyleKit,
  //     FontSize,
  //     Color,
  //     TextAlign.configure({
  //       types: ['paragraph', 'heading'],
  //     }),
  //     Highlight.configure({
  //       multicolor: true,
  //     }),
  //     Superscript,
  //     Subscript,
  //     TableKit.configure({
  //       table: {
  //         resizable: true,
  //       },
  //     }),
  //     Link.configure({
  //       autolink: true,
  //       linkOnPaste: true,
  //       defaultProtocol: 'https',
  //     }),
  //   ],
  //   onTransaction: ({ editor, transaction }) => {
  //     // check if image node was deleted
  //     this.handleImageDelete(transaction);
  //   },

  //   onCreate: ({ editor }) => {
  //     editor.view.dom.spellcheck = false;
  //     editor.commands.setFontSize('16px');
  //   },
  // });

  ngOnInit(): void {
    this.setEditor();
  }

  setEditor() {
    this.editor = new Editor({
      extensions: [
        Markdown,
        StarterKit.configure(),
        FontSize,
        Image.configure({ allowBase64: true }),
        Highlight.configure({
          multicolor: true,
        }),
        TextAlign.configure({
          types: ['paragraph', 'heading'],
        }),
        Superscript,
        Subscript,
        TextStyleKit,
        // Collaboration.configure({
        //   document: this.provider.document,
        // }),
        // CollaborationCaret.configure({
        //   provider: this.provider,
        //   user: {
        //     name: this.userStore.user$.value()?.email,
        //     color: getColor(this.userStore.user$.value()?.email || ''),
        //   },
        // }),
        TableKit.configure({
          table: {
            resizable: true,
          },
        }),
        Focus.configure({
          className: 'border border-primary rounded-field',
          mode: 'all',
        }),
        DragHandle.configure({
          render: () => {
            const handle = document.createElement('span');
            handle.classList.add(
              'icon-[mdi--dots-vertical]',
              'cursor-move',
              'size-4',
              'mr-2'
            );
            return handle;
          },
        }),
      ],
      editorProps: {
        attributes: {
          spellcheck: 'false',
          style: 'outline: none',
        },
      },
      onUpdate: ({ editor }) => {
        this.value.set(editor.getMarkdown());
      },
    });
  }

  isCurrentNodeTable = signal<boolean>(false);

  handleCommand(command: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    command();
  }

  selectImage(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const a = document.createElement('input');
    a.type = 'file';
    a.accept = 'image/*';
    a.click();
    a.onchange = e => {
      const file = (e.target as any)?.files[0];

      if (!file) {
        return;
      }

      this.uploadService
        .upload(file)
        .then(uploadedFile => {
          this.editor?.commands.setImage({
            src: uploadedFile.url,
          });
        })
        .catch(err => {
          console.error('Image upload failed', err);
        });
    };
  }

  handleImageDelete(transaction: Transaction) {
    const current: Node[] = [];
    transaction.doc.content.forEach(node => {
      if (node.type.name == 'image') {
        current.push(node);
      }
    });
    const before: Node[] = [];
    transaction.before.content.forEach(node => {
      if (node.type.name == 'image') {
        before.push(node);
      }
    });
    if (!current || before.length == 0) {
      return;
    }

    const deletedImageNodes = before.filter(node => {
      const src = node.attrs['src'];
      return !current.find(curNode => curNode.attrs['src'] == src);
    });

    if (deletedImageNodes.length > 0) {
      deletedImageNodes.forEach(async node => {
        // await this.uploadService.delete(node.attrs['src']);
      });
    }
  }

  // toggleHighlight() {
  //   if (this.editor.isActive('highlight')) {
  //     // 하이라이트가 활성화되어 있으면 제거
  //     this.editor.chain().focus().unsetHighlight().run();
  //   } else {
  //     // 하이라이트가 없으면 색상 선택기 열기
  //     const highlightInput = this.highlightRef().nativeElement;
  //     highlightInput.click();
  //   }
  // }
}
