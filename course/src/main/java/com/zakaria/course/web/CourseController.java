package com.zakaria.course.web;

import com.zakaria.course.model.Course;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api")
public class CourseController {

    private final List<Course> courses = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public CourseController() {
        // Quelques cours en mémoire pour les tests
        courses.add(new Course(idGenerator.getAndIncrement(), "Spring Boot Basics", "Introduction à Spring Boot"));
        courses.add(new Course(idGenerator.getAndIncrement(), "React Fundamentals", "Bases de React pour SPA"));
    }

    /**
     * GET /courses
     * Accessible à STUDENT + ADMIN
     */
    @GetMapping("/courses")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public List<Course> getCourses() {
        return courses;
    }

    /**
     * POST /courses
     * Réservé à ADMIN
     */
    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public Course addCourse(@RequestBody Course course) {
        course.setId(idGenerator.getAndIncrement());
        courses.add(course);
        return course;
    }

    /**
     * GET /me
     * Retourne les claims du token JWT
     */
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        return jwt.getClaims();
    }
}
