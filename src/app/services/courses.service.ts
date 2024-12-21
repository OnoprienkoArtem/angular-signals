import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Course } from "../models/course.model";
import { GetCoursesResponse } from "../models/get-courses.response";
import { SkipLoading } from '../loading/skip-loading.component';


@Injectable({
  providedIn: "root"
})
export class CoursesService {

  private readonly http = inject(HttpClient);

  private readonly env = environment;

  async leadAllCourses(): Promise<Course[]> {
    const course$ = this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`, {
      context: new HttpContext().set(SkipLoading, true),
    });
    const response = await lastValueFrom(course$);
    return response.courses;
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const course$ = this.http.post<Course>(`${this.env.apiRoot}/courses`, course);
    return firstValueFrom(course$);
  }

  async saveCourse(courseId: string, changes: Partial<Course>): Promise<Course> {
    const course$ = this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, changes);
    return firstValueFrom(course$);
  }

  async deleteCourse(courseId: string): Promise<Course> {
    const delete$ = this.http.delete<Course>(`${this.env.apiRoot}/courses/${courseId}`);
    return firstValueFrom(delete$);
  }
}
