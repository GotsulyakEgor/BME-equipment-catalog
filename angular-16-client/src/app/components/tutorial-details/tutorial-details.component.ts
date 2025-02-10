import { Component, Input, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/models/tutorial.model';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css'],
})
export class TutorialDetailsComponent {
  @Input() viewMode = false;

  @Input() currentTutorial: Item = {
    title: '',
    description: '',
    technicalData: '',
    links: '',
    category: '',
    type: '',
    photoUrl: '',
  };

  selectedFile: File | null = null;
  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getTutorial(this.route.snapshot.params['id']);
    }

    if (!this.authService.isAdmin) {
      this.viewMode = true;
    }
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  updateTutorial(): void {
    const formData = new FormData();

    // @ts-ignore
    formData.append('title', this.currentTutorial.title);
    // @ts-ignore
    formData.append('type', this.currentTutorial.type);
    // @ts-ignore
    formData.append('category', this.currentTutorial.category);
    // @ts-ignore
    formData.append('description', this.currentTutorial.description);
    // @ts-ignore
    formData.append('technicalData', this.currentTutorial.technicalData);
    formData.append('links', this.currentTutorial.links || '');

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.tutorialService.updateWithFile(this.currentTutorial.id, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tutorials']);
        this.message = res.message
          ? res.message
          : 'This tutorial was updated successfully!';
      },
      error: (e) => console.error(e),
    });
  }

  deletePhoto(): void {
    this.tutorialService.deletePhoto(this.currentTutorial.id).subscribe({
      next: () => {
        this.currentTutorial.photoUrl = ''; // Удаляем URL фото из объекта
        this.message = 'Photo deleted successfully!';
      },
      error: (e) => console.error(e),
    });
  }

  deleteTutorial(): void {
    this.tutorialService.delete(this.currentTutorial.id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e)
    });
  }

}
