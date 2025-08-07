// api/send-clv-report.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const Postmark = require('postmark');
  const client = new Postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

  try {
    await client.sendEmail({
      From: "no-reply@aiadvisorsgroup.co",
      To: "reports@aiadvisorsgroup.co", // Change if needed
      Subject: "New CLV Report Request",
      TextBody: `CLV Report Requested\n\nName: ${firstName || 'Not provided'}\nEmail: ${email}`
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Postmark error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
