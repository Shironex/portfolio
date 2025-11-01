import {
  invalidContactFormData,
  longContactFormData,
  validContactFormData,
} from '@tests/fixtures/contact-form'
import { describe, expect, it } from 'vitest'

import { contactFormSchema } from '@/app/contact/_components/validation'

describe('contactFormSchema', () => {
  describe('valid data', () => {
    it('should validate correct contact form data', () => {
      const result = contactFormSchema.safeParse(validContactFormData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validContactFormData)
      }
    })

    it('should allow optional verify field (honeypot)', () => {
      const dataWithoutVerify = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
        turnstileToken: 'token',
      }
      const result = contactFormSchema.safeParse(dataWithoutVerify)
      expect(result.success).toBe(true)
    })

    it('should validate long but valid input data', () => {
      const result = contactFormSchema.safeParse(longContactFormData)
      expect(result.success).toBe(true)
    })
  })

  describe('name validation', () => {
    it('should fail when name is empty', () => {
      const result = contactFormSchema.safeParse(
        invalidContactFormData.emptyName
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['name'],
              message: 'Name is required',
            }),
          ])
        )
      }
    })

    it('should fail when name is less than 3 characters', () => {
      const result = contactFormSchema.safeParse(
        invalidContactFormData.shortName
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['name'],
              message: 'Name is required',
            }),
          ])
        )
      }
    })

    it('should pass when name is exactly 3 characters', () => {
      const data = {
        name: 'Joe',
        email: 'joe@example.com',
        message: 'Test',
        turnstileToken: 'token',
      }
      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('email validation', () => {
    it('should fail when email is invalid', () => {
      const result = contactFormSchema.safeParse(
        invalidContactFormData.invalidEmail
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['email'],
              message: 'Email is required',
            }),
          ])
        )
      }
    })

    it('should pass with valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name+tag@example.co.uk',
        'test123@test-domain.com',
      ]

      validEmails.forEach((email) => {
        const data = {
          name: 'Test User',
          email,
          message: 'Test message',
          turnstileToken: 'token',
        }
        const result = contactFormSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('message validation', () => {
    it('should fail when message is empty', () => {
      const result = contactFormSchema.safeParse(
        invalidContactFormData.emptyMessage
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['message'],
              message: 'Message is required',
            }),
          ])
        )
      }
    })

    it('should pass with single character message', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'a',
        turnstileToken: 'token',
      }
      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('turnstileToken validation', () => {
    it('should fail when turnstileToken is missing', () => {
      const result = contactFormSchema.safeParse(
        invalidContactFormData.missingTurnstile
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['turnstileToken'],
              message: 'field-turnstileToken-required',
            }),
          ])
        )
      }
    })

    it('should pass when turnstileToken is provided', () => {
      const result = contactFormSchema.safeParse(validContactFormData)
      expect(result.success).toBe(true)
    })
  })

  describe('verify field (honeypot)', () => {
    it('should allow empty verify field', () => {
      const data = { ...validContactFormData, verify: '' }
      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should allow filled verify field (will be handled in business logic)', () => {
      const data = { ...validContactFormData, verify: 'bot-filled-this' }
      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should allow undefined verify field', () => {
      const { verify, ...dataWithoutVerify } = validContactFormData
      const result = contactFormSchema.safeParse(dataWithoutVerify)
      expect(result.success).toBe(true)
    })
  })

  describe('multiple validation errors', () => {
    it('should return all validation errors at once', () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        message: '',
        turnstileToken: '',
      }
      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(4) // name, email, message, turnstileToken
      }
    })
  })
})
