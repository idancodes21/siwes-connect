# SIWES Connect

A modern web platform that brings students, employers, and university departments together to manage industrial training and internship placements in one place.

## Overview

SIWES Connect helps Nigerian universities, students, and employers manage industrial training and internship placements in one place. It replaces scattered emails and paperwork with a simple online portal where students apply for opportunities, employers post openings and review candidates, and department heads track their students' progress. The goal is to make the SIWES process smoother, faster, and more transparent for everyone involved.

## Features

- **Role-based portals**: Separate dashboards and workflows for students, employers, and Heads of Department.
- **Internship listings**: Employers can post, publish, close, archive, and delete internship opportunities.
- **Student applications**: Students browse listings, filter by location and work arrangement, and submit applications with cover letters.
- **Application review**: Employers review applications, update statuses, add review notes, and automatically create placements on acceptance.
- **Placement management**: Employers track active, completed, and terminated placements, including supervisor details and internship dates.
- **Department oversight**: HODs view department students, monitor applications and placements, and export student reports.
- **Profile management**: Each user role can update personal, academic, company, or department profile information.
- **Responsive design**: Clean, mobile-friendly interface built with Tailwind CSS and modern React patterns.

## Usage

Start the local development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting started as a student

1. Register an account and select the **Student** role.
2. Choose your institution and department, then enter your matriculation number and academic details.
3. Log in and visit **Find Internships** to browse published opportunities.
4. Click on an internship, review the details, and submit your application.
5. Track your application status under **My Applications** and view placement records under **My Placement**.

### Getting started as an employer

1. Register an account and select the **Employer** role.
2. Fill in your company information during registration.
3. Log in and use the dashboard to post new internships under **Internship Listings**.
4. Review incoming applications under **Applications**.
5. Accept a student to automatically create a placement, then manage it under **Placements**.

### Getting started as an HOD

1. Register an account and select the **Head of Department** role.
2. Choose your institution and department.
3. Log in to view all students registered under your department.
4. Monitor applications, placements, and download reports from the department dashboard.

## Technologies Used

| Technology | Description |
|------------|-------------|
| [Next.js 16](https://nextjs.org/) | React framework for server-side rendering and API routes. |
| [React 19](https://react.dev/) | UI library for building interactive component-based interfaces. |
| [TypeScript](https://www.typescriptlang.org/) | Typed superset of JavaScript for safer code. |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework for rapid styling. |
| [Prisma 7](https://www.prisma.io/) | Object-relational mapper for database access and migrations. |
| [PostgreSQL](https://www.postgresql.org/) | Relational database used for storing application data. |
| [NextAuth.js v5](https://authjs.dev/) | Authentication library with credentials-based login. |
| [Zod](https://zod.dev/) | Schema validation for forms and server actions. |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Password hashing for secure user authentication. |

## Contributing

Contributions are welcome. If you find a bug or have an idea for an improvement, feel free to open an issue or submit a pull request. Please keep the code consistent with the existing patterns and run the linting checks before submitting.

## Author

Built with care by the SIWES Connect team.

## Badges

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://dokugen.samueltuoyo.com)