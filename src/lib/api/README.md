Success Response example:

```json
{
  "data": [{ "id": "1", "text": "Answer 1", "isCorrect": true }],
  "ok": true,
  "invalidateKeys": ["question-123-answers", "question-123"],
  "messages": [{ "type": "info", "message": "Loaded 3 answers", "duration": 2000 }]
}
```

Error Response:

```json
{
  "data": null,
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

Usage of APIError:

```javascript
try {
  const result = await handleApiResponse<TAnswerData[]>(...);
} catch (error) {
  if (error instanceof APIError) {
    console.error('API Error:', error.code, error.message, error.details);
  } else {
    console.error('System Error:', error);
  }
}
```
