// TODO: Data Grid 연동

@Component({
  selector: "app-bulk-actions",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-[400px]">
      <div class="space-y-2 mb-20">
        @for (item of items(); track item.id) {
        <div
          class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary/50 cursor-pointer transition-colors"
          [class.bg-blue-50]="selectedIds().has(item.id)"
          [class.border-blue-200]="selectedIds().has(item.id)"
          (click)="toggleSelection(item.id)"
        >
          <input
            type="checkbox"
            class="checkbox checkbox-sm checkbox-primary"
            [checked]="selectedIds().has(item.id)"
          />
          <span class="font-medium text-gray-700">{{ item.name }}</span>
          <span class="ml-auto text-sm text-gray-400">{{ item.date }}</span>
        </div>
        }
      </div>

      <div
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        [class.translate-y-32]="selectedCount() === 0"
        [class.translate-y-0]="selectedCount() > 0"
        [class.opacity-0]="selectedCount() === 0"
      >
        <div
          class="bg-gray-900 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-6 min-w-[320px]"
        >
          <div class="flex items-center gap-2 border-r border-gray-700 pr-6">
            <span
              class="bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
            >
              {{ selectedCount() }}
            </span>
            <span class="text-sm font-medium">Selected</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="btn btn-ghost btn-sm btn-circle text-gray-300 hover:text-white hover:bg-gray-800"
              title="Archive"
            >
              📥
            </button>
            <button
              class="btn btn-ghost btn-sm btn-circle text-gray-300 hover:text-white hover:bg-gray-800"
              title="Mark as Read"
            >
              ✅
            </button>
            <button
              class="btn btn-ghost btn-sm btn-circle text-red-400 hover:text-red-300 hover:bg-red-900/30"
              title="Delete"
              (click)="deleteSelected()"
            >
              🗑️
            </button>
          </div>

          <button
            class="ml-auto text-gray-500 hover:text-white"
            (click)="clearSelection()"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
})
export class BulkActionsComponent {
  items = signal([
    { id: 1, name: "Project Proposal.pdf", date: "2 mins ago" },
    { id: 2, name: "Design Assets.zip", date: "1 hour ago" },
    { id: 3, name: "Meeting Notes.docx", date: "Yesterday" },
    { id: 4, name: "Invoice_2026.pdf", date: "2 days ago" },
  ]);

  selectedIds = signal<Set<number>>(new Set());
  selectedCount = computed(() => this.selectedIds().size);

  toggleSelection(id: number) {
    this.selectedIds.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  clearSelection() {
    this.selectedIds.set(new Set());
  }

  deleteSelected() {
    const ids = this.selectedIds();
    this.items.update((list) => list.filter((item) => !ids.has(item.id)));
    this.clearSelection();
  }
}
