import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  DescribeSecretCommand,
  ResourceNotFoundException,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

const SECRETS_PREFIX = process.env.SECRETS_PREFIX || "blox/";

/**
 * Get the full ARN for a secret name
 */
function getSecretName(path: string): string {
  return path.startsWith(SECRETS_PREFIX) ? path : `${SECRETS_PREFIX}${path}`;
}

/**
 * Get a secret value from AWS Secrets Manager
 * @param secretName - The name/path of the secret (will be prefixed with SECRETS_PREFIX)
 * @returns The secret value as a string, or null if not found
 */
export async function getSecret(secretName: string): Promise<string | null> {
  try {
    const command = new GetSecretValueCommand({
      SecretId: getSecretName(secretName),
    });
    const response = await client.send(command);
    return response.SecretString || null;
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      return null;
    }
    console.error("Error getting secret:", error);
    throw error;
  }
}

/**
 * Get a secret value and parse it as JSON
 * @param secretName - The name/path of the secret
 * @returns The parsed JSON object, or null if not found
 */
export async function getSecretJson<T = any>(secretName: string): Promise<T | null> {
  const secretString = await getSecret(secretName);
  if (!secretString) return null;
  
  try {
    return JSON.parse(secretString) as T;
  } catch (error) {
    console.error("Error parsing secret JSON:", error);
    throw error;
  }
}

/**
 * Create a new secret in AWS Secrets Manager
 * @param secretName - The name/path of the secret (will be prefixed with SECRETS_PREFIX)
 * @param secretValue - The secret value (string or object that will be JSON stringified)
 * @returns The ARN of the created secret
 */
export async function createSecret(
  secretName: string,
  secretValue: string | object
): Promise<string> {
  try {
    const secretString = typeof secretValue === "string" 
      ? secretValue 
      : JSON.stringify(secretValue);

    const command = new CreateSecretCommand({
      Name: getSecretName(secretName),
      SecretString: secretString,
      Description: `BLOX secret for ${secretName}`,
    });
    const response = await client.send(command);
    return response.ARN!;
  } catch (error) {
    console.error("Error creating secret:", error);
    throw error;
  }
}

/**
 * Update an existing secret in AWS Secrets Manager
 * @param secretName - The name/path of the secret
 * @param secretValue - The new secret value
 * @returns The ARN of the updated secret
 */
export async function updateSecret(
  secretName: string,
  secretValue: string | object
): Promise<string> {
  try {
    const secretString = typeof secretValue === "string" 
      ? secretValue 
      : JSON.stringify(secretValue);

    const command = new UpdateSecretCommand({
      SecretId: getSecretName(secretName),
      SecretString: secretString,
    });
    const response = await client.send(command);
    return response.ARN!;
  } catch (error) {
    console.error("Error updating secret:", error);
    throw error;
  }
}

/**
 * Create or update a secret (upsert)
 * @param secretName - The name/path of the secret
 * @param secretValue - The secret value
 * @returns The ARN of the secret
 */
export async function putSecret(
  secretName: string,
  secretValue: string | object
): Promise<string> {
  const existing = await getSecret(secretName);
  if (existing === null) {
    return await createSecret(secretName, secretValue);
  } else {
    return await updateSecret(secretName, secretValue);
  }
}

/**
 * Create a secret only if it doesn't exist (idempotent)
 * @param secretName - The name/path of the secret
 * @param secretValue - The secret value
 * @returns The ARN of the secret
 */
export async function putSecretIfMissing(
  secretName: string,
  secretValue: string | object
): Promise<string> {
  try {
    const command = new DescribeSecretCommand({
      SecretId: getSecretName(secretName),
    });
    const response = await client.send(command);
    return response.ARN!;
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      return await createSecret(secretName, secretValue);
    }
    throw error;
  }
}

/**
 * Get the ARN for a secret without retrieving its value
 * @param secretName - The name/path of the secret
 * @returns The ARN of the secret, or null if not found
 */
export async function getSecretArn(secretName: string): Promise<string | null> {
  try {
    const command = new DescribeSecretCommand({
      SecretId: getSecretName(secretName),
    });
    const response = await client.send(command);
    return response.ARN || null;
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      return null;
    }
    console.error("Error getting secret ARN:", error);
    throw error;
  }
}

/**
 * Helper to get tool credentials for a tenant
 * @param tenantId - The tenant ID
 * @param toolKey - The tool key (e.g., "email", "sms", "drive")
 * @returns The credentials object, or null if not found
 */
export async function getToolCredentials(
  tenantId: string,
  toolKey: string
): Promise<any> {
  return await getSecretJson(`${tenantId}/tools/${toolKey}`);
}

/**
 * Helper to set tool credentials for a tenant
 * @param tenantId - The tenant ID
 * @param toolKey - The tool key
 * @param credentials - The credentials object
 * @returns The ARN of the secret
 */
export async function setToolCredentials(
  tenantId: string,
  toolKey: string,
  credentials: object
): Promise<string> {
  return await putSecret(`${tenantId}/tools/${toolKey}`, credentials);
}
