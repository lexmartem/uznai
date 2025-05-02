package com.uznai.security;

import com.uznai.exception.RateLimitExceededException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS = 100;
    private static final long TIME_WINDOW = TimeUnit.MINUTES.toMillis(1);
    private final Map<String, RequestCounter> requestCounters = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String clientIp = getClientIp(request);
        RequestCounter counter = requestCounters.computeIfAbsent(clientIp, k -> new RequestCounter());

        if (counter.isRateLimited()) {
            log.warn("Rate limit exceeded for IP: {}", clientIp);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }

        counter.increment();
        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private static class RequestCounter {
        private int count = 0;
        private long windowStart = System.currentTimeMillis();

        synchronized boolean isRateLimited() {
            long now = System.currentTimeMillis();
            if (now - windowStart > TIME_WINDOW) {
                count = 0;
                windowStart = now;
            }
            return count >= MAX_REQUESTS;
        }

        synchronized void increment() {
            count++;
        }
    }
} 