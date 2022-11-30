import { Injectable } from '@nestjs/common';
import Axios from 'axios';

@Injectable()
export class SendNotificationService {
  async sendNotification(channel: string, message: object) {
    const url = process.env.NOTIFICATION_URL + '/' + channel;
    const body = message;

    const response = await Axios.post(url, body)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });

    return response;
  }
}
