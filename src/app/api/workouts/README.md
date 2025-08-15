# Workouts API

GET /api/workouts?topicId=xxx - Retrieve workout for a specific topic
POST /api/workouts - Create new workout
GET /api/workouts/[topicId] - Get specific workout by topicId
PUT /api/workouts/[topicId] - Update existing workout
DELETE /api/workouts/[topicId] - Delete workout

All routes include user authorization and proper error handling with Zod validation for request bodies.
