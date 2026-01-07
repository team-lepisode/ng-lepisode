import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  booleanAttribute,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { Editor } from '@tiptap/core';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { map, tap } from 'rxjs';
import {
  NG_LEPISODE_CONFIG,
  NgLepisodeConfig,
} from '../../libs/provideNgLepisode';
import { EditorBottomSheetComponent } from './components/bottom-sheet/editor-bottom-sheet.component';
import { EditorSlashCommandComponent } from './components/slash-command/editor-slash-command.component';
import { EditorToolbarComponent } from './components/toolbar/editor-toolbar.component';
import { EditorService } from './services/editor.service';

@Component({
  selector: 'lepi-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkMenuModule,
    TiptapEditorDirective,
    EditorToolbarComponent,
    EditorBottomSheetComponent,
    EditorSlashCommandComponent,
  ],
  providers: [EditorService],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent
  implements FormValueControl<string>, OnInit, AfterViewInit, OnDestroy
{
  private readonly config = inject<NgLepisodeConfig>(NG_LEPISODE_CONFIG);
  private readonly uploadService = this.config.uploadService;
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly editorService = inject(EditorService);

  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  readonly showBottomSheet = signal<boolean>(false);
  readonly slashCommandProps = signal<any>(null);

  highlightRef = viewChild.required<ElementRef<HTMLInputElement>>('highlight');
  slashCommandRef = viewChild<EditorSlashCommandComponent>(
    EditorSlashCommandComponent
  );

  format = input<'html' | 'json'>('html');
  image = input<boolean, string | boolean>(true, {
    transform: booleanAttribute,
  });
  viewer = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });

  value = model<string>('');
  value$ = toObservable(this.value);

  get editor(): Editor | null {
    return this.editorService.editor;
  }

  constructor() {
    this.value$
      .pipe(
        tap(value => {
          if (
            this.editor &&
            !this.editor.isFocused &&
            this.editor.getHTML() !== value
          ) {
            this.editor.commands.setContent(value);
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // 에디터 생성 (DOM 요소가 렌더링된 후)
    this.editorService.createEditor({
      onUpdate: html => {
        if (this.value() !== html) {
          this.value.set(html);
        }
      },
      onSlashCommand: props => {
        if (props.type === 'keydown') {
          return this.slashCommandRef()?.onKeyDown(props.event) ?? false;
        }
        this.slashCommandProps.set(props);
        return false;
      },
    });
  }

  ngOnDestroy(): void {
    this.editorService.destroyEditor();
  }

  // ========== Event Handlers ==========
  insertLink(url: string, popover: HTMLElement): void {
    this.editorService.insertLink(url);
    popover.hidePopover();
  }

  selectImage(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = e => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
      if (!file) return;

      this.uploadService
        .upload(file)
        .then(uploadedFile => {
          this.editorService.setImage(uploadedFile.url);
        })
        .catch(err => {
          console.error('Image upload failed', err);
        });
    };
  }

  toggleBottomSheet(): void {
    this.showBottomSheet.update(v => !v);
  }

  focus = () => this.editorService.focus();
}
