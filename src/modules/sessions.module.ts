import { Module } from '@nestjs/common';
import { SessionsRepository } from '../repositories/sessions.repository';
import { SessionController } from '../controllers/session.controler';
import { SessionService } from '../services/sessions/session.service';
import { MessagesDictionary } from '../messages.dictionary';
import { AuthService } from '../services/auth.service';

@Module({
  imports: [],
  controllers: [SessionController],
  providers: [SessionService, SessionsRepository, MessagesDictionary, AuthService],
  exports: [SessionService, SessionsRepository, MessagesDictionary, AuthService],
})
export class SessionsModule {}
