// Compass-AI - script.js (v1.0 - Final Clean Build)
document.addEventListener('DOMContentLoaded', () => {
    // UI Element Acquisition
    const complaintForm = document.getElementById('complaint-form');
    const analyzeButton = document.getElementById('analyze-button');
    const buttonText = document.querySelector('.button-text');
    const spinner = document.querySelector('.spinner');
    const complaintInput = document.getElementById('complaint-input');
    const resultsContainer = document.getElementById('results-container');
    const leadCaptureSection = document.getElementById('lead-capture-section');
    const churnMeterFill = document.getElementById('churn-meter-fill');
    const churnMeterText = document.getElementById('churn-meter-text');
    const replyOutput = document.getElementById('reply-output');
    const errorContainer = document.getElementById('error-container');
    const errorOutput = document.getElementById('error-output');
    const emailReportForm = document.getElementById('email-report-form');
    const leadNameInput = document.getElementById('lead-name-input');
    const leadEmailInput = document.getElementById('lead-email-input');
    const sendReportButton = document.getElementById('send-report-button');

    // Primary Analysis Protocol
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const complaintText = complaintInput.value.trim();
        if (!complaintText) return;
        setLoadingState(true);
        try {
            const response = await fetch('/api/deconstructor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ complaint: complaintText }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            populateResults(data);
        } catch (error) {
            handleError(error.message);
        } finally {
            setLoadingState(false);
        }
    });

    // Lead Capture Protocol
    emailReportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const leadName = leadNameInput.value.trim();
        const leadEmail = leadEmailInput.value.trim();
        if (!leadEmail) {
            alert('Valid email address is required for transmission.');
            return;
        }
        sendReportButton.disabled = true;
        sendReportButton.textContent = 'Transmitting...';
        try {
            const reportData = {
                churnMeterText: churnMeterText.textContent,
                suggestedReply: replyOutput.textContent
            };
            const response = await fetch('/api/send-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadName, leadEmail, reportData })
            });
            if (!response.ok) {
                throw new Error('Mail server rejected transmission.');
            }
            leadCaptureSection.innerHTML = '<h3>🎉 Transmission Complete!</h3><p>Report is inbound. Check spam folder if not received in 60 seconds.</p>';
        } catch (error) {
            alert(`Transmission Error: ${error.message}`);
            sendReportButton.disabled = false;
            sendReportButton.textContent = 'Send My Free Report →';
        }
    });

    // Support Functions
    function setLoadingState(isLoading) {
        analyzeButton.disabled = isLoading;
        buttonText.textContent = isLoading ? 'Analyzing...' : 'Analyze Complaint';
        spinner.style.display = isLoading ? 'block' : 'none';
        if (isLoading) {
            resultsContainer.style.display = 'none';
            leadCaptureSection.style.display = 'none';
            errorContainer.style.display = 'none';
        }
    }

    function populateResults(data) {
        const score = data.churnMeter.score;
        const percentage = (score / 10) * 100;
        churnMeterFill.style.width = `${percentage}%`;
        churnMeterFill.className = 'churn-meter-fill';
        if (score <= 4) churnMeterFill.classList.add('churn-low');
        else if (score <= 7) churnMeterFill.classList.add('churn-medium');
        else churnMeterFill.classList.add('churn-high');
        churnMeterText.textContent = `Score: ${score}/10 - ${data.churnMeter.reasoning}`;
        replyOutput.textContent = data.suggestedReply;
        resultsContainer.style.display = 'block';
        leadCaptureSection.style.display = 'block';
    }

    function handleError(message) {
        errorOutput.textContent = `Analysis Failed. Details: ${message}`;
        errorContainer.style.display = 'block';
    }
});