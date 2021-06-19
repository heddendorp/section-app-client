import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, EventService } from '@tumi/services';
import { first, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { ReceiptService } from '@tumi/services/receipt.service';

@Component({
  selector: 'app-event-finances',
  templateUrl: './event-finances.component.html',
  styleUrls: ['./event-finances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFinancesComponent implements OnInit {
  public event$: Observable<any>;
  public receiptForm: FormGroup;
  public currentFile = new BehaviorSubject<File | null>(null);

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private eventService: EventService,
    private storage: AngularFireStorage,
    private receipts: ReceiptService,
    fb: FormBuilder
  ) {
    this.receiptForm = fb.group({
      file: [undefined, Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });
    this.receiptForm.valueChanges.subscribe((value) => console.log(value));
  }

  ngOnInit(): void {
    this.event$ = this.route.paramMap.pipe(
      tap((event) => console.log(event)),
      switchMap((params) => this.eventService.getOne$(params.get('id') ?? '')),
      shareReplay(1)
    );
  }

  fileChange(event: any) {
    this.currentFile.next(event.target.files[0] as File);
    console.log(event.target.files[0]);
  }

  async submitReceipt() {
    this.receiptForm.disable();
    const file = await this.currentFile.pipe(first()).toPromise();
    const event = await this.event$.pipe(first()).toPromise();
    if (!file) return;
    const filePath = `receipts/${event.id}/${file.name}`;
    const ref = this.storage.ref(filePath);
    const uploadTask = ref.put(file);
    uploadTask.snapshotChanges().subscribe(
      () => {},
      () => {},
      () => {
        const formValue = this.receiptForm.value;
        this.receipts.addReceiptToEvent(event.id, {
          ...formValue,
          file: filePath,
        });
        this.receiptForm.enable();
        this.receiptForm.reset({});
        this.currentFile.next(null);
      }
    );
  }
}
