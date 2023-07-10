import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Contact} from "../../@core/interfaces/contact";

@Directive({
  selector: '[duplicateSearch]',
  standalone: true
})
export class DuplicateSearchDirective<T> implements OnChanges {
  @Input() duplicateSearch!: T[]
  @Input() duplicateClass!: string;
  constructor(private _el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.duplicateSearch) {
      const duplicates = this.findDuplicates();
      this.applyDuplicateClass(duplicates);
    }
  }

  private findDuplicates(): any[] {
    const duplicates = [];
    const values = new Set();

    for (const item of this.duplicateSearch) {
      if (values.has(item)) {
        duplicates.push(item);
      } else {
        values.add(item);
      }
    }

    return duplicates;
  }

  private applyDuplicateClass(duplicates: any[]): void {
    const elements = this._el.nativeElement.querySelectorAll(`.${this.duplicateClass}`);

    elements.forEach((element: HTMLElement) => {
      element.classList.remove(this.duplicateClass);
    });

    duplicates.forEach((duplicate: any) => {
      const duplicateElement = this._el.nativeElement.querySelector(`[data-duplicate-id="${duplicate.id}"]`);
      if (duplicateElement) {
        duplicateElement.classList.add(this.duplicateClass);
      }
    });
  }
}
