import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppointmentFormComponent {
  @Output() appointmentAdded = new EventEmitter<void>();

  name = '';
  purpose = '';
  date: any = '';
  time: any = '';
  status = 'Pending';

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private api: ApiService) {}

  showAlert(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2000);
  }

  onSubmit() {
    if (!this.name || !this.purpose || !this.date || !this.time) {
      this.showAlert('Please fill all fields', 'error');
      return;
    }

    const data = {
      name: this.name,
      purpose: this.purpose,
      date: this.date,
      time: this.time,
      status: this.status
    };

    this.api.addAppointment(data).subscribe({
      next: () => {
        this.showAlert('Appointment added successfully', 'success');
        this.appointmentAdded.emit();
        this.name = '';
        this.purpose = '';
        this.date = '';
        this.time = '';
        this.status = 'Pending';
      },
      error: () => this.showAlert('Failed to add appointment', 'error')
    });
  }
}
