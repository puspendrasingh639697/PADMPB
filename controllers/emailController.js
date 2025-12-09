// controllers/emailController.js
import Client from "../models/Client.js";
import { sendEmail } from "../service/emailService.js";

// Utility function for email templates
const getSelectionEmailTemplate = (clientName, designation, remarks) => {
    // You should use a detailed HTML template for professional emails
    return {
        subject: `Congratulations, ${clientName}! Your CV has been shortlisted.`,
        html: `
            <h3>Dear ${clientName},</h3>
            <p>Congratulations! Your CV has been shortlisted for the position of **${designation}**.</p>
            <p><b>Remarks:</b> ${remarks}</p>
            <p>Kindly contact our consultants for the further process.</p>
            <p>Regards,<br>Alimentation Group</p>
        `,
        text: `Dear ${clientName}, Congratulations! Your CV has been shortlisted for the position of ${designation}. Remarks: ${remarks}. Kindly contact our consultants for the further process.`,
    };
};

const getConfirmationEmailTemplate = (clientName) => {
    return {
        subject: `Job Confirmation for ${clientName}`,
        html: `
            <h3>Dear ${clientName},</h3>
            <p>We are pleased to confirm your final selection. Please review the attached document for joining details.</p>
            <p>Regards,<br>Alimentation Group</p>
        `,
        text: `Dear ${clientName}, We are pleased to confirm your final selection. Please review the attached document for joining details.`,
    };
};


// 📝 Send Selection Email
export const sendSelectionEmail = async (req, res) => {
    try {
        const { id } = req.params;
        
        const client = await Client.findById(id).select("clientName email designation remarks");
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        
        const { subject, html, text } = getSelectionEmailTemplate(
            client.clientName, 
            client.designation, 
            client.remarks
        );
        
        const result = await sendEmail(client.email, subject, text, html);
        
        if (result.success) {
            // Update the client status in the database
            await Client.findByIdAndUpdate(id, { selectionEmailSent: true });
            
            res.json({ 
                message: "Selection Email sent successfully and status updated.", 
                clientEmail: client.email 
            });
        } else {
            res.status(500).json({ message: "Failed to send email.", details: result.error });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 📝 Send Confirmation Email
export const sendConfirmationEmail = async (req, res) => {
    try {
        const { id } = req.params;
        
        const client = await Client.findById(id).select("clientName email");
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        
        const { subject, html, text } = getConfirmationEmailTemplate(client.clientName);
        
        const result = await sendEmail(client.email, subject, text, html);
        
        if (result.success) {
            // Update the client status in the database
            await Client.findByIdAndUpdate(id, { confirmationEmailSent: true });
            
            res.json({ 
                message: "Confirmation Email sent successfully and status updated.", 
                clientEmail: client.email 
            });
        } else {
            res.status(500).json({ message: "Failed to send email.", details: result.error });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};