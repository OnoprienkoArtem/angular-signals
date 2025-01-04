import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course } from '../models/course.model';


export const courseResolver: ResolveFn<Course | null> =
  async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const courseId = route.paramMap.get('courseId');

    if (!courseId) {
      return null;
    }

    const coursesService = inject(CoursesService);
    return coursesService.getCourseById(courseId);
}
