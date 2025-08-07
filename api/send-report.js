// Compass-AI Mail Carrier - api/send-report.js (v1.0 - Final Clean Build)
import { ServerClient } from 'postmark';

const postmark = new ServerClient(process.env.POSTMARK_API_TOKEN);

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }
    try {
        const { leadName, leadEmail, reportData } = request.body;
        const fromAddress = 'mike@aiadvisorsgroup.co'; 

        if (!leadEmail || !reportData) { return response.status(400).json({ error: 'Missing data.' }); }

        const greeting = leadName ? `Hi ${leadName},` : 'Hello,';
        const leadIdentifier = leadName ? `${leadName} (${leadEmail})` : leadEmail;

        // This is the definitive, safe, and strategically-aligned email content
        const htmlBody = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #4c3c7a; color: white; padding: 20px;">
                    <h2 style="margin: 0;">Your AI-Drafted Reply from Compass-AI</h2>
                </div>
                <div style="padding: 20px;">
                    <p>${greeting}</p>
                    <p>Thank you for using Compass-AI. As requested, here is a copy of the AI-powered reply for your records:</p>
                    <div style="background-color: #f4f7f9; border-left: 4px solid #38a169; padding: 15px; margin: 20px 0;">
                        <p><em>"${reportData.suggestedReply}"</em></p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p>This is just the first step. To see how this fits into the bigger picture of eliminating churn, follow the revolution on LinkedIn.</p>
                    <p>Best regards,<br>Mike<br>The Anti-Churn Revolution™</p>
                </div>
            </div>
        `;

        // This is the definitive, safe, and strategically-aligned subject line
        const emailSubject = "Your AI-Drafted Reply from Compass-AI";

        await postmark.sendEmail({
            "From": fromAddress,
            "To": leadEmail,
            "Subject": emailSubject,
            "HtmlBody": htmlBody,
            "MessageStream": "outbound"
        });

        // This sends the notification to you
        await postmark.sendEmail({
            "From": fromAddress,
            "To": fromAddress,
            "Subject": `New Lead from Compass-AI: ${leadIdentifier}`,
            "HtmlBody": `New lead captured: <strong>${leadIdentifier}</strong>. They analyzed a complaint and received an AI-drafted reply.`
        });

        return response.status(200).json({ message: 'Report sent successfully!' });

    } catch (error) {
        console.error('Postmark API Error:', error);
        return response.status(500).json({ error: 'Failed to send report.' });
    }
}