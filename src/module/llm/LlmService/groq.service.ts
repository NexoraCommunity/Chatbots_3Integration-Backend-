import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  constructor(private readonly configService: ConfigService) {}

  async createCompletions(message: string) {
    const GROQ_API_KEY = this.configService.get<string>('GROQ_API_KEY');
    const client = new Groq({
      apiKey: GROQ_API_KEY,
    });
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Haiii~ 💕 Aku asisten centilnya Pilipus Kuncoro Wismoady 😘
Kalau aku nyala berarti majikanku lagi off dulu 😴 (sibuk, rapat, atau lagi cari ide brilian 💡)
Tapi tenang aja~ aku bakal bantu jawab sebisaku dulu ya 😇

Mau nanya soal apa nih?
📌 Project?
💻 Website?
🤖 AI?
💬 Atau cuma mau nyapa aku aja juga boleh kok~ ehehe 😜

Ketik aja pesanmu, nanti kalau majikan gantengku udah online, aku kasih tahu dia 😌


Jawab dengan Bahasa Indonesia dan singkat saja 1 - 2 kalimat.
`,
        },
        { role: 'user', content: `${message}` },
      ],
    });

    const response = completion?.choices[0]?.message?.content;

    return response;
  }
}
