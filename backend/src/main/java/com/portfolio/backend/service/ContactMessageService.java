package com.portfolio.backend.service;

import com.portfolio.backend.exception.ResourceNotFoundException;
import com.portfolio.backend.model.ContactMessage;
import com.portfolio.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender mailSender;

    @Value("${mail.recipient.email}")
    private String recipientEmail;

    @Autowired
    public ContactMessageService(ContactMessageRepository contactMessageRepository, JavaMailSender mailSender) {
        this.contactMessageRepository = contactMessageRepository;
        this.mailSender = mailSender;
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    public ContactMessage getMessageById(Long id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id " + id));
    }

    public ContactMessage saveMessage(ContactMessage message) {
        ContactMessage savedMessage = contactMessageRepository.save(message);
        sendNotificationEmail(savedMessage);
        return savedMessage;
    }

    private void sendNotificationEmail(ContactMessage message) {
        if (recipientEmail == null || recipientEmail.isEmpty()) {
            return;
        }
        
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(recipientEmail);
            mailMessage.setSubject("New Contact Form Submission from " + message.getName());
            mailMessage.setText("You have received a new message from your portfolio contact form:\n\n" +
                    "Name: " + message.getName() + "\n" +
                    "Email: " + message.getEmail() + "\n\n" +
                    "Message:\n" + message.getMessage());
            
            mailSender.send(mailMessage);
        } catch (MailException e) {
            // Log the exception but do not throw it, so the message is still saved
            System.err.println("Failed to send notification email: " + e.getMessage());
        }
    }

    public void deleteMessage(Long id) {
        ContactMessage message = getMessageById(id);
        contactMessageRepository.delete(message);
    }
}
