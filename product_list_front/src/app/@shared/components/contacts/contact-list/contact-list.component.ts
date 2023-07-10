import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {COLUMNS_SCHEMA} from "../../../../@core/consts/contact";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Contact} from "../../../../@core/interfaces/contact";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ContactService} from "../../../../@core/services/contact/contact.service";
import {
  catchError,
  debounceTime,
  fromEvent,
  Subject,
  takeUntil,
  throwError
} from "rxjs";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormValidationService} from "../../../../@core/services/form-validation/form-validation.service";
import {DuplicateSearchDirective} from "../../../directives/duplicate-search.directive";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    DuplicateSearchDirective,
    MatSortModule,
    InfiniteScrollModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    NgxSpinnerModule,
  ],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, OnDestroy {
  public displayedColumns = COLUMNS_SCHEMA.map(col => col.key);
  public contactSchema = COLUMNS_SCHEMA;
  public dataSource = new MatTableDataSource<Contact>();
  public contactForm!: FormGroup;
  public duplicateIds: any[] = [];
  public currentPage = 1;


  private _destroy$ = new Subject<void>()

  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private _contactsService: ContactService,
    private _fb: FormBuilder,
    private _formValidationService: FormValidationService,
    private _cdr: ChangeDetectorRef,
    private _spinner: NgxSpinnerService
    ) {}

  ngOnInit() {
    this.getContactList();
  }

  public onScroll() {
      this.currentPage++;
      this.getContactList();
  }

  private getContactList() {
    this._spinner.show()
    this._contactsService.getContactsList(this.currentPage)
      .pipe(
        takeUntil(this._destroy$),
        catchError(err => throwError(err))
      )
      .subscribe((contacts: Contact[]) => {
        this.dataSource.sort = this.sort;
        this.duplicateIds = this.findDuplicateObjects(contacts);
        this.dataSource.data = [...this.dataSource.data, ...contacts];
        this._spinner.hide()
      })
  }
  public getControl(name:string) {
    return this.contactForm.get(name) as FormControl
  }


  public onAddNewRow() {
    this.initialForm();
    this.dataSource.data = [this.contactForm.value, ...this.dataSource.data];
  }

  public initialForm() {
    this.contactForm = this._fb.group({
      id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      isSelected: [false],
      isEdit: [true]
    });
  }

  public onEditContact(contact: Contact) {
    this.initialForm();
    contact.isEdit = true;
    this.contactForm.patchValue(contact);
  }

  public onUpdateRow(contact: Contact) {
    this.contactForm.value.isEdit = false;
    const updatedContact = {...this.contactForm.value, isEdit: false}
    let obs;

    if (contact.id === 0) {
      obs = this._contactsService.addContact(updatedContact)
    } else {
      obs = this._contactsService.updateContact(updatedContact)
    }

    obs.pipe(
      takeUntil(this._destroy$),
      catchError(err => throwError(err))
    )
      .subscribe(() => {
        contact.isEdit = false;
        const index = this.dataSource.data.indexOf(contact);
        if (index > -1) {
          Object.assign(this.dataSource.data[index], updatedContact);
        }
        this.duplicateIds = this.findDuplicateObjects(this.dataSource.data)
      })
  }

  public onDeleteRow(id: number) {
    this._contactsService.deleteContact(id)
      .pipe(
        takeUntil(this._destroy$),
        catchError(err => throwError(err))
      )
      .subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((row: Contact) => row.id !== id)
        this.duplicateIds = this.findDuplicateObjects(this.dataSource.data)
    })
  }

  public onDeleteRows() {
    const selectedRows = this.dataSource.data.filter(row => row.isSelected);
    this._contactsService.deleteRows(selectedRows)
      .pipe(
        takeUntil(this._destroy$),
        catchError(err => throwError(err))
      )
      .subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((row: Contact) => !row.isSelected);
        this.duplicateIds = this.findDuplicateObjects(this.dataSource.data);
      })
  }

  public findDuplicateObjects(contacts: Contact[]): number[] {
    return this._contactsService.getDuplicateObjectsIds(contacts);
  }


  public isInvalid(controlName: string): boolean {
    return this._formValidationService.isInvalid(controlName, this.contactForm);
  }

  public getErrorMessage(controlName: string): string {
    return this._formValidationService.getErrorMessage(controlName, this.contactForm);
  }

  public applyFilter(column: string, value: Event) {
    const filterValue = (event?.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const columnValue = data[column].toLowerCase();
      return columnValue.includes(filter);
    };
    this.dataSource.filter = filterValue;
  }

  public onCancelEdit(contact: Contact) {
    contact.id === 0
      ? this.dataSource.data = this.dataSource.data.filter((row: Contact) => row.id !== 0)
      : contact.isEdit = false;
  }
  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete()
  }
}
