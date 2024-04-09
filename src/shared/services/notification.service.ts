/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@nestjs/common';
import { mapLimit } from 'async';
import * as firebase from 'firebase-admin';
import type { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { chunk } from 'lodash';

import { ApiConfigService } from './api-config.service';

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
  customData?: Record<string, string | number | boolean>;
}

const NOTIFICATION_CHUNK_SIZE = 100;

@Injectable()
export class NotificationsService {
  constructor(private configService: ApiConfigService) {
    const firebaseCredentials = configService.firebaseConfig;

    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        credential: firebase.credential.cert(firebaseCredentials),
      });
    }
  }

  async sendFirebaseMessages(
    firebaseMessages: ISendFirebaseMessages[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    const batchedFirebaseMessages = chunk(
      firebaseMessages,
      NOTIFICATION_CHUNK_SIZE,
    );

    const batchResponses: BatchResponse[] = await mapLimit<
      ISendFirebaseMessages[],
      BatchResponse
    >(
      batchedFirebaseMessages,
      process.env.FIREBASE_PARALLEL_LIMIT, // 3 is a good place to start
      async (
        groupedFirebaseMessages: ISendFirebaseMessages[],
      ): Promise<BatchResponse> => {
        try {
          const tokenMessages: firebase.messaging.TokenMessage[] =
            groupedFirebaseMessages.map(
              ({ message, title, token, customData }) => ({
                notification: { body: message, title },
                token,
                apns: {
                  payload: {
                    aps: {
                      // eslint-disable-next-line quote-props
                      sound: 'default',
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      'content-available': 1,
                    },
                    ...customData,
                  },
                },
              }),
            );

          return await firebase.messaging().sendAll(tokenMessages, dryRun);
        } catch (error) {
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
          };
        }
      },
    );

    // eslint-disable-next-line unicorn/no-array-reduce
    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => ({
        responses: [...responses, ...currentResponse.responses],
        successCount: successCount + currentResponse.successCount,
        failureCount: failureCount + currentResponse.failureCount,
      }),
      {
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as BatchResponse,
    );
  }
}
