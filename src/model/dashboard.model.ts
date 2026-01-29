import { Product } from '@prisma/client';

export class DashboardModel {
  totalBotActive: number;
  totalAgent: number;
  allTimeRespondedMessage: number;
  RespondedMessage: RespondedMessage[];
  connectedIntegrationPlatfrom: ConnectedIntegrationPlatfrom;
  connectedIntegrationLlm: ConnectedIntegrationLlm;
  activeProduct: Product[];
}

export class RespondedMessage {
  date: string;
  total: number;
}

export class QueryDashboard {
  rangeDate: string;
  userId: string;
}

export class ConnectedIntegrationPlatfrom {
  baileys: {
    setup: boolean;
    isActive: boolean;
  };
  whatsappBussiness: {
    setup: boolean;
    isActive: boolean;
  };
  botFather: {
    setup: boolean;
    isActive: boolean;
  };
  website: {
    setup: boolean;
    isActive: boolean;
  };
}
export class ConnectedIntegrationLlm {
  groq: {
    setup: boolean;
    isActive: boolean;
  };
  gemini: {
    setup: boolean;
    isActive: boolean;
  };
  openRouter: {
    setup: boolean;
    isActive: boolean;
  };
}
