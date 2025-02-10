import { Component } from '@angular/core';
import { Item } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css'],
})
export class AddTutorialComponent {
  tutorial: Item = {
    title: '',
    type: '',
    description: '',
    technicalData: '',
    links: '',
    category: '',
  };
  submitted = false;
  selectedFile: File | null = null;

  constructor(private tutorialService: TutorialService, private router: Router) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveTutorial(): void {
    const formData = new FormData();
    // @ts-ignore
    formData.append('title', this.tutorial?.title);
    // @ts-ignore
    formData.append('type', this.tutorial.type);
    // @ts-ignore
    formData.append('description', this.tutorial.description);
    // @ts-ignore
    formData.append('technicalData', this.tutorial.technicalData);
    // @ts-ignore
    formData.append('links', this.tutorial.links);
    // @ts-ignore
    formData.append('category', this.tutorial.category);
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.tutorialService.create(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e),
    });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      technicalData: '',
      links: '',
      category: '',
      type: '',
    };
    this.selectedFile = null;
  }
}
