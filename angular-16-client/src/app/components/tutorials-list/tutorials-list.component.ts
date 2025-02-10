import {Component, OnInit} from '@angular/core';
import {Item} from 'src/app/models/tutorial.model';
import {TutorialService} from 'src/app/services/tutorial.service';
import {Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css'],
})
export class TutorialsListComponent implements OnInit {
  tutorials: Item[] = [];
  filteredTutorials: Item[] = [];
  currentTutorial: Item = {};
  currentIndex = -1;
  title = '';
  selectedCategory: string | null = null;
  displayedColumns: string[] = ['title', 'type', 'category', 'description', 'photo'];
  categories = [
    'Спеціалізоване обладнання для терапії',
    'Діагностичне медичне обладнання',
    'Обладнання для спортивної медицини та фізичної реабілітації',
    'Екологічне та енергозбережувальне обладнання – зелені технології',
    'Обладнання для екологічного туризму та біотуризму',
    'Сучасне медичне обладнання лабораторії медико-біологічних досліджень для навчання студентів',
    'Ендоскопічне обладнання',
    'Обладнання для тривимірного сканування та друку штучних органів',
    'Спеціалізоване обладнання для протезування / ортезування та біопринтингу',
    'Графічні та сенсорні пристрої',
    'Цифрове обладнання для створення навчального відеоконтенту',
    '3D панорамні стрімові та стерео камери',
    'Роботизовані 3D камери',
    'Технічне оснащення для проведення онлайн лекцій',
    'Сучасне обладнання для інклюзивної освіти та тренажери',
    'Вбудовані та роботизовані медичні системи мікроконтролерні плати Raspberry Pi',
    'Обладнання оптичної та цифрової мікроскопії',
    'Діагностичне обладнання та тренінгові системи',
    'Обладнання для інклюзивної освіти',
    'Обладнання лабораторії спортивної медицини та фізичної реабілітації',
    'Обладнання лабораторії 3D-біомедичних технологій',
    'Обладнання лабораторії «Аналітичної оптохемотроніки ім. проф. М.М. Рожицького»'
  ];


  constructor(private tutorialService: TutorialService,
              public router: Router,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data;
        this.filteredTutorials = [...this.tutorials];
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  filterByCategory(): void {
    this.filteredTutorials = this.selectedCategory
      ? this.tutorials.filter((tutorial) => tutorial.category?.toLowerCase() === this.selectedCategory?.toLowerCase())
      : [...this.tutorials];
  }

  filterByExistingCategory(category: string): void {
    this.filteredTutorials = category
      ? this.tutorials.filter((tutorial) =>
        tutorial.category
          ?.toLowerCase()
          .split(',')
          .map(cat => cat.trim())  // Убираем пробелы
          .includes(category.toLowerCase())
      )
      : [...this.tutorials];
  }


  filterByAlphabetical(order: string): void {
    if (order === 'A-Z') {
      // @ts-ignore
      this.filteredTutorials.sort((a, b) => a.title.localeCompare(b.title));
    } else if (order === 'Z-A') {
      // @ts-ignore
      this.filteredTutorials.sort((a, b) => b.title.localeCompare(a.title));
    }
  }

  searchTitle(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;


    this.filteredTutorials = this.tutorials.filter((tutorial) =>
      // @ts-ignore
      tutorial.title.toLowerCase().includes(this.title.toLowerCase())
    );
  }

  setActiveTutorial(tutorial: Item, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
    this.router.navigate([`/tutorials/${tutorial.id}`]);
  }

  addTutorial() {
    this.router.navigate([`/add`]);
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.title = '';

    this.retrieveTutorials();
    this.filteredTutorials = this.tutorials;
  }


  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
    this.title = '';
    this.selectedCategory = null;
  }
}
