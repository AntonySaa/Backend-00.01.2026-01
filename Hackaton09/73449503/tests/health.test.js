const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { randomUUID } = require('node:crypto');
const app = require('../src/app');
const { sequelize, User, Course, Lesson, Enrollment } = require('../src/models');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

test.after(async () => {
  await sequelize.close();
});

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { ok: true });
});

test('Flow: create user, course, lesson, enroll', async () => {
  const unique = randomUUID();
  let instructorId;
  let studentId;
  let courseId;
  let courseSlug;
  let lessonId;
  let enrollmentId;
  let instructorEmail;
  let studentEmail;

  try {
    instructorEmail = `instructor_${unique}@example.com`;
    studentEmail = `student_${unique}@example.com`;

    const instructorRes = await request(app)
      .post('/users')
      .send({
        firstName: 'Test',
        lastName: 'Instructor',
        email: instructorEmail,
        passwordHash: 'x',
        role: 'instructor'
      });
    if (instructorRes.status === 201) {
      instructorId = instructorRes.body.id;
    } else if (instructorRes.status === 409) {
      const existing = await User.findOne({ where: { email: instructorEmail } });
      assert.ok(existing, 'Expected existing instructor user');
      instructorId = existing.id;
    } else {
      assert.fail(`Unexpected status creating instructor: ${instructorRes.status}`);
    }

    const studentRes = await request(app)
      .post('/users')
      .send({
        firstName: 'Test',
        lastName: 'Student',
        email: studentEmail,
        passwordHash: 'y',
        role: 'student'
      });
    if (studentRes.status === 201) {
      studentId = studentRes.body.id;
    } else if (studentRes.status === 409) {
      const existing = await User.findOne({ where: { email: studentEmail } });
      assert.ok(existing, 'Expected existing student user');
      studentId = existing.id;
    } else {
      assert.fail(`Unexpected status creating student: ${studentRes.status}`);
    }

    const courseTitle = `Curso Test ${unique}`;
    const courseRes = await request(app)
      .post('/courses')
      .send({
        title: courseTitle,
        description: 'Descripcion de prueba para el curso.',
        ownerId: instructorId
      });
    if (courseRes.status === 201) {
      courseId = courseRes.body.id;
      courseSlug = courseRes.body.slug;
    } else if (courseRes.status === 409) {
      const existing = await Course.findOne({ where: { title: courseTitle } });
      assert.ok(existing, 'Expected existing course');
      courseId = existing.id;
      courseSlug = existing.slug;
    } else {
      assert.fail(`Unexpected status creating course: ${courseRes.status}`);
    }

    const lessonTitle = 'Leccion de prueba';
    const lessonRes = await request(app)
      .post(`/courses/${courseId}/lessons`)
      .send({
        title: lessonTitle,
        body: 'Contenido de prueba con mas de veinte caracteres.'
      });
    if (lessonRes.status === 201) {
      lessonId = lessonRes.body.id;
    } else if (lessonRes.status === 409) {
      const existing = await Lesson.findOne({
        where: { courseId, slug: slugify(lessonTitle) }
      });
      if (existing) {
        lessonId = existing.id;
      } else {
        assert.fail(`Lesson conflict but not found. Response: ${JSON.stringify(lessonRes.body)}`);
      }
    } else {
      assert.fail(`Unexpected status creating lesson: ${lessonRes.status} ${JSON.stringify(lessonRes.body)}`);
    }

    const enrollRes = await request(app)
      .post(`/courses/${courseId}/enroll`)
      .send({ userId: studentId });
    if (enrollRes.status === 201) {
      enrollmentId = enrollRes.body.id;
    } else if (enrollRes.status === 409) {
      const existing = await Enrollment.findOne({ where: { courseId, userId: studentId } });
      assert.ok(existing, 'Expected existing enrollment');
      enrollmentId = existing.id;
    } else {
      assert.fail(`Unexpected status creating enrollment: ${enrollRes.status}`);
    }

    const detailRes = await request(app).get(`/courses/${courseSlug}`);
    assert.equal(detailRes.status, 200);
    assert.ok(detailRes.body.stats);
    assert.ok(detailRes.body.stats.lessonsCount >= 1);
    assert.ok(detailRes.body.stats.studentsCount >= 1);
  } finally {
    if (enrollmentId) {
      await Enrollment.destroy({ where: { id: enrollmentId } });
    }
    if (lessonId) {
      await Lesson.destroy({ where: { id: lessonId }, force: true });
    }
    if (courseId) {
      await Course.destroy({ where: { id: courseId }, force: true });
    }
    if (studentId) {
      await User.destroy({ where: { id: studentId } });
    } else if (studentEmail) {
      await User.destroy({ where: { email: studentEmail } });
    }
    if (instructorId) {
      await User.destroy({ where: { id: instructorId } });
    } else if (instructorEmail) {
      await User.destroy({ where: { email: instructorEmail } });
    }
  }
});
