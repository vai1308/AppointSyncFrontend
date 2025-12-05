import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AppointmentFormComponent],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
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
export class AppointmentListComponent implements OnInit {
  Appointments: any[] = [];
  filteredAppointments: any[] = [];
  searchText = '';
  filterDate = '';
  filterStatus = '';
  selectedAppointment: any = null;
  loading = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  darkMode = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getAppointments();
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2000);
  }

  getAppointments() {
    this.loading = true;
    this.api.getAppointments().subscribe({
      next: (data) => {
        this.Appointments = data;
        this.filteredAppointments = data;
        this.loading = false;
      },
      error: () => {
        this.showAlert('Failed to load appointments', 'error');
        this.loading = false;
      }
    });
  }

  filterAppointments() {
    this.filteredAppointments = this.Appointments.filter((a) => {
      const matchesName = a.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDate = !this.filterDate || a.date === this.filterDate;
      const matchesStatus = !this.filterStatus || a.status === this.filterStatus;
      return matchesName && matchesDate && matchesStatus;
    });
  }

  deleteAppointment(id: number) {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.api.deleteAppointment(id).subscribe({
        next: () => {
          this.showAlert('Appointment deleted', 'success');
          this.getAppointments();
        },
        error: () => this.showAlert('Failed to delete appointment', 'error')
      });
    }
  }

  updateStatus(appointment: any) {
    this.api.updateAppointment(appointment.id, appointment).subscribe({
      next: () => this.showAlert('Status updated', 'success'),
      error: () => this.showAlert('Failed to update', 'error')
    });
  }

  showDetails(appointment: any) {
    this.selectedAppointment = appointment;
  }

  closeModal() {
    this.selectedAppointment = null;
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }
}
