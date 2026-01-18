const sendEmail = require('../utils/sendEmail');

exports.sendEnquiry = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Email to Admin
        const adminEmail = process.env.EMAIL_USER; // Or specific admin email
        const adminContent = `
            <h1>New General Enquiry</h1>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                ${message}
            </blockquote>
        `;

        await sendEmail(adminEmail, `New Enquiry from ${name}`, adminContent);

        // Optional: Auto-reply to user
        const userContent = `
            <h1>Thank you for contacting us!</h1>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you shortly.</p>
        `;
        await sendEmail(email, 'We received your enquiry - LuxeSalon', userContent);

        res.status(200).json({ message: "Enquiry sent successfully" });
    } catch (error) {
        console.error("Enquiry error:", error);
        res.status(500).json({ message: "Failed to send enquiry" });
    }
};
