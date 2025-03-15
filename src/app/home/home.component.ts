import { Component, computed, effect, ElementRef, inject, Injector, OnInit, signal, viewChild } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';
import { MatTooltip } from '@angular/material/tooltip';
import { from, interval } from 'rxjs';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent,
    MatTooltip
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  injector = inject(Injector);

  coursesService = inject(CoursesService);
  messagesService = inject(MessagesService);

  dialog = inject(MatDialog);

  #courses = signal<Course[]>([]);

  beginnersList = viewChild('beginnersList', { read: MatTooltip });

  beginnerCourses = computed(() => {
    return this.#courses().filter(course => course.category === "BEGINNER");
  });

  advancedCourses = computed(() => {
    return this.#courses().filter(course => course.category === "ADVANCED");
  });

  courses$ = toObservable(this.#courses);

  coursesToSignal = from(this.coursesService.leadAllCourses());

  onToSignalExample() {
    // const courses = toSignal(this.coursesToSignal, { injector: this.injector });
    const number$ = interval(1000);
    const numbers = toSignal(number$, { injector: this.injector });
    effect(() => {
      // console.log(`courses: `, courses());
      console.log(`Numbers: `, numbers());
    }, { injector: this.injector });
  }

  constructor() {
    this.courses$.subscribe(courses => console.log('signal toObservable', courses))

    effect(() => {
      console.log('beginnersList: ', this.beginnersList());
    });

    effect(() => {
      console.log('BEGINNER', this.beginnerCourses());
      console.log('ADVANCED', this.advancedCourses());
    });
  }

  ngOnInit(): void {
    this.loadCourses().then(() => console.log('All courses leaded: ', this.#courses()));
  }

  onToObservableExample() {
    const numbers = signal(0);
    numbers.set(1);
    numbers.set(2);
    numbers.set(3);
    const numbers$ = toObservable(numbers, { injector: this.injector });
    numbers.set(4);

    numbers$.subscribe(val => {
      console.log(`numbers$: `, val);
    });
    numbers.set(5); // only this value appears after execute this method
  }

  async loadCourses(): Promise<void> {
    try {
      // this.loadingService.loadingOn();
      const courses = await this.coursesService.leadAllCourses();
      this.#courses.set(courses);
    } catch (e) {
      this.messagesService.showMessage('Error loading courses!', 'error');
      console.error(e);
    // } finally {
    //   this.loadingService.loadingOff();
    }
  }

  onCourseUpdated(updatedCourse: Course): void {
    const courses = this.#courses();
    const newCourses = courses.map(course => (
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter(course => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (err) {
      alert('Error deleting courses!');
      console.error(err);
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(
      this.dialog,
      {
        mode: 'create',
        title: 'Create New Course'
      }
    );

    if (!newCourse) {
      return;
    }

    const newCourses = [...this.#courses(), newCourse];
    this.#courses.set(newCourses);
  }
}
