import type { answerSnapshot, calculateResults } from './scoring.js';

type AssessmentResults = ReturnType<typeof calculateResults>;

export type WebhookSubmission = {
  id: string;
  version: string;
  name: string;
  email: string;
  answers: ReturnType<typeof answerSnapshot>;
  result: AssessmentResults;
};

export async function sendAssessmentWebhook(submission: WebhookSubmission) {
  const url = process.env.ASSESSMENT_WEBHOOK_URL;
  if (!url) throw new Error('WEBHOOK_NOT_CONFIGURED');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Assessment-Submission-Id': submission.id },
      body: JSON.stringify({
        submission_id: submission.id,
        assessment_version: submission.version,
        name: submission.name,
        email: submission.email,
        authority_score: submission.result.score,
        maturity_band: submission.result.band,
        dimensions: submission.result.dimensions,
        strongest_areas: submission.result.strongest,
        opportunity_areas: submission.result.gaps,
        all_areas_equal: submission.result.allEqual,
        answers: submission.answers,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('WEBHOOK_DELIVERY_FAILED');
  } catch {
    throw new Error('WEBHOOK_DELIVERY_FAILED');
  }
}
