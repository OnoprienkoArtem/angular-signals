import { Component, computed, effect, inject, Injector, OnInit, Signal, signal } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";

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
      const courses = await this.coursesService.leadAllCourses();
      this.#courses.set(courses);
    } catch (e) {
      alert('Error loading courses!');
      console.error(e);
    }
  }

}
