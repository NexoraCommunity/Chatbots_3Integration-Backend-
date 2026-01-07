export class UserIntegrationApi {
  connectedAt: Date;
  isconnected: boolean;
  provider: string;
}

export class PostUserIntegration {
  userId: string;
  integrationId: number;
  provider: string;
  isconnected: boolean;
}
export class ChangeUserIntegration {
  id: string;
  isconnected: boolean;
}
