import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorService } from '../../services/editor.service';

@Component({
  selector: 'app-editor-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.css'],
})
export class EditorToolbarComponent {
  readonly editorService = inject(EditorService);

  isMobile = input<boolean>(false);
  image = input<boolean>(true);

  @Output() toggleBottomSheet = new EventEmitter<void>();
  @Output() selectImage = new EventEmitter<Event>();

  get editor() {
    return this.editorService.editor;
  }

  // ========== Heading Methods ==========
  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    this.editorService.setHeading(level);
  }

  setParagraph() {
    this.editorService.setParagraph();
  }

  getCurrentHeading() {
    return this.editorService.getCurrentHeading();
  }

  // ========== Formatting Methods ==========
  toggleBold() {
    this.editorService.toggleBold();
  }
  toggleItalic() {
    this.editorService.toggleItalic();
  }
  toggleUnderline() {
    this.editorService.toggleUnderline();
  }
  toggleStrike() {
    this.editorService.toggleStrike();
  }

  // ========== Align Methods ==========
  setTextAlign(align: 'left' | 'center' | 'right' | 'justify') {
    this.editorService.setTextAlign(align);
  }

  // ========== List Methods ==========
  toggleBulletList() {
    this.editorService.toggleBulletList();
  }
  toggleOrderedList() {
    this.editorService.toggleOrderedList();
  }

  // ========== History Methods ==========
  undo() {
    this.editorService.undo();
  }
  redo() {
    this.editorService.redo();
  }
  canUndo() {
    return this.editorService.canUndo();
  }
  canRedo() {
    return this.editorService.canRedo();
  }

  // ========== Link Methods ==========
  linkUrl = signal('');

  openLinkPopover() {
    // 현재 선택된 텍스트에 링크가 있으면 해당 URL을 가져옴
    const currentHref = this.editorService.getLinkHref();
    this.linkUrl.set(currentHref || '');
  }

  setLink() {
    const url = this.linkUrl();
    if (url) {
      this.editorService.setLink(url);
    }
    this.linkUrl.set('');
    // dropdown 닫기 (blur로 자동 닫힘)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  removeLink() {
    this.editorService.unsetLink();
    this.linkUrl.set('');
    // dropdown 닫기 (blur로 자동 닫힘)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  isLinkActive(): boolean {
    return this.editor?.isActive('link') ?? false;
  }

  // ========== Table Methods ==========
  insertTable() {
    this.editorService.insertTable();
  }

  isTableActive(): boolean {
    return this.editorService.isTableActive();
  }

  addColumnBefore() {
    this.editorService.addColumnBefore();
  }

  addColumnAfter() {
    this.editorService.addColumnAfter();
  }

  deleteColumn() {
    this.editorService.deleteColumn();
  }

  addRowBefore() {
    this.editorService.addRowBefore();
  }

  addRowAfter() {
    this.editorService.addRowAfter();
  }

  deleteRow() {
    this.editorService.deleteRow();
  }

  mergeCells() {
    this.editorService.mergeCells();
  }

  splitCell() {
    this.editorService.splitCell();
  }

  deleteTable() {
    this.editorService.deleteTable();
  }

  canMergeCells(): boolean {
    return this.editorService.canMergeCells();
  }

  canSplitCell(): boolean {
    return this.editorService.canSplitCell();
  }
}
