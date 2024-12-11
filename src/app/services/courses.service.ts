import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Course } from "../models/course.model";
import { GetCoursesResponse } from "../models/get-courses.response";


@Injectable({
  providedIn: "root"
})
export class CoursesService {

  private readonly http = inject(HttpClient);

  private readonly env = environment;

  async leadAllCourses(): Promise<Course[]> {
    const course$ = this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`);
    const response = await lastValueFrom(course$);
    return response.courses;
  }

}
