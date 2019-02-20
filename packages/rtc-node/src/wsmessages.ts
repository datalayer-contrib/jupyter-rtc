// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ReadonlyJSONObject, UUID } from '@phosphor/coreutils';

import { Datastore } from '@phosphor/datastore';

/**
 * Namespace for datastore websocket protocol message statics.
 */
export namespace DatastoreWSMessages {
  /**
   * A transaction with a serial number.
   */
  export type SerialTransaction = Datastore.Transaction & {
    /**
     * A serial number given by the server.
     */
    serial: number;
  };

  /**
   *
   */
  export type Base = ReadonlyJSONObject & {
    /**
     * The unique message id.
     */
    msgId: string;
  };

  /**
   * Maps a msgType to the corresponding type.
   */
  export interface ITypeMap {
    'storeid-request': StoreIdRequest;
    'storeid-reply': StoreIdReply;
    'transaction-broadcast': TransactionBroadcast;
    'transaction-ack': TransactionAck;
    'history-request': HistoryRequest;
    'history-reply': HistoryReply;
    'transaction-request': TransactionRequest;
    'transaction-reply': TransactionReply;
    'serial-request': SerialRequest;
    'serial-reply': SerialReply;
    'permissions-request': PermissionsRequest;
    'permissions-reply': PermissionsReply;
    'error-reply': ErrorReply;
    'state-stable': StableStateNotice;
  }

  /**
   * Maps a request msgType to the corresponding reply type.
   */
  export interface IReplyMap {
    'storeid-request': StoreIdReply;
    'transaction-broadcast': TransactionAck;
    'history-request': HistoryReply;
    'transaction-request': TransactionReply;
    'serial-request': SerialReply;
    'permissions-request': PermissionsReply;
  }

  export type BaseReply = Base & {
    /**
     * The msgId of the corresponding request message.
     */
    readonly parentId: string;
  };

  /**
   * A message reqeusting a new, unique store id.
   */
  export type StoreIdRequest = Base & {
    readonly msgType: 'storeid-request';
    readonly content: {};
  };

  /**
   * A reply to a 'storeid-request' message.
   */
  export type StoreIdReply = BaseReply & {
    readonly msgType: 'storeid-reply';
    readonly content: {
      /**
       * The newly created unique store id.
       */
      readonly storeId: number;
    };
  };

  /**
   * A message broadcasting some transactions to peers.
   */
  export type TransactionBroadcast = Base & {
    readonly msgType: 'transaction-broadcast';
    readonly content: {
      /**
       * The transactions being broadcast.
       */
      readonly transactions: ReadonlyArray<
        Datastore.Transaction | SerialTransaction
      >;
    };
  };

  /**
   * An ackowledgment of received transactions.
   */
  export type TransactionAck = BaseReply & {
    readonly msgType: 'transaction-ack';
    readonly content: {
      /**
       * The transaction ids that were received.
       */
      readonly transactionIds: ReadonlyArray<string>;

      /**
       * The serials assigned to the received messages.
       */
      readonly serials: ReadonlyArray<number>;
    };
  };

  /**
   * A message requesting specific transactions from the server.
   */
  export type TransactionRequest = Base & {
    readonly msgType: 'transaction-request';
    readonly content: {
      /**
       * The ids of the transactions that are requested.
       */
      readonly transactionIds: ReadonlyArray<string>;
    };
  };

  /**
   * A reply to a 'transaction-request'.
   */
  export type TransactionReply = BaseReply & {
    readonly msgType: 'transaction-reply';
    readonly content: {
      /**
       * The transactions that were requested.
       */
      readonly transactions: ReadonlyArray<SerialTransaction>;
    };
  };

  /**
   * A message requesting the full transaction history from the server.
   */
  export type HistoryRequest = Base & {
    readonly msgType: 'history-request';
    readonly content: {};
  };

  /**
   * A reply to a 'history-request'.
   */
  export type HistoryReply = BaseReply & {
    readonly msgType: 'history-reply';
    readonly content: {
      /**
       * The transactions that make up the history.
       */
      readonly transactions: ReadonlyArray<SerialTransaction>;
    };
  };

  /**
   * A message requesting specific transactions by serial number.
   */
  export type SerialRequest = Base & {
    readonly msgType: 'serial-request';
    readonly content: {
      /**
       * The serial numbers that are requested.
       */
      readonly serials: ReadonlyArray<number>;
    };
  };

  /**
   * A reply to a 'serial-request'.
   */
  export type SerialReply = BaseReply & {
    readonly msgType: 'serial-reply';
    readonly content: {
      /**
       * The transactions that were requested.
       */
      readonly transactions: ReadonlyArray<SerialTransaction>;
    };
  };

  /**
   * A message requesting which permission we have on the central store.
   */
  export type PermissionsRequest = Base & {
    readonly msgType: 'permissions-request';
    readonly content: {};
  };

  /**
   * A reply to a 'permission-request'.
   */
  export type PermissionsReply = BaseReply & {
    readonly msgType: 'permissions-reply';
    readonly content: {
      /**
       * Whether we can read transactions from the store.
       */
      readonly read: boolean;

      /**
       * Whether we can write transactions to the store.
       */
      readonly write: boolean;
    };
  };

  /**
   * A notice that the current state of the datastore is *stable*.
   *
   * Stability here means that all concurrent transactions are known
   * to have been applied.
   */
  export type StableStateNotice = Base & {
    readonly msgType: 'state-stable';
    readonly content: {
      /**
       * The datastore version of the stable state.
       */
      version: number;
    };
  };

  /**
   * An error reply message.
   */
  export type ErrorReply = BaseReply & {
    readonly msgType: 'error-reply';
    readonly content: {
      /**
       * The reason for the error.
       */
      readonly reason: string;
    };
  };

  /**
   * A union type for all request messages.
   */
  export type Request =
    | StoreIdRequest
    | TransactionBroadcast
    | TransactionRequest
    | HistoryRequest
    | SerialRequest
    | PermissionsRequest;

  /**
   * A union type for all reply messages.
   */
  export type RawReply =
    | StoreIdReply
    | TransactionAck
    | TransactionReply
    | HistoryReply
    | SerialReply
    | PermissionsReply
    | ErrorReply;

  /**
   * A union type for all successful reply messages.
   */
  export type Reply =
    | StoreIdReply
    | TransactionAck
    | TransactionReply
    | HistoryReply
    | SerialReply
    | PermissionsReply;

  /**
   * A union type of all notice messages (no reply expected).
   */
  export type Notice = StableStateNotice;

  /**
   * A union type for all messages.
   */
  export type Message = Request | RawReply | Notice;

  /**
   * Create a WSServerAdapter message.
   *
   * @param {string} msgType The message type.
   * @param {ReadonlyJSONObject} content The content of the message.
   * @param {string} parentId An optional id of the parent of this message.
   * @returns {TransactionBroadcast} The created message.
   */
  export function createMessage<K extends Message['msgType']>(
    msgType: K,
    content: ITypeMap[K]['content'],
    parentId?: ITypeMap[K]['parentId']
  ): ITypeMap[K] {
    const msgId = UUID.uuid4();
    return {
      msgId,
      msgType,
      parentId,
      content
    } as ITypeMap[K];
  }

  /**
   * Create a WSServerAdapter message.
   *
   * @param {string} msgType The message type.
   * @param {ReadonlyJSONObject} content The content of the message.
   * @param {string} parentId The id of the parent of this reply.
   * @returns {TransactionBroadcast} The created message.
   */
  export function createReply<T extends BaseReply>(
    msgType: T['msgType'],
    content: T['content'],
    parentId: string
  ): T {
    const msgId = UUID.uuid4();
    return ({
      msgId,
      msgType,
      parentId,
      content
    } as unknown) as T;
  }

  /**
   * Whether a message is a reply to a previous request.
   * @param message - The message to consider.
   * @returns Whether the message is a reply.
   */
  export function isReply(message: Message): message is RawReply {
    return message.parentId !== undefined;
  }
}
