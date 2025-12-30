export class UserIntegrationApi {
  connectedAt: Date;
  isconnected: boolean;
  name: string;
}

export class PostUserIntegration {
  userId: string;
  integrationId: number;
  name: string;
  isconnected: boolean;
}
export class ChangeUserIntegration {
  id: string;
  isconnected: boolean;
}
