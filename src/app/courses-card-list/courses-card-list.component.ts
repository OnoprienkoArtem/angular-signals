import { Component, EventEmitter, inject, input, Output, output } from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {
  dialog = inject(MatDialog);

  courses = input.required<Course[]>();

  updatedCourse = output<Course>();

  deletedCourse = output<string>();

  async onEditCourse(course: Course): Promise<void> {
    const newCourse = await openEditCourseDialog(
      this.dialog,
      {
        mode: 'update',
        title: 'Update Existing Course',
        course,
      });

    this.updatedCourse.emit(newCourse);
  }

  onCourseDelete(course: Course) {
    this.deletedCourse.emit(course.id);
  }
}
