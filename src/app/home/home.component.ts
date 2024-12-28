import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  coursesService = inject(CoursesService);
  messagesService = inject(MessagesService);

  dialog = inject(MatDialog);

  #courses = signal<Course[]>([]);

  beginnerCourses = computed(() => {
    return this.#courses().filter(course => course.category === "BEGINNER");
  });

  advancedCourses = computed(() => {
    return this.#courses().filter(course => course.category === "ADVANCED");
  });

  constructor() {
    effect(() => {
      console.log('BEGINNER', this.beginnerCourses());
      console.log('ADVANCED', this.advancedCourses());
    });
  }

  ngOnInit(): void {
    this.loadCourses().then(() => console.log('All courses leaded: ', this.#courses()));
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
    const newCourses = [...this.#courses(), newCourse];
    this.#courses.set(newCourses);
  }
}
