import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CertificateService } from './certificate.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  certificateToView: any; // Variable to hold certificate details for viewing
  certificateDetails: any = []; // Variable to hold the list of certificates
  certificateToUpdate: any = {
    id: null,
    studentName: "",
    courseName: "",
    issuedDate: ""
  };
  isLoading = false; // Variable to track loading state

  constructor(private certificateService: CertificateService) { }

  ngOnInit(): void {
    this.getCertificateDetails(); // Fetch certificate details when component is initialized
  }

  // Method to set certificate details for viewing
  viewCertificate(certificate: any) {
    this.certificateToView = certificate;
  }

  // Method to handle the download
  downloadCertificate() {
    if (!this.certificateToView) {
      alert('No certificate data available to download.');
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297; // A4 landscape width in mm
    const margin = 20; // Margin from edges

    const textSizeTitle = 27; // Font size for title and course name
    const textSizeContent = 22; // Font size for content (name)
    const textSizeDate = 10; // Smaller font size for issue date

    // Function to calculate the X-coordinate for centering text
    const centerText = (text: string, fontSize: number) => {
      const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
      return (pageWidth - textWidth) / 2;
    };

    const startY = margin + 20;

    // Add certificate details to the PDF
    doc.setFontSize(textSizeTitle);
    doc.text('Certification of Completion', centerText('Certification of Completion', textSizeTitle), startY + 30);

    doc.setFontSize(textSizeContent);
    doc.setTextColor(0, 128, 0); // Green color for student name
    doc.text(this.certificateToView.studentName, centerText(this.certificateToView.studentName, textSizeContent), startY + 30 + textSizeTitle);

    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.setFontSize(textSizeTitle);
    doc.text(this.certificateToView.courseName, centerText(this.certificateToView.courseName, textSizeTitle), startY + 60 + textSizeTitle);

    doc.setFontSize(textSizeDate); 
    doc.text(`(${this.certificateToView.issuedDate})`, centerText(this.certificateToView.issuedDate, textSizeDate), startY + 90 + textSizeTitle);

    // Download the PDF
    doc.save('certificate.pdf');
  }

  // Register a new certificate
  register(registerForm: NgForm) {
    this.certificateService.registerCertificate(registerForm.value).subscribe(
      (resp: any) => {
        alert(`🎉${resp.studentName} Certificate uploaded successfully!🎉`);
        registerForm.reset(); // Reset the form after successful registration
        this.getCertificateDetails(); // Refresh the list of certificates
      },
      (err: any) => {
        alert('Error while uploading certificate');
        console.log(err);
      }
    );
  }

  // Get the list of certificates
  getCertificateDetails() {
    this.isLoading = true; // Start loading
    this.certificateService.getCertificates().subscribe(
      (resp) => {
        this.certificateDetails = resp;
        this.isLoading = false; // Stop loading
      },
      (err) => {
        console.log(err);
        this.isLoading = false; // Stop loading in case of error
      }
    );
  }

  // Delete a certificate
  deleteCertificate(certificate: any) {
    if (confirm(`Are you sure you want to delete the certificate for ${certificate.studentName}?`)) {
      this.certificateService.deleteCertificate(certificate.id).subscribe(
        (resp) => {
          alert('Certificate deleted successfully');
          this.getCertificateDetails(); // Refresh the list of certificates
        },
        (err) => {
          alert('Failed to delete certificate');
          console.log(err);
        }
      );
    }
  }

  // Set certificate data for editing
  edit(certificate: any) {
    this.certificateToUpdate = { ...certificate };
  }

  // Update a certificate
  updateCertificate() {
    this.certificateService.updateCertificate(this.certificateToUpdate).subscribe(
      (resp) => {
        alert('Certificate updated successfully');
        this.getCertificateDetails(); // Refresh the list of certificates
        this.certificateToUpdate = { id: null, studentName: "", courseName: "", issuedDate: "" }; // Reset form after update
      },
      (err) => {
        alert('Error while updating certificate');
        console.log(err);
      }
    );
  }
}
