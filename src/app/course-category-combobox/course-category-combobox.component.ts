import { Component, contentChild, effect, ElementRef, input, model } from '@angular/core';
import {CourseCategory} from "../models/course-category.model";

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss'
})
export class CourseCategoryComboboxComponent {

  value = model.required<CourseCategory>();

  title = contentChild<ElementRef>('title');

  constructor() {
    effect(() => {
      console.log('title: ', this.title());
    });
  }

  onCategoryChange(category: string): void {
    this.value.set(category as CourseCategory);
  }
}
