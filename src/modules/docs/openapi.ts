import { getEnv } from '../../config/env.js';

export function buildOpenApiDocument() {
  const env = getEnv();

  return {
    openapi: '3.1.0',
    info: {
      title: env.PLATFORM_NAME,
      version: '0.1.0',
      description:
        'Initial production-oriented foundation for a multi-tenant WhatsApp session platform. This phase ships auth, health, deployment scaffolding, and the first database design.'
    },
    servers: [
      {
        url: env.PLATFORM_URL,
        description: env.NODE_ENV === 'production' ? 'Production' : 'Local development'
      }
    ],
    tags: [
      { name: 'System', description: 'Health and platform status' },
      { name: 'Authentication', description: 'Bootstrap master login for the first administrative access' }
    ],
    paths: {
      '/api/v1/status': {
        get: {
          tags: ['System'],
          summary: 'Get platform health and phase status',
          responses: {
            '200': {
              description: 'Platform health status available'
            }
          }
        }
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Authenticate the bootstrap master administrator',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 }
                  }
                },
                examples: {
                  default: {
                    value: {
                      email: 'admin@whatshub.local',
                      password: 'change-this-password'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Authenticated successfully' },
            '401': { description: 'Invalid credentials' }
          }
        }
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Get the current authenticated bootstrap administrator',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Authenticated user profile' },
            '401': { description: 'Missing or invalid token' }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  };
}
