package com.ecommerce.helper;

import com.ecommerce.entity.Session;
import com.ecommerce.entity.SessionStatus;
import com.ecommerce.repository.SessionRepository;
import org.hibernate.SessionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SessionCheck {

    @Autowired
    private SessionRepository sessionRepository;

    public String getEmailOfUser(String sessionID) {
        System.err.println(sessionID);
        Optional<Session> session = sessionRepository.findBySessionId(sessionID);

        if (session.isEmpty())
            throw new SessionException("Session not found");

        if (!session.get().getStatus().equals(SessionStatus.active))
            throw new SessionException("Session is not active");

        return session.get().getEmail();
    }
}