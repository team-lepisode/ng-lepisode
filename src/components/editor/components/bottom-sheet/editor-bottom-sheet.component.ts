import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { EditorService } from '../../services/editor.service';

interface BottomSheetItem {
  title: string;
  icon: string;
  action: () => void;
  isActive?: () => boolean | undefined;
  isDisabled?: () => boolean;
}

@Component({
  selector: 'app-editor-bottom-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-bottom-sheet.component.html',
  styleUrls: ['./editor-bottom-sheet.component.css'],
})
export class EditorBottomSheetComponent {
  readonly editorService = inject(EditorService);

  show = model<boolean>(false);

  get editor() {
    return this.editorService.editor;
  }

  toggle() {
    this.show.update(v => !v);
  }

  // Bottom sheet items grouped by category
  readonly styleItems: BottomSheetItem[] = [
    {
      title: '본문',
      icon: 'icon-[mdi--format-paragraph]',
      action: () => this.editorService.setParagraph(),
      isActive: () =>
        this.editor?.isActive('paragraph') && !this.editor?.isActive('heading'),
    },
    {
      title: '제목 1',
      icon: 'icon-[mdi--format-header-1]',
      action: () => this.editorService.setHeading(1),
      isActive: () => this.editor?.isActive('heading', { level: 1 }),
    },
    {
      title: '제목 2',
      icon: 'icon-[mdi--format-header-2]',
      action: () => this.editorService.setHeading(2),
      isActive: () => this.editor?.isActive('heading', { level: 2 }),
    },
    {
      title: '제목 3',
      icon: 'icon-[mdi--format-header-3]',
      action: () => this.editorService.setHeading(3),
      isActive: () => this.editor?.isActive('heading', { level: 3 }),
    },
  ];

  readonly listItems: BottomSheetItem[] = [
    {
      title: '불렛 리스트',
      icon: 'icon-[mdi--format-list-bulleted]',
      action: () => this.editorService.toggleBulletList(),
      isActive: () => this.editor?.isActive('bulletList'),
    },
    {
      title: '번호 리스트',
      icon: 'icon-[mdi--format-list-numbered]',
      action: () => this.editorService.toggleOrderedList(),
      isActive: () => this.editor?.isActive('orderedList'),
    },
  ];

  readonly insertItems: BottomSheetItem[] = [
    {
      title: '표 삽입',
      icon: 'icon-[mdi--table-large-plus]',
      action: () => this.editorService.insertTable(),
    },
    {
      title: '코드 블록',
      icon: 'icon-[mdi--code-braces]',
      action: () => this.editorService.toggleCodeBlock(),
      isActive: () => this.editor?.isActive('codeBlock'),
    },
    {
      title: '인용문',
      icon: 'icon-[mdi--format-quote-close]',
      action: () => this.editorService.toggleBlockquote(),
      isActive: () => this.editor?.isActive('blockquote'),
    },
    {
      title: '구분선',
      icon: 'icon-[mdi--minus]',
      action: () => this.editorService.insertHorizontalRule(),
    },
    {
      title: '하이라이트',
      icon: 'icon-[mdi--marker]',
      action: () => this.editorService.toggleHighlight(),
      isActive: () => this.editor?.isActive('highlight'),
    },
  ];

  readonly historyItems: BottomSheetItem[] = [
    {
      title: '실행 취소',
      icon: 'icon-[mdi--undo]',
      action: () => this.editorService.undo(),
      isDisabled: () => !this.editorService.canUndo(),
    },
    {
      title: '다시 실행',
      icon: 'icon-[mdi--redo]',
      action: () => this.editorService.redo(),
      isDisabled: () => !this.editorService.canRedo(),
    },
  ];

  executeItem(item: BottomSheetItem) {
    item.action();
  }
}
