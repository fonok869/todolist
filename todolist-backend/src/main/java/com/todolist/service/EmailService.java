package com.todolist.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public boolean sendWelcomeEmail() {
        return sendWelcomeEmail("molnarferi90@protonmail.com");
    }

    public boolean sendWelcomeEmail(String toEmail) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Cannot send email: recipient email address is null or empty");
                return false;
            }

            if (!isValidEmail(toEmail)) {
                logger.error("Cannot send email: invalid email address format: {}", toEmail);
                return false;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setCc("molnarferi90@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Welcome to TodoList Application!");
            message.setFrom("noreply@molnarferenc.com");
            message.setText("Hello!\n\n" +
                    "Welcome to the TodoList Application! The application has successfully started.\n\n" +
                    "You can now access all the features of our todo management system.\n\n" +
                    "Best regards,\n" +
                    "TodoList Team");

            javaMailSender.send(message);
            logger.info("Welcome email sent successfully to {}", toEmail);
            return true;

        } catch (MailException e) {
            logger.error("Failed to send welcome email to {}: Mail server error - {}", toEmail, e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.error("Failed to send welcome email to {}: Unexpected error - {}", toEmail, e.getMessage(), e);
            return false;
        }
    }

    public boolean sendEmail(String toEmail, String subject, String text) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Cannot send email: recipient email address is null or empty");
                return false;
            }

            if (!isValidEmail(toEmail)) {
                logger.error("Cannot send email: invalid email address format: {}", toEmail);
                return false;
            }

            if (subject == null || subject.trim().isEmpty()) {
                logger.error("Cannot send email: subject is null or empty");
                return false;
            }

            if (text == null || text.trim().isEmpty()) {
                logger.error("Cannot send email: message text is null or empty");
                return false;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);

            javaMailSender.send(message);
            logger.info("Email sent successfully to {} with subject: {}", toEmail, subject);
            return true;

        } catch (MailException e) {
            logger.error("Failed to send email to {}: Mail server error - {}", toEmail, e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.error("Failed to send email to {}: Unexpected error - {}", toEmail, e.getMessage(), e);
            return false;
        }
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }

        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(emailRegex);
    }

    public boolean sendEmailValidation(String toEmail, String validationToken) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Cannot send validation email: recipient email address is null or empty");
                return false;
            }

            if (!isValidEmail(toEmail)) {
                logger.error("Cannot send validation email: invalid email address format: {}", toEmail);
                return false;
            }

            if (validationToken == null || validationToken.trim().isEmpty()) {
                logger.error("Cannot send validation email: validation token is null or empty");
                return false;
            }

            String validationLink = frontendUrl + "/validate-email?token=" + validationToken;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("TodoList - Email Validation Required");
            message.setFrom("noreply@molnarferenc.com");
            message.setText("Hello!\n\n" +
                    "Thank you for registering with TodoList Application!\n\n" +
                    "To complete your registration, please validate your email address by clicking the link below:\n\n" +
                    validationLink + "\n\n" +
                    "This link will expire in 24 hours for security reasons.\n\n" +
                    "If you did not create an account with us, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "TodoList Team");

            javaMailSender.send(message);
            logger.info("Email validation sent successfully to {}", toEmail);
            return true;

        } catch (MailException e) {
            logger.error("Failed to send validation email to {}: Mail server error - {}", toEmail, e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.error("Failed to send validation email to {}: Unexpected error - {}", toEmail, e.getMessage(), e);
            return false;
        }
    }

    public boolean testEmailConnection() {
        try {
            SimpleMailMessage testMessage = new SimpleMailMessage();
            testMessage.setTo("molnarferi90@gmail.com");
            testMessage.setFrom("noreply@molnarferenc.com");
            testMessage.setSubject("Test Mail");
            testMessage.setSubject("Connection Test");
            testMessage.setText("This is a connection test message.");

            javaMailSender.send(testMessage);
            logger.info("Email connection test successful - test message sent");
            return true;
        } catch (MailException e) {
            logger.error("Email connection test failed: Mail server error - {}", e.getMessage(), e);
            return false;
        } catch (Exception e) {
            logger.error("Email connection test failed: Unexpected error - {}", e.getMessage(), e);
            return false;
        }
    }
}